import React from 'react';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import EditApplicationPage from '../pages/EditApplicationPage'
import SlidingWindow from './SlidingWindow';

function Application({ application, onDelete }) {
  // console.log(application)
  return (
    <tr>
      <td>{application.title}</td>
      <td>{application.description}</td>
      <td><ul className='view-app-list'>{application.skill_names.map((skill) => (<li key={skill}>{skill}</li>))}</ul></td>
      <td><ul className='view-app-list'>{application.contact_names.map((contact) => (<li key={contact}>{contact}</li>))}</ul></td>
      <td>{application.posting_date}</td>
      <td>{application.status}</td>
      <td><a href={application.link}>{application.link}</a></td>
      <td>
        <SlidingWindow 
          Page={<EditApplicationPage typeToEdit={application}/>}
          ClickableComponent={<MdEdit/>} />
      </td>
      {/* <td><MdEdit onClick={() => onEdit(application)} /></td> */}
      <td><MdDeleteForever onClick={() => onDelete(application.id,application.contacts,application.skills)} /></td>
    </tr>
  );
}

export default Application;