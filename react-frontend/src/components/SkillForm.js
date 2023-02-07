import React, {useState} from "react";

function SkillForm({skillToEdit, setFeaturePane}) {
    const [skill, setSkill] = useState(skillToEdit===undefined?{}:skillToEdit)

    function updateSkill(e, identifier) {
        setSkill({
            ...skill,
            [identifier]: e.target.value
        })
    }

    function handleSubmit(e) {
        e.preventDefault()
        setFeaturePane()
    }
    
    return (
        <div className="SkillForm">
            <label>
                Description:
                <input 
                    type="text" 
                    placeholder={skillToEdit===undefined?'e.g. Python':skillToEdit.description} 
                    onChange={(e) => {updateSkill(e, 'description')}}/>
            </label>
            <label>
                Proficiency: 
                <input
                    type="text"
                    placeholder={skillToEdit===undefined?'1-5':skillToEdit.proficiency}
                    onChange={(e) => {updateSkill(e, 'proficiency')}}/>
            </label>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default SkillForm