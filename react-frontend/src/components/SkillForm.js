import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import SelectMulti from "./SelectMulti"
import {MdDeleteForever} from 'react-icons/md'
import fetchRequests from "../data_model/fetchRequests";
import {useAuth0} from '@auth0/auth0-react';
import { useAPI } from "../utils/Auth0Functions";

function SkillForm({skillToEdit, userSkills, setUserSkills}) {
    const [skill, setSkill] = useState(skillToEdit)
    // used by selectMulti to keep track of what's selected, pushes app objects to
    // the array
    const [selectedApps, setSelectedApps] = useState([])
    // used by selectMulti to display list of apps
    const [applications, setApplications] = useState([])
    const {user, isAuthenticated} = useAuth0();
    const getTokenFromAuth0 = useAPI()
    const navigate = useNavigate()

    function updateSkill(e, identifier) {
        setSkill({
            ...skill,
            [identifier]: e.target.value
        })
    }

    async function handleDelete(e) {
        e.preventDefault()
        const token = await getTokenFromAuth0({redirectURI: '/skills'})
        if(isAuthenticated){
            await fetchRequests.deleteSkillFromUser(user, token, skill.skill_id)
            
            // set user skills to remove item
            let newUserSkills = userSkills.filter(userSkill=> userSkill.skill_id !== skill.skill_id) 
            setUserSkills(newUserSkills)
        }
    }

    async function sendUpdate() {
        const token = await getTokenFromAuth0({redirectURI: '/skills'})
        if(isAuthenticated){
            // send update on proficiency
            let requestBody = {'proficiency': parseInt(skill.proficiency, 10)}
            await fetchRequests.updateSkillProficiency(user, token, requestBody, skill.skill_id)
    
            // send update on tying apps to skills
            tieToApps(token)
    
            // navigate back to main page
            navigate(0)
        }
    }

    async function tieToApps(token){
        for(let app of selectedApps){
            fetchRequests.tieSkillToApp(user, token, skill.skill_id, app.id)
        }
    
    }

    async function getAllApps() {
        const token = await getTokenFromAuth0({redirectURI: '/skills'})
        if(isAuthenticated) {
            const apps = await fetchRequests.getAllApplications(user, token) 
            setApplications(apps)
        }
    }

    useEffect(() => {
        getAllApps()
    }, [user])
    
    return (
        <div id='skill-form' className='form'>
            <div>
                <h2>
                    <MdDeleteForever onClick={handleDelete}/>
                    {skillToEdit.description}
                </h2>
            </div>

            <div>
                <label>
                    Proficiency: 
                    <input
                        type="number"
                        min={1}
                        max={5}
                        placeholder={skillToEdit.proficiency}
                        onChange={(e) => {updateSkill(e, 'proficiency')}}/>
                </label>
            </div>
            <div>
                <h2>
                    Tied to Applications:
                </h2>
                <ul>
                    {skillToEdit.applications.map((app) => {
                        return (
                            <li key={app.id}>{app.title ?? "missing title"}</li>
                            )
                        })}
                </ul>
            </div>
            <div>
                <h2>
                    Add To Application:
                </h2>
                <SelectMulti 
                    items={applications.map((app) => {
                        app.label = app.title
                        app.value = app.title
                        return app
                    })}
                    selected={selectedApps}
                    setSelected={setSelectedApps}/>
                <button onClick={()=>sendUpdate()}>Confirm Updates</button>
            </div>
        </div>
    )
}

export default SkillForm