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
async function updateUserSkills(skillData, userData) {
    // if skill exists in user skills already, just update that
    // skill
    for (let skill in userData.skills) {
        if (skill.skill_id === skillData.skill_id) {
            userData.skills.skill = skillData
            return await model.updateItem(req.body.user, 'users')
        }
    }
    
    // otherwise add the skill to the user
    userData.skills.push(skillData)
    return await model.updateItem(req.body.user, 'users')
}

/**
 * This function loops through a user's applications and buckets the apps
 * with the appropriate skill. Requires a user object in DS as input. Returns
 * an array of skills with apps bucketed like follows: 
 *    [ 
 *        {
 *            (skill) id: ..., 
 *            (skill) description: "...",
 *            (skill) proficiency: X,
 *            apps: [{title: "...", app_id: ...}]
 *        }
 *     ]
 * @param {obj} userData {id: int, skills: [], contacts: [], applications: [], created_at: date}
 */
async function bucketAppsBySkill(userData) {
    const skills = {}
    const userApps = await model.getFilteredItems('applications', 'user_id', userData.id)
    
    // initialize the skill map for bucketing applications to skills
    for(let skill in userData.skills) {
        skill['apps'] = []
        skills[skill.id] = skill
    }

    for(let app in userApps){
        // each app has an array of skill ids, map these back to initialized
        // skill map, adding info about app tied to skill
        for(let appSkill in app.skills) {
            skills[appSkill].apps.push({'title': app.title, 'app_id': app.id})
        }
    }

    return Object.values(skills)
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

    if (("proficiency" in req.body) && Object.keys(req.body).length === 1) {
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
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
function methodNotAllowed(req, res, next) {
    res.status(405).setHeader('Allow', ["GET"]).end()
}

/**
 * #################### ROUTES ############################
 * ########################################################
 * ########################################################
 */

// get a user's skills
router.get('/', 
    //verifyUser,                   // adds user info to req.body.user
    verifyAcceptHeader, 
    async (req, res) => {
        // pull the user info out of the body
        const user = req.body.user

        // create a returnable object by bucketing applications with skills
        const skills = await bucketAppsBySkill(user)
        res.status(200).send(skills)
})

// create a new skill AND tie to user
// TODO: Maybe get rid of this route since we can create on /skills now?
// router.post('/', methodNotAllowed)

// tie an existing skill to a user
router.put('/:skill_id', 
    //verifyUser,                   // adds user info to req.body.user
    verifySkillExists,              // adds skill info to req.body.skill
    verifyAcceptHeader, 
    async (req, res) => {
        const newSkill = {
            "skill_id": req.params.skill_id,
            "proficiency": null,
            "description": req.body.skill.description}
        
        //TODO: add skill to user's skill array
        // user lookup occurs in verifyUser, info
        // added under req.body.user
        // 
        // try {
            // const updatedUser = await updateUserSkills(newSkill, req.body.user)    
        //     res.status(200).send(updatedUser)
        // } catch (err) {
        //     console.error(err)
        //     res.status(500).end()
        // }
        res.status(200).send(newSkill)
})

// delete a skill from a user
router.delete('/:skill_id', )

// modify an existing skill's proficiency for a user
router.patch('/:skill_id', 
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

module.exports = router