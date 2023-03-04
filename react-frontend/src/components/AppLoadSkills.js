
// Get user contacts and set them for applications pages

async function loadSkills(datastore_url, user, setSkills) {
    const response = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/skills`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${user}`
        }
    });
    const data = await response.json();
    setSkills(data);
}

export default loadSkills;