/**
 * Date 1/25/2023
 * Code Source for the page:
 * The code is adapted from a code provided in CS290 Web Development:
 * Module 9 - Full Stack MERN Apps
 * Exploration — Implementing a Full-Stack MERN App - Part 1
 */


import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export const AddContactPage = () => {
  
  // hook to navigate among the pages
  const navigate = useNavigate();

  const [last_name, setLastName] = useState('');
  const [first_name, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [contact_at_id, setContactAt] = useState('');

  const [apps, setApps] = useState([]);

  // add the contact to the database
  const addContact = async (e) => {
    e.preventDefault();

    const newContact = { 
      last_name, 
      first_name, 
      email, 
      phone, 
      notes, 
      contact_at_id 
    };

    // POST a new contact
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
      alert(`Failed to add the contact, status code = ${response.status}`);
    }

    // update an application if added to the contact
    if (contact_at_id !== '' && contact_at_id !== undefined) {

      // get contact id to add to the application
      const conatct_id = await response.json();

      const updateApplication = { contacts: `${conatct_id}` };

      // PATCH the application with contact_id
      const responseUpdateApp = await fetch(`/applications/${contact_at_id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateApplication),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if(responseUpdateApp.status === 200){
        alert("Successfully updated the application!"); 
      } else {
        alert(`Failed to update the application, status code = ${responseUpdateApp.status}`);
      }
    };

    // go back to Application Page
    navigate(-1);  
  };

  // function to fetch applications
  const getApps = async () => {
    const response = await fetch('/applications');
    const data = await response.json();
    setApps(data);
  };

  // hook to call the fucntion above
  useEffect(() => {
    getApps();
  }, []);

  // sort the array of applications
  // source of the function: https://stackabuse.com/sort-array-of-objects-by-string-property-value/
  let sortedApps = apps.sort((a,b) => {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return -1;
    }
    if (b.title.toLowerCase() > a.title.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  return (
    <div>
      <form onSubmit={addContact}>
        <h1>Add Contact</h1>
        <input
          required
          type="text"
          placeholder="Enter last name (required)"
          value={last_name}
          onChange={e => setLastName(e.target.value)} />
        <input
          required
          type="text"
          value={first_name}
          placeholder="Enter first name (required)"
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

        <select onChange={e => setContactAt(e.target.value)}>
          
          <option>Please choose one option</option>
          {sortedApps.map((option, index) => {
            return <option key={index} value={option.id}>
              {option.title}
              </option>
          })}

        </select>
        
        <p>
        <input type="submit" value="Add Contact" />
        <> </>
        <input type="button" value="Cancel" onClick={() => navigate(-1)} />
        </p>
      </form>
      
    </div>
  );
}

export default AddContactPage;