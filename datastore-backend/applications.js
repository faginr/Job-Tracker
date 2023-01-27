const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const ds = require("./datastore");

const datastore = ds.datastore;

const APPLICATION = "Application";

router.use(bodyParser.json());

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              /
//                                       Handlers                                               /
//                                                                                              /
/////////////////////////////////////////////////////////////////////////////////////////////////

// POST application

function post_application(
  title,
  description,
  skills,
  contacts,
  date,
  status,
  link
) {
  var app_key = datastore.key(APPLICATION);
  const new_application = {
    title: title,
    description: description,
    skills: skills,
    contacts: contacts,
    date: date,
    status: status,
    link: link,
  };
  return datastore.save({ key: app_key, data: new_application }).then(() => {
    return key;
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
    return results;
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
  let date;
  let status;
  let link;

  // for each attribute, assign new value else retain old value
  if (new_values["title"] != undefined) {
    title = new_values["title"];
  } else {
    title = application[0]["title"];
  }
  if (new_values["description"] != undefined) {
    description = new_values["description"];
  } else {
    description = application[0]["description"];
  }
  if (new_values["date"] != undefined) {
    date = new_values[0]["date"];
  } else {
    date = application[0]["date"];
  }
  if (new_values["status"] != undefined) {
    status = new_values[0]["status"];
  } else {
    status = application[0]["status"];
  }
  if (new_values["link"] != undefined) {
    link = new_values[0]["link"];
  } else {
    link = application[0]["link"];
  }

  // build modified application object
  const modified_application = {
    // username: application[0]["username"],
    skills: application[0]["skills"],
    contacts: applications[0]["contacts"],
    title: title,
    description: description,
    date: date,
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

  post_application(
    req.body.title,
    req.body.description,
    req.body.skills,
    req.body.contacts,
    req.body.date,
    req.body.status,
    req.body.link
  ).then((key) => {
    res.status(201).send('{ "id": ' + key.id + " }");
  });
});

// GET all applications route

router.get("/", function (req, res) {
  console.log("Get all request received!");
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
      if (req.body.title !== undefined){
        modified_values["title"] = req.body.title
        results["title"] = req.body.title
      }
      if (req.body.title !== undefined){
        modified_values["description"] = req.body.description
        results["description"] = req.body.description
      }
      if (req.body.title !== undefined){
        modified_values["date"] = req.body.date
        results["date"] = req.body.date
      }
      if (req.body.title !== undefined){
        modified_values["status"] = req.body.status
        results["status"] = req.body.status
      }
      if (req.body.title !== undefined){
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
        'date': results["date"],
        'status': results["status"],
        'link': results["link"],
        'self': req.protocol + "://" + req.get("host") + req.baseUrl + "/" + req.params.id
      }))
    }
  })
  patch_application(req.params.id, application)
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
  res.status(405).json({'Error': 'Only GET requests allowed for all applications route'});
});

// PUT 405 applications route reject

router.put('/', function (req, res){
  res.set('Accept', 'GET, POST');
  res.status(405).json({'Error': 'Only GET requests allowed for all applications route'});
});

// PATCH 405 applications route reject

router.patch('/', function (req, res){
  res.set('Accept', 'GET, POST');
  res.status(405).json({'Error': 'Only GET requests allowed for all applications route'});
});

module.exports = router;
