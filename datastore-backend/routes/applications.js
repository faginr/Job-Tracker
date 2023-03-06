const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const model = require('../model')
const verifyUser = require('./middleware/verifyUser')

const ds = require('../datastore');

const datastore = ds.datastore;
const APPLICATION = "application";

router.use(bodyParser.json());

const default_values = {
  'skills': [],
  'contacts': [],
  'posting_date': "",
  'status': "Applied",
  'link': "",
}

// gcloud auth application-default login

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              /
//                                       Handlers                                               /
//                                                                                              /
/////////////////////////////////////////////////////////////////////////////////////////////////

// Verify a given attribute is not undefined or null; true means value is undefined or null
function verify_not_blank (val){
  if (val === undefined || val === null) {
    return true
  }
  return false
}

// Verify an id in a route is of valid type; true means invalid type
function verify_id (id) {
  let idRegex = /[^0-9]/gi
  if (idRegex.test(id) === true){
      return true
  } 
  return false
}

// Verify keys passed to post/patch an application are valid
function verify_keys (body_keys) {
  const allowed_keys = {
    title: "title",
    description: "description",
    posting_date: "posting_date",
    contacts: "contacts",
    skills: "skills",
    status: "status",
    link: "link",
    auth: "auth",
    user: "user"
  }

  for (let item of Object.keys(body_keys)){
    if (!(item in allowed_keys)){
      // console.log(item)
      return {valid: false, message: `Key ${item} not allowed`}
    }
  }

  return {valid: true}

}

function limit_title (title) {
  if (title.length>100) {
    return true
  }
  return false
}

