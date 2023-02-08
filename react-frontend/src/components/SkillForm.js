import React, {useEffect, useState} from "react";
import { user } from "./User";

function SkillForm({skillToEdit, handleFormSubmittal}) {
    const [skill, setSkill] = useState(skillToEdit===undefined?{}:skillToEdit)

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
    
    return (
        <div id='skill-form' className='form'>
            <div>
                <label>
                    Description:
                    <input 
                        type="text" 
                        readOnly={skillToEdit?true:false}
                        placeholder={skillToEdit?skill.description:'e.g. Python'} 
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
                        value={skillToEdit?skill.proficiency:1}
                        onChange={(e) => {updateSkill(e, 'proficiency')}}/>
                </label>
            </div>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default SkillForm