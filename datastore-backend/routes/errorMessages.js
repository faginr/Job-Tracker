// error messages used by the application
const errorMessages = {
  400: {jsonError: {"Error": "Problem with JSON format in body."}, 
        keyError: {"Error": "The user sends invalid object keys."},
        userExists: {"Error": "User already exists"},
        valueError: {"Error": "Request body values contain invalid data"}
      },
  401: {"401": "JWT is Invalid!"},
  403: {"403": "User does not own resource"}, 
  404: {contacts: {"Error": "No contact exists with this id."},
        users: {"404": "User does not exist"},
        skills: {"404": "Skill does not exist"}
      },
  406: {"Error": "The user sends unsupported Accept header."},
  415: {"Error": "The user sends unsupported Content-Type."}
}

module.exports = errorMessages;