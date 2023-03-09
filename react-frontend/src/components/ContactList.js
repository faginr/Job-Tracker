import React from 'react';
import Contact from './Contact';

function ContactList({ contacts, onDelete, sorting }) {
  
  return (
    <table id="contacts" className='contact-table'>
      <thead>
        <tr>
          <th onClick={() => sorting("first_name")} >First Name <br />(click to sort)</th>
          <th onClick={() => sorting("last_name")} >Last Name <br />(click to sort)</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Info about the contact</th>
          <th>Related to job</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact, i) => <Contact 
          contact={contact}
          onDelete={onDelete}
          key={i} />)}
      </tbody>
    </table>
  );
}

export default ContactList;