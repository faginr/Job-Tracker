import React from 'react';
import { MdDeleteForever, MdEdit } from 'react-icons/md';

function Application({ application, onDelete }) {
  return (
    <tr>
      <td>{application.name}</td>
      <td>{application.description}</td>
      <td>{application.skill}</td>
      <td>Edit</td>
      <td><MdDeleteForever onClick={() => onDelete(application.id)} /></td>
    </tr>
  );
}

export default Application;