// A set of global <Link>s to each page according to the <Route>s in App.js.

import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { NavLink } from 'react-router-dom';
import { LogoutButton } from "./LogOut";

function Navigation ({setFeatureChild}) {

  const {isAuthenticated} = useAuth0()

  function handleClick() {
    setFeatureChild()
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

        {/* Only display logout button if authenticated */}
        {(isAuthenticated && <LogoutButton />)}
    </nav>
  );
}

export default Navigation;