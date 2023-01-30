// error messages used by the application
const errorMessages = {
  400: {jsonError: {"Error": "Problem with JSON format in body."}, 
        keyError: {"Error": "The user sends invalid object keys."},
        userExists: {"Error": "User already exists"}
      },
  403: {"403": "User does not own resource"}, 
  404: {"Error": "No contact exists with this id."},
  406: {"Error": "The user sends unsupported Accept header."},
  415: {"Error": "The user sends unsupported Content-Type."}
}

module.exports = errorMessages;