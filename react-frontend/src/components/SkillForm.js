import React, {useEffect, useState} from "react";
import { user } from "../utils/User";
import SelectMulti from "./SelectMulti"
import {MdDeleteForever} from 'react-icons/md'
import fetchRequests from "../data_model/fetchRequests";

function SkillForm({skillToEdit, skillsModified, setSkillsModified}) {
    const [skill, setSkill] = useState(skillToEdit)
    // used by selectMulti to keep track of what's selected, pushes app objects to
    // the array
    const [selectedApps, setSelectedApps] = useState([])
    // used by selectMulti to display list of apps
    const [applications, setApplications] = useState([])

    function updateSkill(e, identifier) {
        setSkill({
            ...skill,
            [identifier]: e.target.value
        })
    }

    async function handleDelete(e) {
        e.preventDefault()
        await fetchRequests.deleteSkillFromUser(user, user, skill.skill_id)
        
        // call setSkillsModified to refresh the skills page
        setSkillsModified(skillsModified+1)
    }

    async function sendUpdate() {
        // send update on proficiency
        let requestBody = {'proficiency': parseInt(skill.proficiency, 10)}
        await fetchRequests.updateSkillProficiency(user, user, requestBody, skill.skill_id)

        // send update on tying apps to skills
        tieToApps()

        // call setSkillsModified to refresh the skills page
        setSkillsModified(skillsModified+1)
    }

    async function tieToApps(){
        for(let app of selectedApps){
            fetchRequests.tieSkillToApp(user, user, skill.skill_id, app.id)
        }
    }

    async function getAllApps() {
        const apps = await fetchRequests.getAllApplications(user, user) 
        setApplications(apps)
    }

    useEffect(() => {
        getAllApps()
    }, [])
    
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
                            <li>{app.title ?? "missing title"}</li>
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