const express = require('express');
const router = express.Router();
const ds = require('../datastore');
const datastore = ds.datastore;
const errorMessages = require('./errorMessages');
const model = require('../model')
const verifyUser = require('./middleware/verifyUser')

// the name of the kind to be stored
const CONTACT = "contact";


/************************************************************* 
 * Function to get a user_id from the url
 ************************************************************/
function getUserId(req) {
  const tempArray = req.baseUrl.split("/");
  return tempArray[2];
};


/*--------------- Begin Middleware Functions --------------- */

/************************************************************* 
 * Check if the user sends accepted Content-Type header, 
 * if not, send an error message.
 ************************************************************/
function checkContentTypeHeader (req, res, next) {
  if (req.get('content-type') !== 'application/json') {
    res.status(415).send(errorMessages[415])
  } else {
    next()
  }
};


/************************************************************* 
 * Check if the user sends accepted Accept header, 
 * if not, send an error message.
 ************************************************************/
function checkAcceptHeader (req, res, next) {
  if (req.get('accept') !== 'application/json' && req.get('accept') !== '*/*') {
    res.status(406).send(errorMessages[406])
  } else {
    next()
  }
};


/************************************************************* 
 * Check if the user sends the body with valid object keys, 
 * if not, send an error message (used by POST and PUT).
 ************************************************************/
