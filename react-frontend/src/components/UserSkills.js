import React from "react";
import UserSkillBubble from "./UserSkillBubble";

function UserSkills({userSkills}) {

    function alertSkill(skill) {
        return (
            <UserSkillBubble 
                className="alert-skill"
                key={skill.skill_id}
                skill={skill}
                 />
        )
    }

    function normalSkill(skill) {
        return (
            <UserSkillBubble 
                className="regular-skill"
                key={skill.skill_id}
                skill={skill}
                 />
        )
    }

    // split skill display out by competency
    return (
        <div className="user-skills">
            <div className="high-prof-skills">
                {/* user skills in the 4/5 proficiency category */}
                <p>High Proficiency Skills</p>
                {userSkills?.high?.map((skill) => {
                    return (normalSkill(skill))
                })}
            </div>
            <hr />

            <div className='med-prof-skills'>
                {/* user skills in the 2/3 proficiency category */}
                {/* color RED if on more than 5 applications */}
                <p>Medium Proficiency Skills</p>
                {userSkills?.med?.map((skill) => {
                    return (skill.applications.length > 5 ? alertSkill(skill) : normalSkill(skill))
                })}
            </div>
            <hr />

            <div className="low-prof-skills">
                {/* user skills in the null/1 proficiency category */}
                {/* color RED if on more than 2 applications */}
                <p>Low Proficiency Skills</p>
                {userSkills?.low?.map((skill) => {
                    return(skill.applications.length > 2 ? alertSkill(skill) : normalSkill(skill))
                })}
            </div>
            <hr />
        </div>
    )
}

export default UserSkills