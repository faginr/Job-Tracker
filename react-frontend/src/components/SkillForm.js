import React, {useState} from "react";
import { user } from "../utils/User";
import { datastore_url } from "../utils/Constants";

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

    async function handleDelete(e) {
        e.preventDefault()
        const response = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/skills/${skill.skill_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user}`,
            }
        })
        if (response.status !== 200) {
            alert("Uh-oh, I had trouble deleting this skill")
        }
        handleFormSubmittal()
    }

    async function sendUpdate(skill) {
        const response = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/skills/${skill.skill_id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${user}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'proficiency': parseInt(skill.proficiency, 10)})
        })
        if (response.status !== 204) {
            alert("Uh-oh, something went wrong with updating the skill")
        }
    }

    async function sendNew(skill) {
        const response = await fetch(`${datastore_url}/skills`, {
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
                <h2>
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
                        placeholder={skillToEdit?skill.proficiency:1}
                        onChange={(e) => {updateSkill(e, 'proficiency')}}/>
                </label>
            </div>
            <button onClick={handleSubmit}>Submit</button>
            <div>
                <h2>
                    Tied to Applications:
                    <ul>
                        {skillToEdit?.applications.map((app) => {
                            return (
                                <li>{app.title ?? "missing title"}</li>
                                )
                            })}
                    </ul>
                </h2>
            </div>
            <div>
                <h2>
                    Ability to add application here?
                </h2>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}

export default SkillForm