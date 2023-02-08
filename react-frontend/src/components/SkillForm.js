import React, {useEffect, useState} from "react";
import { user } from "./User";

function SkillForm({skillToEdit, handleFormSubmittal}) {
    const [skill, setSkill] = useState(skillToEdit===undefined?{}:skillToEdit)
    const [allSkills, setAllSkills] = useState([])

    async function loadAllSkills() {
        const response = await fetch('/skills', {
            headers: {
                'Authorization': `Bearer ${user}`
            }
        })
        if (response.status !== 200) {
            alert('Uh-oh, I couldn\'t load all the skills in DS!')
            return
        }

        const data = await response.json()
        setAllSkills(data)
    }

    function updateSkill(e, identifier) {
        setSkill({
            ...skill,
            [identifier]: e.target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        skillToEdit ?  await sendUpdate(skill) : await sendNew(skill)
        handleFormSubmittal()
    }

    async function sendUpdate(skill) {
        const response = await fetch(`users/${JSON.parse(user).sub}/skills/${skill.skill_id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${user}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'proficiency': parseInt(skill.proficiency, 10)})
        })
        if (response.status !== 200) {
            alert("Uh-oh, something went wrong with updating the skill")
        }
    }

    async function sendNew(skill) {
        const response = await fetch(`/skills`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(skill)
        })
        if (response.status !== 201) {
            alert("Uh-oh, something went wrong with creating a new skill")
        }
    }

    useEffect(() => {loadAllSkills()}, [])
    
    return (
        <div id='skill-form' className='feature-pane'>
            <div>
                <label>
                    Description:
                    <input 
                        type="text" 
                        placeholder={skill.description ?? 'e.g. Python'} 
                        onChange={(e) => {updateSkill(e, 'description')}}/>
                </label>
            </div>
            <div>
                <label>
                    Proficiency: 
                    <input
                        type="number"
                        min={1}
                        max={5}
                        value={skill.proficiency ?? 1}
                        onChange={(e) => {updateSkill(e, 'proficiency')}}/>
                </label>
            </div>
            <button onClick={handleSubmit}>Submit</button>
            {skillToEdit!==undefined?<div/>:(
                <div>
                    <ul>
                        {allSkills.map((skill) => {return(<li>{skill.description}</li>)})}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default SkillForm