import React from 'react';
import { MdDeleteForever, MdEdit } from 'react-icons/md';

function Contact({ contact, onDelete, onEdit }) {
  return (
    <tr>
      <td>{contact.last_name}</td>
      <td>{contact.first_name}</td>
      <td>{contact.email}</td>
      <td>{contact.phone}</td>
      <td>{contact.notes}</td>
      <td>{contact.contact_at}</td>
      <td><MdEdit onClick={() => onEdit(contact)} /></td>
      <td><MdDeleteForever onClick={() => onDelete(contact.id)} /></td>
    </tr>
  );
}

export default Contact;