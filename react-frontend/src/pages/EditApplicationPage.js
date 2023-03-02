import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { user } from '../utils/User';
import SelectMulti from '../components/SelectMulti';
import { datastore_url } from '../utils/Constants';

export const EditApplicationPage = ({ typeToEdit }) => {
  
  const startingContacts = typeToEdit.contacts
  const startingSkills = typeToEdit.skills

  // console.log(typeToEdit);
  const [title, setTitle] = useState(typeToEdit.title);
  const [description, setDescription] = useState(typeToEdit.description);
  const [posting_date, setPostingDate] = useState(typeToEdit.posting_date);
  const [status, setStatus] = useState(typeToEdit.status);
  const [link, setLink] = useState(typeToEdit.link);

  let contacts = []
  const [selectedContacts, setSelectedContacts] = useState([]);
  let skills = []
  const [selectedSkills, setSelectedSkills] = useState([]);

  let [buildContacts, setContacts] = useState([]);
  let [buildSkills, setSkills] = useState([]);

  const navigate = useNavigate();

  const [visibleRemoveContactsButton, setvisibleRemoveContactsButton] = useState(true);
  const [visibleUndoContactsButton, setvisibleUndoContactsButton] = useState(false);
  const [visibleRemoveSkillsButton, setvisibleRemoveSkillsButton] = useState(true);
  const [visibleUndoSkillsButton, setvisibleUndoSkillsButton] = useState(false);

  const showContacts = (e) => {
    e.preventDefault();
    setvisibleRemoveContactsButton(true);
    setvisibleUndoContactsButton(false);
  }

  const showSkills = (e) => {
    e.preventDefault();
    setvisibleRemoveSkillsButton(true);
    setvisibleUndoSkillsButton(false);
  }

  const hideContacts = (e) => {
    e.preventDefault();
    setvisibleRemoveContactsButton(false);
    setvisibleUndoContactsButton(true);
  }

  const hideSkills = (e) => {
    e.preventDefault();
    setvisibleRemoveSkillsButton(false);
    setvisibleUndoSkillsButton(true);
  }

  let displayContacts = [];
  let displaySkills =[];
  let displayContactLabel = '';
  let displaySkillLabel = '';

  const editApplication = async (e) => {
    e.preventDefault();
    // listen for any value changes

    if(setvisibleRemoveContactsButton === true
      && selectedContacts.length === 0
      && title === typeToEdit.title
      && description === typeToEdit.description
      && posting_date === typeToEdit.posting_date
      && status === typeToEdit.status
      && link === typeToEdit.link
      ) {
        console.log('no changes');
        return navigate(0);
      }

    if(setvisibleRemoveSkillsButton === true
      && selectedSkills.length === 0
      && title === typeToEdit.title
      && description === typeToEdit.description
      && posting_date === typeToEdit.posting_date
      && status === typeToEdit.status
      && link === typeToEdit.link
      ) {
        console.log('no changes');
        return navigate(0);
      }

    // reset all contacts to blank array if user removed all via button
    if (setvisibleRemoveContactsButton === false
      && selectedContacts.length === 0
      ) {
        contacts = [];
      }

    if (setvisibleRemoveSkillsButton === false
      && selectedSkills.length === 0
      ) {
        skills = [];
      }

    // push each element id selected into contacts
    for (let element of selectedContacts) {
      // console.log(element)
      contacts.push(element.id)
    }

    for (let element of selectedSkills) {
      // console.log(element)
      skills.push(element.skill_id)
    }

    // define all values for edited app
    const editedApplication = { 
      title, 
      description,
      skills, 
      contacts, 
      posting_date, 
      status, 
      link 
     };

    // PATCH application
    const response = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/applications/${typeToEdit.id}`, {
      method: 'PATCH',
      body: JSON.stringify(editedApplication),
      headers: {
        'Authorization': `Bearer ${user}`,
        'Content-Type': 'application/json',
      },
    });
    if(response.status === 200){
      alert("Successfully edit the application!");
    } else {
      alert(`Failed to edit application, status code = ${response.status}`);
    }

    // check if contacts has changed
    if (startingContacts !== contacts) {

      // get newly posted application by id
      // const newApp = await response.json();

      // Loop through each contact of starting contacts
      for(let contact of startingContacts) {
        // see if contacts has startingContact still in it
        if(!(contacts.includes(contact))){
        // GET the contact if not
        const contactResponse = await fetch(`${datastore_url}/contacts/${contact}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        // See response status of GET
        if (contactResponse.status === 200) {
          console.log(`GET ${contactResponse} success 200`);
        } else {
          console.log(`GET ${contactResponse} failure ${contactResponse.status}`);
        }

        const data = await contactResponse.json();
        const editedContacts = [];
        for (let contactId of data.contact_at_app_id){
          if (contactId !== typeToEdit.id){
            editedContacts.push(contactId)
          }
        };

        const updatedContacts = {contact_at_app_id: editedContacts}
        
        const patchResponse = await fetch(`${datastore_url}/contacts/${contact}`, {
          method: 'PATCH',
          body: JSON.stringify(updatedContacts),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (patchResponse.status === 200) {
          console.log(`PATCH ${patchResponse.id} success 200`)
        } else {
          console.log(`PATCH ${patchResponse.id} failure ${patchResponse.status} `);
        }
      }
    }

    for (let contact of contacts) {
      if (!(startingContacts.includes(contact))) {
        const contactResponse = await fetch(`${datastore_url}/contacts/${contact}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (contactResponse.status === 200){
          console.log(`GET ${contactResponse.id} success 200`);
        } else {
          console.log(`GET ${contactResponse.id} failure ${contactResponse.status}`);
        }

        const data = await contactResponse.json();
        const editedContacts = [];
        for (let contactId of data.contact_at_app_id){
          if (contactId !== typeToEdit.id){
            editedContacts.push(contactId)
          }
        };

        const updatedContacts = {contact_at_app_id: editedContacts}
        
        const patchResponse = await fetch(`${datastore_url}/contacts/${contact}`, {
          method: 'PATCH',
          body: JSON.stringify(updatedContacts),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (patchResponse.status === 200) {
          console.log(`PATCH ${patchResponse.id} success 200`)
        } else {
          console.log(`PATCH ${patchResponse.id} failure ${patchResponse.status} `);
        }

      }
    }

  }

    navigate(0);  // goes back to Application Page
  };

  const loadContacts = async () => {
    const response = await fetch(`${datastore_url}/contacts`);
    const data = await response.json();
    // console.log(data);
    setContacts(data);
  }

  const loadSkills = async () => {
    const response = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/skills`, {
      headers: {
        'Authorization': `Bearer ${user}`
      }
    });
    const data = await response.json();
    // console.log(data)
    setSkills(data);
  }

  function contactNames() {
    for (let contact of typeToEdit.contacts){
      // console.log(contact)
      for (let id of buildContacts){
        if (contact === id.id){
          let contactName = id.first_name + " " + id.last_name
          displayContacts.push(contactName);
        }
      }
    };
    // console.log(displayContacts)

    if (displayContacts.length === 0) {
      displayContactLabel = 'None';
    } else {
      displayContactLabel = JSON.stringify(displayContacts);
      displayContactLabel = displayContactLabel.slice(1,-1);
    }
    // console.log(displayLabel)
  }

  function skillNames() {
    for (let skill of typeToEdit.skills){
      // console.log(skill)
      for (let id of buildSkills){
        // console.log(id)
        if (skill === id.skill_id){
          displaySkills.push(id.description);
        }
      }
    };
    // console.log(displayContacts)

    if (displaySkills.length === 0) {
      displaySkillLabel = 'None';
    } else {
      displaySkillLabel = JSON.stringify(displaySkills);
      displaySkillLabel = displaySkillLabel.slice(1,-1);
    }
    // console.log(displayLabel)
  }

  contactNames();
  skillNames();



  useEffect(() => {
    loadContacts();
    loadSkills();
  }, []);

  function addKeys(selection) {
    if (selection === "contacts")
    buildContacts = buildContacts.map(function(obj) {
        obj.label = obj.first_name + " " + obj.last_name;
        obj.value = obj.first_name + " " + obj.last_name;
        // console.log(selectedContacts)
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
  
  
  return (
    <div>
      <form onSubmit={editApplication}>
      <h1>Edit Application</h1>

      <div className="container">
      <label className="">Title:</label>
      <input
        className="edit-app"
        required
        type="text"
        placeholder="Enter Title (required)"
        value={title}
        onChange={e => setTitle(e.target.value)} />
      <label className="">Description:</label>
      <textarea
      className='edit-description'
        required
        type="text"
        rows="25"
        cols="55"
        value={description}
        placeholder="Enter Description (required)"
        onChange={e => setDescription(e.target.value)} />
      <label className="">Posting Date:</label>
      <input
      className="edit-app"
        type="date"
        placeholder="Enter Posting Date"
        value={posting_date}
        onChange={e => setPostingDate(e.target.value)} />
      <label className="">Status:</label>
      <select 
      className="edit-app"
      onChange={e => setStatus(e.target.value)}>
          <option>Applied</option>
          <option>Not Applied</option>
      </select>
      <label className="">Link:</label>
      <input
      className="edit-app"
        type="url"
        placeholder="Enter Link"
        value={link}
        onChange={e => setLink(e.target.value)} />
      </div>
        <div  className='select'>
          {visibleRemoveContactsButton && 
            <><br />
              <><b>Current Contact(s):</b></><br /><br />
              <>{displayContactLabel}</>
            </>
          }

          <div><br />
              <button onClick={hideContacts}>Remove all current contacts</button>
            {visibleUndoContactsButton &&
              <><button onClick={showContacts}>Undo Remove</button><br /><br /></>
            }
          </div>

          {visibleRemoveContactsButton &&
            <><br /><b>or </b>
            </>
          }

          <b>select new Contacts to add to Applcation:</b><br /><br />
          <SelectMulti
          items={buildContacts}
          selected={selectedContacts}
          setSelected={setSelectedContacts}
          />

          <b><br />or leave as it is.</b>
        </div> 
        <br />  
        <div  className='select'>
          {visibleRemoveSkillsButton && 
            <><br />
              <><b>Current Skill(s):</b></><br /><br />
              <>{displaySkillLabel}</>
            </>
          }

          <div><br />
              <button onClick={hideSkills}>Remove all current skills</button>
            {visibleUndoSkillsButton &&
              <><button onClick={showSkills}>Undo Remove</button><br /><br /></>
            }
          </div>

          {visibleRemoveSkillsButton &&
            <><br /><b>or </b>
            </>
          }

          <b>select new Skills to add to Applcation:</b><br /><br />
          <SelectMulti
          items={buildSkills}
          selected={selectedSkills}
          setSelected={setSelectedSkills}
          />

          <b><br />or leave as it is.</b>
        </div> 
      <p>
        <input type="submit" value="Submit Changes" />
      </p>
      </form>
    </div>
  );
}

export default EditApplicationPage;