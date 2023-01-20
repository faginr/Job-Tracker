import React from 'react';
import { Link } from 'react-router-dom';
import ApplicationList from '../components/ApplicationList';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function ApplicationPage() {
  
  const [applications, setApplications] = useState([]);

  const onDelete = async id => {
    const response = await fetch(`/applications/${id}`, { method: 'DELETE' });
    if (response.status === 204) {
        setApplications(applications.filter(application => application.id !== id));
        alert("Successfully deleted the application! Click Ok to update the page.");
    } else {
        console.error(`Failed to delete application with id = ${id}, status code = ${response.status}`)
    }
};

  const loadApplications = async () => {
    const response = await fetch('/applications');
    const data = await response.json();
    setApplications(data);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <>
      <h1>Application Page</h1>

      <div>
        <p>Hello Username!</p>
        <p>List of your applications:</p>
        <ApplicationList applications={applications} onDelete={onDelete}></ApplicationList>
      </div>
    </>
  );
}

export default ApplicationPage;