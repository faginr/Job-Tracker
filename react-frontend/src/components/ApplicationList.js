import React from 'react';
import Application from './Application';

function ApplicationList({ applications, onDelete, onEdit }) {
  return (
    <table id="applications">
      <thead>
        <tr>
          <th>Job Title</th>
          <th>Job Description</th>
          <th>Relevant Skills</th>
          <th>Contacts</th>
          <th>Job Posting Date</th>
          <th>Applcation Status</th>
          <th>External Link</th>
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