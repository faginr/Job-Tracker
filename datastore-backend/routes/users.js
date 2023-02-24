const express = require('express')
const model = require('../model')
const errorMessages = require('./errorMessages')
const {verifyJWTWithUserParam, verifyJWTOnly} = require('./middleware/verifyUser')

const router = express.Router()

// body-parser already used at the top app level
// JWT verifier already used at the top app level

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
        res.status(406).send(messages[406])
    } else {
        next()
    }
}


function verifyRequestBody(req, res, next){
    try{
        if(req.body.username === undefined || req.body.username === null){
            return res.status(400).send(errorMessages[400].keyError)
        } 
        if (req.body.username.length > 40){
            return res.status(400).send(errorMessages[400].keyError)
        }
    } catch(e){
        console.error("Trouble verifying body post on users")
        return res.status(400).send(errorMessages[400].requiredKey)
    }
    next()
}

/**
 * Verifies that the user that we're trying to create doesn't exist.
 * If it does exist, a 400 status is returned. Otherwise, passes to the
 * next middleware.
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
async function verifyUserDoesNotExist (req, res, next) {
    const resourceId = req.body.auth.id
    let resource = []
    try{
        resource = await model.getItemByManualID('users', resourceId)
    } catch(e){
        console.error(e)
        console.error("Problem looking up user!")
        return res.status(500).end()
    }
    if (resource[0] != null || resource[0] != undefined) {
        res.status(400).send(errorMessages[400].userExists)
    } else {
        next()
    }
}

/**
 * Sends a 405 message with Allow header set properly.
 * @param {express.request} req 
 * @param {express.response} res 
 */
function methodNotAllowed (req, res) {
    res.status(405).setHeader('Allow', ["POST"]).end()
}


/*------------------ USERS ROUTES --------------------------- */
router.post('/', 
    verifyAcceptHeader,
    verifyJWTOnly,                   // adds id under req.body.auth         
    verifyUserDoesNotExist,
    verifyRequestBody,
    async (req, res) => {
        const today = new Date()
        const [month, day, year] = [today.getMonth() + 1, today.getDate(), today.getFullYear()]

        req.body.auth.skills = []
        req.body.auth.contacts = []
        req.body.auth.applications = []
        req.body.auth.date_created = `${month}/${day}/${year}`
        req.body.auth.username = req.body.username
        const id = req.body.auth.id
        delete req.body.auth.id
        try{
            const response = await model.postItemManualId(req.body.auth, id, 'users')
            res.status(201).send(response)
        } catch(e){
            console.error(e)
            console.error("Problem creating user!")
            res.status(500).end()
        }
})

router.get('/', methodNotAllowed)

router.put('/', methodNotAllowed)

router.patch('/', methodNotAllowed)

router.delete('/', methodNotAllowed)

/*------------------ USERS/USERNAME ROUTES -------------------- */

router.get('/:user_id', 
    verifyAcceptHeader,
    verifyJWTWithUserParam,             // adds id under req.body.auth, user info under req.body.user   
    async(req, res) => {
        res.status(200).send(req.body.user)
})

router.delete('/:user_id', 
    verifyJWTWithUserParam,             // adds id under req.body.auth, user info under req.body.user
    async (req, res) => {
        const user_id = req.body.user.id
        
        try {
            // delete applications tied to user
            const deletedApps = await model.deleteMatchingItemsFromKind('applications', 'user_id', user_id)
            
            // delete contacts tied to user
            const deletedContacts = await model.deleteMatchingItemsFromKind('contacts', 'user_id', user_id)

            // delete user
            await model.deleteItemManualID('users', user_id)
            res.status(200).send({"deletedApps": deletedApps.length, "deletedContacts": deletedContacts.length})
        } catch (error) {
            console.error(error)
            console.error("Problem deleting user!")
            res.status(500).end()
        }
})

router.put('/:user_id', methodNotAllowed)

router.patch('/:user_id', methodNotAllowed)

module.exports = router
