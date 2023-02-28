const express = require('express');
const model = require('../model');
const messages = require('./errorMessages')
const verifyUser = require('./middleware/verifyUser')

const router = express.Router()


/*--------------- Middleware Functions --------------------- */
    

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
                console.log("key not in request")
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
router.get('/', verifyUser.verifyJWTOnly,
                verifyAcceptHeader, async (req, res) => {
    try {
        const sortedSkills = await model.getItemsSorted('skills', 'description')
        res.status(200).send(sortedSkills)
    } catch (err) {
        console.error(err)
        res.status(500).end()
    }
})

router.post('/', verifyRequestBodyKeys,
                 verifyRequestBodyVals,
                 verifyUser.verifyJWTOnly,
                 verifyAcceptHeader,
                 verifyContentTypeHeader, async (req, res) => {
    
    try {
        // check if skill already exists
        let skills = await model.getItemsNoPaginate('skills')
        for (let skill of skills){
            if (skill.description.toLowerCase() === req.body.description.toLowerCase()){
                //  if it does, just send the info back to avoid duplicates
                return res.status(201).send(skill)
            }
        }
        
        // otherwise create it
        let skill = await model.postItem({"description": req.body.description}, 'skills')
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
