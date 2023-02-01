/**
 * Date 1/25/2023
 * Code Source for Model and Control Functions:
 * The code is adapted from a code provided in CS493 Cloud Development:
 * Module 4: Intermediate Restful API
 * Exploration - Intermediate REST API Features with Node.js
 */


const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const ds = require('../datastore');
const datastore = ds.datastore;

const errorMessages = require('./errorMessages');

// the name of the kind to be stored
const CONTACT = "contact";


/** 
 * Check if the request body is in the json format, if not, send an error message.
 */
router.use(bodyParser.json());
router.use((err, req, res, next) => {
  if (err) {
    //console.error(err)
    res.status(400).send(errorMessages[400].jsonError)
  } else {
    next()
  }
});


/*--------------- Begin Middleware Functions --------------- */

/** 
 * Check if the user sends accepted Content-Type header, 
 * if not, send an error message.
 */
function checkContentTypeHeader (req, res, next) {
  if (req.get('content-type') !== 'application/json') {
    res.status(415).send(errorMessages[415])
  } else {
    next()
  }
};


/** 
 * Check if the user sends accepted Accept header, 
 * if not, send an error message.
 */
function checkAcceptHeader (req, res, next) {
  if (req.get('accept') !== 'application/json' && req.get('accept') !== '*/*') {
    res.status(406).send(errorMessages[406])
  } else {
    next()
  }
};


/** 
 * Check if the user sends the body with valid object keys, 
 * if not, send an error message.
 */
function checkRequestBody (req, res, next) {
  const allKeys = {"last_name": '', 
    "first_name": '', 
    "email": '', 
    "phone": '', 
    "notes": '', 
    "contact_at_app_id": ''
  };
  const requiredKeys = ["last_name", "first_name"];
  let keyError = false;

  // check if received keys are valid
  Object.keys(req.body).forEach(key => {
    if (!(key in allKeys)) {
      keyError = true;
    }    
  });

  // check if the body contains the required keys
  requiredKeys.forEach(key => {
    if (!(key in req.body)) {
      keyError = true;
    }
  });

  if (keyError) {
    res.status(400).send(errorMessages[400].keyError)
  } else {
    next()
  }
};


/** 
 * Check if the user sends a valid object's id, 
 * if not, send an error message.
 */
function checkIdExists (req, res, next) {
  const key = datastore.key([CONTACT, parseInt(req.params.id, 10)]);
  return datastore.get(key).then((entity) => {
    if (entity[0] === undefined || entity[0] === null) {
      res.status(404).send(errorMessages[404]);
    } else {
      next()
    }
  });

};

/*--------------- End Middleware Functions ----------------- */


/* ------------- Begin Lodging Model Functions ------------- */

function post_contact(last_name, first_name, email, phone, notes, contact_at_app_id) {
  var key = datastore.key(CONTACT);
  const new_contact = { 
    "last_name": last_name, 
    "first_name": first_name, 
    "email": email, 
    "phone": phone, 
    "notes": notes, 
    "contact_at_app_id": contact_at_app_id 
  };
  return datastore.save({ "key": key, "data": new_contact }).then(() => { return key });
}


/**
 * The function datastore.query returns an array, where the element at index 0
 * is itself an array. Each element in the array at element 0 is a JSON object
 * with an entity fromt the type "Contact".
 */
function get_contacts() {
  const q = datastore.createQuery(CONTACT);
  return datastore.runQuery(q).then((entities) => {
    // Use Array.map to call the function fromDatastore. This function
    // adds id attribute to every element in the array at element 0 of
    // the variable entities
    return entities[0].map(ds.fromDatastore);
  });
}


/**
 * Note that datastore.get returns an array where each element is a JSON object 
 * corresponding to an entity of the Type "Contact." If there are no entities
 * in the result, then the 0th element is undefined.
 * @param {number} id Int ID value
 * @returns An array of length 1.
 *      If a contact with the provided id exists, then the element in the array
 *           is that contact
 *      If no contact with the provided id exists, then the value of the 
 *          element is undefined
 */
function get_contact(id) {
  const key = datastore.key([CONTACT, parseInt(id, 10)]);
  return datastore.get(key).then((entity) => {
    if (entity[0] === undefined || entity[0] === null) {
      // No entity found. Don't try to add the id attribute
      return entity;
    } else {
      // Use Array.map to call the function fromDatastore. This function
      // adds id attribute to every element in the array entity
      return entity.map(ds.fromDatastore);
    }
  });
}


function put_contact(id, last_name, first_name, email, phone, notes, contact_at_app_id ) {
  const key = datastore.key([CONTACT, parseInt(id, 10)]);
  const contact = { 
    "last_name": last_name, 
    "first_name": first_name, 
    "email": email, 
    "phone": phone, 
    "notes": notes, 
    "contact_at_app_id": contact_at_app_id 
  };
  return datastore.save({ "key": key, "data": contact });
}


function delete_contact(id) {
  const key = datastore.key([CONTACT, parseInt(id, 10)]);
  return datastore.delete(key);
}

/* ------------- End Model Functions ------------- */

/* ------------- Begin Controller Functions ------------- */

router.get('/', checkAcceptHeader, function (req, res) {
  console.log("Get all request received!");
  get_contacts()
    .then((contacts) => {
      res.status(200).json(contacts);
    })
    .catch(error => {
      console.error(error);
      res.send({ error: "Request failed." })
    });
});


router.post('/', checkContentTypeHeader, checkRequestBody, function (req, res) {
  console.log("Post request received!");
  post_contact(
    req.body.last_name, 
    req.body.first_name, 
    req.body.email, req.body.phone, 
    req.body.notes, 
    req.body.contact_at_app_id
    )
    .then(key => { res.status(201).json(key.id) })
    .catch(error => {
      console.error(error);
      res.send({ error: "Request failed." })
    });
});


router.put('/:id', checkContentTypeHeader, checkRequestBody, function (req, res) {
  console.log("Put request received!");
  put_contact(
    req.params.id, 
    req.body.last_name, 
    req.body.first_name, 
    req.body.email, 
    req.body.phone, 
    req.body.notes, 
    req.body.contact_at_app_id
    )
    .then(res.status(200).end())
    .catch(error => {
      console.error(error);
      res.send({ error: "Request failed." })
    });
});


router.delete('/:id', checkIdExists, function (req, res) {
  console.log("Delete request received!");
  delete_contact(req.params.id)
    .then(res.status(204).end())
    .catch(error => {
      console.error(error);
      res.send({ error: "Request failed." })
    });
});


router.get('/:id', checkAcceptHeader, checkIdExists, function (req, res) {
  console.log("Get request received!");
  get_contact(req.params.id)
    .then(contact => {res.status(200).json(contact[0]) })
    .catch(error => {
      console.error(error);
      res.send({ error: "Request failed." })
    });
});

/* ------------- End Controller Functions ------------- */

module.exports = router;