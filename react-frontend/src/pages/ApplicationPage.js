import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApplicationList from '../components/ApplicationList';
import { useState, useEffect } from 'react';

function ApplicationPage({ setApplicationToEdit }) {
  
  const [applications, setApplications] = useState([]);

  const navigate = useNavigate();

  const onDelete = async id => {
    const response = await fetch(`/applications/${id}`, { method: 'DELETE' });
    if (response.status === 204) {
        setApplications(applications.filter(application => application.id !== id));
        alert("Successfully deleted the application! Click Ok to update the page.");
    } else {
        console.error(`Failed to delete application with id = ${id}, status code = ${response.status}`)
    }
  };

  const onEdit = application => {
    setApplicationToEdit(application);
    navigate("/edit-application");
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
        <ApplicationList 
          applications={applications} 
          onDelete={onDelete}
          onEdit={onEdit}></ApplicationList>
        <p>
          <Link to="/add-application">Add a New Application</Link>
        </p>
      </div>
    </>
  );
}

export default ApplicationPage;