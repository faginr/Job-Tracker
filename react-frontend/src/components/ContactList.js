import React from 'react';
import Contact from './Contact';

function ContactList({ contacts, onDelete, onEdit }) {

  return (
    <table id="contacts">
      <thead>
        <tr>
          <th>Contact Name</th>
          <th>Contact Email</th>
          <th>Contact Phone</th>
          <th>Notes about the contact</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact, i) => <Contact contact={contact}
          onDelete={onDelete}
          onEdit={onEdit}
          key={i} />)}
      </tbody>
    </table>
  );
}

export default ContactList;