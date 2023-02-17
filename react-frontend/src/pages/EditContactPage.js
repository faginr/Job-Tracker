import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { datastore_url } from '../components/Constants';
import SelectMulti from '../components/SelectMulti';


export const EditContactPage = ({ contactToEdit }) => {
  
  const navigate = useNavigate();   // hook to navigate among the pages

  // store the original application id's if replaced by new application
  const originalApplication = contactToEdit.contact_at_app_id

  const [last_name, setLastName] = useState(contactToEdit.last_name);
  const [first_name, setFirstName] = useState(contactToEdit.first_name);
  const [email, setEmail] = useState(contactToEdit.email);
  const [phone, setPhone] = useState(contactToEdit.phone);
  const [notes, setNotes] = useState(contactToEdit.notes);
  
  let contact_at_app_id = [];
  const [selected, setSelected] = useState([]);

  let [apps, setApps] = useState([]);
  let contactAtNameStr = '';
  let contactAtNameArray = [];


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
   * Function to edit the contact 
   ************************************************************/
  const editContact = async (e) => {
    e.preventDefault();

    // if no changes, do nothing
    if (visibleRemoveButton === true
        && selected.length === 0
        && last_name === contactToEdit.last_name 
        && first_name === contactToEdit.first_name
        && email === contactToEdit.email
        && phone === contactToEdit.phone
        && notes === contactToEdit.notes) {
      console.log ('no changes');
      return navigate(0);
    };

    // remove all applications if the button Remove clicked and no selected 
    if (visibleRemoveButton === false && selected.length === 0) {
      contact_at_app_id = [];
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
    const response = await fetch(
      `${datastore_url}/contacts/${contactToEdit.id}`, 
      {
        method: 'PUT',
        body: JSON.stringify(editedContact),
        headers: {'Content-Type': 'application/json',},
      }
    );
    if (response.status === 200) {
      alert("Successfully edited the contact!"); 
    } else {
      alert(`Failed to edit contact, status code = ${response.status}`);
    }

    // if the array of application has changed for the contact, update the old and new applications
    if (originalApplication !== contact_at_app_id) {

      // update the old application by removing the contact id
      for (let app of originalApplication) {
        if (!(contact_at_app_id.includes(app))) {
          // GET the application to be updated
          const responseGetApp = await fetch(`${datastore_url}/applications/${app}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          if (responseGetApp.status === 200) {
            //alert("Successfully get the application!"); 
          } else {
            alert(`Failed to get the application, status code = ${responseGetApp.status}`);
          };

          const data = await responseGetApp.json();
          const appContacts = [];
          for (let contact of data.contacts) {
            if (contact !== contactToEdit.id) {
              appContacts.push(contact)
            }
          };

          const updatedOldApplication = { contacts: appContacts };

          // PATCH the old application if changed
          const responseOldApplication = await fetch(`${datastore_url}/applications/${app}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedOldApplication),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (responseOldApplication.status === 200) {
            //alert("Successfully updated the old application!"); 
          } else {
            alert(`Failed to update the old application, status code = ${responseOldApplication.status}`);
          }
        }
      };

      // PATCH the new application if added
      for (let app of contact_at_app_id) {
        if (!(originalApplication.includes(app))) {
          // GET the application to be updated
          const responseGetApp = await fetch(`${datastore_url}/applications/${app}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          if (responseGetApp.status === 200) {
            //alert("Successfully get the application!"); 
          } else {
            alert(`Failed to get the application, status code = ${responseGetApp.status}`);
          };

          const data = await responseGetApp.json();
          const appContacts = data.contacts;
          appContacts.push(contactToEdit.id)
          const updatedNewApplication = { contacts: appContacts };

          // PATCH the new application
          const responseNewApplication = await fetch(`${datastore_url}/applications/${app}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedNewApplication),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (responseNewApplication.status === 200) {
            //alert("Successfully updated the old application!"); 
          } else {
            alert(`Failed to update the old application, status code = ${responseNewApplication.status}`);
          }
        }
      }
    };

    // go back to Contact Page
    navigate(0);  
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
   * Iterate over the array of the applications 
   * and get the name of applications related to the contact
   ************************************************************/
  function applicationNames() {
    for (let contactApp of contactToEdit.contact_at_app_id) {
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
    getApps();
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

        <div className='wrapper'>

          <label className='one'>First Name:</label>
          <input className='one-two'
            required
            type="text"
            value={first_name}
            placeholder="Enter first name (required)"
            onChange={e => setFirstName(e.target.value)} /><br />

          <label className='two'>Last Name:</label>
          <input className='two-two'
            required
            type="text"
            placeholder="Enter last name (required)"
            value={last_name}
            onChange={e => setLastName(e.target.value)} /><br />
            
          <label className='three'>Email:</label>
          <input className='three-two'
            type="text"
            value={email}
            placeholder="Enter email"
            onChange={e => setEmail(e.target.value)} /><br />

          <label className='four'>Phone:</label>
          <input className='four-two'
            type="text"
            placeholder="Enter phone"
            value={phone}
            onChange={e => setPhone(e.target.value)} /><br />

          <label className='five'>Notes:</label>
          <input className='five-two'
            type="text"
            placeholder="Enter notes"
            value={notes}
            onChange={e => setNotes(e.target.value)} />

        </div>

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