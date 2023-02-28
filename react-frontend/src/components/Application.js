import React from 'react';
import { MdDeleteForever, MdEdit, MdLabel } from 'react-icons/md';
import EditApplicationPage from '../pages/EditApplicationPage'
import SlidingWindow from './SlidingWindow';

function Application({ application, onDelete }) {
  // console.log(application)
  return (
    <div className='card'>
      <h3>{application.title}</h3>
      <p className='app-description'>{application.description}</p>
      <ul className='view-app-list'><span><em>Skills: </em></span>{application.skill_names.map((skill) => (<li key={skill}>{skill}</li>))}</ul>
      <ul className='view-app-list'><span><em>Contacts: </em></span>{application.contact_names.map((contact) => (<li key={contact}>{contact}</li>))}</ul>
      <p className='app-item'><span><em>Posted: </em></span>{application.posting_date}</p>
      <p className='app-item'><span><em>Status: </em></span>{application.status}</p>
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
    // <tr>
    //   <td>{application.title}</td>
    //   <td className='app-description'>{application.description}</td>
    //   <td><ul className='view-app-list'>{application.skill_names.map((skill) => (<li key={skill}>{skill}</li>))}</ul></td>
    //   <td><ul className='view-app-list'>{application.contact_names.map((contact) => (<li key={contact}>{contact}</li>))}</ul></td>
    //   <td>{application.posting_date}</td>
    //   <td>{application.status}</td>
    //   <td><a href={application.link}>{application.link}</a></td>
    //   <td>
    //     <SlidingWindow 
    //       Page={<EditApplicationPage typeToEdit={application}/>}
    //       ClickableComponent={<MdEdit/>} />
    //   </td>
    //   {/* <td><MdEdit onClick={() => onEdit(application)} /></td> */}
    //   <td><MdDeleteForever onClick={() => onDelete(application.id,application.contacts,application.skills)} /></td>
    // </tr>
    );
}

export default Application;