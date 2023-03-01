import React, { useEffect, useState } from 'react';
import UserSkills from '../components/UserSkills';
import AddSkill from '../components/AddSkill';
import SlidingWindow from '../components/SlidingWindow';
import ReactButton from '../components/ReactButton';
import LoadingPage from './LoadingPage';
import { useAuth0 } from '@auth0/auth0-react';
import { useAPI } from '../utils/Auth0Functions';
import fetchRequests from '../data_model/fetchRequests';

const apiURL = process.env.REACT_APP_API_SERVER_URL

function SkillPage() {
  const [skillsModified, setSkillsModified] = useState(0)
  const [skills, setSkills] = useState([])
  const {user, isAuthenticated} = useAuth0()
  const getTokenFromAuth0 = useAPI()

  // group skills any time page re-renders
  const groupedSkills = splitSkillsByProf(skills)

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
    const token = await getTokenFromAuth0({redirectURI: '/skills'})
    let data = [];
    if(isAuthenticated){
      data = await fetchRequests.getUserSkills(user, token);
    }
    setSkills(data);
  }

  useEffect(() => {
    loadUserSkills()
  }, [skillsModified, user])

  return (
    isAuthenticated ?
      <div id="skills-page">
        <h1>Your current skills:</h1>
        <UserSkills userSkills={groupedSkills} skillsModified={skillsModified} setSkillsModified={setSkillsModified} />
        
        <div>
          <SlidingWindow 
            Page={<AddSkill skillAdded={skillsModified} setSkillAdded={setSkillsModified} userSkills={skills}/>}
            ClickableComponent={<ReactButton label={"Add New Skill"}/>} />
        </div>
      </div>
    :
      <LoadingPage />
  );
}

export default SkillPage;