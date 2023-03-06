const express = require('express');
const model = require('../model')
const messages = require('./errorMessages')
const verifyUser = require('./middleware/verifyUser')

const router = express.Router()

/**
 * These routes represent the /users/:user_id/skills
 * endpoints. All routes are protected by JWT, and the 
 * user_id passed in the JWT is paired against the route
 * parameter. The user_id is also queried in the db to make
 * sure the user exists.
 */

/**
 * ################# HELPER FUNCTIONS #####################
 * ########################################################
 * ########################################################
 */


/**
 * Loops through userData to determine if a skill is tied to a user.
 * If they are, updates that skill. Otherwise, adds the skill to the 
 * user's skills array.
 * @param {obj} skillData {skill_id: int, description: str, proficiency: int || null} 
 * @param {obj} userData {id: int, skills: [], contacts: [], applications: [], created_at: date}
 * @returns 
 */
async function addUserSkill(skillData, userData) {
    // if skill exists in user skills already, just update that
    // skill as long as new proficiency is not null
    for(let skill of userData.skills) {
        if (skill.skill_id === skillData.skill_id) {
            if (skillData.proficiency) {
                skill.proficiency = skillData.proficiency
                try{
                    await model.updateItem(userData, 'users')
                } catch(err){
                    console.error(err)
                    console.error(
                        `Error in GCP updating user ${userData.id} to update skill ${skillData.skill_id}`
                        )
                }
            }
            return userData
        }
    }
    
    userData.skills.push(skillData)
    try{
        await model.updateItem(userData, 'users')
    } catch(err){
        console.error(`Error in GCP updating user ${userData.id} to add skill ${skillData.skill_id}`)
    }
    return userData
}

async function deleteSkillFromUser(skillID, userData) {
    let newUserSkills = []

    // user skills is array of objects with keys of skill_id, prof, desc
    // so compare ID to skill_id
    for (let skill of userData.skills) {
        if(skill.skill_id === skillID) {
            continue;
        }
        newUserSkills.push(skill)
    }

    userData.skills = newUserSkills
    try{
        await model.updateItem(userData, 'users')
    } catch(err){
        console.error(err)
        console.error(`Error in GCP updating user ${userData.id} to remove skill ${skillID}`)
    }
    return userData
}

async function deleteSkillFromApp(skillID, appData) {
    let newSkillIDs = []

    // app skills is array of IDs, so compare passed skillID
    // to each of these vals
    for(let id of appData.skills) {
        if(id === skillID) {
            continue;
        }
        newSkillIDs.push(id)
    }
    appData.skills = newSkillIDs

    try{
        return await model.updateBigItem(appData, 'application')
    } catch(err){
        console.error(err)
        console.error(
            `Error in GCP updating applications to remove skill ${skillID} from app ${appData.id}`
            )
    }
}

async function deleteSkillFromApps(skillID, userID) {
    let deletedAppRelations = 0
    let relatedApps = []
    
    try{
        relatedApps = await model.getFilteredItems('application', 'user', userID)
    } catch(err){
        console.error(err)
        console.error('Error in GCP getting applications from DB')
    }
    
    for(let app of relatedApps) {
        for(let id of app.skills) {
            if(id === skillID) {
                await deleteSkillFromApp(skillID, app)
                deletedAppRelations++
                break;
            }
        }
    }
    return deletedAppRelations
}

async function deleteUserSkill(skillID, userData) {
    // delete skill out of users array
    let newUser = {}
    try{
        newUser = await deleteSkillFromUser(skillID, userData)
    } catch(err){
        console.error(err)
        console.error(`Error deleting skill ${skillID} from user ${userData.id}`)
    }

    // delete skill out of all applications
    let deletedAppRelations = 0
    try{
        deletedAppRelations = await deleteSkillFromApps(skillID, userData.id)
    } catch(err){
        console.error(err)
        console.error(`Error deleting ${skillID} from user ${userData.id}`)
    }
    return {"user": newUser, "deleted_app_relations": deletedAppRelations}
}

/**
 * Takes a user's skills array and converts it to a map with skill_id being the key
 * and the skill object as the value with a new array of apps added. Returns the map.
 * @param {any[]} skillArray [{skill_id: "1234", description: "...", prof: X}, ...]
 * @returns {} {"1234": {skill_id: "1234", description: "...", prof: X, apps: []}, ...}
 */
