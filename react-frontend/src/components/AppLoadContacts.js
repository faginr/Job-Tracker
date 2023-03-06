
// Get user contacts and set them for applications pages

async function loadContacts(datastore_url, user, setContacts) {
    const response = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/contacts`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${user}`
        }
    });
    const data = await response.json();
    setContacts(data);
  }

export default loadContacts;  