import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { datastore_url } from '../utils/Constants';
import SelectMulti from '../components/SelectMulti';
import ContactUserInputs from '../components/ContactUserInputs';
import ContactGetApps from '../components/ContactGetApps';
import {useAuth0} from '@auth0/auth0-react';
import { useAPI } from '../utils/Auth0Functions';

export const EditContactPage = ({ typeToEdit }) => {
  
  const navigate = useNavigate();   // hook to navigate among the pages

  // store the original application id's if replaced by new application
  const originalApplication = typeToEdit.contact_at_app_id;

  const [last_name, setLastName] = useState(typeToEdit.last_name);
  const [first_name, setFirstName] = useState(typeToEdit.first_name);
  const [email, setEmail] = useState(typeToEdit.email);
  const [phone, setPhone] = useState(typeToEdit.phone);
  const [notes, setNotes] = useState(typeToEdit.notes);

  const {user, isAuthenticated} = useAuth0();
  const getTokenFromAuth0 = useAPI();
  
  let contact_at_app_id = [];
  const [selected, setSelected] = useState([]);

  let [apps, setApps] = useState([]);
  let contactAtNameStr = '';
  let contactAtNameArray = [];

  // prevent double click submit
  const [submitDisabled, setSubmitDisabled] = useState(false);


  /************************************************************* 
   * Function to show or hide the previously choosen application releated to a contact,
   * if the variable 'visibleRemoveButton' is false, 
   * it means the user deletes the applications from the contact
   ************************************************************/
  const [visibleRemoveButton, setVisibleRemoveButton] = useState(true);
  const [visibleUndoButton, setVisibleUndoButton] = useState(false);
  const [visibleText, setVisibleText] = useState(false);

  const show = (e) => {
    e.preventDefault();
    setVisibleRemoveButton(true);
    setVisibleUndoButton(false);
  };

  const hide = (e) => {
    e.preventDefault();
    setVisibleRemoveButton(false);
    setVisibleUndoButton(true);
  };


  /************************************************************* 
   * Function to edit a contact 
   ************************************************************/
  const editContact = async (e) => {
    e.preventDefault();
    // console.log('submit button status:', submitDisabled);
    if (!submitDisabled) {
      setSubmitDisabled(true);

      // if no changes, do nothing
      if ((visibleRemoveButton === true
          && selected.length === 0
          && last_name === typeToEdit.last_name 
          && first_name === typeToEdit.first_name
          && email === typeToEdit.email
          && phone === typeToEdit.phone
          && notes === typeToEdit.notes)
          || (visibleText === true
            && selected.length === 0
            && last_name === typeToEdit.last_name 
            && first_name === typeToEdit.first_name
            && email === typeToEdit.email
            && phone === typeToEdit.phone
            && notes === typeToEdit.notes)) {
        return navigate(0);
      };

      // remove all applications if the button Remove clicked and no selected 
      if (visibleRemoveButton === false && selected.length === 0) {
        contact_at_app_id = [];
      };

      if (visibleRemoveButton === true && selected.length === 0) {
        contact_at_app_id = originalApplication;
      };

      for (let element of selected) {
        contact_at_app_id.push(element.id)
      };
      
      const editedContact = { 
        last_name, 
        first_name, 
        email, 
        phone, 
        notes, 
        contact_at_app_id 
      };

      // PUT the contact
      const token = await getTokenFromAuth0({redirectURI: '/contacts'})
      if(isAuthenticated){
        const userID = user.sub.split('|')[1]
        const response = await fetch(`${datastore_url}/users/${userID}/contacts/${typeToEdit.id}`, 
          {
            method: 'PUT',
            body: JSON.stringify(editedContact),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`}
          }
        );
        if (response.status === 200) {
          // console.log("Successfully edited the contact!"); 
        } else {
          alert(`Failed to edit contact, status code = ${response.status}`);
        };
      
        // go back to Contact Page
        navigate(0);  
      }
    };
  };


  /************************************************************* 
   * Iterate over the array of the applications 
   * and get the name of applications related to the contact
   ************************************************************/
  function applicationNames() {
    for (let contactApp of typeToEdit.contact_at_app_id) {
      for (let app of apps) {
        if (contactApp === app.id) {
          contactAtNameArray.push(app.title);
        } 
      }
    };

    if (contactAtNameArray.length === 0) {
      contactAtNameStr = 'None';
    } else {
      contactAtNameStr = JSON.stringify(contactAtNameArray);
      contactAtNameStr = contactAtNameStr.slice(1, -1);
    }
  };

  applicationNames();

  
  /************************************************************* 
   * Hook to call the function above 
   ************************************************************/
  useEffect(() => {
    getTokenFromAuth0({redirectURI: '/contacts'}).then(
      (token) => ContactGetApps(datastore_url, user, token, setApps)
    )
    if (originalApplication.length === 0 ) {
      setVisibleRemoveButton(false);
      setVisibleUndoButton(false);
      setVisibleText(true);
    };
  }, []);


  /************************************************************* 
   * Function to add keys required by MultiSelect
   * label and value keys are required
   **********************************************************/
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
      <form onSubmit={editContact}>
        <h1>Edit Contact</h1>

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

        <div  className='select'>

          <div>
            {visibleRemoveButton &&
              <>
                <>Your previously selected application(s):<br /></>
                <br />{contactAtNameStr}<br />
                <br />There are several options here:
                <br />You can remove all the selected application(s)<br />
                <br /><button onClick={hide}>Delete all</button><br />
                <br />or select new application(s) associated with the contact 
                <br />or leave it as is.<br /><br />
              </>
            }
            {visibleUndoButton &&
              <>
                <>Your previously selected application(s) were deleted.<br /></>
                <br /><button onClick={show}>Undo Delete</button><br />
                <br />Select applications associated with the contact (optional):<br /><br />
              </>
            }

            {visibleText &&
              <>Select applications associated with the contact (optional):<br /><br /></>
            }
          </div>

          <SelectMulti
            items={apps}
            selected={selected}
            setSelected={setSelected}
            />

        </div> 

        <p><br />
        <input type="submit" value="Submit Changes" />
        </p>
      </form>
    </div>
  );
}

export default EditContactPage;