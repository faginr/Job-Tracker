import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { datastore_url } from '../utils/Constants';
import SelectMulti from '../components/SelectMulti';
import ContactUserInputs from '../components/ContactUserInputs';
import { user } from '../utils/User';

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
   * Function to get applications 
   ************************************************************/
  const getApps = async () => {
    const response = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/applications`,
      { 
        method: "GET",
        headers: {
          'Accept': 'application/json', 
          'Authorization': `Bearer ${user}`}
      }
    );
    if (response.status === 200) {
      //console.log("Successfully fetched the applications!"); 
    } else {
      console.log(`Failed to fetch the applications, status code = ${response.status}`);
    };
    const data = await response.json();

    // sort by title
    // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    data.sort((a, b) => {
      const titleA = a.title.toUpperCase();
      const titleB = b.title.toUpperCase();
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