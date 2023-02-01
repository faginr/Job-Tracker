// error messages used by the application
const errorMessages = {
  400: {jsonError: {"Error": "Problem with JSON format in body."}, 
        keyError: {"Error": "The user sends invalid object keys."},
        userExists: {"Error": "User already exists."}
      },
  403: {"Error": "User does not own resource."}, 
  404: {"Error": "No contact exists with this id."},
  405: {"Error": "Only GET, POST requests allowed for all applications route."},
  406: {"Error": "The user sends unsupported Accept header."},
  415: {"Error": "The user sends unsupported Content-Type."},
  500: {"Error": "Request failed."}
}

module.exports = errorMessages;