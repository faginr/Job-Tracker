import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export const AddContactPage = () => {
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const navigate = useNavigate();

  const addContact = async () => {

    const newContact = { name, email, phone, notes };

    const response = await fetch('/contacts', {
      method: 'POST',
      body: JSON.stringify(newContact),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if(response.status === 201){
      alert("Successfully added the contact!"); 
    } else {
      alert(`Failed to add contact, status code = ${response.status}`);
    }

    navigate(-1);  // goes back to Application Page
  };
  
  return (
    <div>
      <h1>Add Contact</h1>
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={e => setName(e.target.value)} />
      <input
        type="text"
        value={email}
        placeholder="Enter email"
        onChange={e => setEmail(e.target.value)} />
      <input
        type="text"
        placeholder="Enter phone"
        value={phone}
        onChange={e => setPhone(e.target.value)} />
      <input
        type="text"
        placeholder="Enter notes"
        value={notes}
        onChange={e => setNotes(e.target.value)} />
      <p>
        <button
          onClick={() => navigate(-1)}
        >Cancel</button>
        <> </>
        <button
          onClick={addContact}
        >Add</button>
      </p>
    </div>
  );
}

export default AddContactPage;