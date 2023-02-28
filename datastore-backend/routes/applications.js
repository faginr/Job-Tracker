const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const model = require('../model')
const verifyUser = require('./middleware/verifyUser')

const ds = require('../datastore');

const datastore = ds.datastore;

const APPLICATION = "application";

router.use(bodyParser.json());


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
  // console.log(req.body.user.id)

  // Test for invalid request
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
  const default_values = {
    'skills': [],
    'contacts': [],
    'posting_date': "",
    'status': "",
    'link': "",
  }

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

  // apply default values to blanks
  if (req.body.skills === undefined){
    new_application["skills"] = default_values["skills"]
  }
  // else {
  //   for (let skill of req.body.skills){
  //     new_application["skills"].push(skill)
  //   }
  // }
  if (req.body.contacts === undefined){
    new_application["contacts"] = default_values["contacts"]
  }
  if (req.body.posting_date === undefined){
    new_application["posting_date"] = default_values["posting_date"]
  }
  if (req.body.status === undefined){
    new_application["status"] = default_values["status"]
  }
  if (req.body.link === undefined){
    new_application["link"] = default_values["link"]
  }

  // save new object in datastore
  model.postBigItem(new_application, 'application')
    .then((key) => {
      model.getItemByID('users', req.params.user_id).then((user) => {
        let newUserData = user[0]
        newUserData.applications.push(key.id)
        model.updateItem(newUserData, 'users').then(() => {
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
  });
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

  // Test for invalid request
  if (
    verify_id(req.params.app_id) 
    || verify_not_blank(req.params.app_id)
    ){
      // console.log("here")
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
    } else {

      // collect any modified values, collect correct result values
      const results = application
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

      if(limit_title(results[0]["title"])){
        return res.status(400).json({'Error': "title can only be a maximum of 100 chars long"})
      }
    
      if(limit_description(results[0]["description"])){
        return res.status(400).json({'Error': "description can only be a maximum of 5000 chars long"})
      }

      // Update application in datastore, return updated object in response body
      return model.updateBigItem(results[0], 'application')
      .then(res.status(200).json({
        'id': req.params.app_id,
        // 'user': results["user"],
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
    }
  })
  .catch(err => {
    console.error(err)
    // res.status(500).json({'Error': error}).end()
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

  // Get application by id
  model.getItemByID('application', req.params.app_id)
  .then(application => {
    
    // if applcation doesn't exist, reject with 404
    if(verify_not_blank(application[0])){
      return res.status(404).json({'Error': 'No application with this id exists'});
    }

    model.getItemByID('users', req.params.user_id).then((user) => {
        let newUserData = user[0]
        newUserData.applications = []

        for (let app in user[0].applications){
          if (app === application[0].id){
            console.log(application[0].id + " removed")
          } else {
            newUserData.applications.push(app)
          }
        }
        model.updateItem(newUserData, 'users').then(() => { 
          // TODO implement all necessary checks and removals before delete
          return model.deleteItem('application', req.params.app_id).then(res.status(204).end());
        })
      })
  })
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