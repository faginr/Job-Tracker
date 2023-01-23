import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContactList from '../components/ContactList';
import { useState, useEffect } from 'react';

function ContactPage({ setContactToEdit }) {
  
  const [contacts, setContacts] = useState([]);

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
          onEdit={onEdit}></ContactList>
        <p>
          <Link to="/add-contact">Add a New Contact</Link>
        </p>
      </div>
    </>
  );
}

export default ContactPage;