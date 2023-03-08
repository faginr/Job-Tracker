const messages = require("../errorMessages");
const model = require("../../model");
const {auth} = require("express-oauth2-jwt-bearer");

/**
 * A collection of functions that aid in the verification
 * of a user through JWT.
 */


/**
 * Returns true if the user_id parameter matches the 
 * decoded JWT id. Otherwise returns False. 
 * @param {express.request} req 
 * @returns 
 */
function userMatchesJWT(req) {
    try {
        return(req.params.user_id === req.body.auth.id)
    } catch(err) {
        console.error(err)
        return false
    }
}

/**
 * Returns true if the user exists in datastore, otherwise returns false
 * @param {*} req 
 * @returns 
 */
async function userExists(req) {
    let user;
    try {
        user = await model.getItemByManualID('users', req.params.user_id)
        req.body['user'] = user[0]
    } catch(err) {
        console.error(err)
        return false
    }
    if(req.body.user === null || req.body.user === undefined) {
        return false
    }
    return true
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
async function verifyJWTWithUserParam(req, res, next) {

    // call verifyJWT and pass in empty "next" function so that control doesn't move
    // from this function
    await verifyJWTOnly(req, res, ()=>{})
    if(res.statusCode === 401){
        return
    }
    
    // verify user param and JWT match
    if (!(userMatchesJWT(req))) {
        return res.status(403).send({"Error": "User ID in JWT does not match URL"})
    }

    // verify user exists in the database
    if (!(await userExists(req))) {
        return res.status(404).send(messages[404].users)
    }
    
    next()
}

/**
 * This middleware verifies that a JWT is valid and adds the ID of
 * the requester to req.body.auth
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function verifyJWTOnly(req, res, next) {

    // auth is a middleware FUNCTION developed by OAuth, so need to 
    // CALL the middleware while providing req, res, and callback function 
    try{
        await auth({
            audience: 'Datastore',
            issuerBaseURL: 'https://capstone-react-auth.us.auth0.com/',
            tokenSigningAlg: 'RS256'
        })(req, res, function() {
            req.body.auth = {"id": req.auth.payload.sub.split('|')[1]}
        })
    } catch(e){
        console.error("Error decoding the JWT!")
        console.error(e)
        return res.status(401).send(messages[401])
    }
    next()
}

module.exports = {
    verifyJWTWithUserParam,
    verifyJWTOnly
}