import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
import ApplicationList from '../components/ApplicationList';
import { useState, useEffect } from 'react';
import { datastore_url } from '../utils/Constants';
import { user } from '../utils/User';
import AddApplicationPage from './AddApplicationPage';
import SlidingWindow from '../components/SlidingWindow';
import ReactButton from '../components/ReactButton';
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
  // const navigate = useNavigate();


  /************************************************************* 
   * Function to DELETE an application
   ************************************************************/
  const onDelete = async (id, contacts, skills) => {
    
    // Confirm Deletion
    const confirm = window.confirm("Are you sure you want to delete the application?");
    if(confirm){

      // DELETE application
      const response = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/applications/${id}`, { 
        headers: {
          'Authorization': `Bearer ${user}`
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

  };

 /************************************************************* 
   * Get applications and set
   ************************************************************/
  const loadApplications = async () => {
    const response = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/applications`, {
      headers: {
        'Authorization': `Bearer ${user}`
      }
    });
    const data = await response.json();
    setApplications(data);
  };

  /***********************************************************
  * Hook for loading in user specific contacts and skills
  ***********************************************************/
  useEffect(() => {
    loadApplications();
    loadContacts(datastore_url,user,setContacts);
    loadSkills(datastore_url,user,setSkills);
  }, []);

  
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
  
  
  return (
    <>
      <h1>Application Page</h1>

      <div>
        <p>Hello Username!</p>
        <p>Your applications:</p>
        <ApplicationList 
          applications={applications} 
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
  );
}

export default ApplicationPage;
