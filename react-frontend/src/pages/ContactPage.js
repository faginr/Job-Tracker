/**
 * Date 1/25/2023
 * Code Source for the page:
 * The code is adapted from a code provided in CS290 Web Development:
 * Module 9 - Full Stack MERN Apps
 * Exploration — Implementing a Full-Stack MERN App - Part 1
 */


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContactList from '../components/ContactList';
import { useState, useEffect } from 'react';

function ContactPage({ setContactToEdit }) {
  
  // hook to navigate among the pages
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [order, setOrder] = useState("Ascending");
  const [apps, setApps] = useState([]);
  
  // function to allow the user to sort the contact table by clicking on the name of the column
  const sorting = (col) => {
    if (order === "Ascending"){
      const sorted = [...contacts].sort((a,b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setContacts(sorted);
      setOrder("Descending");
    };

    if (order === "Descending"){
      const sorted = [...contacts].sort((a,b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setContacts(sorted);
      setOrder("Ascending");
    };
  }

  // function to delete a contact
  const onDelete = async (id, contact_at_id) => {
    const confirmed = window.confirm("Are you sure you want to delete the contact?");

    if (confirmed) {

      // update any application if releated to the contact 
      if (contact_at_id !== '') {
        const updatedApplication = { contacts: '' };

        const responseUpdateApp = await fetch(`/applications/${contact_at_id}`, {
          method: 'PATCH',
          body: JSON.stringify(updatedApplication),
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

      const response = await fetch(`/contacts/${id}`, { method: 'DELETE' });
      if (response.status === 204) {
          setContacts(contacts.filter(contact => contact.id !== id));
          alert("Successfully deleted the contact! Click Ok to update the page.");
      } else {
          console.error(`Failed to delete contact with id = ${id}, status code = ${response.status}`)
      }
    }
  };

  // function to call the edit page
  const onEdit = contact => {
    setContactToEdit(contact);
    navigate("/edit-contact");
  };

  // function to fetch contacts
  const loadContacts = async () => {
    const response = await fetch('/contacts');
    const data = await response.json();
    setContacts(data);
  };

  // function to fetch applications
  const getApps = async () => {
    const response = await fetch('/applications');
    const data = await response.json();
    setApps(data);
  };

  // hook to call the fucntions above
  useEffect(() => {
    loadContacts();
    getApps();
  }, []);


  // iterate over contacts and applications, if a contact is related to an application, 
  // it adds the name and link of this application to this contact
  for (let contact of contacts) {
    for (let app of apps) {
      if (contact.contact_at_id === app.id) {
        contact.contact_at_name = app.title;
        contact.contact_at_link = app.link;
      } 
    }
  }

  // sort the array of contacts
  // source of the function: https://stackabuse.com/sort-array-of-objects-by-string-property-value/
  let sortedContacts = contacts.sort((a,b) => {
    if (a.first_name.toLowerCase() < b.first_name.toLowerCase()) {
      return -1;
    }
    if (b.first_name.toLowerCase() > a.first_name.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  return (
    <>
      <h1>Contact Page</h1>

      <div>
        <p>Hello Username!</p>
        <p>List of your contacts:</p>
        <ContactList 
          contacts={sortedContacts} 
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