import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export const EditContactPage = ({ contactToEdit }) => {
  
  const [name, setName] = useState(contactToEdit.name);
  const [email, setEmail] = useState(contactToEdit.email);
  const [phone, setPhone] = useState(contactToEdit.phone);
  const [notes, setNotes] = useState(contactToEdit.notes);

  const navigate = useNavigate();

  const editContact = async (e) => {
    e.preventDefault();

    const editedContact = { name, email, phone, notes };

    const response = await fetch(`/contacts/${contactToEdit.id}`, {
      method: 'PUT',
      body: JSON.stringify(editedContact),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if(response.status === 200){
      alert("Successfully edited the contact!"); 
    } else {
      alert(`Failed to edit contact, status code = ${response.status}`);
    }

    navigate(-1);  // goes back to Contact Page
  };
  
  return (
    <div>
      <form onSubmit={editContact}>
        <h1>Edit Contact</h1>
        <input
          required
          type="text"
          value={name}
          onChange={e => setName(e.target.value)} />
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)} />
        <input
          type="text"
          value={phone}
          onChange={e => setPhone(e.target.value)} />
        <input
          type="text"
          value={notes}
          onChange={e => setNotes(e.target.value)} />
        <p>
          <button>Submit</button>
        </p>
      </form>
      <p>
        <button onClick={() => navigate(-1)} >Cancel</button>
      </p>
    </div>
  );
}

export default EditContactPage;