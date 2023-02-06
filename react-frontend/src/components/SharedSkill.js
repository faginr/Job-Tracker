import React from "react";
import DisplayButton from "./DisplayButton";

function SharedSkills({skills, setShowForm, setObjectToEdit}) {
    return (
        <div className="sharedSkill">
            {skills.map((skill) => {
                return (
                    <DisplayButton key={skill.skill_id} displayObject={skill} displayTitle={skill.description} setShowForm={setShowForm} setObjectToEdit={setObjectToEdit} />
                )
            })}
        </div>
    )
}

export default SharedSkills