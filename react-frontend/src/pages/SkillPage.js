import React, { useEffect, useState } from 'react';
import UserSkills from '../components/UserSkills';
import SkillForm from '../components/SkillForm';
import DisplayButton from '../components/DisplayButton';
import AddSkill from '../components/AddSkill';
import LoadingPage from './LoadingPage';
import { useAuth0 } from '@auth0/auth0-react';
import { useAPI } from '../utils/Auth0Functions';

const apiURL = process.env.REACT_APP_API_SERVER_URL

function SkillPage({setFeatureChild}) {
  const [skills, setSkills] = useState({})
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

  function handleFormSubmit() {
    // on form submission, close the feature pane and update your list of 
    // existing skills to match what you just submitted
    setFeatureChild()
    loadUserSkills()
  }

  function setSkillFormAsFeature(skillToEdit) {
    setFeatureChild(<SkillForm skillToEdit={skillToEdit} handleFormSubmittal={handleFormSubmit}/>)
  }

  function setAddSkillAsFeature() {
    setFeatureChild(<AddSkill handleSkillClick={handleFormSubmit}/>)
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
        alert("Whoops! I failed to get your skills")
        return setSkills({})
      }
      const data = await response.json();
      setSkills(splitSkillsByProf(data));
    }
  }

  useEffect(() => {
    loadUserSkills()
  }, [])

  if (isAuthenticated){
    return (
      <div id="skills-page">
        <h1>Your current skills:</h1>
        <UserSkills userSkills={skills} handleClickAction={setSkillFormAsFeature} />
        
        <div>------------------</div>
        <DisplayButton displayTitle={"Add New Skill"} handleClickAction={setAddSkillAsFeature} />
      </div>
    );
  } else{
    return <LoadingPage />
  }
}

export default SkillPage;