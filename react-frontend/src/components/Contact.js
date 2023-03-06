import React from 'react';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import AppsNamesLinks from './AppsNamesLinks';
import EditContactPage from '../pages/EditContactPage';
import SlidingWindow from './SlidingWindow';


function Contact({ contact, onDelete }) {

  return (
    <tr >
      <td>{contact.first_name}</td>
      <td>{contact.last_name}</td>
      <td>{contact.email}</td>
      <td>{contact.phone}</td>
      <td>{contact.notes}</td>
      <td>{contact.arrayAppsNames.map((application, i) => <AppsNamesLinks
        application={application}
        key={i} />)}</td>
      <td>
        <SlidingWindow 
          Page={<EditContactPage typeToEdit={contact} />}
          ClickableComponent={<MdEdit className='edit-button'/>} 
          />
      </td>
      <td><MdDeleteForever className='delete-button' onClick={() => onDelete(contact.id, contact.contact_at_app_id)} /></td>
    </tr>
  )
};

export default Contact;