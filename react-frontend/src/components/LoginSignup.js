import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

function LogInSignUp() {
    const {loginWithRedirect} = useAuth0();

    async function handleLogin(e){
        e.preventDefault()
        console.log("logging in...")
        await loginWithRedirect({
            // tell Auth0 to take them from /callback to /applications
            appState: {
                returnTo: "/applications"
            }
        })
    }

    async function handleSignup(e){
        e.preventDefault()
        console.log("signing up...")
        await loginWithRedirect({
            // tell Auth0 to take them from /callback to /applications
            appState: {
                returnTo: "/applications"
            },
            // tell Auth0 that this is a signup event
            authorizationParams: {
                screen_hint: "signup"
            }
        })
    }

    return(
        <div className="login-signup">
            <button onClick={handleLogin}>
                Log In
            </button>

            <button onClick={handleSignup}>
                Sign Up
            </button>
        </div>
    )
}

export default LogInSignUp 