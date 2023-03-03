// A set of global <Link>s to each page according to the <Route>s in App.js.

import React from "react";
import { NavLink } from 'react-router-dom';

function Navigation () {

  return (
    <nav className="navigation-bar">
        <div className="App-link" >
          <NavLink to="/">Home</NavLink>
        </div>
        <div className="App-link" >
          <NavLink to="/applications">Applications</NavLink>
        </div>
        <div className="App-link" >
          <NavLink to="/contacts">Contacts</NavLink>
        </div>
        <div className="App-link" >
          <NavLink to="/skills">Skills</NavLink>
        </div>
    </nav>
  );
}

export default Navigation;