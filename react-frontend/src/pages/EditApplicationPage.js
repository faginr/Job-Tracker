import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export const EditApplicationPage = ({ applicationToEdit }) => {
  
  const [name, setName] = useState(applicationToEdit.name);
  const [description, setDescription] = useState(applicationToEdit.description);
  const [skill, setSkill] = useState(applicationToEdit.skill);

  const navigate = useNavigate();

  const editApplication = async () => {

    const editedApplication = { name, description, skill };

    const response = await fetch(`/applications/${applicationToEdit.id}`, {
      method: 'PUT',
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
        type="text"
        value={name}
        onChange={e => setName(e.target.value)} />
      <input
        type="text"
        value={description}
        onChange={e => setDescription(e.target.value)} />
      <input
        type="text"
        value={skill}
        onChange={e => setSkill(e.target.value)} />
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