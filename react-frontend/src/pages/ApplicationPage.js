import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
import ApplicationList from '../components/ApplicationList';
import { useState, useEffect } from 'react';
import { datastore_url } from '../utils/Constants';
import AddApplicationPage from './AddApplicationPage';
import SlidingWindow from '../components/SlidingWindow';
import ReactButton from '../components/ReactButton';
import { useAuth0 } from '@auth0/auth0-react';
import { useAPI } from '../utils/Auth0Functions';
import LoadingPage from './LoadingPage';

// Note -> test adding a contact and a skill and then delete the contact and see if skill is also deleted

function ApplicationPage() {
  
  const [applications, setApplications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [skills, setSkills] = useState([]);
  const {user, isAuthenticated} = useAuth0();
  const getTokenFromAuth0 = useAPI();
  // const navigate = useNavigate();

  const onDelete = async (id, contacts, skills) => {
    const token = await getTokenFromAuth0({redirectURI: '/applications'})
    if(isAuthenticated){
      const userID = user.sub.split('|')[1]
      // Confirm Deletion
      const confirm = window.confirm("Are you sure you want to delete the application?");
      if(confirm){
  
        // Check to see if contacts is not empty
        if (Object.keys(contacts).length > 0){
          // at least one contact
          for (let contact of contacts){
            // get each contact in contacts
            const response = await fetch(`${datastore_url}/users/${userID}/contacts/${contact}`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`,
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
            const patchContact = await fetch(`${datastore_url}/users/${userID}/contacts/${contact}`, {
              method: 'PATCH',
              body: JSON.stringify(updatedContactApps),
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
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
        const response = await fetch(`${datastore_url}/users/${userID}/applications/${id}`, { 
          headers: {
            'Authorization': `Bearer ${token}`
          },
          method: 'DELETE' 
        });
        if (response.status === 204) {
            setApplications(applications.filter(application => application.id !== id));
            console.log("Successfully deleted the application!");
        } else {
            console.error(`Failed to delete application with id = ${id}, status code = ${response.status}`)
        }
      }
    }
  };

  // GET Applications
  const loadApplications = async (token, userID) => {
      const response = await fetch(`${datastore_url}/users/${userID}/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setApplications(data);
  };

  // GET Contacts
<<<<<<< HEAD
  const loadContacts = async (token, userID) => {
    const response = await fetch(`${datastore_url}/users/${userID}/contacts`, {
      headers: {
        'Authorization': `Bearer ${token}`
=======
  const loadContacts = async () => {
    const response = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/contacts`, {
      headers: {
        'Authorization': `Bearer ${user}`
>>>>>>> main
      }
    });
    const data = await response.json();
    setContacts(data);
  }

  const loadSkills = async (token, userID) => {
    const response = await fetch(`${datastore_url}/users/${userID}/skills`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setSkills(data);
  }

  // const onEdit = application => {
  //   settypeToEdit(application);
  //   navigate("/edit-application");
  // };

  // Get applications and contacts data
  useEffect(() => {
    getTokenFromAuth0({redirectURI: '/applications'}).then((token) => {
      if(isAuthenticated){
        const userID = user.sub.split('|')[1]
        loadApplications(token, userID);
        loadContacts(token, userID);
        loadSkills(token, userID);
      }
    })
  }, [user]);

  // console.log(applications)
  for (let app of applications){
    app.skill_names = []
    app.contact_names = []
    // skills
    if (app.skills.length > 0){
      for(let app_skill of app.skills){
        for(let skill of skills){
          // console.log(skill)
          if (skill.skill_id === app_skill){
            app.skill_names.push(skill.description);  
          }
        }
      }
    }
    if (app.contacts.length > 0){
      for (let app_contact of app.contacts){
        for (let contact of contacts){
          if (contact.id === app_contact){
            app.contact_names.push(contact.first_name+" "+contact.last_name)
          }
        }
      }
    }
  }

  

  return (
    isAuthenticated ? 
      <>
        <h1>Application Page</h1>

        <div>
          <p>Hello Username!</p>
          <p>Your applications:</p>
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
        <div className='add-app'>
          <SlidingWindow 
            Page={<AddApplicationPage />}
            ClickableComponent={<ReactButton label="Add Application"/>}
            />
        </div>
    </>
    :
      <LoadingPage />
  );
}

export default ApplicationPage;
