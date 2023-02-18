import { setUser } from '../utils/User';
import React from 'react';
import icon from '../images/icon.png';
import LogInSignUp from '../components/LoginSignup';

function HomePage() {

  return (
    <div>
      <h1>Home Page</h1>

      <div>
        <p>Welcome to Job Tracker, this web app allows students to track their internship/job hunting efforts!</p>
      </div>

      <img src={icon} alt="Job Search"></img>
      <div>Source of the image:
        <br />https://eecs.engineering.oregonstate.edu 
        <br />from the Job Tracker project description
        <LogInSignUp />
      </div>
      <br /><br />
    </div>
  );  
}

export default HomePage;