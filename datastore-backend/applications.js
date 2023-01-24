const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const ds = require('./datastore');

const datastore = ds.datastore;

const APPLICATION = "Application";

router.use(bodyParser.json());



/* ------------- Begin Lodging Model Functions ------------- */
function post_application(name, description, skill) {
  var key = datastore.key(APPLICATION);
  const new_application = { "name": name, "description": description, "skill": skill };
  return datastore.save({ "key": key, "data": new_application }).then(() => { return key });
}

/**
 * The function datastore.query returns an array, where the element at index 0
 * is itself an array. Each element in the array at element 0 is a JSON object
 * with an entity fromt the type "Application".
 */
function get_applications() {
  const q = datastore.createQuery(APPLICATION);
  return datastore.runQuery(q).then((entities) => {
    // Use Array.map to call the function fromDatastore. This function
    // adds id attribute to every element in the array at element 0 of
    // the variable entities
    return entities[0].map(ds.fromDatastore);
  });
}

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
function get_application(id) {
  const key = datastore.key([APPLICATION, parseInt(id, 10)]);
  return datastore.get(key).then((entity) => {
    if (entity[0] === undefined || entity[0] === null) {
      // No entity found. Don't try to add the id attribute
      return entity;
    } else {
      // Use Array.map to call the function fromDatastore. This function
      // adds id attribute to every element in the array entity
      return entity.map(fromDatastore);
    }
  });
}

function put_application(id, name, description, skill) {
  const key = datastore.key([APPLICATION, parseInt(id, 10)]);
  const application = { "name": name, "description": description, "skill": skill };
  return datastore.save({ "key": key, "data": application });
}

function delete_application(id) {
  const key = datastore.key([APPLICATION, parseInt(id, 10)]);
  return datastore.delete(key);
}

/* ------------- End Model Functions ------------- */

/* ------------- Begin Controller Functions ------------- */

router.get('/', function (req, res) {
  console.log("Get all request received!");
  get_applications()
    .then((applications) => {
      res.status(200).json(applications);
    });
});

router.post('/', function (req, res) {
  console.log("Post request received!");
  post_application(req.body.name, req.body.description, req.body.skill)
    .then(key => { res.status(201).send('{ "id": ' + key.id + ' }') });
});

router.put('/:id', function (req, res) {
  console.log("Put request received!");
  put_application(req.params.id, req.body.name, req.body.description, req.body.skill)
    .then(res.status(200).end());
});

router.delete('/:id', function (req, res) {
  console.log("Delete request received!");
  delete_application(req.params.id).then(res.status(204).end())
});

router.get('/:id', function (req, res) {
  console.log("Get request received!");
  get_application(req.params.id)
    .then(application => {
      if (application[0] === undefined || application[0] === null) {
        // The 0th element is undefined. This means there is no application with this id
        res.status(404).json({ 'Error': 'No application exists with this id' });
      } else {
        // Return the 0th element which is the application with this id
        res.status(200).json(application[0]);
      }
    });
});

/* ------------- End Controller Functions ------------- */

module.exports = router;