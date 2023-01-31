const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

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

// POST application

function post_application(
  title,
  description,
  skills = [],
  contacts = [],
  posting_date = null,
  status = null,
  link = null
) {
  var app_key = datastore.key(APPLICATION);
  const new_application = {
    title: title,
    description: description,
    skills: skills,
    contacts: contacts,
    posting_date: posting_date,
    status: status,
    link: link,
  };
  return datastore.save({ key: app_key, data: new_application }).then(() => {
    return app_key;
  });
}

// GET all applications

/**
 * The function datastore.query returns an array, where the element at index 0
 * is itself an array. Each element in the array at element 0 is a JSON object
 * with an entity fromt the type "Application".
 */
function get_applications(req) {
  // get application data
  const query = datastore.createQuery(APPLICATION);
  // create results object
  const results = {};
  return datastore.runQuery(query).then((entities) => {
    // Use Array.map to call the function fromDatastore. This function
    // adds id attribute to every element in the array at element 0 of
    // the variable entities

    // map query payload to results object
    results.applications = entities[0].map(ds.fromDatastore);
    // if results is not empty
    if (results.applications !== undefined && results.applications !== null) {
      // iterate through results
      for (let i = 0; i < results.applications.length; i++) {
        // for each record with an id
        if (results.applications[i]["id"] !== undefined) {
          // create self link to resource
          results.applications[i]["self"] =
            req.protocol +
            "://" +
            req.get("host") +
            req.baseUrl +
            "/" +
            results.applications[i]["id"];
        }
      }
    }
    // return results object
    return results.applications;
  });
}

// GET application by id

/**
 * Note that datastore.get returns an array where each element is a JSON object
 * corresponding to an entity of the Type "Application." If there are no entities
 * in the result, then the 0th element is undefined.
 * @param {number} id Int ID value
 * @returns An array of length 1.
 *      If a application with the provided id exists, then the element in the array
 *           is that application
 *      If no application with the provided id exists, then the value of the
 *          element is undefined
 */
function get_application(req) {
  const key = datastore.key([APPLICATION, parseInt(req.params.id, 10)]);
  return datastore.get(key).then((entity) => {
    if (entity[0] === undefined || entity[0] === null) {
      // No entity found. Don't try to add the id attribute
      return entity;
    } else {
      // Use Array.map to call the function fromDatastore. This function
      // adds id attribute to every element in the array entity
      let results = entity.map(ds.fromDatastore);
      results[0]["self"] =
        req.protocol +
        "://" +
        req.get("host") +
        req.baseUrl +
        "/" +
        results[0]["id"];
      return results;
    }
  });
}

// PATCH an application

function patch_application(id, application, new_values) {
  // get application by stored id
  const key = datastore.key([APPLICATION, parseInt(id, 10)]);
  let title;
  let description;
  let posting_date;
  let status;
  let link;
  let contacts;
  let skills;
  

  // console.log("application: ")
  // console.dir(JSON.stringify(application))
  // console.log("new_values: ")
  // console.dir(JSON.stringify(new_values))


  // for each attribute, assign new value else retain old value
  if (new_values["title"] != undefined && new_values["title"] != null) {
    title = new_values["title"];
  } else {
    title = application[0]["title"];
  }
  if (new_values["description"] != undefined && new_values["description"] != null) {
    description = new_values["description"];
  } else {
    description = application[0]["description"];
  }
  if (new_values["skills"] != undefined && new_values["skills"] != null) {
    skills = new_values["skills"];
  } else {
    skills = application[0]["skills"];
  }
  if (new_values["contacts"] != undefined && new_values["contacts"] != null) {
    contacts = new_values["contacts"];
  } else {
    contacts = application[0]["contacts"];
  }
  if (new_values["posting_date"] != undefined && new_values["posting_date"] != null) {
    posting_date = new_values["posting_date"];
  } else {
    posting_date = application[0]["posting_date"];
  }
  if (new_values["status"] != undefined && new_values["status"] != null) {
    status = new_values["status"];
  } else {
    status = application[0]["status"];
  }
  if (new_values["link"] != undefined && new_values["link"] != null) {
    link = new_values["link"];
  } else {
    link = application[0]["link"];
  }

  // build modified application object
  const modified_application = {
    // username: application[0]["username"],
    skills: skills,
    contacts: contacts,
    title: title,
    description: description,
    posting_date: posting_date,
    status: status,
    link: link,
  };

  // save modified application record
  return datastore.save({ key: key, data: modified_application });
}

// DELETE applcation

function delete_application(id) {
  const key = datastore.key([APPLICATION, parseInt(id, 10)]);
  return datastore.delete(key);
}

// function put_application(id, name, description, skill) {
//   const key = datastore.key([APPLICATION, parseInt(id, 10)]);
//   const application = { "name": name, "description": description, "skill": skill };
//   return datastore.save({ "key": key, "data": application });
// }

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              /
//                                         Routes                                               /
//                                                                                              /
/////////////////////////////////////////////////////////////////////////////////////////////////

