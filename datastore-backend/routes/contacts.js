const express = require('express');
const router = express.Router();
const ds = require('../datastore');
const datastore = ds.datastore;
const errorMessages = require('./errorMessages');
const model = require('../model');
const modelContact = require('../modelContact');
const verifyUser = require('./middleware/verifyUser');
const constants = require('./constants');

// the name of the kind to be stored
const CONTACT = constants.CONTACT;


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
 * if not, send an error message.
 ************************************************************/
function checkRequestBody (req, res, next) {
  // available keys
  const allKeys = {
    "last_name": '', 
    "first_name": '', 
    "email": '', 
    "phone": '', 
    "notes": '', 
    "contact_at_app_id": '',
    "auth": '',
    "user": ''
  };

  // required keys
  const requiredKeys = [
    "last_name", 
    "first_name"
  ];

  let keyError = false;

  // check if received keys are valid (check key names and their value lenght)
  Object.entries(req.body).forEach(key => {
    if (key[0] === "last_name" || key[0] === "first_name" || key[0] === "email" || key[0] === "phone") {
      if (key[1].length > 30) {
        keyError = errorMessages[400].inputLenght;
      }
    };
    if (key[0] === "notes") {
      if (key[1].length > 500) {
        keyError = errorMessages[400].inputLenght;
      }
    };
    if (!(key[0] in allKeys)) {
      keyError = errorMessages[400].keyError;
    };
  });
  
  if (req.method !== 'PATCH') {
    // check if the body contains the required keys
    requiredKeys.forEach(key => {
      if (!(key in req.body)) {
        keyError = errorMessages[400].keyError;
      }
    });
  };

  if (req.method === 'PATCH') {
    // required keys cannot be empty strings, if so, send an error message
    if (req.body.last_name === '' || req.body.first_name === '') {
      keyError = errorMessages[400].requiredKey;
    };
  };

  if (keyError) {
    res.status(400).send(keyError)
  } else {
    next()
  }
};


/*************************************************************  
 * Check if the user sends a valid object's id, 
 * if not, send an error message.
 ************************************************************/
async function checkIdExists (req, res, next) {
  try {
    const key = datastore.key([CONTACT, parseInt(req.params.contact_id, 10)]);
    const entity = await datastore.get(key)
    if (entity[0] === undefined || entity[0] === null) {
      res.status(404).send(errorMessages[404].contacts);
    } else {
      next()
    }
  } catch (error) {
    console.error('Error caught in checkIdExists', error);
    res.status(500).send(errorMessages[500]);
  };
};


/*--------------- End Middleware Functions ----------------- */
/* ------------- Begin Controller Functions ---------------- */


/************************************************************* 
 * POST a new contact
 ************************************************************/
router.post('/users/:user_id/contacts', 
  verifyUser.verifyJWTWithUserParam, 
  checkContentTypeHeader, 
  checkRequestBody, 
  function (req, res) {

  //console.log("Post request received!");
  async function postUserContact() {
    try {
      const key = await modelContact.postContact(
        req.body.last_name, 
        req.body.first_name, 
        req.body.email, 
        req.body.phone, 
        req.body.notes, 
        req.body.contact_at_app_id,
        req.params.user_id
        );
      const contactId = key.id;
      const appsId = req.body.contact_at_app_id;

      // UPDATE the user by adding the contact id
      let userData = await model.getItemByManualID('users', req.params.user_id);
      let newUserData = userData[0]
      newUserData.contacts.push(contactId);
      model.updateItem(newUserData, 'users');
      
      // UPDATE the application(s) if added to the contact
      for (let app of appsId) {
        // get the application
        let application = await model.getItemByID('application', app);
        application[0].contacts.push(contactId);
        // update the application
        model.updateBigItem(application[0], 'application');
      };
      
      res.status(201).json(contactId);
    } catch (error) {
      console.error('Error caught in postUserContact', error);
      res.status(500).send(errorMessages[500]);
    };
  };

  postUserContact();
});


