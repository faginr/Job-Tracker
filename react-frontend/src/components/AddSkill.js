import React, {useState, useEffect} from "react";
import { user } from "../utils/User";

const datastore_url = process.env.REACT_APP_API_SERVER_URL

// Component that lists all skills in the database, allows
// filtering of those skills with search, and when a skill
// is clicked adds that skill to the user.
// Requires handleSkillClick function to control what happens with
// the parent component when a skill is clicked.
function AddSkill({skillAdded, setSkillAdded}) {
    const [allSkills, setAllSkills] = useState([])
    const [newSkill, setNewSkill] = useState({"description": undefined, "proficiency": null})
    const [newSkillFormClass, setNewSkillFormClass] = useState("hidden")
    const [query, setQuery] = useState("")

    const filterdSkills = allSkills.filter((skill) => {
        return (skill.description.toLowerCase().includes(query.toLowerCase()))
    })

    function createNew() {
        return (
            <li onClick={() => setNewSkillFormClass("new-skill-form")}>
                Create New
            </li>
        )
    }

    async function createNewSkillInAPI(){
        let response = await fetch(`${datastore_url}/skills`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                'Content-type': 'application/json'
            }, 
            // only send the description to POST
            body: JSON.stringify({'description': newSkill.description}),
        })
        if (response.status !== 201) {
            alert(`Uh-oh, I couldn't create ${newSkill.description} in DS!`)
            return
        }
        return await response.json()
    }

    async function tieSkillToUser(skill){
        let putResponse = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/skills/${skill.id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                'Content-type': 'application/json',
            }, 
            // PUT method expect only proficiency in body
            // and form auto-formats prof as string, so need to conver to num
            body: JSON.stringify({'proficiency': parseInt(skill.proficiency)})
        })
        if (putResponse.status !== 204) {
            alert(`Uh-oh, I couldn't tie ${skill.description} to user!`)
        }
        updateUserSkillsInReact()
    }

    function updateUserSkillsInReact() {
        setSkillAdded(skillAdded+1)
    }

    async function createSkill (e) {
        e.preventDefault()
        
        newSkill.description ?? (newSkill['description'] = query)

        // send the skill to the backend for creation
        let createdSkill = await createNewSkillInAPI()

        // format the created skill to be the same as all the other skills
        createdSkill['proficiency'] = newSkill.proficiency

        // tie the skill to the user
        await tieSkillToUser(createdSkill)

        // hide the form
        setNewSkillFormClass("hidden")

        // reload all skills to reflect new item and reset query
        loadAllSkills()
        setQuery("")
    }

    function handleFormChange(e, identifier) {
        setNewSkill({
            ...newSkill,
            [identifier]: e.target.value
        })
        if(identifier === 'description'){
            // update the query to allow for dynamically
            // changing list
            setQuery(e.target.value)
        }
    }

    async function loadAllSkills() {
        const response = await fetch(`${datastore_url}/skills`, {
            headers: {
                'Authorization': `Bearer ${user}`
            }
        })
        if (response.status !== 200) {
            alert('Uh-oh, I couldn\'t load all the skills in DS!')
            return
        }

        const data = await response.json()
        setAllSkills(data)
    }

    async function handleSkillSelection(skill) {
        await tieSkillToUser(skill)
    }

    useEffect(()=>{loadAllSkills()}, [])

    return(
        <div className="add-skill">
            <h2>
                Add Skill to Your Profile
            </h2>
            <input type="search" placeholder="Search..." onChange={(e)=>setQuery(e.target.value)}/>
            <ul>
                {/* List all skills in database */}
                {filterdSkills.map((skill) => {
                    return(
                        <li key={skill.id} 
                            onClick={() => handleSkillSelection(skill)}>
                                {skill.description}
                        </li>
                    )}
                )}

                {/* Add ability to create new skill if less than 4 skills on screen */}
                {filterdSkills.length<4?createNew():<div/>}
            </ul>
            <div className={newSkillFormClass}>
                <form>
                    <div>
                        <label>
                            Description:
                            <input type="text" value={query} onChange={(e)=>handleFormChange(e, 'description')}/>
                        </label>
                    </div>
                    <div>
                        <label>
                            Proficiency:
                            <input type="number" max={5} min={1} onChange={(e)=>handleFormChange(e, 'proficiency')}/>
                        </label>
                    </div>
                    <div>
                        <button onClick={createSkill}>Create New</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddSkill