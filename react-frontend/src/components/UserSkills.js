import React, {useEffect, useState} from "react";
import SlidingWindow from "./SlidingWindow";
import SkillForm from "./SkillForm"
import UserSkillBubble from "./UserSkillBubble";

function UserSkills({userSkills, setUserSkills}) {
    const [proficiency, setProficiency] = useState(0)
    const [skillsMap, setSkillsMap] = useState({
        "A": [], "B": [], "C": [], "D": [], "E": [], "F": [], "G": [],
        "H": [], "I": [], "J": [], "K": [], "L": [], "M": [], "N": [],
        "O": [], "P": [], "Q": [], "R": [], "S": [], "T": [], "U": [],
        "V": [], "W": [], "X": [], "Y": [], "Z": [], "Other": [],
    })

    function alertSkill(skill) {
        return (
            <SlidingWindow key={skill.skill_id} 
                Page={<SkillForm skillToEdit={skill} userSkills={userSkills} setUserSkills={setUserSkills}/>}
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
                Page={<SkillForm skillToEdit={skill} userSkills={userSkills} setUserSkills={setUserSkills}/>}
                ClickableComponent= {<UserSkillBubble 
                                        className="regular-skill"
                                        key={skill.skill_id}
                                        skill={skill} />}
                />
        )
    }
        
    function groupSkills() {
        let newSkillsMap = createBlankSkillMap()
        for(let skill of userSkills) {
            try{
                newSkillsMap[skill.description[0]].push(skill)
            } catch(e){
                newSkillsMap.Other.push(skill)
            }
        }
        setSkillsMap(newSkillsMap)
    }

    function filterSkillsByProf(){
        if(proficiency === 0){
            return skillsMap
        } 
        if(proficiency === 6){
            return filterForNull()
        }
        
        const newSkillMap = createBlankSkillMap()
        
        // loop through skillsMap and filter based on prof
        for(let letter in skillsMap){
            for(let skill of skillsMap[letter]){
            if(skill.proficiency === proficiency){
                newSkillMap[letter].push(skill)
                }
            }
        }
        return newSkillMap
    }

    function filterForNull(){
        const newSkillMap = createBlankSkillMap()
        for(let letter in skillsMap){
            for(let skill of skillsMap[letter]){
            if(skill.proficiency == undefined){
                newSkillMap[letter].push(skill)
            }
            }
        }
        return newSkillMap
    }

    function createBlankSkillMap(){
        // create blank copy of skillsMap
        const newSkillMap = {}
        for(let letter in skillsMap){
            newSkillMap[letter] = []
        }
        return newSkillMap
    }
    
    useEffect(() => {
        groupSkills()        
    }, [userSkills])
    
    const filteredSkillMap = filterSkillsByProf()

    return (
        <div>
            <h2>All:</h2>
            <label>
            Filter By Proficiency: 
            <select onChange={(e)=>setProficiency(parseInt(e.target.value))}>
                <option value={0}>--No Filter--</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>No Rating</option>
            </select>
            </label>
            <div className="grouped-skills">
                {Object.keys(filteredSkillMap).map((letter) => {
                    
                    return (
                        <div className="grouped-skills-container" key={letter}> 
                            <div className="grouped-skills-category">
                                {letter}
                            </div>
                            {filteredSkillMap[letter].map((skill)=>{
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

        </div>
    )
}

export default UserSkills