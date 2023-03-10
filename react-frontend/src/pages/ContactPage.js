import ContactList from '../components/ContactList';
import { datastore_url } from '../utils/Constants';
import React, { useState, useEffect } from 'react';
import AddContactPage from './AddContactPage';
import SlidingWindow from '../components/SlidingWindow';
import ReactButton from '../components/ReactButton';
import {useAuth0} from '@auth0/auth0-react';
import { useAPI } from '../utils/Auth0Functions';
import LoadingPage from './LoadingPage';

function ContactPage() {
  
  const [contacts, setContacts] = useState([]);
  const [order, setOrder] = useState("Ascending");
  const getTokenFromAuth0 = useAPI();
  const {user, isAuthenticated} = useAuth0()
  const [loading, setLoading] = useState(true);
  
  
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
      const token = await getTokenFromAuth0({redirectURI: '/contacts'})
      const userID = user.sub.split('|')[1]
      const response = await fetch(`${datastore_url}/users/${userID}/contacts/${contact_id}`, 
        { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`}
        }
      );
      if (response.status === 204) {
        setContacts(contacts.filter(contact => contact.id !== contact_id));
        // console.log("Successfully deleted the contact!");
      } else {
        alert(`Failed to delete contact with id = ${contact_id}, status code = ${response.status}`)
      }
    }
  };


  /************************************************************* 
   * Function to get contacts 
   ************************************************************/
  const getContacts = async () => {
    const token = await getTokenFromAuth0({redirectURI: '/contacts'})
    if(isAuthenticated){
      const userID = user.sub.split('|')[1]
      const response = await fetch(`${datastore_url}/users/${userID}/contacts`,
        { 
          method: "GET",
          headers: {
            'Accept': 'application/json', 
            'Authorization': `Bearer ${token}`}
        }
      );
      if (response.status === 200) {
        // console.log("Successfully fetched the contacts!"); 
      } else {
        alert(`Failed to fetch the contacts, status code = ${response.status}`);
      };
      const data = await response.json();
      setContacts(data);
      setLoading(false);
    }
  };


  /************************************************************* 
   * Hook to call the function above 
   ************************************************************/
  useEffect(() => {
    getContacts();
  }, [user]);


  return (
    (isAuthenticated && loading === false) ?
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
    :
    <LoadingPage />
  );
}

export default ContactPage;