function checkRequestBody (req, res, next) {

  // available keys
  const allKeys = {
    "last_name": '', 
    "first_name": '', 
    "email": '', 
    "phone": '', 
    "notes": '', 
    "contact_at_app_id": ''
  };

  // required keys
  const requiredKeys = [
    "last_name", 
    "first_name"
  ];

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


/************************************************************* 
 * Check if the user sends the body with valid object keys, 
 * if not, send an error message (used by POST and PUT).
 ************************************************************/
function checkRequestBodyPatch (req, res, next) {

  // available keys
  const allKeys = {
    "last_name": '', 
    "first_name": '', 
    "email": '', 
    "phone": '', 
    "notes": '', 
    "contact_at_app_id": ''
  };

  // check if received keys are valid
  Object.keys(req.body).forEach(key => {
    if (!(key in allKeys)) {
      res.status(400).send(errorMessages[400].keyError)
    }    
  });

  // required keys cannot be empty strings, if so, send an error message
  if (req.body.last_name === '' || req.body.first_name === '') {
    res.status(400).send(errorMessages[400].requiredKey)
  };

  next()
};


/*************************************************************  
 * Check if the user sends a valid object's id, 
 * if not, send an error message.
 ************************************************************/
function checkIdExists (req, res, next) {
  const key = datastore.key([CONTACT, parseInt(req.params.contact_id, 10)]);
  return datastore.get(key).then((entity) => {
    if (entity[0] === undefined || entity[0] === null) {
      res.status(404).send(errorMessages[404].contacts);
    } else {
      next()
    }
  })
};

/*--------------- End Middleware Functions ----------------- */


/* ------------- Begin Model Functions ------------- */

/************************************************************* 
 * The function sends a request to datastore to store the received data 
 * and returns the status code and the key of new created object.
 ************************************************************/
function postContact(last_name, first_name, email, phone, notes, contact_at_app_id, user_id) {
  let key = datastore.key(CONTACT);
  
  const default_values = {
    'email': "",
    'phone': "",
    'notes': "",
    'contact_at_app_id': []
  }

  // if optional values undefined, apply the default values
  if (email === undefined) {
    email = default_values["email"]
  }
  if (phone === undefined) {
    phone = default_values["phone"]
  }
  if (notes === undefined) {
    notes = default_values["notes"]
  }
  if (contact_at_app_id === undefined) {
    contact_at_app_id = default_values["contact_at_app_id"]
  };

  // create object
  const new_contact = { 
    "last_name": last_name,
    "first_name": first_name, 
    "email": email, 
    "phone": phone, 
    "notes": notes, 
    "contact_at_app_id": contact_at_app_id,
    "user_id": user_id
  };

  return datastore.save({ "key": key, "data": new_contact }).then(() => { return key });
};


/************************************************************* 
 * The function returns the arry of contacts that belongs to the user
 ************************************************************/
async function getContacts(user_id) {
  const query = datastore.createQuery(CONTACT);
  let contacts = await datastore.runQuery(query);
  // array.map adds id attribute to every element in the array at element 0 of
  // the variable contacts
  contacts = contacts[0].map(ds.fromDatastore);
  let userContacts = [];
  // get only contacts that belongs to the user
  for (let contact of contacts) {
    if (user_id === contact.user_id) {
      userContacts.push(contact)
    }
  };
  return userContacts;
};


/************************************************************* 
 * The function returns the arry with the requested contact 
 * if the contact belongs to the user
 ************************************************************/
async function get_contact(contact_id, user_id) {
  const key = datastore.key([CONTACT, parseInt(contact_id, 10)]);
  let contact = await datastore.get(key);
  // array.map adds id attribute
  contact = contact.map(ds.fromDatastore);
  // check if the contact belongs to the user
  if (user_id === contact[0].user_id) {
    return contact;
  } else {
    return false;
  };
};


/************************************************************* 
 * The function sends a request to datastore to replace 
 * old values with the new values and returns the status code
 * if the contact belongs to the user
 ************************************************************/
async function put_contact(contact_id, last_name, first_name, email, phone, notes, contact_at_app_id, user_id ) {
  const key = datastore.key([CONTACT, parseInt(contact_id, 10)]);
  let contact = await datastore.get(key);
  // check if the contact belongs to the user
  if (user_id !== contact[0].user_id) {
    return false;
  } else {
    contact = { 
      "last_name": last_name, 
      "first_name": first_name, 
      "email": email, 
      "phone": phone, 
      "notes": notes, 
      "contact_at_app_id": contact_at_app_id,
      "user_id": user_id
    };
    let result = await datastore.save({ "key": key, "data": contact });
    return result;
  }
};


/************************************************************* 
 * The function sends a request to datastore to update some old values 
 * with the new values and returns the status code
 * if the contact belongs to the user
 ************************************************************/
async function patch_contact(contact_id, last_name, first_name, email, phone, notes, contact_at_app_id, user_id ) {
  const key = datastore.key([CONTACT, parseInt(contact_id, 10)]);
  let contact = await datastore.get(key);
  // check if the contact belongs to the user
  if (user_id !== contact[0].user_id) {
    return false;
  } else {
    if (last_name === undefined) {
      last_name = contact[0].last_name
    }
    if (first_name === undefined) {
      first_name = contact[0].first_name
    }
    if (email === undefined) {
      email = contact[0].email
    }
    if (phone === undefined) {
      phone = contact[0].phone
    }
    if (notes === undefined) {
      notes = contact[0].notes
    }
    if (contact_at_app_id === undefined) {
      contact_at_app_id = contact[0].contact_at_app_id
    };
    // created the contact
    contact = { 
      "last_name": last_name, 
      "first_name": first_name, 
      "email": email, 
      "phone": phone, 
      "notes": notes, 
      "contact_at_app_id": contact_at_app_id,
      "user_id": user_id
    };
    let result = await datastore.save({ "key": key, "data": contact });
    return result;
  }
};


/************************************************************* 
 * The function sends a request to datastore to delete the object
 * and returns the status code if the contact belongs to the user
 ************************************************************/
async function deleteContact(contact_id, user_id) {
  const key = datastore.key([CONTACT, parseInt(contact_id, 10)]);

  let contact = await datastore.get(key);
  // check if the contact belongs to the user
  if (user_id !== contact[0].user_id) {
    return false;
  } else {
    await datastore.delete(key);
    return contact[0].contact_at_app_id;
  }
};


/* ----------------- End Model Functions ---------------- */

/* ------------- Begin Controller Functions ------------- */


/************************************************************* 
 * POST a new contact
 ************************************************************/
router.post('/', checkContentTypeHeader, checkRequestBody, function (req, res) {
  //console.log("Post request received!");
  const user_id = getUserId(req);

  async function postUserContact() {
    try {
      const key = await postContact(
        req.body.last_name, 
        req.body.first_name, 
        req.body.email, 
        req.body.phone, 
        req.body.notes, 
        req.body.contact_at_app_id,
        user_id
        );
      const contactId = key.id;
      const appsId = req.body.contact_at_app_id;
      
      // UPDATE the application(s) if added to the contact
      for (let app of appsId) {

        // GET the application
        let application = await model.getItemByID('application', app);
        application[0].contacts.push(contactId);

        // PATCH the application
        model.updateItem(application[0], 'application');
      };
      
      res.status(201).json(contactId);
    } catch (error) {
      console.error(error);
      res.status(500).send(errorMessages[500]);
    };
  };

  postUserContact();
});


/************************************************************* 
 * GET all contacts
 ************************************************************/
router.get('/', checkAcceptHeader, function (req, res) {
  //console.log("Get all request received!");
  const user_id = getUserId(req);

  async function getUserContacts() {
    try {
      let contacts = await getContacts(user_id);
      const applications = await model.getItemsNoPaginate('application');
      // Iterate over contacts and applications, if a contact is related to an application, 
      // add the name and link of this application to this contact 
      let arrayAppsNames = [];
      let objApps = {};
      for (let contact of contacts) {
        arrayAppsNames = [];
        for (let app_id of contact.contact_at_app_id) {
          for (let application of applications) {
            if (app_id === application.id) {
              objApps = {};
              objApps['title'] = application.title;
              objApps['link'] = application.link;
              arrayAppsNames.push(objApps); 
            } 
          }
        };
        contact.arrayAppsNames = arrayAppsNames;
      };
      res.status(200).json(contacts);
    } catch (error) {
      console.error(error);
      res.status(500).send(errorMessages[500]);
    };
  };

  getUserContacts();
});


/************************************************************* 
 * GET a contact
 ************************************************************/
router.get('/:contact_id', checkAcceptHeader, checkIdExists, function (req, res) {
  //console.log("Get request received!");
  const user_id = getUserId(req);

  get_contact(req.params.contact_id, user_id)
    .then(contact => {
      if (contact === false) {
        // user does not own the contact
        res.status(403).send(errorMessages[403]);
      } else {
        res.status(200).json(contact[0]) 
      };
    })
    .catch(error => {
      console.error(error);
      res.status(500).send(errorMessages[500]);
    })
});


/************************************************************* 
 * PUT: replace all values for this contact_id
 ************************************************************/
router.put('/:contact_id', checkContentTypeHeader, checkRequestBody, checkIdExists, function (req, res) {
  //console.log("Put request received!");
  const user_id = getUserId(req);

  put_contact(
    req.params.contact_id, 
    req.body.last_name, 
    req.body.first_name, 
    req.body.email, 
    req.body.phone, 
    req.body.notes, 
    req.body.contact_at_app_id,
    user_id
    )
    .then((contact) => {
      if (contact === false) {
        // user does not own the contact
        res.status(403).send(errorMessages[403]);
      } else {
        res.status(200).end() 
      };
    })
    .catch(error => {
      console.error(error);
      res.status(500).send(errorMessages[500]);
    })
});


/************************************************************* 
 * PATCH: update some values, the received values, 
 * do not change others for this contact_id
 ************************************************************/
router.patch('/:contact_id', checkContentTypeHeader, checkRequestBodyPatch, checkIdExists, function (req, res) {
  //console.log("Patch request received!");
  const user_id = getUserId(req);

  patch_contact(
    req.params.contact_id, 
    req.body.last_name, 
    req.body.first_name, 
    req.body.email, 
    req.body.phone, 
    req.body.notes, 
    req.body.contact_at_app_id,
    user_id
    )
    .then((contact) => {
      if (contact === false) {
        // user does not own the contact
        res.status(403).send(errorMessages[403]);
      } else {
        res.status(200).end() 
      };
    })
    .catch(error => {
      console.error(error);
      res.status(500).send(errorMessages[500]);
    });
  }
);


/************************************************************* 
 * DELETE a contact
 ************************************************************/
router.delete('/:contact_id', checkIdExists, function (req, res) {
  //console.log("Delete request received!");
  const user_id = getUserId(req);

  async function deleteUserContact() {
    try {
      //if delete success, return the list of application to be updated
      const appsId = await deleteContact(req.params.contact_id, user_id);
      if (appsId === false) {
        // if user does not own the contact
        res.status(403).send(errorMessages[403]);
      } else {
        // UPDATE any application if releated to the contact 
        for (let app of appsId) { 

          // GET the application
          let application = await model.getItemByID('application', app);
          const appNewContacts = [];
          for (let contactId of application[0].contacts) {
            if (contactId !== req.params.contact_id) {
              appNewContacts.push(contactId)
            }
          };
          application[0].contacts = appNewContacts;

          // PATCH the application
          model.updateItem(application[0], 'application');
        };

        res.status(204).end();
      };
    } catch (error) {
      console.error(error);
      res.status(500).send(errorMessages[500]);
    };
  };

  deleteUserContact();
});

/* -------------- End Controller Functions -------------- */

/* -------------- Begin Not Allowed Routes -------------- */

router.put('/', function (req, res) {
  res.set('Accept', 'GET, POST');
  res.status(405).send(errorMessages[405].all);
});


router.patch('/', function (req, res) {
  res.set('Accept', 'GET, POST');
  res.status(405).send(errorMessages[405].all);
});


router.delete('/', function (req, res) {
  res.set('Accept', 'GET, POST');
  res.status(405).send(errorMessages[405].all);
});


router.post('/:contact_id', function (req, res) {
  res.set('Accept', 'GET, PUT, PATCH, DELETE');
  res.status(405).send(errorMessages[405].postWithId);
});

/* --------------- End Not Allowed Routes --------------- */

module.exports = router;