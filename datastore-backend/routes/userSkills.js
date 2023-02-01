const express = require('express');
const model = require('../model')
const messages = require('./errorMessages')

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
    // skill
    for (let skill in userData.skills) {
        if (skill.skill_id === skillData.skill_id) {
            userData.skills.skill = skillData
            return await model.updateItem(userData, 'users')
        }
    }
    
    // otherwise add the skill to the user
    userData.skills.push(skillData)
    return await model.updateItem(req.body.user, 'users')
}

async function deleteSkillFromUser(skillID, userData) {
    let newUserSkills = []

    // user skills is array of objects with keys of skill_id, prof, desc
    // so compare ID to skill_id
    for(let skill in userData.skills) {
        if(skill.skill_id === skillID) {
            continue;
        }
        newUserSkills.push(skill)
    }
    userData.skills = newUserSkills
    return await model.updateItem(userData, 'users')
}

async function deleteSkillFromApp(skillID, appData) {
    let newSkillIDs = []

    // app skills is array of IDs, so compare passed skillID
    // to each of these vals
    for(let id in appData.skills) {
        if(id === skillID) {
            continue;
        }
        newSkillIDs.push(id)
    }
    return await model.updateItem(appData, 'applications')
}

async function deleteSkillFromApps(skillID, userID) {
    let deletedAppRelations = 0
    const relatedApps = await model.getFilteredItems('applications', 'user_id', userID)
    for(let app in relatedApps) {
        for(let id in app.skills) {
            if(id === skillID) {
                await deleteSkillFromApp(skillID, appData)
                deletedAppRelations++
                break;
            }
        }
    }
    return deletedAppRelations
}

async function deleteUserSkill(skillID, userData) {
    // delete skill out of users array
    const newUser = await deleteSkillFromUser(skillID, userData)

    // delete skill out of all applications
    const deletedAppRelations = await deleteSkillFromApps(skillID, userData.id)
    return {"user": newUser, "deleted_tied_apps": deletedAppRelations}
}

/**
 * Takes a user's skills array and converts it to a map with skill_id being the key
 * and the skill object as the value with a new array of apps added. Returns the map.
 * @param {any[]} skillArray [{skill_id: "1234", description: "...", prof: X}, ...]
 * @returns {} {"1234": {skill_id: "1234", description: "...", prof: X, apps: []}, ...}
 */
function createSkillMap(skillArray) {
    const skillMap = {}
    for(let skill in skillArray) {
        skill['apps'] = []
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
    const userApps = await model.getFilteredItems('applications', 'user_id', userData.id)
    for(let app in userApps){
        // each app has an array of skill ids, map these back to initialized
        // skill map, adding info about app tied to skill
        for(let appSkill in app.skills) {
            skillMap[appSkill].apps.push({'title': app.title, 'app_id': app.id})
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

    const resource = await model.getItemByID('skills', resourceId)

    if (resource[0] === null || resource[0] === undefined) {
        return res.status(404).send(errorMessages[404].skills)
    }
    req.body['skill'] = resource[0]
    next()
}

/**
 * Verifies that the user requesting action via a JWT owns the resource 
 * being requested. If the user requesting action does not own the resource, 
 * a 403 status/error message is returned.
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
async function verifyUserOwnsSkill (req, res, next) {
    // TODO: lookup user and make sure skill parameter is in their skill
    // array... once user verification implemented
    next()
}

/**
 * Verifies the content type header of the request is application/json.
 * If content-type header is incorrect, sends 415 message.
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
function verifyContentTypeHeader (req, res, next) {
    if (req.get('content-type') !== 'application/json') {
        return res.status(415).send(messages[415])
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
    let profiencyIsUndefined = (proficiency === undefined)

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

// get a user's skills - /users/:user_id/skills
router.get('/', 
    //verifyUser,                   // adds user info to req.body.user
    verifyAcceptHeader, 
    async (req, res) => {
        const skillMap = createSkillMap(req.body.user.skills)
        const skills = await bucketAppsBySkill(req.body.user, skillMap)
        res.status(200).send(skills)
})

// create a new skill AND tie to user
// TODO: Maybe get rid of this route since we can create on /skills now?
// router.post('/', methodNotAllowed)

router.put('/', methodNotAllowedSkills)
router.patch('/', methodNotAllowedSkills)
router.delete('/', methodNotAllowedSkills)

// TODO: Uncomment once users have been established
// router.get('/:skill_id', 
//     verifyAcceptHeader,
//     // verifyUser,              // adds user info to req.body.user
//     verifySkillExists,          // adds skill info to req.body.skill
//     verifyUserOwnsSkill,        // adds user skill info to req.body.userSkill
//     async (req, res) => {
        
//         try {
//             const skillMap = createSkillMap([req.body.userSkill])
//             const returnInfo = await bucketAppsBySkill(req.body.user, skillMap)
//             res.status(200).send(returnInfo)
//         } catch (err) {
//             console.error(err)
//             res.status(500).end()
//         }
//     }
// )

// TODO: Uncomment once users have been established
// // delete a skill from a user
// router.delete('/:skill_id', 
//     //verifyUser,               // adds user info to req.body.user
//     verifySkillExists,          // adds skill info to req.body.skill
//     verifyUserOwnsSkill,
//     async (req, res) => {
//         const deleteInfo = await deleteUserSkill(req.body.skill.id, req.body.user)
//         res.status(200).send(deleteInfo)
//     }
// )

// modify an existing skill's proficiency for a user
// OR tie existing skill to user
router.put('/:skill_id', 
    verifyContentTypeHeader,
    verifyAcceptHeader,
    verifyRequestBodyKeys,
    verifyRequestBodyVals, 
    //verifyUser,               // adds user info to req.body.user
    verifySkillExists,          // adds skill info to req.body.skill
    async (req, res) => {
        const newSkillData = {
            "skill_id": req.params.skill_id,
            "proficiency": req.body.proficiency === undefined?null:req.body.proficiency,
            "description": req.body.skill.description
        }

        // TODO: update user's skill array once user verification complete
        // try {
        //     const updatedUser = updateUserSkills(newSkillData, req.body.user)
        //     res.status(200).send(updatedUser)
        // } catch (err) {
        //     console.error(err)
        //     res.status(500).end()
        // }
        res.status(200).send(newSkillData)
    }
)

router.patch('/:skill_id', methodNotAllowedUserSkill)
router.post('/:skill_id', methodNotAllowedUserSkill)
router.delete('/:skill_id', methodNotAllowedUserSkill)

module.exports = router