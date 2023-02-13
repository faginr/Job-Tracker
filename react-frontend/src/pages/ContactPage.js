import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContactList from '../components/ContactList';
import { datastore_url } from '../components/Constants';
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
  const onDelete = async (id, contact_at_app_id) => {
    const confirmed = window.confirm("Are you sure you want to delete the contact?");

    if (confirmed) {

    // update any application if releated to the contact 
    if (Object.keys(contact_at_app_id).length > 0) {
      for (let contact of contact_at_app_id) {
        const updatedApplication = { contacts: [] };

        // PATCH the contact
        const responseUpdateApp = await fetch(`${datastore_url}/applications/${contact}`, {
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
      }
    };

      // DELETE the contact
      const response = await fetch(
        `${datastore_url}/contacts/${id}`, 
        { 
          method: 'DELETE'
        }
      );
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
    const response = await fetch(
      `${datastore_url}/contacts`,
      { 
        method: "GET",
        headers: {"Accept": "application/json"}
      }
    );

    const data = await response.json();
    setContacts(data);
  };

  // function to fetch applications
  const getApps = async () => {
    const response = await fetch(`${datastore_url}/applications`);
    const data = await response.json();
    setApps(data);
  };

  // hook to call the fucntions above
  useEffect(() => {
    loadContacts();
    getApps();
  }, []);

  // iterate over contacts and applications, if a contact is related to an application, 
  // add the name and link of this application to this contact
  let arrayAppsNames = [];
  let objApps = {};
  
  for (let contact of contacts) {
    arrayAppsNames = [];
    for (let app_id of contact.contact_at_app_id) {
      for (let app of apps) {
        if (app_id === app.id) {
          objApps = {};
          objApps['title'] = app.title;
          objApps['link'] = app.link;
          arrayAppsNames.push(objApps); 
        } 
      }
    };
    contact.arrayAppsNames = arrayAppsNames
  };
  //console.log('arrayAppsNames', arrayAppsNames)


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