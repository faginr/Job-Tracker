import React from 'react';
import Application from './Application';

function ApplicationList({ applications, onDelete }) {
  return (
    <table id="applications">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Skill</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((application, i) => <Application application={application}
          onDelete={onDelete}
          key={i} />)}
      </tbody>
    </table>
  );
}

export default ApplicationList;