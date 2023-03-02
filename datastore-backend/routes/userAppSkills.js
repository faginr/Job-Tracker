/**
 * This module provides a router for the endpoint
 * /users/:user_id/applications/:app_id/skills.
 * This is the endpoint that ties a user's skills to 
 * applications.
 */

const express = require('express');
const { verifyJWTWithUserParam } = require('./middleware/verifyUser');
const model = require('../model');
const messages = require('./errorMessages')

const router = express.Router()

/*************************************************************************************
 * Helper functions 
 *************************************************************************************
 */
/**
 * Loops through userData to determine if a skill is tied to a user.
 * If they are, returns true. Otherwise, returns false.
 * @param {str} skillID str 
 * @param {obj} userData {id: int, skills: [], contacts: [], applications: [], created_at: date}
 * @returns 
 */
function userOwnsSkill(skillID, userData) {
    for(let skill of userData.skills) {
        if (skill.skill_id === skillID) {
            return true
        }
    }
    
    return false
}

async function addSkillToUser(skillObject, userObject) {
    try {
        userObject.skills.push(skillObject)
        await model.updateItem(userObject, 'users')
    } catch(err){
        console.error(err)
        console.error(`Error adding ${skillObject.skill_id} to ${userObject.id}`)
    }
}

async function addSkillToApp(skillID, appObject) {
    try{
        appObject.skills.push(skillID)
        await model.updateBigItem(appObject, 'application')
    } catch(err){
        console.error(err)
        console.error(`Error adding ${skillID} to ${appObject.id}`)
    }
}

/*************************************************************************************
 * Middleware 
 *************************************************************************************
 */

 async function verifyAppExists(req, res, next) {
    const appID = req.params.app_id
    try {
        const app = await model.getItemByID('application', appID)
        if(app[0] == undefined) {
            return res.status(404).send(messages[404].apps)
        }
        req.body['app'] = app[0]
        return next()
    } catch(err) {
        console.error(err)
        return res.status(500).end()
    }
 }

 async function verifySkillExists(req, res, next) {
    const skillID = req.params.skill_id
    try {
        const skill = await model.getItemByID('skills', skillID)
        if(skill[0] == undefined) {
            return res.status(404).send(messages[404].skills)
        }
        req.body['skill'] = skill[0]
        return next()
    } catch(err) {
        console.error(err)
        return res.status(500).end()
    }
 }

 function verifyUserOwnsApp(req, res, next) {
    // must have user info under req.body.user
    for (let appID of req.body.user.applications) {
        if (appID === req.params.app_id) {
            return next()
        }
    }
    return res.status(403).send({"Error": "User does not own application"})
 }

 function verifyAppNotTiedToSkill(req, res, next) {
    // app info needs to be under req.body.app
    for (let skillID of req.body.app.skills) {
        if (skillID === req.params.skill_id){
            // if skill is already in app skills array, send back 204
            // status to kill this route
            return res.status(204).end()
        }
    }

    next()
 }

 function methodNotAllowed(req, res, next) {
     return res.status(405).setHeader('Allow', []).end()
 }
 
 function methodNotAllowedOnSkill(req, res, next) {
     return res.status(405).setHeader('Allow', ['PUT', 'DELETE']).end()
 }


/*************************************************************************************
 * Routes 
 *************************************************************************************
 */
router.get('/:user_id/applications/:app_id/skills', methodNotAllowed)
router.post('/:user_id/applications/:app_id/skills', methodNotAllowed)
router.put('/:user_id/applications/:app_id/skills', methodNotAllowed)
router.patch('/:user_id/applications/:app_id/skills', methodNotAllowed)
router.delete('/:user_id/applications/:app_id/skills', methodNotAllowed)

router.get('/:user_id/applications/:app_id/skills/:skill_id', methodNotAllowedOnSkill)
router.post('/:user_id/applications/:app_id/skills/:skill_id', methodNotAllowedOnSkill)
router.patch('/:user_id/applications/:app_id/skills/:skill_id', methodNotAllowedOnSkill)

router.put(
    '/:user_id/applications/:app_id/skills/:skill_id',
    verifyJWTWithUserParam,     // places user under req.body.user
    verifyAppExists,            // places app under req.body.app
    verifySkillExists,          // places skill under req.body.skill
    verifyUserOwnsApp,           
    verifyAppNotTiedToSkill,    // kills route and send 204 if app already tied to skill
    (req, res) => {

        try{
            // add skill to user skills array if not there already
            if (!userOwnsSkill(req.params.skill_id, req.body.user)){
                let skillObject = {
                    "description": req.body.skill.description,
                    "proficiency": null,
                    "skill_id": req.params.skill_id,
                    }
                addSkillToUser(skillObject, req.body.user)
            }
    
            // add skill to app skills array
            addSkillToApp(req.params.skill_id, req.body.app)
    
            // send back 204 status
            res.status(204).end()
        } catch(err) {
            console.error(err)
            res.status(500).end()
        }
    }
)
router.delete(
    '/:user_id/applications/:app_id/skills/:skill_id',
    verifyJWTWithUserParam,     // places user under req.body.user
    verifyAppExists,            // places app under req.body.app
    verifySkillExists,          // places skill under req.body.skill
    verifyUserOwnsApp,        
    (req, res) => {
        // update app skills array to not contain skill
        // if skill not tied, this won't throw an error, it will just act
        // as if process completed
        updatedSkills = []
        for(let skillID of req.body.app.skills){
            if(skillID === req.params.skill_id) {
                continue
            }
            updatedSkills.push(skillID)
        }
        req.body.app.skills = updatedSkills

        try{
            // update datastore
            model.updateBigItem(req.body.app, 'application')
    
            // send back 204 status
            res.status(204).end()
        } catch(err) {
            console.error(err)
            res.status(500).end()
        }
    }
)

module.exports = router
