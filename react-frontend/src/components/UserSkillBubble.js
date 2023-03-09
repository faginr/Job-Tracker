import React from "react";

// progress bar obtained from here: https://www.npmjs.com/package/@ramonak/react-progress-bar
import ProgressBar from '@ramonak/react-progress-bar';


export default function UserSkillBubble({skill, className}) {
    function reactProgressBar(skill){
        const max = 5
        let completed = skill.proficiency
        let bgColor = "white"
        let background = "grey"
        switch (completed){
            case 1:
                bgColor = "red"
                break;
            case 2:
            case 3:
                bgColor = "orange"
                break;
            case 4:
            case 5:
                bgColor = "green"
                break;
            default:
                completed = 0
                background = "grey"
                break;
        }
        
        return <ProgressBar 
                    completed={completed}
                    maxCompleted={max}
                    bgColor={bgColor}
                    labelColor="black"
                    baseBgColor={background}
                    customLabel={`${completed}`} />
    }


    return(
        <div className={`skills ${className}`}>
            <div className="skill-description">
                {skill.description}
            </div>
            <div className="skill-app-count">
                App Count: {skill.applications.length}
            </div>
            <div className="skill-proficiency">
                Proficiency:
                {reactProgressBar(skill)}
            </div>
        </div>
    )
}