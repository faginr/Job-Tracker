// A set of global <Link>s to each page according to the <Route>s in App.js.

import React from "react";
import { NavLink } from 'react-router-dom';

function Navigation () {
  return (
    <nav>
      <p>Click one of the tabs to navigate to:</p>
      <h4>
        <NavLink className="App-link" to="/">Home Page</NavLink>
        <> </>
        <NavLink className="App-link"to="/applications">Application Page</NavLink>
        <> </>
        <NavLink className="App-link" to="/skills">Skill Page</NavLink>
        <> </>
        <NavLink className="App-link" to="/contacts">Contact Page</NavLink>
      </h4>
    </nav>
  );
}

export default Navigation;