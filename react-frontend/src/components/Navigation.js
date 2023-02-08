// A set of global <Link>s to each page according to the <Route>s in App.js.

import React from "react";
import { NavLink } from 'react-router-dom';

function Navigation ({setFeatureObj}) {

  function handleClick() {
    setFeatureObj()
  }

  return (
    <nav className="navigation-bar">
        <div className="App-link" onClick={handleClick}>
          <NavLink to="/">Home</NavLink>
        </div>
        <div className="App-link" onClick={handleClick}>
          <NavLink to="/applications">Applications</NavLink>
        </div>
        <div className="App-link" onClick={handleClick}>
          <NavLink to="/skills">Skills</NavLink>
        </div>
        <div className="App-link" onClick={handleClick}>
          <NavLink to="/contacts">Contacts</NavLink>
        </div>
    </nav>
  );
}

export default Navigation;