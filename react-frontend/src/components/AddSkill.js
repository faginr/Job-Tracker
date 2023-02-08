import React, {useState, useEffect} from "react";
import { user } from "./User";

function AddSkill({handleSkillClick}) {
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

    async function addSkillToUser(skill) {
        const response = await fetch(`/users/${JSON.parse(user).sub}/skills/${skill.id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`
            }, 
        })
        if (response.status !== 200) {
            alert(`Uh-oh, I couldn\'t tie ${skill.description} to user!`)
            return
        }
    }

    async function handleSkillSelection(skill) {
        await addSkillToUser(skill)
        handleSkillClick()
    }

    useEffect(()=>{loadAllSkills()}, [])

    return(
        <div className="add-skill">
            <ul>
                {allSkills.map((skill) => {
                    return(
                        <li key={skill.id} 
                            onClick={() => handleSkillSelection(skill)}>
                                {skill.description}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default AddSkill