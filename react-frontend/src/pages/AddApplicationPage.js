import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { user } from '../utils/User';
import SelectMulti from '../components/SelectMulti';
import { datastore_url } from '../utils/Constants';
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

  let contacts = []
  const [selectedContacts, setSelectedContacts] = useState([]);
  let skills = []
  const [selectedSkills, setSelectedSkills] = useState([]);

  let [buildContacts, setContacts] = useState([]);
  let [buildSkills, setSkills] = useState([]);

  // used for 'page' navigation
  const navigate = useNavigate();


  /***********************************************************
  * 'Add Application' pressed -> Post a new application
  ***********************************************************/
  const addApplication = async (e) => {
    // prevent default behavior
    e.preventDefault();

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

    alert(newApplication)

    // POST new application
    const response = await fetch(
      `${datastore_url}/users/${JSON.parse(user).sub}/applications`, {
      method: 'POST',
      body: JSON.stringify(newApplication),
      headers: {
        'Authorization': `Bearer ${user}`,
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


/***********************************************************
* Hook for loading in user specific contacts and skills
***********************************************************/
useEffect(() => {
  loadContacts(datastore_url,user,setContacts);
  loadSkills(datastore_url,user,setSkills);
}, []);


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
        <label>Title:</label>
        <br />
        <input
        className='add-app'
          required
          type="text"
          placeholder="Enter Title (required)"
          value={title}
          onChange={e => setTitle(e.target.value)} />
          <br />
        <label>Description:</label>
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
        <label>External Link:</label>
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