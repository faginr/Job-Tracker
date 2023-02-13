import React from 'react';
import Contact from './Contact';

function ContactList({ contacts, onDelete, onEdit, sorting }) {
  
  return (
    <table id="contacts">
      <thead>
        <tr>
          <th onClick={() => sorting("first_name")} >Contact First Name <br />(click to sort)</th>
          <th onClick={() => sorting("last_name")} >Contact Last Name <br />(click to sort)</th>
          <th>Contact Email</th>
          <th>Contact Phone</th>
          <th>Notes about the contact</th>
          <th>Contact for application</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact, i) => <Contact 
          contact={contact}
          onDelete={onDelete}
          onEdit={onEdit}
          key={i} />)}
      </tbody>
    </table>
  );
}

export default ContactList;