import { setUser } from '../components/User';
import React from 'react';
import icon from '../images/icon.png';

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
    <>
      <h1>Home Page</h1>

      <div>
        <p>Select a button below to act as a certain user:</p>
        <button onClick={(e)=> updateUser(e, 'user1')}>User 1</button>
        <button onClick={(e)=> updateUser(e, 'user2')}>User 2</button>
        <button onClick={(e)=> updateUser(e, '')}>Non-Existent</button>
        <p>Welcome to Job Tracker, this web app allows students to track their internship/job hunting efforts!</p>
      </div>

      <img src={icon} alt="Job Search"></img><br />
      <>Source of the image:
        <br />https://eecs.engineering.oregonstate.edu 
        <br />from the Job Tracker project description
      </>
      <br /><br />
    </>
  );  
}

export default HomePage;