import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { datastore_url } from '../components/Constants';

export const AddApplicationPage = () => {
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkill] = useState('');
  const [contacts, setContact] = useState('');
  const [posting_date, setPostingDate] = useState('');
  const [status, setStatus] = useState('');
  const [link, setLink] = useState('');

  const navigate = useNavigate();

  const addApplication = async (e) => {
    e.preventDefault();

    const newApplication = { 
      title, 
      description,
      skills, 
      contacts, 
      posting_date, 
      status, 
      link 
    };

    const response = await fetch(`${datastore_url}/applications`, {
      method: 'POST',
      body: JSON.stringify(newApplication),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if(response.status === 201){
      alert("Successfully added the application!"); 
    } else {
      alert(`Failed to add application, status code = ${response.status}`);
    }

    navigate(-1);  // goes back to Application Page
  };


  
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
      <input
        required
        type="text"
        value={description}
        placeholder="Enter Description (required)"
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
      <input type="submit" value="Add Application" />
      <input type="submit" value="Cancel" onClick={() => navigate(-1)} />
      </p>
      </form>
    </div>
  );
}

export default AddApplicationPage;