function createSkillMap(skillArray) {
    const skillMap = {}
    for(let skill of skillArray) {
        skill['applications'] = []
        skillMap[skill.skill_id] = skill
    }
    return skillMap
}


/**
 * This function loops through a user's applications and buckets the apps
 * with the appropriate skill. Requires a user object as displayed in DS as input.
 * Also requires a map of skills with a key of the skill_id and value of an object with
 * apps array.
 * Returns an array of skill objects that have an app array
 * @param {obj} skillMap {"1234": {skill_id: "1234", description: "...", prof: X, apps: []}}
 * @param {obj} userData {id: int, skills: [], contacts: [], applications: [], created_at: date}
 * @returns {Promise<any[]>} Array of objects like so: 
 * *    [ 
 *        {
 *            (skill) skill_id: ..., 
 *            (skill) description: "...",
 *            (skill) proficiency: X,
 *            apps: [{title: "...", app_id: ...}]
 *        }
 *     ]
 */
async function bucketAppsBySkill(userData, skillMap) {
        
    // grab the apps associated with the user
    let userApps = []

    try{
        userApps = await model.getFilteredItems('application', 'user', userData.id)
    } catch(err) {
        console.error(err)
        console.error('Error in GCP getting user apps')
    }

    for(let app of userApps){
        // TODO: delete once all apps have been converted to blank array for skills
        if(typeof app.skills === 'string' || app.skills instanceof String){
            continue
        }
        for(let skillID of app.skills){
            try{
                skillMap[skillID].applications.push({'title': app.title, 'app_id': app.id})
            } catch(err){
                console.error(err)
                console.error('Error - skill exists in app that is not tied to user')
            }
        }
    }
    return Object.values(skillMap)
}


/**
 * ############### MIDDLEWARE FUNCTIONS ###################
 * ########################################################
 * ########################################################
 */

/**
 * Verifies that the resource on which action is requested actually exists.
 * If it does exist, passes control to next middleware. If it doesn't 
 * exist, a 404 status/error message is returned.
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
async function verifySkillExists (req, res, next) {
    const resourceId = req.params.skill_id
    let resource = []
    
    try{
        resource = await model.getItemByID('skills', resourceId)
    } catch(err){
        console.error(err)
        return res.status(500).end()
    }

    if (resource[0] === null || resource[0] === undefined) {
        return res.status(404).send(errorMessages[404].skills)
    }
    req.body['skill'] = resource[0]
    next()
}

/**
 * Verifies that the user requesting action via a JWT owns the skill 
 * being requested. If the user requesting action does not own the skill, 
 * a 403 status/error message is returned. If they do, then the user's
 * skill info {proficiency, skill_id, description} are added to the 
 * request body under userSkill
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
async function verifyUserOwnsSkill (req, res, next) {
    try{
        for(let skill of req.body.user.skills) {
            if(skill.skill_id === req.params.skill_id){
                req.body['userSkill'] = skill
                return next()
            }
        }
    } catch(err) {
        console.error(err)
        return res.status(500).end()
    }
    return res.status(403).send(messages[403])
}

/**
 * Verifies the content type header of the request is application/json
 * if the content is not empty.
 * If content-type header is incorrect, sends 415 message.
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
function verifyContentTypeHeader (req, res, next) {
    if (req.get('content-length') !== "0") {
        if (req.get('content-type') !== 'application/json') {
            return res.status(415).send(messages[415])
        } 
    } 
    next()
}

/**
 * Verifies the requester can recieve application/json through the 
 * Accept Header. If accept header is incorrect, sends 406 message.
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
function verifyAcceptHeader (req, res, next) {
    const headerVal = req.get('accept')
    if (headerVal !== 'application/json' && headerVal !== '*/*') {
        return res.status(406).send(messages[406])
    } 
    next()
}


