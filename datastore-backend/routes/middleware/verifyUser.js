const messages = require("../errorMessages")
const model = require("../../model")

/**
 * A collection of functions that aid in the verification
 * of a user through JWT.
 */

/**
 * Translates the JWT fields to datastore fields.
 * @param {Object} decodedJWT 
 * @returns 
 */
function extractUserInfo (decodedJWT) {
    const userInfo = {
        "username": decodedJWT.username,
        "id": parseInt(decodedJWT.sub, 10)
    }

    return userInfo
}

function fakeDecode(req) {
    req.body['auth'] = {
        "username": "tester",
        "sub": "1234567890",
    }
}

/**
 * Verifies that the JWT is valid. If valid, adds user info obtained
 * from the JWT to the body of the request under req.body.auth (username, id)
 * and returns True, otherwise returns False.
 * @param {express.request} req 
 * @returns {boolean} True if valid, otherwise false
 */
function jwtValid (req) {
    let token = req.get('authorization')
    
    try {
        // put decode capability here, currently stubbing out
        // decode places info under req.body.auth
        fakeDecode(req)

        // if decode is successful, extract the user info
        // and replace req.body.auth with it
        req.body.auth = extractUserInfo(req.body.auth)
        return true
    }
    catch (err) {
        console.error(err)
        return false
    }
}

/**
 * Returns true if the user_id parameter matches the 
 * decoded JWT id. Otherwise returns False. 
 * @param {express.request} req 
 * @returns 
 */
function userMatchesJWT(req) {
    try {
        return(parseInt(req.params.user_id, 10) === req.body.auth.id)
    } catch(err) {
        console.error(err)
        return false
    }
}


async function addUserToBody(req) {
    let user = await model.getItemByID('users', req.params.user_id)
    req.body['user'] = user[0]
}


/**
 * Use this middleware when on route like /users/:user_id...
 * Checks to make sure the JWT passed in the request is valid.
 * Then checks to make sure the user_id parameter matches the JWT passed.
 * Finally checks to make sure the user exists.
 * If both pass, passes control to next function with {username, id}
 * stored under req.body.auth and user lookup data from DS under req.body.user
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 * @returns 
 */
async function verifyJWTWithUserParam (req, res, next) {
    if (!(jwtValid(req))){
        return res.status(401).send(messages[401])
    }

    if (!(userMatchesJWT(req))) {
        return res.status(403).send(messages[403])
    }

    await addUserToBody(req)
    
    if (req.body.user === null || req.body.user === undefined) {
        return res.status(404).send(messages[404].users)
    }

    next()
}


/**
 * Use this middleware when on route like /users with no /user_id.
 * Does not verify JWT matches user parameter. Only verifies JWT
 * is valid. If valid, adds user info from JWT {username, id} under
 * req.body.auth. Otherwise sends a 401 message.
 * @param {express.request} req 
 * @param {express.response} res 
 * @param {express.next} next 
 * @returns 
 */
function verifyJWTOnly(req, res, next) {
    if (!(jwtValid(req))){
        return res.status(401).send(messages[401])
    }
    next()
}

module.exports = {
    verifyJWTWithUserParam: verifyJWTWithUserParam,
    verifyJWTOnly: verifyJWTOnly
}