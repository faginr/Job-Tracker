import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { datastore_url } from "../utils/Constants";


function CallBackPage() {
    const {isLoading, isAuthenticated, user, getAccessTokenSilently} = useAuth0()

    async function checkUserExistsInDatabase(){
        if (isAuthenticated) {
            console.log(user.sub)
            try{
                const accessToken = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: 'Datastore',
                        scope: 'read:posts'
                    }
                })
                console.log(accessToken)
            } catch(e) {
                console.error(e)
            }
            const res = await fetch(`${datastore_url}/users/${user.sub.slice(6)}`)
            console.log(res.status)
            const message = await res.json()
            console.log(message)
        }
    }

    checkUserExistsInDatabase()

    return (
        <div>
            {/* 
            Since header, nav, and footer are all defined on the App page,
            nothing needed here
             */}
             
        </div>
    )
}

export default CallBackPage
