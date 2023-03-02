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

    // split skill display out by first letter
    const alphabet = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
        "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", 
        "U", "V", "W", "X", "Y", "Z", "Other"
        ]
    
    return (
        <div className="grouped-skills">
            {alphabet.map((letter) => {
                return (
                    <div className="grouped-skills-container" key={letter}> 
                        <div className="grouped-skills-category">
                            {letter}
                        </div>
                        {userSkills[letter]?.map((skill)=>{
                            return skill.proficiency < 2 && skill.applications.length > 3 
                                ?
                                    alertSkill(skill) 
                                :
                                    normalSkill(skill)
                        })}
                    </div>
                )
            })}

        </div>
    )
}

export default UserSkills