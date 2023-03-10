import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { datastore_url } from '../utils/Constants';
import SelectMulti from '../components/SelectMulti';
import ContactUserInputs from '../components/ContactUserInputs';
import ContactGetApps from '../components/ContactGetApps';
import {useAuth0} from '@auth0/auth0-react';
import { useAPI } from '../utils/Auth0Functions';

export const AddContactPage = () => {
  
  const navigate = useNavigate();   // hook to navigate among the pages
  const [last_name, setLastName] = useState('');
  const [first_name, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const {user, isAuthenticated} = useAuth0();
  const getTokenFromAuth0 = useAPI();
  
  let contact_at_app_id = []
  const [selected, setSelected] = useState([]);   // added apps to the contact
  let [apps, setApps] = useState([]);

  // prevent double click submit
  const [submitDisabled, setSubmitDisabled] = useState(false);


  /************************************************************* 
   * Function to POST a new contact 
   ************************************************************/
  const addContact = async (e) => {
    e.preventDefault();
    //console.log('submit button status:', submitDisabled);
    if (!submitDisabled) {
      setSubmitDisabled(true);

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
      const token = await getTokenFromAuth0({redirectURI: '/contacts'})
      if(isAuthenticated){
        const userID = user.sub.split('|')[1]
        const responseContactId = await fetch(`${datastore_url}/users/${userID}/contacts`, 
          {
            method: 'POST',
            body: JSON.stringify(newContact),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`},
          }
        );
        if (responseContactId.status === 201) {
          // console.log("Successfully added the contact!"); 
        } else {
          alert(`Failed to add the contact, status code = ${responseContactId.status}`);
        };
      
        // go back to Contact Page
        navigate(0);  
      }
    }
  };


  /************************************************************* 
   * Hook to call the function above 
   ************************************************************/
  useEffect(() => {
    getTokenFromAuth0({redirectURI: '/contacts'}).then(
      (token) => ContactGetApps(datastore_url, user, token, setApps)
    )
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