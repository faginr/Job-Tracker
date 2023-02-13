import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { datastore_url } from '../components/Constants';

export const EditContactPage = ({ contactToEdit }) => {
  
  const navigate = useNavigate();   // hook to navigate among the pages

  // store the original application id's if replaced by new application
  const originalApplication = contactToEdit.contact_at_app_id

  const [last_name, setLastName] = useState(contactToEdit.last_name);
  const [first_name, setFirstName] = useState(contactToEdit.first_name);
  const [email, setEmail] = useState(contactToEdit.email);
  const [phone, setPhone] = useState(contactToEdit.phone);
  const [notes, setNotes] = useState(contactToEdit.notes);
  const [contact_at_app_id, setContactAt] = useState(contactToEdit.contact_at_app_id);
  const [apps, setApps] = useState([]);


  /************************************************************* 
   * Function to edit the contact 
   ************************************************************/
  const editContact = async (e) => {
    e.preventDefault();

    const editedContact = { 
      last_name, 
      first_name, 
      email, 
      phone, 
      notes, 
      contact_at_app_id 
    };

    // PUT the contact
    const response = await fetch(
      `${datastore_url}/contacts/${contactToEdit.id}`, 
      {
        method: 'PUT',
        body: JSON.stringify(editedContact),
        headers: {'Content-Type': 'application/json',},
      }
    );
    if (response.status === 200){
      alert("Successfully edited the contact!"); 
    } else {
      alert(`Failed to edit contact, status code = ${response.status}`);
    }

    // if application has changed for the contact, update the old and new applications
    if (originalApplication !== contact_at_app_id) {

      // update the old application if existed
      if (originalApplication !== '' && originalApplication !== undefined) {
        console.log('applications changed for the contact');

        // update the old application
        const updatedOldApplication = { contacts: '' };

        // PATCH the old application if changed
        const responseOldApplication = await fetch(`${datastore_url}/applications/${originalApplication}`, {
          method: 'PATCH',
          body: JSON.stringify(updatedOldApplication),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if(responseOldApplication.status === 200){
          alert("Successfully updated the old application!"); 
        } else {
          alert(`Failed to update the old application, status code = ${responseOldApplication.status}`);
        }
      };

      // PATCH the new application if added
      if (contact_at_app_id !== '' && contact_at_app_id !== undefined) {
        const updatedNewApplication = { contacts: `${contactToEdit.id}` };

        const responseUpdateNewApp = await fetch(`${datastore_url}/applications/${contact_at_app_id}`, {
          method: 'PATCH',
          body: JSON.stringify(updatedNewApplication),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if(responseUpdateNewApp.status === 200){
          alert("Successfully updated the new application!"); 
        } else {
          alert(`Failed to update the new application, status code = ${responseUpdateNewApp.status}`);
        }
      };
    };

    // go back to Contact Page
    navigate(-1);  
  };


  /************************************************************* 
   * Function to fetch applications 
   ************************************************************/
  const getApps = async () => {
    const response = await fetch(`${datastore_url}/applications`);
    const data = await response.json();
    setApps(data);
  };


  /************************************************************* 
   * Hook to call the function above 
   ************************************************************/
  useEffect(() => {
    getApps();
  }, []);


  /************************************************************* 
   * Iterate over the array of the applications 
   * and add name of application to the contact 
   ************************************************************/
  let contact_at_name;
  for (let app of apps) {
    if (contactToEdit.contact_at_app_id === app.id) {
      contact_at_name = app.title;
    } 
  };


  /************************************************************* 
   * Sort the array of applications
   * Source: https://stackabuse.com/sort-array-of-objects-by-string-property-value/
   ************************************************************/
  let sortedApps = apps.sort((a,b) => {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return -1;
    }
    if (b.title.toLowerCase() > a.title.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  
  return (
    <div>
      <form onSubmit={editContact}>
        <h1>Edit Contact</h1>
        <input
          type="text"
          value={first_name}
          onChange={e => setFirstName(e.target.value)} />
        <input
          required
          type="text"
          value={last_name}
          onChange={e => setLastName(e.target.value)} />
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)} />
        <input
          type="text"
          value={phone}
          onChange={e => setPhone(e.target.value)} />
        <input
          type="text"
          value={notes}
          onChange={e => setNotes(e.target.value)} />

        <select multiple onChange={e => setContactAt(e.target.value)}>
          
          <option>{contact_at_name}</option>
          <option></option>
          {sortedApps.map((option, index) => {
            return <option key={index} value={option.id}>
              {option.title}
              </option>
          })}

        </select> 

        <p>
        <input type="submit" value="Submit Changes" />
        <> </>
        <input type="button" value="Cancel" onClick={() => navigate(-1)} />
        </p>
      </form>
    </div>
  );
}

export default EditContactPage;