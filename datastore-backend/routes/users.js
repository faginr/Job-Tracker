const express = require('express')
const model = require('../model')
const errorMessages = require('./errorMessages')
const verifyUser = require('./middleware/verifyUser')

const router = express.Router()

// body-parser already used at the top app level

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

/**
 * Verifies that the resource on which action is requested actually exists.
 * If it does exist, the existing resource is added to the request body 
 * as existResource and passes control to next middleware. If it doesn't 
 * exist, a 404 status/error message is returned.
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
async function verifyResourceExists (req, res, next) {
    const resourceId = req.params.user_id

    const resource = await model.getItemByID('users', resourceId)

    if (resource[0] === null || resource[0] === undefined) {
        res.status(404).send(errorMessages[404].users)
    } else {
        req.body.existResource = resource[0]
        next()
    }
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

    const resource = await model.getItemByID('users', resourceId)
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
    verifyUser.verifyJWTOnly,       // adds username, id under req.body.auth         
    verifyUserDoesNotExist,
    async (req, res) => {
        const today = new Date()
        const [month, day, year] = [today.getMonth() + 1, today.getDate(), today.getFullYear()]

        req.body.auth.skills = []
        req.body.auth.contacts = []
        req.body.auth.applications = []
        req.body.auth.date_created = `${month}/${day}/${year}`
        const id = req.body.auth.id
        delete req.body.auth.id
        const response = await model.postItemManId(req.body.auth, id, 'users')
        res.status(201).send(response)
})

router.get('/', methodNotAllowed)

router.put('/', methodNotAllowed)

router.patch('/', methodNotAllowed)

router.delete('/', methodNotAllowed)

/*------------------ USERS/USERNAME ROUTES -------------------- */

router.get('/:user_id', 
    verifyAcceptHeader,
    verifyUser.verifyJWTWithUserParam,  // adds username, id under req.body.auth   
    verifyResourceExists,               // adds user data under req.body.existResource
    async(req, res) => {
        res.status(200).send(req.body.existResource)
})

router.delete('/:user_id', 
    verifyResourceExists,               // adds user data under req.body.existResource
    verifyUser.verifyJWTWithUserParam,
    async (req, res) => {
        const user_id = req.body.existResource.id
        
        try {
            // delete applications tied to user
            const deletedApps = await model.deleteMatchingItemsFromKind('applications', 'user_id', user_id)
            
            // delete contacts tied to user
            const deletedContacts = await model.deleteMatchingItemsFromKind('contacts', 'user_id', user_id)

            // delete user
            await model.deleteItem('users', user_id)
            res.status(200).send({"deletedApps": deletedApps.length, "deletedContacts": deletedContacts.length})
        } catch (error) {
            console.error(error)
            res.status(500).end()
        }
})

router.put('/:user_id', methodNotAllowed)

router.patch('/:user_id', methodNotAllowed)

module.exports = router
