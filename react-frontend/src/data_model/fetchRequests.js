export default class fetchRequests {
    static DATASTORE_URL = process.env.REACT_APP_API_SERVER_URL

    static getIDFromUser(user){
        if (user == undefined || user.sub == undefined){
            return ''
        }
        return user.sub.split('|')[1]
    }

    // returns the response object, not the user info from datastore
    // for processing the response status.
    static getUserResponseObject = async function(user, accessToken){
        const userID = this.getIDFromUser(user)
        const response = await fetch(`${this.DATASTORE_URL}/users/${userID}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response
    }

    static createUser = async function(user, accessToken) {
        console.info('creating user in datastore')
        
        const res = await fetch(`${this.DATASTORE_URL}/users`, {
            method: 'POST',
            body: JSON.stringify({"username": user.name}),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'content-type': 'application/json'
            }
        })
        if (res.status !== 201) {
            throw ReferenceError('Error creating user in datastore')
        }
    }

    static getAllSkills = async function (accessToken) {
            const response = await fetch(`${this.DATASTORE_URL}/skills`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            if (response.status !== 200) {
                alert('Uh-oh, I couldn\'t load all the skills in DS!')
                return
            }
    
            const data = await response.json()
            return data
        }
    

    static getUserSkills = async function (user, accessToken) {
        const userID = this.getIDFromUser(user)
        const response = await fetch(`${this.DATASTORE_URL}/users/${userID}/skills`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (response.status !== 200) {
          // show error page??
          alert(`Whoops! Fetch to skills failed! Got response ${response.status}`)
          return []
        }
        const data = await response.json();
        return data
    }


    static createSkill = async function (accessToken, requestBody){
        let response = await fetch(`${this.DATASTORE_URL}/skills`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-type': 'application/json'
            }, 
            // only send the description to POST
            body: JSON.stringify(requestBody),
        })
        if (response.status !== 201) {
            alert(`Uh-oh, I couldn't create ${requestBody} in DS!`)
            return
        }
        return await response.json()
    }

    static tieSkillToUser = async function (user, accessToken, requestBody, skillID){
        const userID = this.getIDFromUser(user)
        let putResponse = await fetch(`${this.DATASTORE_URL}/users/${userID}/skills/${skillID}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-type': 'application/json',
            }, 
            // PUT method expect only proficiency in body
            // and form auto-formats prof as string, so need to conver to num
            body: JSON.stringify(requestBody)
        })
        if (putResponse.status !== 204) {
            alert(`Uh-oh, I couldn't tie ${skillID} to user!`)
        }
    }

    static updateSkillProficiency = async function(user, accessToken, requestBody, skillID) {
        const userID = this.getIDFromUser(user)
        const response = await fetch(`${this.DATASTORE_URL}/users/${userID}/skills/${skillID}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        if (response.status !== 204) {
            alert("Uh-oh, something went wrong with updating the skill")
        }
    }

    static deleteSkillFromUser = async function(user, accessToken, skillID) {
        const userID = this.getIDFromUser(user)
        const response = await fetch(`${this.DATASTORE_URL}/users/${userID}/skills/${skillID}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        if (response.status !== 200) {
            alert("Uh-oh, I had trouble deleting this skill")
        }
    }

    static getAllApplications = async function(user, accessToken){
        const userID = this.getIDFromUser(user)
        const response = await fetch(`${this.DATASTORE_URL}/users/${userID}/applications`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        if (response.status !== 200) {
            alert("Uh-oh, I had trouble getting applications")
        }
        return await response.json()
    }

    static tieSkillToApp = async function(user, accessToken, skillID, appID){
        const userID = this.getIDFromUser(user)
        const response = await fetch(`${this.DATASTORE_URL}/users/${userID}/applications/${appID}/skills/${skillID}`,{
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        if (response.status !== 204){
            alert(`Whoops... I couldn't tie skill: ${skillID} to app: ${appID}`)
        }
    }
}