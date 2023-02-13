import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { datastore_url } from '../components/Constants';
import { MultiSelect } from "react-multi-select-component";


export const AddContactPage = () => {
  
  // hook to navigate among the pages
  const navigate = useNavigate();

  const [last_name, setLastName] = useState('');
  const [first_name, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  //const [contact_at_app_id, setContactAt] = useState([]);

  let [apps, setApps] = useState([]);
  const [selected, setSelected] = useState([]);
  let contact_at_app_id = []

  // add the contact to the database
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

    if(responseContactId.status === 201){
      alert("Successfully added the contact!"); 
    } else {
      alert(`Failed to add the contact, status code = ${responseContactId.status}`);
    };

    // update an application if added to the contact
    if (contact_at_app_id.length > 0) {

      // get contact_id
      const contact_id = await responseContactId.json();

      // update the application(s)
      for (let contact of contact_at_app_id) {      

        const updateApplication = { contacts: `${contact_id}` };

        // PATCH the application with contact_id
        const responseUpdateApp = await fetch(`${datastore_url}/applications/${contact}`, {
          method: 'PATCH',
          body: JSON.stringify(updateApplication),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if(responseUpdateApp.status === 200){
          alert("Successfully updated the application!"); 
        } else {
          alert(`Failed to update the application, status code = ${responseUpdateApp.status}`);
        }
      }
    }
    // go back to Application Page
    navigate(-1);  
  };

  // function to fetch applications
  const getApps = async () => {
    const response = await fetch(`${datastore_url}/applications`);
    const data = await response.json();
    setApps(data);
  };

  // hook to call the fucntion above
  useEffect(() => {
    getApps();
  }, []);

  // add keys required by MultiSelect
  function addKeys() {
    apps = apps.map(function(obj) {
        obj.label = obj.title;
        obj.value = obj.title;
        return obj;
    })
  };
  addKeys();

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
          <MultiSelect
            options={apps}
            value={selected}
            onChange={setSelected}
            filterOptions={filterOptions}
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