import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { datastore_url } from '../components/Constants';

export const EditApplicationPage = ({ applicationToEdit }) => {
  
  const [title, setTitle] = useState(applicationToEdit.title);
  const [description, setDescription] = useState(applicationToEdit.description);
  const [skills, setSkill] = useState(applicationToEdit.skills);
  const [contacts, setContact] = useState(applicationToEdit.contacts);
  const [posting_date, setPostingDate] = useState(applicationToEdit.posting_date);
  const [status, setStatus] = useState(applicationToEdit.status);
  const [link, setLink] = useState(applicationToEdit.link);


  const navigate = useNavigate();

  const editApplication = async () => {

    const editedApplication = { title, 
      description,
      skills, 
      contacts, 
      posting_date, 
      status, 
      link 
     };

    const response = await fetch(`${datastore_url}/applications/${applicationToEdit.id}`, {
      method: 'PATCH',
      body: JSON.stringify(editedApplication),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if(response.status === 200){
      alert("Successfully edited the application!"); 
    } else {
      alert(`Failed to edit application, status code = ${response.status}`);
    }

    navigate(-1);  // goes back to Application Page
  };
  
  return (
    <div>
      <h1>Edit Application</h1>
      <input
        required
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={e => setTitle(e.target.value)} />
      <input
        required
        type="text"
        value={description}
        placeholder="Enter Description"
        onChange={e => setDescription(e.target.value)} />
      <input
        type="text"
        placeholder="Enter Skill"
        value={skills}
        onChange={e => setSkill(e.target.value)} />
      <input
        type="text"
        placeholder="Enter Contact"
        value={contacts}
        onChange={e => setContact(e.target.value)} />
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
        <button
          onClick={() => navigate(-1)}
        >Cancel</button>
        <> </>
        <button
          onClick={editApplication}
        >Submit</button>
      </p>
    </div>
  );
}

export default EditApplicationPage;