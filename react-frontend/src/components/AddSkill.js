import React, {useState, useEffect} from "react";
import {MdOutlineCheckCircleOutline} from "react-icons/md"
import fetchRequests from "../data_model/fetchRequests";
import {useAuth0} from '@auth0/auth0-react';
import {useAPI} from '../utils/Auth0Functions';

// Component that lists all skills in the database, allows
// filtering of those skills with search, and when a skill
// is clicked adds that skill to the user.
function AddSkill({skillAdded, setSkillAdded, userSkills}) {
    const [allSkillList, setAllSkills] = useState([])
    const [newSkill, setNewSkill] = useState({"description": undefined, "proficiency": null})
    const [newSkillFormClass, setNewSkillFormClass] = useState("hidden")
    const [query, setQuery] = useState("")
    const {user, isAuthenticated} = useAuth0();
    const getTokenFromAuth0 = useAPI();

    const filteredSkills = allSkillList.filter((skill) => {
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
        if(newSkill.description === undefined || newSkill.description === "") {
            return alert('Sorry, it looks like you haven\'t provided a description... Please try again')
        }

        const token = await getTokenFromAuth0({redirectURI: '/skills'})
        
        if(isAuthenticated){
            // send the skill to the backend for creation
            let createdSkill = await fetchRequests.createSkill(token, {'description': newSkill.description})
    
            // tie the skill to the user
            await fetchRequests.tieSkillToUser(user, token, {'proficiency': parseInt(newSkill.proficiency)}, createdSkill.id)
            
            // perform cleanup after skill created
            setNewSkillFormClass("hidden")
            loadAllSkills().then((data) => highlightUsersSkills(data))
            setQuery("")
            setNewSkill({'description': undefined, 'proficiency': undefined})
            setSkillAdded(skillAdded+1)
        }

    }

    function cancelCreate(e) {
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
        const token = await getTokenFromAuth0({redirectURI: '/skills'})
        if(isAuthenticated){
            await fetchRequests.tieSkillToUser(user, token, {'proficiency': undefined}, skill.id)
    
            // perform cleanup after skill tied
            setSkillAdded(skillAdded+1)
            skill.userOwns = true
        }
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

    function highlightUsersSkills(allSkillList) {
        let allSkillIndex = 0
        let userSkillIndex = 0
        while (allSkillIndex < allSkillList.length && userSkillIndex < userSkills.length){
            let allSkillDesc = allSkillList[allSkillIndex].description.toLowerCase()
            let userSkillDesc = userSkills[userSkillIndex].description.toLowerCase()
            
            if(allSkillDesc > userSkillDesc){
                userSkillIndex++
                continue;
            } else if(allSkillDesc === userSkillDesc){
                allSkillList[allSkillIndex].userOwns = true
                userSkillIndex++
            } 
            allSkillIndex++
        }
        setAllSkills(allSkillList)
    }

    async function loadAllSkills() {
        let data = [];
        const token = await getTokenFromAuth0({redirectURI: '/skills'})
        if(isAuthenticated){
            data = await fetchRequests.getAllSkills(token)
        }
        setAllSkills(data)
        return data
    }

    useEffect(()=>{loadAllSkills().then((data) => highlightUsersSkills(data))}, [user])

    return(
        <div className="add-skill">
            
            <h2>
                Add Skill to Your Profile
            </h2>
            
            {allSkillList.length<3?createNew():allowSearchAndCreateNew()}

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
                        <button onClick={cancelCreate}>Cancel</button>
                    </div>
                </form>
            </div>

            <ul>
                {/* List all skills in database, display user owned skills as different
                color with checkmark */}
                {filteredSkills.map((skill) => {
                    return (
                        skill.userOwns ? 
                            <li key={skill.id} 
                                className='user-skill'>
                                {skill.description}
                                <MdOutlineCheckCircleOutline />
                            </li>
                        :
                        <li key={skill.id} 
                            className='all-skill'
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