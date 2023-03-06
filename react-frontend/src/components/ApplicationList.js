import React from 'react';
import Application from './Application';

function ApplicationList({ applications, onDelete }) {
  return (
    <div id="applications">
        {applications.map((application, i) => <Application
        application={application}
        onDelete={onDelete}
        key={i}
        />)}
    </div>
  );
}

export default ApplicationList;