import React from 'react';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import EditApplicationPage from '../pages/EditApplicationPage'
import SlidingWindow from './SlidingWindow';

function Application({ application, onDelete }) {
  return (
    <div className='card'>
      <h3>{application.title}</h3>
      <p className='app-description'>{application.description}</p>
      <ul className='view-app-list'><span><strong><em>Skills: </em></strong></span>{application.skill_names.map((skill) => (<li key={skill}>{skill}</li>))}</ul>
      <ul className='view-app-list'><span><strong><em>Contacts: </em></strong></span>{application.contact_names.map((contact) => (<li key={contact}>{contact}</li>))}</ul>
      <p className='app-item'><span><strong><em>Posted: </em></strong></span>{application.posting_date}</p>
      <p className='app-item'><span><strong><em>Status: </em></strong></span>{application.status}</p>
      <p className='app-item'><a href={application.link}>{application.link}</a></p>
      <div className='button-group'>
        <div className='edit-button'>
          <SlidingWindow
                Page={<EditApplicationPage typeToEdit={application}/>}
                ClickableComponent={<MdEdit/>} />
        </div>
        <div className="delete-button">
          <MdDeleteForever onClick={() => onDelete(application.id,application.contacts,application.skills)} />
        </div>
      </div>
    </div>
    );
}

export default Application;