
// Get user contacts and set them for applications pages

async function loadContacts(datastore_url, user, token, setContacts) {
    const userID = user.sub.split('|')[1]
    const response = await fetch(`${datastore_url}/users/${userID}/contacts`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    setContacts(data);
  }

export default loadContacts;  