// POST application route

router.post("/", function (req, res) {
  console.log("Post request received!");

  // check if required parameters were sent in request; if not reject with 400 error
  if (req.body.title === undefined || req.body.title === null) {
    // if not, send 400
    return res.status(400).json({Error:  "The request object is missing at least one of the required attributes"});
  }
  if (req.body.description === undefined || req.body.title === null) {
    // if not, send 400
    return res.status(400).json({Error:  "The request object is missing at least one of the required attributes"});
  }

  // create default object for return

  post_application(
    req.body.title,
    req.body.description,
    req.body.skills,
    req.body.contacts,
    req.body.posting_date,
    req.body.status,
    req.body.link
  ).then((key) => {
    res.status(201).json({
      'id': key.id,
      'title': req.body.title,
      'description': req.body.description,
      'skills': req.body.skills,
      'contacts': req.body.contacts,
      'posting date': req.body.posting_date,
      'status': req.body.status,
      'link': req.body.link,
      'self': req.protocol + "://" + req.get("host") + req.baseUrl + "/" + key.id
    });
  });
});

// GET all applications route

router.get("/", function (req, res) {
  console.log("Get all requests received!");
  get_applications(req).then((applications) => {
    res.status(200).json(applications);
  });
});

// GET application by id route

router.get("/:id", function (req, res) {
  console.log("Get request received!");
  get_application(req)
  .then((application) => {
    if (application[0] === undefined || application[0] === null) {
      // The 0th element is undefined. This means there is no application with this id
      res.status(404).json({ Error: "No application exists with this id" });
    } 
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

// router.put("/:id", function (req, res) {
//   console.log("Put request received!");
//   put_application(
//     req.params.id,
//     req.body.name,
//     req.body.description,
//     req.body.skill
//   ).then(res.status(200).end());
// });

// PATCH application by id route

router.patch("/:id", function (req, res) {
  console.log("Patch request received!");
  // get application by id
  get_application(req)
  .then(application => {
    // if application doesn't exist reject with 404 error
    if(application[0] === undefined || application[0] === null){
      return res.status(404).json({'Error': 'No application with this id exists'});
    } else {
      // collect any modified values, collect correct result values
      const modified_values = {}
      const results = application
      console.log(application)
      if (req.body.title !== undefined){
        modified_values["title"] = req.body.title
        results["title"] = req.body.title
      }
      if (req.body.description !== undefined){
        modified_values["description"] = req.body.description
        results["description"] = req.body.description
      }
      if (req.body.skills !== undefined){
        modified_values["skills"] = req.body.skills
        results["skills"] = req.body.skills
      }
      if (req.body.contacts !== undefined){
        modified_values["contacts"] = req.body.contacts
        results["contacts"] = req.body.contacts
      }
      if (req.body.posting_date !== undefined){
        modified_values["posting_date"] = req.body.posting_date
        results["posting_date"] = req.body.posting_date
      }
      if (req.body.status !== undefined){
        modified_values["status"] = req.body.status
        results["status"] = req.body.status
      }
      if (req.body.link !== undefined){
        modified_values["link"] = req.body.link
        results["link"] = req.body.link
      }
      return patch_application(req.params.id, application, modified_values)
      .then(res.status(200).json({
        'id': req.params.id,
        // 'user': results["user"],
        'skills': results["skills"],
        'contacts': results["contacts"],
        'title': results["title"],
        'description': results["description"],
        'posting_date': results["posting_date"],
        'status': results["status"],
        'link': results["link"],
        'self': req.protocol + "://" + req.get("host") + req.baseUrl + "/" + req.params.id
      }))
    }
  })
})

// DELETE application by id route

router.delete("/:id", function (req, res) {
  console.log("Delete request received!");
  // get application by id
  get_application(req)
  .then(application => {
    // if applcation doesn't exist, reject with 404
    if(application[0] === undefined || application[0] === null){
      return res.status(404).json({'Error': 'No application with this id exists'});
    }
    // TODO implement all necessary checks and removals before delete
    return delete_application(req.params.id).then(res.status(204).end());
  })
});

// DELETE 405 applications route reject

router.delete('/', function (req, res){
  res.set('Accept', 'GET, POST');
  res.status(405).json({'Error': 'Only GET, POST requests allowed for all applications route'});
});

// PUT 405 applications route reject

router.put('/', function (req, res){
  res.set('Accept', 'GET, POST');
  res.status(405).json({'Error': 'Only GET, POST requests allowed for all applications route'});
});

// PATCH 405 applications route reject

router.patch('/', function (req, res){
  res.set('Accept', 'GET, POST');
  res.status(405).json({'Error': 'Only GET, POST requests allowed for all applications route'});
});

module.exports = router;
