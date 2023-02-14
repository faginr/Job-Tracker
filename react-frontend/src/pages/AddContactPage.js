import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { datastore_url } from '../components/Constants';
import SelectMulti from '../components/SelectMulti';


export const AddContactPage = () => {
  
  const navigate = useNavigate();   // hook to navigate among the pages
  const [last_name, setLastName] = useState('');
  const [first_name, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  let [apps, setApps] = useState([]);
  const [selected, setSelected] = useState([]);
  let contact_at_app_id = []


  /************************************************************* 
   * Function to POST a new contact 
   ************************************************************/
  const addContact = async (e) => {
    e.preventDefault();

    if (selected.length > 0) {
      for (let element of selected) {
        contact_at_app_id.push(element.id)
      } 
    };  

    const newContact = { 
      last_name, 
      first_name, 
      email, 
      phone, 
      notes, 
      contact_at_app_id 
    };

    // POST a new contact
    const responseContactId = await fetch(
      `${datastore_url}/contacts`, 
      {
        method: 'POST',
        body: JSON.stringify(newContact),
        headers: {'Content-Type': 'application/json'},
      }
    );
    if (responseContactId.status === 201) {
      alert("Successfully added the contact!"); 
    } else {
      alert(`Failed to add the contact, status code = ${responseContactId.status}`);
    };

    // update an application if added to the contact
    if (contact_at_app_id.length > 0) {

      // get contact_id
      const contact_id = await responseContactId.json();

      // update the application(s)
      for (let application of contact_at_app_id) {

        // GET the application to be updated
        const responseGetApp = await fetch(`${datastore_url}/applications/${application}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (responseGetApp.status === 200) {
          alert("Successfully get the application!"); 
        } else {
          alert(`Failed to get the application, status code = ${responseGetApp.status}`);
        };

        const data = await responseGetApp.json();
        const appContacts = [];
        for (let contact of data.contacts) {
          appContacts.push(contact)
        };

        appContacts.push(`${contact_id}`)
        const updateApplication = { contacts: appContacts };

        // PATCH the application with contact_id
        const responseUpdateApp = await fetch(`${datastore_url}/applications/${application}`, {
          method: 'PATCH',
          body: JSON.stringify(updateApplication),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (responseUpdateApp.status === 200) {
          alert("Successfully updated the application!"); 
        } else {
          alert(`Failed to update the application, status code = ${responseUpdateApp.status}`);
        }
      }
    }
    // go back to Application Page
    navigate(-1);  
  };


  /************************************************************* 
   * Function to fetch applications 
   ************************************************************/
  const getApps = async () => {
    const response = await fetch(`${datastore_url}/applications`);
    const data = await response.json();

    // sort by title
    // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    data.sort((a, b) => {
      const titleA = a.title.toUpperCase(); // ignore upper and lowercase
      const titleB = b.title.toUpperCase(); // ignore upper and lowercase
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      };
      return 0;
    });

    setApps(data);
  };


  /************************************************************* 
   * Hook to call the function above 
   ************************************************************/
  useEffect(() => {
    getApps();
  }, []);


  /************************************************************* 
   * Function to add keys required by MultiSelect
   ************************************************************/
  function addKeys() {
    apps = apps.map(function(obj) {
        obj.label = obj.title;
        obj.value = obj.title;
        return obj;
    })
  };
  addKeys();


  /************************************************************* 
   * Search option for MultiSelect 
   * Source: https://www.npmjs.com/package/react-multi-select-component
   ************************************************************/
  const filterOptions = (options, filter) => {
    if (!filter) {
      return options;
    }
    const re = new RegExp(filter, "i");
    return options.filter(({ label }) => label && label.match(re));
  };


  return (
    <div>
      <form onSubmit={addContact}>
        <h1>Add Contact</h1>       
        <input
          required
          type="text"
          value={first_name}
          placeholder="Enter first name (required)"
          onChange={e => setFirstName(e.target.value)} />
        <input
          required
          type="text"
          placeholder="Enter last name (required)"
          value={last_name}
          onChange={e => setLastName(e.target.value)} />
        <input
          type="text"
          value={email}
          placeholder="Enter email"
          onChange={e => setEmail(e.target.value)} />
        <input
          type="text"
          placeholder="Enter phone"
          value={phone}
          onChange={e => setPhone(e.target.value)} />
        <input
          type="text"
          placeholder="Enter notes"
          value={notes}
          onChange={e => setNotes(e.target.value)} />

        <div>
          <h5>Select Applications releated to the contact</h5>
          <SelectMulti
            apps={apps}
            selected={selected}
            setSelected={setSelected}
            />
        </div>

        <p>
        <input type="submit" value="Add Contact" />
        <> </>
        <input type="button" value="Cancel" onClick={() => navigate(-1)} />
        </p>
      </form>
      
    </div>
  );
}

export default AddContactPage;