import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAPI } from "../utils/Auth0Functions";
import fetchRequests from "../data_model/fetchRequests";


function CallBackPage() {
    const {isAuthenticated, user} = useAuth0()
    const getTokenFromAuth0 = useAPI()
    const navigate = useNavigate()

    async function handleUserLogin(token) {
        
        const res = await fetchRequests.getUserResponseObject(user, token)
        switch (res.status){
            case 200:
                navigate('/applications')
                break;
            case 401:
                // fallthrough to 403 because same action
            case 403:
                alert(`Unable to complete login at this time.`)
                navigate('/')
                break;
            case 404:
                try{
                    await fetchRequests.createUser(user, token)
                } catch(e){
                    alert('Unable to create a new user at this time.')
                    navigate('/')
                    break;
                }
                // TODO: navigate to page to guide user through adding apps and skills
                navigate('/applications')
                break;
            default:
                alert(`Whoops... I got a response of ${res.status} from our API`)
                navigate('/')
        }
    
    }

    useEffect(() => {
        if(isAuthenticated){
            getTokenFromAuth0().then((token) => {
                handleUserLogin(token)
            })
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
