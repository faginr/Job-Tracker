import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

function LogInSignUp() {
    const {loginWithRedirect} = useAuth0();

    async function handleLogin(e){
        e.preventDefault()
        await loginWithRedirect()
        // callback endpoint will conditionally render a page
        // depending on if the user exists or not in datastore
    }

    async function handleSignup(e){
        e.preventDefault()
        await loginWithRedirect({
            // tell Auth0 that this is a signup event
            authorizationParams: {
                screen_hint: "signup"
            }
        })
    }

    return(
        <div className="login-signup">
            <button className="button-login" onClick={handleLogin}>
                Log In
            </button>

            <button className="button-signup" onClick={handleSignup}>
                Sign Up
            </button>
        </div>
    )
}

export default LogInSignUp 