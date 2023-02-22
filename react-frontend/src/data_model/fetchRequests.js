export default class fetchRequests {
    static DATASTORE_URL = process.env.REACT_APP_API_SERVER_URL

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

    static tieSkillToUser = async function (accessToken, requestBody, skillID){
        let putResponse = await fetch(`${this.DATASTORE_URL}/users/${JSON.parse(accessToken).sub}/skills/${skillID}`, {
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
}