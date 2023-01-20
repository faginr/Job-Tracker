import React from 'react';
import icon from '../images/icon.png';

function HomePage() {
  return (
    <>
      <h1>Home Page</h1>

      <div>
        <p>Hello Username!</p>
        <p>Welcome to Job Tracker, this web app allows students to track their internship/job hunting efforts!</p>
      </div>

      <img src={icon} alt="Job Search"></img>
      <br />
    </>
  );  
}

export default HomePage;