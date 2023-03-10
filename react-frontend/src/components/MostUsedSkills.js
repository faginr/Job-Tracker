import React from "react";
import UserSkillBubble from "./UserSkillBubble";
import UserSkills from "./UserSkills";

export default function MostUsedSkills({userSkills}){


    // need to sort userSkills based on the app array length
    // going to use a version of count sort to do this
    function sortByAppCount(){
        let [arrLength, minAppCount] = findArrLength()
        let highestRefSkills = []

        if(arrLength === 1){
            // max and min are the same, so return a subset of userSkills
            if(userSkills.length < 5){
                return userSkills
            } else {
                return userSkills.slice(0, 5)
            }
        }

        // create blank array with arrays as initial values so that we can
        // shove each skill in the index that matches their application length
        let sortedArray = Array.apply(null, Array(arrLength)).map(() => {
            return []
        })

        for (let skill of userSkills){
            let arrIndex = skill.applications.length - minAppCount
            sortedArray[arrIndex].push(skill)
        }

        // sorted array is now filled at each index with a list of
        // skills that have that app count (-minAppCount) from lowest
        // to highest
        for(let i=sortedArray.length-1; i>=0; i--){
            for(let skill of sortedArray[i]){
                highestRefSkills.push(skill)
                if(highestRefSkills.length === 5){
                    return highestRefSkills
                }
            }
        }
        return highestRefSkills
    }

    function findArrLength(){
        let min = Number.MAX_SAFE_INTEGER;
        let max = 0;
        for(let skill of userSkills){
            if(skill.applications.length < min){
                min = skill.applications.length
            }
            if(skill.applications.length > max){
                max = skill.applications.length
            }
        }
        if(max < min){
            return [0, 0]
        }
        return [(max-min+1), min]
    }

    const highestRefSkills = sortByAppCount()

    return(
        userSkills.length === 0 ? <div></div> 
            :
        <div>
            <h2>Most Referenced:</h2>
            <div className="most-ref-skills">
                {highestRefSkills.map((skill) => {
                    return <UserSkillBubble key={`${skill.skill_id} ${skill.description}`} skill={skill} />
                })}
            </div>
        </div>
    )
}