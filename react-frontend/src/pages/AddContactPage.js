import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { datastore_url } from '../utils/Constants';
import SelectMulti from '../components/SelectMulti';
import ContactUserInputs from '../components/ContactUserInputs';
import { user } from '../utils/User';
import ContactGetApps from '../components/ContactGetApps';

export const AddContactPage = () => {
  
  const navigate = useNavigate();   // hook to navigate among the pages
  const [last_name, setLastName] = useState('');
  const [first_name, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  let contact_at_app_id = []
  const [selected, setSelected] = useState([]);   // added apps to the contact
  let [apps, setApps] = useState([]);


  /************************************************************* 
   * Function to POST a new contact 
   ************************************************************/
  const addContact = async (e) => {
    e.preventDefault();
    console.log('contact_at_app_id', contact_at_app_id)
    console.log('selected', selected)

    for (let element of selected) {
      contact_at_app_id.push(element.id)
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
    const responseContactId = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/contacts`, 
      {
        method: 'POST',
        body: JSON.stringify(newContact),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user}`},
      }
    );
    if (responseContactId.status === 201) {
      alert("Successfully added the contact!"); 
    } else {
      console.log(`Failed to add the contact, status code = ${responseContactId.status}`);
    };

    // go back to Contact Page
    navigate(0);  
  };


  /************************************************************* 
   * Hook to call the function above 
   ************************************************************/
  useEffect(() => {
    ContactGetApps(datastore_url, user, setApps);
  }, []);


  /************************************************************* 
   * Function to add keys required by MultiSelect
   * label and value keys are required
   ***********************************************************/
  function addKeys() {
    apps = apps.map(function(obj) {
        obj.label = obj.title;
        obj.value = obj.title;
        return obj;
    })
  };
  addKeys();
  

  return (
    <div>
      <form onSubmit={addContact}>
        <h1>Add Contact</h1>
         
        <ContactUserInputs 
          last_name={last_name}
          setLastName={setLastName}
          first_name={first_name}
          setFirstName={setFirstName}
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
          notes={notes}
          setNotes={setNotes}
        />

        <div className='select'>
          <>Select applications associated with the contact (optional):<br /><br /></>
          <SelectMulti
            items={apps}
            selected={selected}
            setSelected={setSelected}
            />
        </div>

        <p><br />
        <input type="submit" value="Add Contact" />
        </p>
      </form>
      
    </div>
  );
}

export default AddContactPage;