/************************************************************* 
 * GET all contacts
 ************************************************************/
router.get('/users/:user_id/contacts', 
  verifyUser.verifyJWTWithUserParam,  
  checkAcceptHeader, 
  function (req, res) {

  //console.log("Get all request received!");
  async function getUserContacts() {
    try {
      let contacts = await modelContact.getContacts(req.params.user_id);
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
      console.error('Error caught in getUserContacts', error);
      res.status(500).send(errorMessages[500]);
    };
  };

  getUserContacts();
});


/************************************************************* 
 * GET a contact
 ************************************************************/
router.get('/users/:user_id/contacts/:contact_id', 
  verifyUser.verifyJWTWithUserParam, 
  checkAcceptHeader, 
  checkIdExists, 
  function (req, res) {

  //console.log("Get request received!");
  async function getUserContact() {
    try {
      let contact = await modelContact.getContact(req.params.contact_id, req.params.user_id)
      if (contact === false) {
        // user does not own the contact
        res.status(403).send(errorMessages[403]);
      } else {
        res.status(200).json(contact[0]) 
      }
    } catch (error) {
      console.error('Error caught in getUserContact', error);
      res.status(500).send(errorMessages[500]);
    }
  }

  getUserContact();
});


/************************************************************* 
 * PUT: replace all values for this contact_id and updates applications if needed
 ************************************************************/
router.put('/users/:user_id/contacts/:contact_id', 
  verifyUser.verifyJWTWithUserParam, 
  checkContentTypeHeader, 
  checkRequestBody, 
  checkIdExists, 
  function (req, res) {

  //console.log("Put request received!");
  async function putUserContact() {
    try {
      const originalApps = await modelContact.putContact(
        req.params.contact_id, 
        req.body.last_name, 
        req.body.first_name, 
        req.body.email, 
        req.body.phone, 
        req.body.notes, 
        req.body.contact_at_app_id,
        req.params.user_id
        );
      const newApps =req.body.contact_at_app_id;
      if (originalApps === false) {
        // user does not own the contact
        res.status(403).send(errorMessages[403]);
      } else {
        // if the array of application has changed for the contact, update the old and new applications
        if (originalApps !== newApps) {

          // UPDATE old applications by removing the contact_id
          for (let app of originalApps) {
            if (!(newApps.includes(app))) {
              // get the application to be updated
              let application = await model.getItemByID('application', app);
              const appUpdatedContacts = [];
              for (let contactId of application[0].contacts) {
                if (contactId !== req.params.contact_id) {
                  appUpdatedContacts.push(contactId)
                }
              };
              application[0].contacts = appUpdatedContacts;
              // update the application
              model.updateBigItem(application[0], 'application');
            }
          };

          // UPDATE new applications if added by adding the contact_id
          for (let app of newApps) {
            if (!(originalApps.includes(app))) {
              // get the application to be updated
              let application = await model.getItemByID('application', app);
              application[0].contacts.push(req.params.contact_id);
              // update the application
              model.updateBigItem(application[0], 'application');
            }
          };
        };
        res.status(200).end();
      };
    } catch (error) {
      console.error('Error caught in putUserContact', error);
      res.status(500).send(errorMessages[500]);
    }
  };

  putUserContact();
});


/************************************************************* 
 * PATCH: update only received values and updates applications if needed
 ************************************************************/
