/**
 * Date 1/25/2023
 * Code Source for AddContactPage:
 * The code is adapted from a code provided in CS290 Web Development:
 * Module 9 - Full Stack MERN Apps
 * Exploration — Implementing a Full-Stack MERN App - Part 1
 */


import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export const AddContactPage = () => {
  
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const navigate = useNavigate();

  const addContact = async (e) => {
    e.preventDefault();

    const newContact = { lastName, firstName, email, phone, notes };

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
      <form onSubmit={addContact}>
        <h1>Add Contact</h1>
        <input
          required
          type="text"
          placeholder="Enter last name (required)"
          value={lastName}
          onChange={e => setLastName(e.target.value)} />
        <input
          type="text"
          value={firstName}
          placeholder="Enter first name"
          onChange={e => setFirstName(e.target.value)} />
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
        <input type="submit" value="Add" />
        <> </>
        <input type="button" value="Cancel" onClick={() => navigate(-1)} />
        </p>
      </form>
      
    </div>
  );
}

export default AddContactPage;