import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { datastore_url } from '../components/Constants';
import SelectMulti from '../components/SelectMulti';

export const AddApplicationPage = () => {
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkill] = useState('');
  // const [contacts, setContact] = useState('');
  const [posting_date, setPostingDate] = useState('');
  const [status, setStatus] = useState('');
  const [link, setLink] = useState('');

  let contacts = []
  // const [selectedContacts, setSelectedContacts] = useState([]);
  // let skills = []
  const [selected, setSelected] = useState([]);

  let [buildContacts, setContacts] = useState([]);
  // let [buildSkills, setSkills] = useState([]);

  const navigate = useNavigate();

  const addApplication = async (e) => {
    // prevent default behavior
    e.preventDefault();

    // push each element id into skills
    // for (let element of selected) {
    //   console.log(element)
    //   skills.push(element.id)
    // }

    // push each element id into contacts
    for (let element of selected) {
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
   

    // update Contacts
    if (contacts.length > 0) {

      const newContact = await response.json();

      for(let contact of contacts) {

        const contactResponse = await fetch(`${datastore_url}/contacts/${contact}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (contactResponse.status === 200) {
          console.log(`GET ${contact} success 200`);
        } else {
          console.log(`GET ${contact} failure ${contactResponse.status}`);
        }

      const data = await contactResponse.json();
      console.log(data);
      // const newContacts = [];
      // for (let contact of data.contact_at_)


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
//   const response = await fetch(`${datastore_url}/constants`);
//   const data = await response.json();
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
        selected={selected}
        setSelectedSkills={setSelected}
        />
      </div> */}
      <div className="select">
        <p>Contacts:</p>
        <SelectMulti
        items={buildContacts}
        selected={selected}
        setSelected={setSelected}
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