import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import SelectMulti from '../components/SelectMulti';
import { datastore_url } from '../utils/Constants';
import { useAPI } from '../utils/Auth0Functions';
import { useAuth0 } from '@auth0/auth0-react';
import loadContacts from '../components/AppLoadContacts';
import loadSkills from '../components/AppLoadSkills';


/***********************************************************
* Edit Application Page component
***********************************************************/
export const EditApplicationPage = ({ typeToEdit }) => {

  // Constants
  const [title, setTitle] = useState(typeToEdit.title);
  const [description, setDescription] = useState(typeToEdit.description);
  const [posting_date, setPostingDate] = useState(typeToEdit.posting_date);
  const [status, setStatus] = useState(typeToEdit.status);
  const [link, setLink] = useState(typeToEdit.link);
  const {user, isAuthenticated} = useAuth0();
  const getTokenFromAuth0 = useAPI();

  let contacts = []
  const [selectedContacts, setSelectedContacts] = useState([]);
  let skills = []
  const [selectedSkills, setSelectedSkills] = useState([]);

  let [buildContacts, setContacts] = useState([]);
  let [buildSkills, setSkills] = useState([]);

  const navigate = useNavigate();

  // Show remove button/undo button for contacts and skills
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

  
  // Show previous values in edit sliding panel
  let displayContacts = [];
  let displaySkills =[];
  let displayContactLabel = '';
  let displaySkillLabel = '';

  // Prevent double click submit
  const [submitDisabled, setSubmitDisabled] = useState(false);


  /***********************************************************
  * Button pressed, send application patch request 
  ***********************************************************/
  const editApplication = async (e) => {
    e.preventDefault();
    //console.log('submit button status:', submitDisabled);
    if (!submitDisabled) {
      setSubmitDisabled(true);

      // listen for any value changes
      if(visibleRemoveContactsButton === true
        && visibleRemoveSkillsButton === true
        && selectedContacts.length === 0
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
      if (visibleRemoveContactsButton === false
        && selectedContacts.length === 0
        ) {
          contacts = [];
        }

      if (visibleRemoveSkillsButton === false
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
        posting_date,
        status, 
        link 
      };

    // Only send skills/contacts if values change
    if(selectedSkills.length === 0 
      && displaySkillLabel !== 'None' 
      && visibleRemoveSkillsButton === true){
      console.log("no change in skills")
    } else {
      editedApplication["skills"] = skills
    }
    if(selectedContacts.length === 0 
      && displayContactLabel !== 'None' 
      && visibleRemoveContactsButton === true){
      console.log("no change in contacts")
    } else {
      editedApplication["contacts"] = contacts
    }
    
    
    // PATCH application
    // only send request if authenticated, otherwise error will be thrown while trying to parse
    // out the user ID because user will be undefined
    const token = await getTokenFromAuth0({redirectURI: '/applications'})
    if(isAuthenticated){
      const userID = user.sub.split('|')[1]
      const response = await fetch(`${datastore_url}/users/${userID}/applications/${typeToEdit.id}`, {
        method: 'PATCH',
        body: JSON.stringify(editedApplication),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      // Log status
      if(response.status === 200){
        console.log("Successfully edit the application!"); 
      } else {
        alert(`Failed to edit application, status code = ${response.status}`);
      }
  
      // Reload applications page
      navigate(0);  
      }
    }
  };

  // Convert contact ids to first + last names
  function contactNames() {
    for (let contact of typeToEdit.contacts){
      for (let id of buildContacts){
        if (contact === id.id){
          let contactName = id.first_name + " " + id.last_name
          displayContacts.push(contactName);
        }
      }
    };

    if (displayContacts.length === 0) {
      displayContactLabel = 'None';
    } else {
      displayContactLabel = JSON.stringify(displayContacts);
      displayContactLabel = displayContactLabel.slice(1,-1);
    }
  }

  // Convert skill ids to descriptions
  function skillNames() {
    for (let skill of typeToEdit.skills){
      for (let id of buildSkills){
        if (skill === id.skill_id){
          displaySkills.push(id.description);
        }
      }
    };

    if (displaySkills.length === 0) {
      displaySkillLabel = 'None';
    } else {
      displaySkillLabel = JSON.stringify(displaySkills);
      displaySkillLabel = displaySkillLabel.slice(1,-1);
    }
  }

  contactNames();
  skillNames();

  /***********************************************************
  * Hook for loading in user specific contacts and skills
  ***********************************************************/
  useEffect(() => {
    getTokenFromAuth0({redirectURI: '/applications'}).then((token)=>{
      if(isAuthenticated){
        loadContacts(datastore_url,user,token,setContacts);
        loadSkills(datastore_url,user,token,setSkills);
      }
    })
  }, [user]);

  // Build selections for dropdowns
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
  
  
  return (
    <div>
      <form onSubmit={editApplication}>
      <h1>Edit Application</h1>

      <div className="container">
      <label className="">Title (max chars: 100):</label>
      <input
        className="edit-app"
        required
        type="text"
        placeholder="Enter Title (required)"
        value={title}
        onChange={e => setTitle(e.target.value)} />
      <label className="">Description (max chars: 5000):</label>
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
          <option disabled selected value>--Select Status--</option>
          <option>Applied</option>
          <option>Not Applied</option>
      </select>
      <label className="">Link (max chars: 2048):</label>
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
            {visibleRemoveContactsButton &&
              <button onClick={hideContacts}>Remove all current contacts</button>
            }
            {visibleUndoContactsButton &&
              <><button onClick={showContacts}>Undo Remove</button><br /><br /></>
            }
          </div>

          {visibleRemoveContactsButton &&
            <><br /><b>or </b>
            </>
          }

          <b>select new Contacts to add to Applcation:</b><br />
          <p>(unchecked items will be removed)</p><br />
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
            {visibleRemoveSkillsButton &&
              <button onClick={hideSkills}>Remove all current skills</button>
            }
            {visibleUndoSkillsButton &&
              <><button onClick={showSkills}>Undo Remove</button><br /><br /></>
            }
          </div>

          {visibleRemoveSkillsButton &&
            <><br /><b>or </b>
            </>
          }

          <b>select new Skills to add to Application:</b><br />
          <p>(unchecked items will be removed)</p><br />
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