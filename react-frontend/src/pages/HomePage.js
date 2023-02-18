import { setUser } from '../utils/User';
import React from 'react';
import icon from '../images/icon.png';
import LogInSignUp from '../components/LoginSignup';

function HomePage() {
  function updateUser(e, desiredUser) {
    e.preventDefault()

    if (desiredUser === "user1") {
      setUser('{"username": "tester1", "sub": "1234567890"}')
    } else if (desiredUser === "user2"){
      setUser('{"username": "tester2", "sub": "2345678901"}')
    } else {
      setUser('{"username": "noexist", "sub": "1111111111"}')
    }
  }

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