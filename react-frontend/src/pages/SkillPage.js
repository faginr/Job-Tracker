import React, { useEffect, useState } from 'react';
import UserSkills from '../components/UserSkills';
import AddSkill from '../components/AddSkill';
import SlidingWindow from '../components/SlidingWindow';
import ReactButton from '../components/ReactButton';
import { useAuth0 } from '@auth0/auth0-react';
import { useAPI } from '../utils/Auth0Functions';

const apiURL = process.env.REACT_APP_API_SERVER_URL

function SkillPage() {
  const [groupedSkills, setGroupedSkills] = useState({})
  const [skillsModified, setSkillsModified] = useState(0)
  const [skills, setSkills] = useState([])
  const {user, isAuthenticated} = useAuth0()
  const {getTokenFromAuth0} = useAPI()

  function splitSkillsByProf(userSkills) {
    const skillsMap = {"high": [], "med": [], "low": []}
    for(let skill of userSkills) {
        switch (skill.proficiency) {
            case 5:
            case 4:
                skillsMap.high.push(skill)
                break;
            case 3:
            case 2:
                skillsMap.med.push(skill)
                break;
            default:
                skillsMap.low.push(skill)
        }
    }
    return skillsMap
}


  async function loadUserSkills() {

    // get the access token from Auth0 and redirect back to this page
    const accessToken = await getTokenFromAuth0({redirectURI: '/skills'})

    // fetch the user's skills once authenticated
    if (isAuthenticated){
      let response;
      try {
        response = await fetch(`${apiURL}/users/${user?.sub.slice(6)}/skills`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
      } catch(err){
        alert("Uh oh... looks like the server is in-communicado!")
      }
      if (response.status !== 200) {
        // show error page??
        console.log("Whoops! Fetch to skills failed")
        return setSkills([])
      }
      const data = await response.json();
      setSkills(data)
    };
  }

  useEffect(() => {loadUserSkills()}, [skillsModified])
  useEffect(() => setGroupedSkills(splitSkillsByProf(skills)), [skills])

  return (
    <div id="skills-page">
      <h1>Your current skills:</h1>
      <UserSkills userSkills={groupedSkills} skillsModified={skillsModified} setSkillsModified={setSkillsModified} />
      
      <div>
        <SlidingWindow 
          Page={<AddSkill skillAdded={skillsModified} setSkillAdded={setSkillsModified}/>}
          ClickableComponent={<ReactButton label={"Add New Skill"}/>} />
      </div>
    </div>
  );
}

export default SkillPage;