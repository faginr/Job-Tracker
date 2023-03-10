import React from 'react';
import icon from '../images/icon.png';
import LogInSignUp from '../components/LoginSignup';
import {useAuth0} from '@auth0/auth0-react'

function HomePage() {
  const {isAuthenticated} = useAuth0()

  return (
    <div>
      <h1>Home Page</h1>

      <div>
        <p>Welcome to Job Tracker, this web app allows students to track their internship/job hunting efforts!</p>
      </div>

      <img src={icon} alt="Job Search"></img>
      <div className='credit'>Source of the image:
        <br />https://eecs.engineering.oregonstate.edu 
        <br />from the Job Tracker project description
        {!isAuthenticated?<LogInSignUp />:<div></div>}
      </div>
      <br /><br />
    </div>
  );  
}

export default HomePage;
