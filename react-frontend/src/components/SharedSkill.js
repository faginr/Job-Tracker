import React from "react";

function SharedSkills({skills}) {
    return (
        <div className="sharedSkill">
            <h1>Shared Skills in Datastore:</h1>
            <ul>
                {skills.map((skill) => {
                    return (
                        <li key={skill.id}>{skill.id}: {skill.description}</li>
                    )
                })}
            </ul>
            <h1>Still to Come:</h1>
            <ul>
                <li>Tying skills to user</li>
                <li>Deleting skill from user</li>
                <li>Allowing user to set proficiency</li>
                <li>Tying skills to applications</li>
            </ul>
        </div>
    )
}

export default SharedSkills