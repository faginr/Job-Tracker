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
import loadContacts from '../components/AppLoadContacts';
import loadSkills from '../components/AppLoadSkills';

// Note -> test adding a contact and a skill and then delete the contact and see if skill is also deleted

/***********************************************************
* Application Page component
***********************************************************/
function ApplicationPage() {
  
  const [applications, setApplications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [skills, setSkills] = useState([]);
  const {user, isAuthenticated} = useAuth0();
  const [filteredSelect, setFilterSelect] = useState(0);
  const [loading, setLoading] = useState(true);
  const getTokenFromAuth0 = useAPI();
  // const navigate = useNavigate();


  /************************************************************* 
   * Function to DELETE an application
   ************************************************************/
  const onDelete = async (id) => {
    
    // Confirm Deletion
    const confirm = window.confirm("Are you sure you want to delete the application?");
    if(confirm){

      // DELETE application
      const token = await getTokenFromAuth0({redirectURI: '/applications'})
      if(isAuthenticated){
        const userID = user.sub.split('|')[1]
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

  // const loading = applications["loading"]?false:true; 

 /************************************************************* 
   * Get applications and set
   ************************************************************/
  const loadApplications = async (userID, token) => {
    const response = await fetch(`${datastore_url}/users/${userID}/applications`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setApplications(data);
    setLoading(false);
  };

  /***********************************************************
  * Hook for loading in user specific contacts and skills
  ***********************************************************/
  useEffect(() => {
    getTokenFromAuth0({redirectURI: '/applications'}).then((token)=>{
      // NOTE - there's a delay between signing in with Auth0, being redirected back, and user being defined
      // so we need to check if authenticated before trying to split user for ID and sending fetch requests
      // or else fetch requests will look for undefined userID and respond with 404. Performing the action
      // every time user changes allows this hook to run again once user is defined
      if(isAuthenticated){
        const userID = user.sub.split('|')[1]
        loadApplications(userID, token);
        loadContacts(datastore_url,user,token,setContacts);
        loadSkills(datastore_url,user,token,setSkills);
      }
    })
  }, [user]);

  
  // Translate ids to names
  applications.forEach(app => {
    // for each app, grab all skill data for each skill matching skill id in app skills array
    let skillData = skills.filter(skill => 
      app["skills"].find(appSkillId => appSkillId === skill.skill_id))
    // create array of only description data from skillData object
    let skillNames = skillData.map(function (skillSet){
      return skillSet.description
    });
    // set skill_names to array of descriptions
    app["skill_names"] = skillNames;

    let contactData = contacts.filter(contact => 
      app["contacts"].find(appContactId => appContactId === contact.id))
    let contactNames = contactData.map(function (contactSet){
      return contactSet.first_name + " " + contactSet.last_name
    });
    app["contact_names"] = contactNames;
  })


  function setFilterApps() {
    if (filteredSelect === 1){
      return applications.filter(apps => apps["status"] === "Applied")
    }
    if (filteredSelect === 2){
      return applications.filter(apps => apps["status"] === "Not Applied")
    }
    return applications
  }

  const filteredApps = setFilterApps();
  // const loading = false
  return (
    (isAuthenticated && loading === false) ? 
      <>
        <h1>Application Page</h1>
        <label>
        Filter By Status: 
        <select onChange={(e)=>setFilterSelect(parseInt(e.target.value))}>
          <option value={0}>--No Filter--</option>
          <option value={1}>Applied</option>
          <option value={2}>Not Applied</option>
        </select>
      </label>

      <div>
        <p>Your applications:</p>
        <ApplicationList 
          applications={filteredApps} 
          onDelete={onDelete}
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
