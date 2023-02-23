import React from "react";
import SlidingWindow from "./SlidingWindow";
import SkillForm from "./SkillForm"
import UserSkillBubble from "./UserSkillBubble";

function UserSkills({userSkills, skillsModified, setSkillsModified}) {

    function alertSkill(skill) {
        return (
            <SlidingWindow key={skill.skill_id} 
                Page={<SkillForm skillToEdit={skill} skillsModified={skillsModified} setSkillsModified={setSkillsModified}/>}
                ClickableComponent= {<UserSkillBubble 
                                        className="alert-skill"
                                        key={skill.skill_id}
                                        skill={skill} />}
                />
        )
    }

    function normalSkill(skill) {
        return (
            <SlidingWindow key={skill.skill_id}
                Page={<SkillForm skillToEdit={skill} skillsModified={skillsModified} setSkillsModified={setSkillsModified}/>}
                ClickableComponent= {<UserSkillBubble 
                                        className="regular-skill"
                                        key={skill.skill_id}
                                        skill={skill} />}
                />
        )
    }

    // split skill display out by competency
    return (
        <div className="user-skills">
            <p>High Proficiency Skills</p>
            <div className="high-prof-skills">
                {/* user skills in the 4/5 proficiency category */}
                {userSkills?.high?.map((skill) => {
                    return (normalSkill(skill))
                })}
            </div>
            <hr />

            <p>Medium Proficiency Skills</p>
            <div className='med-prof-skills'>
                {/* user skills in the 2/3 proficiency category */}
                {/* color RED if on more than 5 applications */}
                {userSkills?.med?.map((skill) => {
                    return (skill.applications.length > 5 ? alertSkill(skill) : normalSkill(skill))
                })}
            </div>
            <hr />

            <p>Low Proficiency Skills</p>
            <div className="low-prof-skills">
                {/* user skills in the null/1 proficiency category */}
                {/* color RED if on more than 2 applications */}
                {userSkills?.low?.map((skill) => {
                    return(skill.applications.length > 2 ? alertSkill(skill) : normalSkill(skill))
                })}
            </div>
            <hr />
        </div>
    )
}

export default UserSkills