import ContactList from '../components/ContactList';
import { datastore_url } from '../utils/Constants';
import React, { useState, useEffect } from 'react';
import AddContactPage from './AddContactPage';
import SlidingWindow from '../components/SlidingWindow';
import { user } from '../utils/User';
import ReactButton from '../components/ReactButton';

function ContactPage() {
  
  const [contacts, setContacts] = useState([]);
  const [order, setOrder] = useState("Ascending");
  
  /************************************************************* 
   * Function to allow a user to sort the contact table 
   * by clicking on the name of the column
   * Source: https://www.youtube.com/watch?v=g523Bj0y36Q
   ************************************************************/
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
    }
  };


  /************************************************************* 
   * Function to DELETE a contact 
   ************************************************************/
  const onDelete = async (contact_id) => {
    const confirmed = window.confirm("Are you sure you want to delete the contact?");
    if (confirmed) {
      // DELETE the contact
      const response = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/contacts/${contact_id}`, 
        { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user}`}
        }
      );
      if (response.status === 204) {
        setContacts(contacts.filter(contact => contact.id !== contact_id));
          //alert("Successfully deleted the contact! Click Ok to update the page.");
      } else {
        console.log(`Failed to delete contact with id = ${contact_id}, status code = ${response.status}`)
      }
    }
  };


  /************************************************************* 
   * Function to get contacts 
   ************************************************************/
  const getContacts = async () => {
    const response = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/contacts`,
      { 
        method: "GET",
        headers: {
          'Accept': 'application/json', 
          'Authorization': `Bearer ${user}`}
      }
    );
    if (response.status === 200) {
      //console.log("Successfully fetched the contacts!"); 
    } else {
      console.log(`Failed to fetch the contacts, status code = ${response.status}`);
    };
    const data = await response.json();
    setContacts(data);
  };


  /************************************************************* 
   * Hook to call the function above 
   ************************************************************/
  useEffect(() => {
    getContacts();
  }, []);


  return (
    <>
      <h1>Contact Page</h1>

      <div>
        <p>Your contacts:</p>
        <ContactList 
          contacts={contacts} 
          onDelete={onDelete}
          sorting={sorting} ></ContactList>
      </div><br />

      <SlidingWindow 
        Page={<AddContactPage />}
        ClickableComponent={<ReactButton label="Add Contact"/>}
        />

    </>
  );
}

export default ContactPage;