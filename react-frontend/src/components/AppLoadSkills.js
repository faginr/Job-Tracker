
// Get user contacts and set them for applications pages

async function loadSkills(datastore_url, user, token, setSkills) {
    const userID = user.sub.split('|')[1]
    const response = await fetch(`${datastore_url}/users/${userID}/skills`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    setSkills(data);
}

export default loadSkills;