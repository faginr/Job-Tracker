import React, {useState, useEffect} from "react";
import { user } from "../utils/User";
import fetchRequests from "../data_model/fetchRequests";

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

    const filteredSkills = allSkills.filter((skill) => {
        return (skill.description.toLowerCase().includes(query.toLowerCase()))
    })

    function allowSearchAndCreateNew() {
        return(
            <div>
                <input type="search" placeholder="Search..." onChange={handleQuery}/>
                {createNew()}
            </div>
        )
    }

    function createNew() {
        return (
        <button onClick={() => setNewSkillFormClass("new-skill-form")}>
            Create New
        </button>
        )
    }

    /**
     * Creates a new skill in datastore and ties new skill to the user
     * with the defined proficiency
     * @param {*} e 
     */
    async function createSkill (e) {
        e.preventDefault()

        // handles case where description is blank
        if(newSkill.description == undefined || newSkill.description === "") {
            return alert('Sorry, it looks like you haven\'t provided a description... Please try again')
        }

        // send the skill to the backend for creation
        let createdSkill = await fetchRequests.createSkill(user, {'description': newSkill.description})

        // tie the skill to the user
        await fetchRequests.tieSkillToUser(user, user, {'proficiency': parseInt(newSkill.proficiency)}, createdSkill.id)
        
        // perform cleanup after skill created
        setNewSkillFormClass("hidden")
        loadAllSkills()
        setQuery("")
        setNewSkill({'description': undefined, 'proficiency': undefined})
        setSkillAdded(skillAdded+1)
    }

    function cancleCreate(e) {
        e.preventDefault()
        setNewSkillFormClass("hidden")
        setQuery("")
        setNewSkill({'description': '', 'proficiency': ''})
    }

    /**
     * Ties a skill to a user with default proficiency
     * @param {*} skill 
     */
    async function tieSkillToUser(skill){
        await fetchRequests.tieSkillToUser(user, user, {'proficiency': undefined}, skill.id)

        // perform cleanup after skill tied
        setSkillAdded(skillAdded+1)
    }

    function handleQuery(e){
        // update the new skill to have the same value as query
        setNewSkill({
            ...newSkill,
            'description': e.target.value
        })

        // update query to reflect the target value
        setQuery(e.target.value)
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
        const data = await fetchRequests.getAllSkills(user)
        setAllSkills(data)
    }

    useEffect(()=>{loadAllSkills()}, [])

    return(
        <div className="add-skill">
            
            <h2>
                Add Skill to Your Profile
            </h2>
            
            {allSkills.length<3?createNew():allowSearchAndCreateNew()}

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
                            <input type="number" value={undefined} max={5} min={1} onChange={(e)=>handleFormChange(e, 'proficiency')}/>
                        </label>
                    </div>
                    <div>
                        <button onClick={createSkill}>Submit</button>
                        <button onClick={cancleCreate}>Cancel</button>
                    </div>
                </form>
            </div>

            <ul>
                {/* List all skills in database */}
                {filteredSkills.map((skill) => {
                    return(
                        <li key={skill.id} 
                            onClick={() => tieSkillToUser(skill)}>
                                {skill.description}
                        </li>
                    )}
                )}

            </ul>
        </div>
    )
}

export default AddSkill