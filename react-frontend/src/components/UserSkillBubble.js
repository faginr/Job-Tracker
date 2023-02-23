import React from "react";

export default function UserSkillBubble({skill, className}) {
    return(
        <div className={`skills ${className}`}>
            <div className="skill-description">
                {skill.description}
            </div>
            <div className="skill-app-count">
                App Count: {skill.applications.length}
            </div>
            <div className="skill-proficiency">
                Prof: {skill.proficiency}
            </div>
        </div>
    )
}