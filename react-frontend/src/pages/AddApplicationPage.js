import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { datastore_url } from '../components/Constants';
import SelectMulti from '../components/SelectMulti';

export const AddApplicationPage = () => {
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkill] = useState('');
  const [posting_date, setPostingDate] = useState('');
  const [status, setStatus] = useState('');
  const [link, setLink] = useState('');

  let contacts = []
  const [selectedContacts, setSelectedContacts] = useState([]);
  // Figure out auth with Philip
  // let skills = []
  // const [selectedSkills, setSelectedSkills] = useState([]);

  let [buildContacts, setContacts] = useState([]);
  // let [buildSkills, setSkills] = useState([]);

  const navigate = useNavigate();

  const addApplication = async (e) => {
    // prevent default behavior
    e.preventDefault();

    // push each element id into skills
    // for (let element of selectedSkills) {
    //   console.log(element)
    //   skills.push(element.id)
    // }

    // push each element id selected into contacts
    for (let element of selectedContacts) {
      console.log(element)
      contacts.push(element.id)
    }

    // Setup parameters for new application
    const newApplication = { 
      title, 
      description,
      skills, 
      contacts, 
      posting_date, 
      status, 
      link 
    };


    // POST new application
    const response = await fetch(
      `${datastore_url}/applications`, {
      method: 'POST',
      body: JSON.stringify(newApplication),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Log response status 
    if(response.status === 201){
      console.log("Successfully added the application 201"); 
    } else {
      console.log(`Failed to add application, status code = ${response.status}`);
    }
   

    // update - See if there is at least one contact added
    if (contacts.length > 0) {

      // get newly posted application by id
      const newApp = await response.json();

      // Loop through each contact
      for(let contact of contacts) {

        // GET the contact
        const contactResponse = await fetch(`${datastore_url}/contacts/${contact}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        // See response status of GET
        if (contactResponse.status === 200) {
          console.log(`GET ${contact} success 200`);
        } else {
          console.log(`GET ${contact} failure ${contactResponse.status}`);
        }

      // convert data to json
      const data = await contactResponse.json();

      // Put all previous app ids into new array, add newly posted app id
      const updateContact = { contact_at_app_id: data.contact_at_app_id }
      updateContact["contact_at_app_id"].push(`${newApp.id}`) 
      
      // alert(JSON.stringify(updateContact))
      const responsePatch = await fetch(`${datastore_url}/contacts/${contact}`, {
        method: 'PATCH',
        body: JSON.stringify(updateContact),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // See response status of GET
      if (responsePatch.status === 200) {
        console.log(`PATCH ${contact} success 200`);
      } else {
        console.log(`PATCH ${contact} failure ${responsePatch.status}`);
      }

    }

    navigate(0);  // goes back to Application Page
  };
}

const loadContacts = async () => {
  const response = await fetch(`${datastore_url}/contacts`);
  const data = await response.json();
  // console.log(data);
  setContacts(data);
}

// const loadSkills = async () => {
//   const response = await fetch(`${datastore_url}/skills`);
//   const data = await response.json();
//   console.log(data)
//   setSkills(data);
// }

useEffect(() => {
  loadContacts();
  // loadSkills();
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
    // if (selection === "skills")
    // buildSkills = buildSkills.map(function(obj) {
    //     obj.label = obj.title;
    //     obj.value = obj.title;
    //     return obj;
    // })
    return
  };
  addKeys("contacts");
  // addKeys("skills");
  


  
  return (
    <div>
      <form onSubmit={addApplication}>
      <h1>Add Application</h1>
      <input
        required
        type="text"
        placeholder="Enter Title (required)"
        value={title}
        onChange={e => setTitle(e.target.value)} />
        <br />
      <textarea
        required
        type="text"
        rows="25"
        cols="55"
        value={description}
        placeholder="Enter Description (required)"
        onChange={e => setDescription(e.target.value)} />
      {/* <div className="select">
        <p>Skills:</p>
        <SelectMulti
        items={buildSkills}
        selected={selectedSkills}
        setSelected={setSelectedSkills}
        />
      </div> */}
      <div className="select">
        <p>Contacts:</p>
        <SelectMulti
        items={buildContacts}
        selected={selectedContacts}
        setSelected={setSelectedContacts}
        />
      </div>
      <input
        type="text"
        placeholder="Enter Skill"
        value={skills}
        onChange={e => setSkill(e.target.value)} />
      {/* <input
        type="text"
        placeholder="Enter Contact"
        value={contacts}
        onChange={e => setContact(e.target.value)} /> */}
      <input
        type="date"
        placeholder="Enter Posting Date"
        value={posting_date}
        onChange={e => setPostingDate(e.target.value)} />
      <select onChange={e => setStatus(e.target.value)}>
          <option>Applied</option>
          <option>Not Applied</option>
      </select>
      <input
        type="url"
        placeholder="Enter Link"
        value={link}
        onChange={e => setLink(e.target.value)} /> 
      <p>
      <input type="submit" value="Add Application" />
      {/* <input type="submit" value="Cancel" onClick={() => navigate(-1)} /> */}
      </p>
      </form>
    </div>
  );
}

export default AddApplicationPage;