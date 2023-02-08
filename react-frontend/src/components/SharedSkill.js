import React from "react";
import DisplayButton from "./DisplayButton";

function SharedSkills({skills, handleClickAction}) {


    return (
        <div className="sharedSkill">
            {skills.map((skill) => {
                return (
                    <DisplayButton 
                        key={skill.skill_id}
                        displayObject={skill}
                        displayTitle={skill.description}
                        handleClickAction={handleClickAction} />
                )
            })}
        </div>
    )
}

export default SharedSkills