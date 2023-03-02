

/************************************************************* 
 * Function to get applications 
 ************************************************************/
async function ContactGetApps(datastore_url, user, setApps) {
  const response = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/applications`,
    { 
      method: "GET",
      headers: {
        'Accept': 'application/json', 
        'Authorization': `Bearer ${user}`}
    }
  );
  if (response.status === 200) {
    //console.log("Successfully fetched the applications!"); 
  } else {
    console.log(`Failed to fetch the applications, status code = ${response.status}`);
  };
  const data = await response.json();
  // sort by title
  // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  data.sort((a, b) => {
    const titleA = a.title.toUpperCase();
    const titleB = b.title.toUpperCase();
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    };
    return 0;
  });
  setApps(data);
};

export default ContactGetApps;