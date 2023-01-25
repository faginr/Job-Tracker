/**
 * Date 1/25/2023
 * Code Source for ContactPage:
 * The code is adapted from a code provided in CS290 Web Development:
 * Module 9 - Full Stack MERN Apps
 * Exploration — Implementing a Full-Stack MERN App - Part 1
 */


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContactList from '../components/ContactList';
import { useState, useEffect } from 'react';

function ContactPage({ setContactToEdit }) {
  
  const [contacts, setContacts] = useState([]);
  const [order, setOrder] = useState("ASC");
  
  // sorts the contact table by clicking on the name of the column
  const sorting = (col) => {
    if (order === "ASC"){
      const sorted = [...contacts].sort((a,b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setContacts(sorted);
      setOrder("DSC");
    };

    if (order === "DSC"){
      const sorted = [...contacts].sort((a,b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setContacts(sorted);
      setOrder("ASC");
    };
  }

  const navigate = useNavigate();

  const onDelete = async id => {
    const confirmed = window.confirm("Are you sure you want to delete the contact?");

    if (confirmed) {
      const response = await fetch(`/contacts/${id}`, { method: 'DELETE' });
      if (response.status === 204) {
          setContacts(contacts.filter(contact => contact.id !== id));
          alert("Successfully deleted the contact! Click Ok to update the page.");
      } else {
          console.error(`Failed to delete contact with id = ${id}, status code = ${response.status}`)
      }
    }
  };

  const onEdit = contact => {
    setContactToEdit(contact);
    navigate("/edit-contact");
  };

  const loadContacts = async () => {
    const response = await fetch('/contacts');
    const data = await response.json();
    setContacts(data);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return (
    <>
      <h1>Contact Page</h1>

      <div>
        <p>Hello Username!</p>
        <p>List of your contacts:</p>
        <ContactList 
          contacts={contacts} 
          onDelete={onDelete}
          onEdit={onEdit}
          sorting={sorting}></ContactList>
        <p>
          <Link to="/add-contact">Add a New Contact</Link>
        </p>
      </div>
    </>
  );
}

export default ContactPage;