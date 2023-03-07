// A set of global <Link>s to each page according to the <Route>s in App.js.

import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { NavLink } from 'react-router-dom';
import { LogoutButton } from "./LogOut";

function Navigation () {

  const {isAuthenticated} = useAuth0()

  return (
    isAuthenticated?
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

        {/* Only display logout button if authenticated */}
        {(isAuthenticated && <LogoutButton />)}
    </nav>
    :
    <nav className="navigation-bar nav-spacer">
        <div className="App-link" >
          <NavLink to="#">Home</NavLink>
        </div>
        <div className="App-link" >
          <NavLink to="#">Applications</NavLink>
        </div>
        <div className="App-link" >
          <NavLink to="#">Contacts</NavLink>
        </div>
        <div className="App-link" >
          <NavLink to="#">Skills</NavLink>
        </div>
    </nav>
    
  );
}

export default Navigation;