router.patch('/users/:user_id/contacts/:contact_id', 
  verifyUser.verifyJWTWithUserParam, 
  checkContentTypeHeader, 
  checkRequestBody, 
  checkIdExists, 
  function (req, res) {

  //console.log("Patch request received!");
  async function patchUserContact() {
    try {
      const originalApps = await modelContact.patchContact(
        req.params.contact_id, 
        req.body.last_name, 
        req.body.first_name, 
        req.body.email, 
        req.body.phone, 
        req.body.notes, 
        req.body.contact_at_app_id,
        req.params.user_id
        );
      const newApps =req.body.contact_at_app_id;
      if (originalApps === false) {
        // user does not own the contact
        res.status(403).send(errorMessages[403]);
      } else {
        // if the array of application has changed for the contact, update the old and new applications
        if (originalApps !== newApps) {

          // UPDATE old applications by removing the contact_id
          for (let app of originalApps) {
            if (newApps !== undefined) {
              if (!(newApps.includes(app))) {
                // get the application to be updated
                let application = await model.getItemByID('application', app);
                const appUpdatedContacts = [];
                for (let contactId of application[0].contacts) {
                  if (contactId !== req.params.contact_id) {
                    appUpdatedContacts.push(contactId)
                  }
                };
                application[0].contacts = appUpdatedContacts;
                // update the application
                model.updateBigItem(application[0], 'application');
              }
            }
          };

          // UPDATE new applications if added by adding the contact_id
          if (newApps !== undefined) {
            for (let app of newApps) {
              if (!(originalApps.includes(app))) {
                // get the application to be updated
                let application = await model.getItemByID('application', app);
                application[0].contacts.push(req.params.contact_id);
                // update the application
                model.updateBigItem(application[0], 'application');
              }
            }
          }
        };
        res.status(200).end();
      };
    } catch (error) {
      console.error('Error caught in patchUserContact', error);
      res.status(500).send(errorMessages[500]);
    }
  };

  patchUserContact();
});


/************************************************************* 
 * DELETE a contact
 ************************************************************/
router.delete('/users/:user_id/contacts/:contact_id', 
  verifyUser.verifyJWTWithUserParam, 
  checkIdExists, 
  function (req, res) {

  //console.log("Delete request received!");
  async function deleteUserContact() {
    try {
      const contactId = req.params.contact_id;
      //if delete success, return the list of application to be updated
      const appsId = await modelContact.deleteContact(contactId, req.params.user_id);
      if (appsId === false) {
        // if user does not own the contact
        res.status(403).send(errorMessages[403]);
      } else {

        // UPDATE any application if releated to the contact 
        for (let app of appsId) { 
          // get the application
          let application = await model.getItemByID('application', app);
          const appUpdatedContacts = [];
          for (let contactId of application[0].contacts) {
            if (contactId !== contactId) {
              appUpdatedContacts.push(contactId)
            }
          };
          application[0].contacts = appUpdatedContacts;
          // update the application
          model.updateBigItem(application[0], 'application');
        };

        // UPDATE the user by removing the contact id
        let userData = await model.getItemByID('users', req.params.user_id);
        let newUserContacts = [];
        for (let contact of userData[0].contacts) {
          if (contactId !== contact) {
            newUserContacts.push(contact);
          }
        };
        userData[0].contacts = newUserContacts
        model.updateItem(userData[0], 'users');

        res.status(204).end();
      };
    } catch (error) {
      console.error('Error caught in deleteUserContact', error);
      res.status(500).send(errorMessages[500]);
    };
  };

  deleteUserContact();
});

/* -------------- End Controller Functions -------------- */
/* -------------- Begin Not Allowed Routes -------------- */

router.put('/users/:user_id/contacts', function (req, res) {
  res.set('Accept', 'GET, POST');
  res.status(405).send(errorMessages[405].all);
});


router.patch('/users/:user_id/contacts', function (req, res) {
  res.set('Accept', 'GET, POST');
  res.status(405).send(errorMessages[405].all);
});


router.delete('/users/:user_id/contacts', function (req, res) {
  res.set('Accept', 'GET, POST');
  res.status(405).send(errorMessages[405].all);
});


router.post('/users/:user_id/contacts/:contact_id', function (req, res) {
  res.set('Accept', 'GET, PUT, PATCH, DELETE');
  res.status(405).send(errorMessages[405].postWithId);
});

/* --------------- End Not Allowed Routes --------------- */

module.exports = router;