function limit_description (description) {
  if (description.length>5000) {
    return true
  }
  return false
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              /
//                                         Routes                                               /
//                                                                                              /
/////////////////////////////////////////////////////////////////////////////////////////////////

// POST application route

router.post("/users/:user_id/applications", verifyUser.verifyJWTWithUserParam , function (req, res) {
  console.log("Post request received!");

  // Tests for invalid request
  if (
    verify_not_blank(req.body.title) 
    || verify_not_blank(req.body.description)
    ) {
    // Failure, reject
    return res.status(400).json({'Error':  "The request object is missing at least one of the required attributes"});
  }

  valid_keys = verify_keys(req.body)
  if (valid_keys["valid"] === false) {
    return res.status(400).json({'Error': `${valid_keys["message"]}`})
  }

  if(limit_title(req.body.title)){
    return res.status(400).json({'Error': "title can only be a maximum of 100 chars long"})
  }

  if(limit_description(req.body.description)){
    return res.status(400).json({'Error': "description can only be a maximum of 5000 chars long"})
  }

  // create object with new application data
  const new_application = {
    'title': req.body.title,
    'description': req.body.description,
    'skills': req.body.skills,
    'contacts': req.body.contacts,
    'posting_date': req.body.posting_date,
    'status': req.body.status,
    'link': req.body.link,
    'user': req.body.user.id
  }

  console.log(req.body.status)

  // apply default values to blanks
  if (req.body.skills === undefined){
    new_application["skills"] = default_values["skills"]
  }
  if (req.body.contacts === undefined){
    new_application["contacts"] = default_values["contacts"]
  }
  if (req.body.posting_date === undefined){
    new_application["posting_date"] = default_values["posting_date"]
  }
  if (req.body.status === undefined || req.body.status === ''){
    new_application["status"] = default_values["status"]
  }
  if (req.body.link === undefined){
    new_application["link"] = default_values["link"]
  }

  try{

    // Post new app
    model.postBigItem(new_application, 'application')
      .then((key) => {
        
        // Get user by id
        model.getItemByID('users', req.params.user_id).then((user) => {
          let newUserData = user[0]
          newUserData.applications.push(key.id)
          
          // Patch user to include new app id in apps property
          model.updateItem(newUserData, 'users').then(() => {
            
            // queue up promises to run
            const promises = [];
            // Get each contact in application contacts
            for(let contact of new_application["contacts"]){
              promises.push(model.getItemByID('contact', contact)
                .then(currentContact => {
                  // update contact with new app id
                  currentContact[0]["contact_at_app_id"].push(key.id)
                  // console.log(currentContact[0])
                  model.updateItem(currentContact[0], 'contact')
                })
              )
            }

            // Run all promises
            Promise.all(promises)
              .then(() => {
                // return object in response body
                res.status(201).json({
                  'id': key.id,
                  'title': new_application["title"],
                  'description': new_application["description"],
                  'skills': new_application["skills"],
                  'contacts': new_application["contacts"],
                  'posting date': new_application["posting_date"],
                  'status': new_application["status"],
                  'link': new_application["link"],
                  'user': new_application["user"]
                  // 'self': req.protocol + "://" + req.get("host") + req.baseUrl + "/" + key.id
                });

              })

            })

        })

    });
  } catch(err) {
    // Log error
    console.error(err);
    res.status(500).end()
  }
});

// GET all applications route

router.get("/users/:user_id/applications", verifyUser.verifyJWTWithUserParam , function (req, res) {
  console.log("Get all requests received!");

  // Get all entities by kind 'application'
  model.getFilteredItems('application', 'user', req.params.user_id).then((applications) => {
    res.status(200).json(applications);
  });
});

// GET application by id route

router.get("/users/:user_id/applications/:app_id", verifyUser.verifyJWTWithUserParam, function (req, res) {
  console.log("Get request received!");
  
  // Test for invalid request 
  if (
    verify_id(req.params.app_id) 
    || verify_not_blank(req.params.app_id)
    ){
      // Failure, reject
      return res.status(400).json({ Error: 'No application exists with this id'})
  } 

  // Get entity by kind and id
  model.getItemByID('application', req.params.app_id)
  .then((application) => {

    // Check if application data is blank (doesn't exist)
    if (verify_not_blank(application[0])) {
      res.status(404).json({ Error: "No application exists with this id" });
    } 

    // Reject any non-JSON requests
    const accepts = req.accepts(['application/json']);
    if(!accepts){
      return res.status(406).json({'Error': 'Not accepted, only application/json supported'});
    }

    else {
      // Return the 0th element which is the application with this id
      res.status(200).json(application[0]);
    }
  });
});

// PATCH application by id route

router.patch("/users/:user_id/applications/:app_id", verifyUser.verifyJWTWithUserParam, function (req, res) {
  console.log("Patch request received!");

  // Tests for invalid request
  if (
    verify_id(req.params.app_id) 
    || verify_not_blank(req.params.app_id)
    ){
      // Failure, reject
      return res.status(400).json({ Error: 'No application exists with this id'})
    } 

  valid_keys = verify_keys(req.body)
  if (valid_keys["valid"] === false) {
    return res.status(400).json({'Error': `${valid_keys["message"]}`})
  }
  
  // get application by id
  model.getItemByID('application', req.params.app_id)
  .then(application => {

    // if application doesn't exist reject with 404 error
    if(verify_not_blank(application[0])){
      return res.status(404).json({'Error': 'No application with this id exists'});
    } 

    
    // collect any modified values, collect correct result values
    const results = application
    originalContacts = results[0]["contacts"]
    if (req.body.title !== undefined){
      results[0]["title"] = req.body.title
    }
    if (req.body.description !== undefined){
      results[0]["description"] = req.body.description
    }
    if (req.body.skills !== undefined){
      results[0]["skills"] = req.body.skills
    }
    if (req.body.contacts !== undefined){
      results[0]["contacts"] = req.body.contacts
    }
    if (req.body.posting_date !== undefined){
      results[0]["posting_date"] = req.body.posting_date
    }
    if (req.body.status !== undefined){
      results[0]["status"] = req.body.status
    }
    if (req.body.link !== undefined){
      results[0]["link"] = req.body.link
    }

    // Check input size limits
    if(limit_title(results[0]["title"])){
      return res.status(400).json({'Error': "title can only be a maximum of 100 chars long"})
    }
  
    if(limit_description(results[0]["description"])){
      return res.status(400).json({'Error': "description can only be a maximum of 5000 chars long"})
    }
    console.log(results[0])

    try{
      // Update application in datastore, return updated object in response body
      model.updateBigItem(results[0], 'application')
        .then(editedData => {

          // removal process
          removeList = [];
          // for each contact in original object
          for (let oldContact of originalContacts){
            // if old contact not in new contacts
            if (!(editedData["contacts"].includes(oldContact))){
              // add only contacts that were there but now removed
              removeList.push(oldContact)
            }
          }

          // queue up promises
          const removePromises = [];
          // for each contact to be removed
          for (let removeContact of removeList){
            // get that contact
            removePromises.push(model.getItemByID('contact', removeContact)
            .then(currentRemoveContact => {
              let newReducedApps = [];
              // rebuild app ids
              for(let newApp of currentRemoveContact[0]["contact_at_app_id"]){
                // if app id is not the id being removed then add
                if (newApp !== req.params.app_id){
                  newReducedApps.push(newApp)
                }
              }
              // reassign app ids with edited app id removed
              currentRemoveContact[0]["contact_at_app_id"] = newReducedApps
              // update contact
              model.updateItem(currentRemoveContact[0], 'contact');
            }) 
            )
          }

          // run all remove actions
          Promise.all(removePromises)
            .then(() => {
              
              // repeat for adding new app id to each new contact 
              addList = [];
              for (let newContact of editedData["contacts"]){
                if (!(originalContacts.includes(newContact))){
                  addList.push(newContact)
                }
              }

              const addPromises = [];
              for(let addContact of addList){
                addPromises.push(model.getItemByID('contact', addContact)
                .then(currentAddContact => {
                  currentAddContact[0]["contact_at_app_id"].push(req.params.app_id)
                  model.updateItem(currentAddContact[0], 'contact');
                })
                )
              }
              Promise.all(addPromises)
              .then(res.status(200).json({
                'id': req.params.app_id,
                'skills': results[0]["skills"],
                'contacts': results[0]["contacts"],
                'title': results[0]["title"],
                'description': results[0]["description"],
                'posting_date': results[0]["posting_date"],
                'status': results[0]["status"],
                'link': results[0]["link"],
                'user': results[0]["user"]
                // 'self': req.protocol + "://" + req.get("host") + req.baseUrl + "/" + req.params.app_id
              }))
            })

        })
  } catch(err) {
    // Log error
    console.error(err);
    res.status(500).end()
  }
  })
})

// DELETE application by id route

router.delete("/users/:user_id/applications/:app_id", verifyUser.verifyJWTWithUserParam, function (req, res) {
  console.log("Delete request received!");
  
  // Test for invalid request
  if (
    verify_id(req.params.app_id) 
    || verify_not_blank(req.params.app_id)
    ){
      // Failure, reject
      return res.status(400).json({ Error: 'No application exists with this id'})
  } 

  try{
    // Get application by id
    model.getItemByID('application', req.params.app_id)
    .then(application => {
      
      // if applcation doesn't exist, reject with 404
      if(verify_not_blank(application[0])){
        return res.status(404).json({'Error': 'No application with this id exists'});
      }

      // Get user by id
      model.getItemByID('users', req.params.user_id).then((user) => {
          let newUserData = user[0]
          newUserData.applications = []

          // iterate through apps belonging to user
          for (let app in user[0].applications){
            // rebuild apps removing this app id if present
            if (app === application[0].id){
              console.log(application[0].id + " removed")
            } else {
              newUserData.applications.push(app)
            }
          }
          // Patch user with app removed
          model.updateItem(newUserData, 'users').then(() => { 
            
            // If there is at least 1 contact in app
            if(application[0]["contacts"].length > 0){
              
              // queue up promises to run
              const promises = [];
              // Get each contact in app contacts
              for (let contact of application[0]["contacts"]){
                promises.push(model.getItemByID('contact', contact)
                .then(currentContact => {
                  // make array to edit contact app ids
                  let newApps = [];
                  // loop through all app ids in contact
                  for (let newApp of currentContact[0]["contact_at_app_id"]){
                    // remove app id from contact app ids
                    if (newApp !== application[0].id){
                      newApps.push(newApp);
                    }
                  }
                  // set current contact app ids to edited value
                  currentContact[0]["contact_at_app_id"] = newApps
                  // patch contact
                  model.updateItem(currentContact[0], 'contact');
                })
                )
              }
              // run all promises
              Promise.all(promises)
              .then(() => {
                // delete application
                return model.deleteItem('application', req.params.app_id).then(res.status(204).end());
              })
            }
            else {
              // delete application
              return model.deleteItem('application', req.params.app_id).then(res.status(204).end());
            }          
          })
        })
    })
  } catch(err) {
    // Log error
    console.error(err);
    res.status(500).end()
  }
});

// DELETE 405 applications route reject

router.delete('/users/:user_id/applications', function (req, res){
  res.set('Accept', 'GET, POST');
  res.status(405).json({'Error': 'Only GET, POST requests allowed for all applications route'});
});

// PUT 405 applications route reject

router.put('/users/:user_id/applications', function (req, res){
  res.set('Accept', 'GET, POST');
  res.status(405).json({'Error': 'Only GET, POST requests allowed for all applications route'});
});

// PATCH 405 applications route reject

router.patch('/users/:user_id/applications', function (req, res){
  res.set('Accept', 'GET, POST');
  res.status(405).json({'Error': 'Only GET, POST requests allowed for all applications route'});
});

module.exports = router;