/**
 * Verifies the body of the request only contains allowable keys.
 * If body contains more or less than required keys, returns a 
 * 400 message.
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
function verifyRequestBodyKeys (req, res, next) {
    try {
        // body can be either blank, or only proficiency passed
        let keyLength = Object.keys(req.body).length
        let profDefined = (req.body.proficiency !== undefined)
    
        if (keyLength < 1) {
            next()
        } else if (keyLength === 1 && profDefined) {
            next()
        } else {
            return res.status(400).send(messages[400].keyError)
        }
    } catch(err){
        console.error(err)
        return res.status(500).end()
    }
}

/**
 * Verifies that the request body values do not contain invalid information
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
function verifyRequestBodyVals (req, res, next) {
    let proficiency = req.body.proficiency
    let proficiencyIsInt = Number.isInteger(proficiency)
    let profiencyIsUndefined = (proficiency == undefined)

    if (profiencyIsUndefined) {
        return next()
    }

    if (proficiencyIsInt && (0 < proficiency) && (proficiency <= 5)) {
        return next()
    }

    return res.status(400).send(messages[400].valueError)
}

/**
 * Sets the allow header on the response and ends processing.
 * For routes /users/:user_id/skills
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
function methodNotAllowedSkills(req, res, next) {
    res.status(405).setHeader('Allow', ["GET"]).end()
}

/**
 * Sets the allow header on the response and ends processing.
 * For routes /users/:user_id/skills/:skill_id
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
function methodNotAllowedUserSkill(req, res, next) {
    res.status(405).setHeader('Allow', ["GET", "PUT", "DELETE"]).end()
}

/**
 * #################### ROUTES ############################
 * ########################################################
 * ########################################################
 */

router.get('/:user_id/skills', 
    verifyUser.verifyJWTWithUserParam,      // adds user info to req.body.user
    verifyAcceptHeader, 
    async (req, res) => {
        const skillMap = createSkillMap(req.body.user.skills)
        let skills = await bucketAppsBySkill(req.body.user, skillMap)

        // sort the skills before sending them back
        skills = skills.sort((a, b) => {
            a = a.description.toUpperCase()
            b = b.description.toUpperCase()
            if(a < b) return -1
            if(a > b) return 1
            return 0
        })

        res.status(200).send(skills)
})

router.post('/:user_id/skills', methodNotAllowedSkills)
router.put('/:user_id/skills', methodNotAllowedSkills)
router.patch('/:user_id/skills', methodNotAllowedSkills)
router.delete('/:user_id/skills', methodNotAllowedSkills)

router.get('/:user_id/skills/:skill_id', 
    verifyAcceptHeader,
    verifyUser.verifyJWTWithUserParam,  // adds user info to req.body.user
    verifySkillExists,                  // adds skill info to req.body.skill
    verifyUserOwnsSkill,                // adds user skill info to req.body.userSkill
    async (req, res) => {
        
        try {
            const skillMap = createSkillMap([req.body.userSkill])
            const returnInfo = await bucketAppsBySkill(req.body.user, skillMap)
            res.status(200).send(returnInfo)
        } catch (err) {
            console.error(err)
            res.status(500).end()
        }
    }
)

// // delete a skill from a user
router.delete('/:user_id/skills/:skill_id', 
    verifyUser.verifyJWTWithUserParam,      // adds user info to req.body.user
    verifySkillExists,                      // adds skill info to req.body.skill
    verifyUserOwnsSkill,
    async (req, res) => {

        try {
            const deleteInfo = await deleteUserSkill(req.body.skill.id, req.body.user)
            res.status(200).send(deleteInfo)
        } catch(err) {
            console.error(err)
            res.status(500).end()
        }
    }
)

// modify an existing skill's proficiency for a user
// OR tie existing skill to user
router.put('/:user_id/skills/:skill_id', 
    verifyContentTypeHeader,
    verifyAcceptHeader,
    verifyRequestBodyKeys,
    verifyRequestBodyVals, 
    verifyUser.verifyJWTWithUserParam,  // adds user info to req.body.user
    verifySkillExists,                  // adds skill info to req.body.skill
    async (req, res) => {
        const newSkillData = {
            "skill_id": req.params.skill_id,
            "proficiency": req.body.proficiency === undefined?null:req.body.proficiency,
            "description": req.body.skill.description
        }

        try {
            const updatedUser = await addUserSkill(newSkillData, req.body.user)
            res.status(204).send(updatedUser)
        } catch (err) {
            console.error(err)
            res.status(500).end()
        }
    }
)

router.patch('/:user_id/skills/:skill_id', methodNotAllowedUserSkill)
router.post('/:user_id/skills/:skill_id', methodNotAllowedUserSkill)
router.delete('/:user_id/skills/:skill_id', methodNotAllowedUserSkill)

module.exports = router