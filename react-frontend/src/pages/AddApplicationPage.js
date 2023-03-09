import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import SelectMulti from '../components/SelectMulti';
import { datastore_url } from '../utils/Constants'
import { useAuth0 } from '@auth0/auth0-react';
import { useAPI } from '../utils/Auth0Functions';
import loadContacts from '../components/AppLoadContacts';
import loadSkills from '../components/AppLoadSkills';


/***********************************************************
* Add Application Page component
***********************************************************/
export const AddApplicationPage = () => {
  
  // Constants
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [posting_date, setPostingDate] = useState('');
  const [status, setStatus] = useState('');
  const [link, setLink] = useState('');
  const getTokenFromAuth0 = useAPI();
  const {user, isAuthenticated} = useAuth0();

  let contacts = []
  const [selectedContacts, setSelectedContacts] = useState([]);
  let skills = []
  const [selectedSkills, setSelectedSkills] = useState([]);

  let [buildContacts, setContacts] = useState([]);
  let [buildSkills, setSkills] = useState([]);

  // used for 'page' navigation
  const navigate = useNavigate();

  // Prevent double click submit
  const [submitDisabled, setSubmitDisabled] = useState(false);


  /***********************************************************
  * 'Add Application' pressed -> Post a new application
  ***********************************************************/
  const addApplication = async (e) => {
    // prevent default behavior
    e.preventDefault();
    //console.log('submit button status:', submitDisabled);
    if (!submitDisabled) {
      setSubmitDisabled(true);

      // push each selected skill id into skills array
      for (let element of selectedSkills) {
        skills.push(element.skill_id)
      }

      // push each selected contact id in contacts array
      for (let element of selectedContacts) {
        contacts.push(element.id)
      }

      // Initialize key value pairs for new application
      const newApplication = { 
        title, 
        description,
        skills, 
        contacts, 
        posting_date, 
        status, 
        link 
      };

      // alert(newApplication)

    // POST new application
    const token = await getTokenFromAuth0({redirectURI: '/applications'})
    if(isAuthenticated){
      const userID = user.sub.split('|')[1]
      const response = await fetch(
        `${datastore_url}/users/${userID}/applications`, {
        method: 'POST',
        body: JSON.stringify(newApplication),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Log response status 
      if(response.status === 201){
        console.log("Successfully added the application 201"); 
      } else {
        alert(`Failed to add application, status code = ${response.status}`);
      }
      navigate(0);  // goes back to Application Page
      }
    }
  }


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
      loadContacts(datastore_url,user,token,setContacts);
      loadSkills(datastore_url,user,token,setSkills);
    }
  })
}, [user]);


  /************************************************************* 
   * Function to add keys required by MultiSelect
   * label and value keys are required
   ***********************************************************/
  function addKeys(selection) {
    if (selection === "contacts")
    buildContacts = buildContacts.map(function(obj) {
        obj.label = obj.first_name + " " + obj.last_name;
        obj.value = obj.first_name + " " + obj.last_name;
        return obj;
    })
    if (selection === "skills")
    buildSkills = buildSkills.map(function(obj) {
        obj.label = obj.description;
        obj.value = obj.description;
        return obj;
    })
    return
  };

  addKeys("contacts");
  addKeys("skills");


  /***********************************************************
  * JSX to build add application form
  ***********************************************************/
  return (
    <div className="container">
      <form onSubmit={addApplication}>
        <h1>Add Application</h1>
        <label>Title (max chars: 100):</label>
        <br />
        <input
        className='add-app'
          required
          type="text"
          placeholder="Enter Title (required)"
          value={title}
          onChange={e => setTitle(e.target.value)} />
          <br />
        <label>Description (max chars: 5000):</label>
        <br />
        <textarea
          required
          type="text"
          rows="25"
          cols="55"
          value={description}
          placeholder="Enter Description (required)"
          onChange={e => setDescription(e.target.value)} />
        <br />
        <div className="select">
        <label>Skills:</label>
          <SelectMulti
          items={buildSkills}
          selected={selectedSkills}
          setSelected={setSelectedSkills}
          />
        </div>
        <div className="select">
          <label>Contacts:</label>
          <br />
          <SelectMulti
          items={buildContacts}
          selected={selectedContacts}
          setSelected={setSelectedContacts}
          />
        </div>
        <br />
        <label>Posting Date:</label>
        <br />
        <input
        className='add-app'
          type="date"
          placeholder="Enter Posting Date"
          value={posting_date}
          onChange={e => setPostingDate(e.target.value)} />
          <br />
        <label>Status:</label>
        <br />
        <select className="status"
        // defaultValue={{value: "Applied"}}
        onChange={e => setStatus(e.target.value)}>
            <option>Applied</option>
            <option>Not Applied</option>
        </select>
        <br />
        <label>External Link (max chars: 2048):</label>
        <br />
        <input
        className='add-app'
          type="url"
          placeholder="Enter Link"
          value={link}
          onChange={e => setLink(e.target.value)} /> 
        <p>
        <input type="submit" value="Add Application" />
        </p>
      </form>
    </div>
  );
}

export default AddApplicationPage;