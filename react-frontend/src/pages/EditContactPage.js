import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export const EditContactPage = ({ contactToEdit }) => {
  
  const [last_name, setLastName] = useState(contactToEdit.last_name);
  const [first_name, setFirstName] = useState(contactToEdit.first_name);
  const [email, setEmail] = useState(contactToEdit.email);
  const [phone, setPhone] = useState(contactToEdit.phone);
  const [notes, setNotes] = useState(contactToEdit.notes);
  const [contact_at_id, setContactAt] = useState(contactToEdit.contact_at_id);

  const [apps, setApps] = useState([]);

  const navigate = useNavigate();

  const editContact = async (e) => {
    e.preventDefault();

    const editedContact = { last_name, first_name, email, phone, notes, contact_at_id };

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

  const getApps = async () => {
    const response = await fetch('/applications');
    const data = await response.json();
    setApps(data);
  };

  useEffect(() => {
    getApps();
  }, []);

  let contact_at_name;

  // iterate over applications and add name of application to the contact
  for (let app of apps) {
    if (contactToEdit.contact_at_id === app.id) {
      contact_at_name = app.title;
    } 
  }
  
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

        <select onChange={e => setContactAt(e.target.value)}>
          
          <option>{contact_at_name}</option>
          {apps.map((option, index) => {
            return <option key={index} value={option.id}>
              {option.title}
              </option>
          })}

        </select> 

        <p>
        <input type="submit" value="Submit Changes" />
        <> </>
        <input type="button" value="Cancel" onClick={() => navigate(-1)} />
        </p>
      </form>
    </div>
  );
}

export default EditContactPage;