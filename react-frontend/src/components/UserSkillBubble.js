import React from "react";

export default function UserSkillBubble({skill, className}) {
    return(
        <span className={className}>
            <b>{skill.description}</b>
            <div />
            <b>{skill.proficiency}</b>
        </span>
    )
}