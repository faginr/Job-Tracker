import React from "react";
import DisplayButton from "./DisplayButton";

function UserSkills({userSkills, handleClickAction}) {


    return (
        <div className="sharedSkill">
            {userSkills.map((skill) => {
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

export default UserSkills