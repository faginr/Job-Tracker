const express = require('express')
const model = require('./model')
const messages = require('./errorMessages')
// TODO: Import auth client

const router = express.Router()

// body-parser already used at the top app level

function newUser (decodedJWT) {
    let date = new Date()
    const [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()]

    const newUser = {
        "username": decodedJWT.payload.username,
        "created": `${month}/${day}/${year}`,
        "id": decodedJWT.payload.sub
    }

    return newUser
}

function fakeDecode(token, req) {
    req.body.auth.username = 'tester'
    req.body.auth.id = 1234567890
}

/*--------------- Middleware Functions --------------------- */
/**
 * Verifies that the JWT is valid. If valid, adds user info obtained
 * from the JWT to the body of the request (username, id, date created).
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
async function verifyJWT (req, res, next) {
    let token = req.get('authorization')
    
    try {
        // put decode capability here, currently stubbing out
        // decode places info in request body under auth
        fakeDecode(token, req)

        // if JWT is valid, add new user info from JWT to the body 
        // of the request
        req.body = newUser(req.body.auth)
        next()
    }
    catch (err) {
        console.error(err)
        res.status(401).send(messages[401])
    }
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
        res.status(415).send(messages[415])
    } else {
        next()
    }
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
        res.status(406).send(messages[406])
    } else {
        next()
    }
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
    const requiredKeys = ["username", "created", "id"]
    const request = req.body
    let valid = true

    if (requiredKeys.length !== Object.keys(request).length) {
        valid = false
    }

    if (valid) {
        requiredKeys.forEach(key => {
            if (!(key in request)) {
                valid = false
            }
        })
    }

    if (valid) {
        next()
    } else {
        res.status(400).send(messages[400].badKeys)
    }
}

/**
 * Verifies that the request body values do not contain invalid information
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
function verifyRequestBodyVals (req, res, next) {
    /**
     * In this case, the req body is built by the JWT, and only after the 
     * JWT has been deemed valid. Since user does not pass body explicitly, 
     * no need to verify body vals.
    */ 
   next()
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
    const resourceId = req.params.username

    const resource = await model.getItemByID('users', resourceId, false)
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
    const resourceId = req.params.username

    const resource = await model.getItemByID('users', resourceId, false)
    if (resource[0] !== null || resource[0] !== undefined) {
        res.status(400).send(errorMessages[400].userExists)
    } else {
        next()
    }
}


/**
 * Verifies that the user requesting action via a JWT owns the resource being requested. 
 * NOTE - this middleware must come after verifyResourceExists and verifyJWT, as they 
 * perform actions that this middleware depends on. If the user requesting action does 
 * not match the current owner of the resource, a 403 status/error message is returned.
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
async function verifyUserOwnsResource (req, res, next) {
    // existing resource is stored in the body of the request at this point 
    // (after verifyResourceExists)
    if (req.body.existResource.username !== req.body.username) {
        res.status(403).send(errorMessages[403])
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
router.post('/', verifyAcceptHeader,
                verifyJWT,
                verifyUserDoesNotExist,
                verifyRequestBodyKeys,
                verifyRequestBodyVals, async (req, res) => {
    
    req.body.skills = []
    req.body.contacts = []
    req.body.applications = []
    const id = req.body.id
    delete req.body.id
    const response = await model.postItemManId(req.body, id, 'users')
    res.status(201).send(response)
})

router.get('/', methodNotAllowed)

router.put('/', methodNotAllowed)

router.patch('/', methodNotAllowed)

router.delete('/', methodNotAllowed)

/*------------------ USERS/USERNAME ROUTES -------------------- */

router.get('/users/:username', verifyAcceptHeader,
                            verifyJWT,
                            verifyResourceExists,
                            verifyUserOwnsResource, async(req, res) => {
    res.status(200).send(req.body.existResource)
})

module.exports = router