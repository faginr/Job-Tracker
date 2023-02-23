import React, {useEffect, useState} from "react";
import { user } from "../utils/User";
import SelectMulti from "./SelectMulti"
import {MdDeleteForever} from 'react-icons/md'
import fetchRequests from "../data_model/fetchRequests";

function SkillForm({skillToEdit, skillsModified, setSkillsModified}) {
    const [skill, setSkill] = useState(skillToEdit)
    const [selectedApps, setSelectedApps] = useState([])
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

    async function sendUpdate(skill) {
        let requestBody = {'proficiency': parseInt(skill.proficiency, 10)}
        await fetchRequests.updateSkillProficiency(user, user, requestBody, skill.skill_id)

        // call setSkillsModified to refresh the skills page
        setSkillsModified(skillsModified+1)
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
            <button onClick={()=>sendUpdate(skill)}>Submit</button>
            <div>
                <h2>
                    Tied to Applications:
                    <ul>
                        {skillToEdit.applications.map((app) => {
                            return (
                                <li>{app.title ?? "missing title"}</li>
                                )
                            })}
                    </ul>
                </h2>
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
            </div>
        </div>
    )
}

export default SkillForm