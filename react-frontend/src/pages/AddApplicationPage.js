import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export const AddApplicationPage = () => {
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [skill, setSkill] = useState('');

  const navigate = useNavigate();

  const addApplication = async () => {

    const newApplication = { name, description, skill };

    const response = await fetch('/applications', {
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
      <h1>Add Application</h1>
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={e => setName(e.target.value)} />
      <input
        type="text"
        value={description}
        placeholder="Enter description"
        onChange={e => setDescription(e.target.value)} />
      <input
        type="text"
        placeholder="Enter skill"
        value={skill}
        onChange={e => setSkill(e.target.value)} />
      <p>
        <button
          onClick={() => navigate(-1)}
        >Cancel</button>
        <> </>
        <button
          onClick={addApplication}
        >Add</button>
      </p>
    </div>
  );
}

export default AddApplicationPage;