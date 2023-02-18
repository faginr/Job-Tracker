import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
import ApplicationList from '../components/ApplicationList';
import { useState, useEffect } from 'react';
import { datastore_url } from '../components/Constants';

import AddApplicationPage from './AddApplicationPage';
import SlidingWindow from '../components/SlidingWindow';

function ApplicationPage() {
  
  const [applications, setApplications] = useState([]);
  const [contacts, setContacts] = useState([]);
  // const navigate = useNavigate();

  const onDelete = async (id, contacts) => {
    // Confirm Deletion
    const confirm = window.confirm("Are you sure you want to delete the application?");
    if(confirm){

      // Check to see if contacts is not empty
      if (Object.keys(contacts).length > 0){
        // at least one contact
        for (let contact of contacts){
          // get each contact in contacts
          const response = await fetch(`${datastore_url}/contacts/${contact}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          // for each GET request, determine response status
          if (response.status === 200){
            console.log(`GET ${contact} success 200`);
          } else {
            console.log(`GET ${contact} failure ${response.status}`);
          }

          // get contact
          const data = await response.json();
          // console.log(data);
          
          // recreate contact_at_app_id without this app_id
          const newApps = [];
          for (let newApp of data.contact_at_app_id){
            // console.log(newApp)
            if (newApp !== id){
              newApps.push(newApp)
            }
          }
          const updatedContactApps = {contact_at_app_id: newApps}

          // Save updated contact to database
          const patchContact = await fetch(`${datastore_url}/contacts/${contact}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedContactApps),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (patchContact.status === 200){
            console.log(`${contact} Patch sucess 200`)
          } else {
            console.log(`${contact} Patch failure ${patchContact.status}`)
          }
        }
      };

      // Check Skills

      // DELETE application
      const response = await fetch(`${datastore_url}/applications/${id}`, { method: 'DELETE' });
      if (response.status === 204) {
          setApplications(applications.filter(application => application.id !== id));
          console.log("Successfully deleted the application!");
      } else {
          console.error(`Failed to delete application with id = ${id}, status code = ${response.status}`)
      }
    }

  };

  // GET Applications
  const loadApplications = async () => {
    const response = await fetch(`${datastore_url}/applications`);
    const data = await response.json();
    setApplications(data);
  };

  // GET Contacts
  const loadContacts = async () => {
    const response = await fetch(`${datastore_url}/contacts`);
    const data = await response.json();
    setContacts(data);
  }

  // const onEdit = application => {
  //   setApplicationToEdit(application);
  //   navigate("/edit-application");
  // };

  // Get applications and contacts data
  useEffect(() => {
    loadApplications();
    loadContacts();
  }, []);

  return (
    <>
      <h1>Application Page</h1>

      <div>
        <p>Hello Username!</p>
        <p>List of your applications:</p>
        <ApplicationList 
          applications={applications} 
          onDelete={onDelete}
          /*onEdit={onEdit}>*/
          /* <p>
          <Link to="/add-application">Add a New Application</Link>
            </p> */
        ></ApplicationList>
      </div>
      <br />
      <SlidingWindow
      Page={AddApplicationPage}
      buttonName="AddNewApplication"
      />

    </>
  );
}

export default ApplicationPage;