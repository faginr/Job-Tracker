const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const ds = require('./datastore');

const datastore = ds.datastore;

const CONTACT = "Contact";

router.use(bodyParser.json());



/* ------------- Begin Lodging Model Functions ------------- */
function post_contact(name, email, phone, notes) {
  var key = datastore.key(CONTACT);
  const new_contact = { "name": name, "email": email, "phone": phone, "notes": notes };
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
      return entity.map(fromDatastore);
    }
  });
}

function put_contact(id, name, email, phone, notes ) {
  const key = datastore.key([CONTACT, parseInt(id, 10)]);
  const contact = { "name": name, "email": email, "phone": phone, "notes": notes };
  return datastore.save({ "key": key, "data": contact });
}

function delete_contact(id) {
  const key = datastore.key([CONTACT, parseInt(id, 10)]);
  return datastore.delete(key);
}

/* ------------- End Model Functions ------------- */

/* ------------- Begin Controller Functions ------------- */

router.get('/', function (req, res) {
  console.log("Get all request received!");
  get_contacts()
    .then((contacts) => {
      res.status(200).json(contacts);
    });
});

router.post('/', function (req, res) {
  console.log("Post request received!");
  post_contact(req.body.name, req.body.email, req.body.phone, req.body.notes)
    .then(key => { res.status(201).send('{ "id": ' + key.id + ' }') });
});

router.put('/:id', function (req, res) {
  console.log("Put request received!");
  put_contact(req.params.id, req.body.name, req.body.email, req.body.phone, req.body.notes)
    .then(res.status(200).end());
});

router.delete('/:id', function (req, res) {
  console.log("Delete request received!");
  delete_contact(req.params.id).then(res.status(204).end())
});

router.get('/:id', function (req, res) {
  console.log("Get request received!");
  get_contact(req.params.id)
    .then(contact => {
      if (contact[0] === undefined || contact[0] === null) {
        // The 0th element is undefined. This means there is no contact with this id
        res.status(404).json({ 'Error': 'No contact exists with this id' });
      } else {
        // Return the 0th element which is the contact with this id
        res.status(200).json(contact[0]);
      }
    });
});

/* ------------- End Controller Functions ------------- */

module.exports = router;