import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export const EditContactPage = ({ contactToEdit }) => {
  
  const [last_name, setLastName] = useState(contactToEdit.last_name);
  const [first_name, setFirstName] = useState(contactToEdit.first_name);
  const [email, setEmail] = useState(contactToEdit.email);
  const [phone, setPhone] = useState(contactToEdit.phone);
  const [notes, setNotes] = useState(contactToEdit.notes);

  const navigate = useNavigate();

  const editContact = async (e) => {
    e.preventDefault();

    const editedContact = { last_name, first_name, email, phone, notes };

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
          value={last_name}
          onChange={e => setLastName(e.target.value)} />
        <input
          type="text"
          value={first_name}
          onChange={e => setFirstName(e.target.value)} />
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
        <input type="submit" value="Submit" />
        <> </>
        <input type="button" value="Cancel" onClick={() => navigate(-1)} />
        </p>
      </form>
    </div>
  );
}

export default EditContactPage;