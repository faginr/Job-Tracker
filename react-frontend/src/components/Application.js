import React from 'react';
import { MdDeleteForever, MdEdit } from 'react-icons/md';

function Application({ application, onDelete, onEdit }) {
  return (
    <tr>
      <td>{application.title}</td>
      <td>{application.description}</td>
      <td>{application.skills}</td>
      <td>{application.contacts}</td>
      <td>{application.posting_date}</td>
      <td>{application.status}</td>
      <td><a href={application.link}>{application.link}</a></td>
      <td><MdEdit onClick={() => onEdit(application)} /></td>
      <td><MdDeleteForever onClick={() => onDelete(application.id)} /></td>
    </tr>
  );
}

export default Application;