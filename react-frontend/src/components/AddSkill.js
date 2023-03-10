import React, {useState, useEffect} from "react";
import {MdOutlineCheckCircleOutline} from "react-icons/md"
import fetchRequests from "../data_model/fetchRequests";
import {useAuth0} from '@auth0/auth0-react';
import {useAPI} from '../utils/Auth0Functions';

// Component that lists all skills in the database, allows
// filtering of those skills with search, and when a skill
// is clicked adds that skill to the user.
function AddSkill({userSkills, setUserSkills}) {
    const [allSkillList, setAllSkills] = useState([])
    const [newSkill, setNewSkill] = useState({"description": undefined, "proficiency": null})
    const [newSkillFormClass, setNewSkillFormClass] = useState("hidden")
    const [query, setQuery] = useState("")
    const {user, isAuthenticated} = useAuth0();
    const getTokenFromAuth0 = useAPI();

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

    // Creates a new userSkills array in sorted order with skillToAdd included
    function createNewUserSkills(skillToAdd){
        let newUserSkills = []
        let newSkillPushed = false
        for(let skill of userSkills){
            if(skill.description.toUpperCase() < skillToAdd.description.toUpperCase()){
                newUserSkills.push(skill)
            } else {
                if (!newSkillPushed){
                    newUserSkills.push(skillToAdd)
                    newSkillPushed = true
                }
                newUserSkills.push(skill)
            }
        }
        // special case at end of loop, if skillToAdd is greater than all existing userSkills
        // then need to push it at the end.
        if (!newSkillPushed){
            newUserSkills.push(skillToAdd)
        }
        return newUserSkills
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
    
            // determine proficiency entered
            let prof = newSkill.proficiency
            if(prof === ''){
                prof = undefined
            } else{
                prof = parseInt(prof)
            }

            // tie the skill to the user
            await fetchRequests.tieSkillToUser(user, token, {'proficiency': prof}, createdSkill.id)
            
            // push new skill into userSkills array, this will cause a re-render
            let skillToAdd = {
                'skill_id': createdSkill.id,
                'applications': [],
                'description': newSkill.description,
                'proficiency': prof,
            }
            let newUserSkills = createNewUserSkills(skillToAdd)
            setUserSkills(newUserSkills)
            setNewSkillFormClass("hidden")
            setQuery("")
            setNewSkill({'description': '', 'proficiency': ''})
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
    
            // push new skill into userSkills array, this will cause a re-render
            let skillToAdd = {
                'description': skill.description,
                'skill_id': skill.id,
                'applications': [],
                'proficiency': undefined,
            }
            let newUserSkills = createNewUserSkills(skillToAdd)
            setUserSkills(newUserSkills)
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

    function highlightUsersSkills() {
        let allSkillIndex = 0
        let userSkillIndex = 0
        let highlightedSkills = []
        while (allSkillIndex < allSkillList.length && userSkillIndex < userSkills.length){
            let allSkill = allSkillList[allSkillIndex]
            let userSkill = userSkills[userSkillIndex]
            allSkill.userOwns = false
            
            if(allSkill.description.toLowerCase() > userSkill.description.toLowerCase()){
                // hold allSkill ref in place while moving user skill forward 
                userSkillIndex++
                continue;
            } else if(allSkill.description.toLowerCase() === userSkill.description.toLowerCase()){
                // mark allSkill as being owned by user, move both pointers forward
                allSkill.userOwns = true
                userSkillIndex++
                allSkillIndex++
            } else {
                // hold userSkill in place while moving allSkill pointer forward
                allSkillIndex++
            }
            highlightedSkills.push(allSkill)
        }

        // at end of user skills, if any skills left in all skills push them in
        while(allSkillIndex < allSkillList.length){
            let allSkill = allSkillList[allSkillIndex]
            allSkill.userOwns = false
            highlightedSkills.push(allSkill)
            allSkillIndex++
        }
        return highlightedSkills
    }

    async function loadAllSkills() {
        let data = [];
        const token = await getTokenFromAuth0({redirectURI: '/skills'})
        if(isAuthenticated){
            data = await fetchRequests.getAllSkills(token)
        }
        setAllSkills(data)
    }

    useEffect(()=>{
        loadAllSkills()
    }, [user, userSkills])
    
    const highlightedSkills = highlightUsersSkills()
    const filteredSkills = highlightedSkills.filter((skill) => {
        return (skill.description.toLowerCase().includes(query.toLowerCase()))
    })
    return(
        <div className="add-skill">
            
            <h2>
                Add Skill to Your Profile
            </h2>
            
            {highlightedSkills.length<3?createNew():allowSearchAndCreateNew()}

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