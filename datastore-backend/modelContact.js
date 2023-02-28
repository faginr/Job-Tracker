const ds = require('./datastore');
const datastore = ds.datastore;
const constants = require('./routes/constants');

// the name of the kind to be stored
const CONTACT = constants.CONTACT;


/* ------------- Begin Model Functions ------------- */

/************************************************************* 
 * The function sends a request to datastore to store the received data 
 * and returns the status code and the key of new created object.
 ************************************************************/
async function postContact(last_name, first_name, email, phone, notes, contact_at_app_id, user_id) {
  try {
    let key = datastore.key(CONTACT);
    const default_values = {
      'email': "",
      'phone': "",
      'notes': "",
      'contact_at_app_id': []
    };

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

    await datastore.save({ "key": key, "data": new_contact });
    return key;
  } catch (error) {
    console.error(error);
  };
};


/************************************************************* 
 * The function returns the arry of contacts that belongs to the user
 ************************************************************/
async function getContacts(user_id) {
  try {
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
  } catch (error) {
    console.error(error);
  };
};


/************************************************************* 
 * The function returns the arry with the requested contact 
 * if the contact belongs to the user
 ************************************************************/
async function getContact(contact_id, user_id) {
  try {
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
  } catch (error) {
    console.error(error);
  };
};


/************************************************************* 
 * The function sends a request to datastore to replace 
 * old values with the new values and returns the status code
 * if the contact belongs to the user
 ************************************************************/
async function putContact(contact_id, last_name, first_name, email, phone, notes, contact_at_app_id, user_id ) {
  try {
    const key = datastore.key([CONTACT, parseInt(contact_id, 10)]);
    let contact = await datastore.get(key);
    // check if the contact belongs to the user
    if (user_id !== contact[0].user_id) {
      return false;
    } else {
      const newContact = { 
        "last_name": last_name, 
        "first_name": first_name, 
        "email": email, 
        "phone": phone, 
        "notes": notes, 
        "contact_at_app_id": contact_at_app_id,
        "user_id": user_id
      };
      await datastore.save({ "key": key, "data": newContact });
      // return the array of old applications
      return contact[0].contact_at_app_id;
    }
  } catch (error) {
    console.error(error);
  };
};


/************************************************************* 
 * The function sends a request to datastore to update some old values 
 * with the new values and returns the status code
 * if the contact belongs to the user
 ************************************************************/
async function patchContact(contact_id, last_name, first_name, email, phone, notes, contact_at_app_id, user_id ) {
  try {
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
  } catch (error) {
    console.error(error);
  };
};


/************************************************************* 
 * The function sends a request to datastore to delete the object
 * and returns the status code if the contact belongs to the user
 ************************************************************/
async function deleteContact(contact_id, user_id) {
  try {
    const key = datastore.key([CONTACT, parseInt(contact_id, 10)]);
    let contact = await datastore.get(key);
    // check if the contact belongs to the user
    if (user_id !== contact[0].user_id) {
      return false;
    } else {
      await datastore.delete(key);
      return contact[0].contact_at_app_id;
    }
  } catch (error) {
    console.error(error);
  };
};


/* ----------------- End Model Functions ---------------- */

module.exports = {
  postContact,
  getContacts,
  getContact,
  putContact, 
  patchContact,
  deleteContact
}