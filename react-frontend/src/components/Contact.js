import React from 'react';
import { MdDeleteForever, MdEdit } from 'react-icons/md';

function Contact({ contact, onDelete, onEdit }) {
  return (
    <tr>
      <td>{contact.first_name}</td>
      <td>{contact.last_name}</td>
      <td>{contact.email}</td>
      <td>{contact.phone}</td>
      <td>{contact.notes}</td>
      <td><a href={contact.contact_at_link}>{contact.contact_at_name}</a></td>
      <td><MdEdit onClick={() => onEdit(contact)} /></td>
      <td><MdDeleteForever onClick={() => onDelete(contact.id, contact.contact_at_app_id)} /></td>
    </tr>
  );
}

export default Contact;