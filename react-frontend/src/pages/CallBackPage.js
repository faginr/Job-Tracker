import React, {useEffect, useState} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAPI } from "../utils/Auth0Functions";


const datastore_url = process.env.REACT_APP_API_SERVER_URL


function CallBackPage() {
    const {isAuthenticated, user} = useAuth0()
    const {getTokenFromAuth0} = useAPI()


    async function getUserFromAPI(){
        const accessToken = await getTokenFromAuth0()
        console.log(user.sub)
        console.log(accessToken)
        
        console.log('getting user info from datastore')
        const res = await fetch(`${datastore_url}/users/${user.sub.slice(6)}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
        return res
    }


    async function createUser() {
        const accessToken = await getTokenFromAuth0()
        console.log('creating user in datastore')
        const res = await fetch(`${datastore_url}/users`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        if (res.status !== 204) {
            alert('Whoops... this is embarassing. I couldn\'t create the user in datastore.')
        }
    }

    async function handleUserLogin() {
        
        const res = await getUserFromAPI()
        switch (res.status){
            case 401:
                alert(`Whoops... It looks like there's a problem with your access token.`)
                break;
            case 403:
                alert(`Whoops... user ID and access token don't match`)
                break;
            case 404:
                createUser()
                // TODO: navigate to page to guide user through adding apps and skills
                break;
            default:
                alert(`Whoops... I got a response of ${res.status} from our API`)
        }
    
    }

    useEffect(() => {
        if(isAuthenticated){
            handleUserLogin()
        }
        // run this effect every time user value changes
    }, [user])

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
