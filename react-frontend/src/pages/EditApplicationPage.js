import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { user } from '../utils/User';
import SelectMulti from '../components/SelectMulti';
import { datastore_url } from '../utils/Constants';

export const EditApplicationPage = ({ typeToEdit }) => {
  
  const startingContacts = typeToEdit.contacts

  // console.log(typeToEdit);
  const [title, setTitle] = useState(typeToEdit.title);
  const [description, setDescription] = useState(typeToEdit.description);
  const [skills, setSkill] = useState(typeToEdit.skills);
  // const [contacts, setContact] = useState(typeToEdit.contacts);
  const [posting_date, setPostingDate] = useState(typeToEdit.posting_date);
  const [status, setStatus] = useState(typeToEdit.status);
  const [link, setLink] = useState(typeToEdit.link);

  let contacts = []
  const [selectedContacts, setSelectedContacts] = useState([]);

  let [buildContacts, setContacts] = useState([]);

  const navigate = useNavigate();

  const [visibleRemoveButton, setVisibleRemoveButton] = useState(true);
  const [visibleUndoButton, setVisibleUndoButton] = useState(false);

  const show = (e) => {
    e.preventDefault();
    setVisibleRemoveButton(true);
    setVisibleUndoButton(false);
  }

  const hide = (e) => {
    e.preventDefault();
    setVisibleRemoveButton(false);
    setVisibleUndoButton(true);
  }

  let displayContacts = [];
  let displayLabel = '';


  const editApplication = async (e) => {
    e.preventDefault();

    // listen for any value changes

    if(setVisibleRemoveButton === true
      && selectedContacts.length === 0
      && skills === typeToEdit.skills
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
    if (setVisibleRemoveButton === false
      && selectedContacts.length === 0
      ) {
        contacts = [];
      }

    // push each element id selected into contacts
    for (let element of selectedContacts) {
      // console.log(element)
      contacts.push(element.id)

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
        const contactResponse = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/contacts/${contact}`, {
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
        
        const patchResponse = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/contacts/${contact}`, {
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
        const contactResponse = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/contacts/${contact}`, {
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
        
        const patchResponse = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/contacts/${contact}`, {
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
    const response = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/contacts`);
    const data = await response.json();
    // console.log(data);
    setContacts(data);
  }

  function contactNames() {
    for (let contact of typeToEdit.contacts){
      console.log(contact)
      for (let id of buildContacts){
        if (contact === id.id){
          displayContacts.push(contact);
        }
      }
    };
    // console.log(displayContacts)

    if (displayContacts.length === 0) {
      displayLabel = 'None';
    } else {
      displayLabel = JSON.stringify(displayContacts);
      displayLabel = displayLabel.slice(1,-1);
    }
    // console.log(displayLabel)
  }
  contactNames();

  useEffect(() => {
    loadContacts();
    // loadSkills();
  }, []);

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
      <label className="">Skills:</label>
      <input
      className="edit-app"
        type="text"
        placeholder="Enter Skill"
        value={skills}
        onChange={e => setSkill(e.target.value)} />
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
      {/* <input
        type="text"
        placeholder="Enter Contact"
        value={contacts}
        onChange={e => setContact(e.target.value)} /> */}
        <div  className='select'>
          {visibleRemoveButton && 
            <><br />
              <><b>Current Contact(s):</b></><br /><br />
              <>{displayLabel}</>
            </>
          }

          <div><br />
            {visibleRemoveButton &&
              <button onClick={hide}>Remove all current contacts</button>
            }
            {visibleUndoButton &&
              <><button onClick={show}>Undo Remove</button><br /><br /></>
            }
          </div>

          {visibleRemoveButton &&
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
      
      {/* <p>
        <button
          onClick={() => navigate(-1)}
        >Cancel</button>
        <> </>
        <button
          onClick={editApplication}
        >Submit</button>
      </p> */}
      <p>
        <input type="submit" value="Submit Changes" />
      </p>
      </form>
    </div>
  );
}

export default EditApplicationPage;