import React from 'react';
import Application from './Application';

function ApplicationList({ applications, onDelete, onEdit }) {

  return (
    <table id="applications">
      <thead>
        <tr>
          <th>Job Name</th>
          <th>Job Description</th>
          <th>Required Skills</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((application, i) => <Application application={application}
          onDelete={onDelete}
          onEdit={onEdit}
          key={i} />)}
      </tbody>
    </table>
  );
}

export default ApplicationList;