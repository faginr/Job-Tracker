const express = require('express');
const model = require('./model');
const messages = require('./errorMessages')

const router = express.Router()

function fakeDecode(token, req) {
    req.body['auth'] = {
        "username": token.username,
        "sub": token.sub
    }
}

function extractUserInfo (decodedJWT) {
    return {
        "username": decodedJWT.username,
        "id": parseInt(decodedJWT.sub, 10)
    }
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
    token = JSON.parse(token.slice(7))
    
    try {
        // put decode capability here, currently stubbing out
        // decode places info in request body under auth
        fakeDecode(token, req)

        // if JWT is valid, add user info from JWT to the body 
        // of the request
        req.body.auth = extractUserInfo(req.body.auth)
        next()
    }
    catch (err) {
        console.error(err)
        res.status(401).send(messages[401])
    }
}


/*--------------- Middleware Functions --------------------- */
/**
 * Verifies that the JWT is valid. If valid, adds user info obtained
 * from the JWT to the body of the request (username, id, date created).
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
async function verifyUser(req, res, next) {
    // make sure JWT matches user in db
    let existUser
    try {
        existUser = await model.getItemByID('users', req.body.auth.id)
        delete req.body.auth
    } catch (err) {
        console.error(err)
        return res.status(500).end()
    }
    if (existUser[0] === null || existUser[0] === undefined) {
        return res.status(403).send(messages[403])
    }
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
    const requiredKeys = ["description"]
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

    if (!valid) {
        return res.status(400).send(messages[400].keyError)
    } 
    next()
}

/**
 * Verifies that the request body values do not contain invalid information
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 */
function verifyRequestBodyVals (req, res, next) {
   next()
}

/**
 * Sends a 405 message with Allow header set properly.
 * @param {express.request} req 
 * @param {express.response} res 
 */
function methodNotAllowedSkills (req, res) {
    res.status(405).setHeader('Allow', ["POST", "GET"]).end()
}

/**
 * Sends a 405 message with Allow header set properly.
 * @param {express.request} req 
 * @param {express.response} res 
 */
function methodNotAllowedSkillID (req, res) {
    res.status(405).setHeader('Allow', []).end()
}

/*------------------- ROUTES ------------------------ */
router.get('/', verifyJWT, verifyUser, verifyAcceptHeader, async (req, res) => {
    try {
        const skills = await model.getItemsNoPaginate('skills')
        res.status(200).send(skills)
    } catch (err) {
        console.error(err)
        res.status(500).end()
    }
})

router.post('/', verifyJWT, 
                 verifyUser,
                 verifyRequestBodyKeys,
                 verifyRequestBodyVals,
                 verifyAcceptHeader,
                 verifyContentTypeHeader, async (req, res) => {
    
    try {
        // check if skill already exists
        let skill = await model.getFilteredItems('skills', 'description', req.body.description)
        
        //  if it does, just send the info back to avoid duplicates
        if (skill[0] !== null && skill[0] !== undefined) {
            return res.status(201).send(skill[0])
        }

        // otherwise create it
        skill = await model.postItem(req.body, 'skills')
        return res.status(201).send(skill)
    } catch (err) {
        console.error(err)
        return res.status(500).end()
    }
})

router.put('/', methodNotAllowedSkills)
router.patch('/', methodNotAllowedSkills)
router.delete('/', methodNotAllowedSkills)
router.use('/skills/:skill_id', methodNotAllowedSkillID)


module.exports = router
