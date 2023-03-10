import React, { useEffect, useState } from 'react';
import UserSkills from '../components/UserSkills';
import AddSkill from '../components/AddSkill';
import SlidingWindow from '../components/SlidingWindow';
import ReactButton from '../components/ReactButton';
import LoadingPage from './LoadingPage';
import { useAuth0 } from '@auth0/auth0-react';
import { useAPI } from '../utils/Auth0Functions';
import fetchRequests from '../data_model/fetchRequests';
import MostUsedSkills from '../components/MostUsedSkills';

function SkillPage() {
  const [skills, setSkills] = useState([])
  const {user, isAuthenticated} = useAuth0()
  const [loading, setLoading] = useState(true);
  const getTokenFromAuth0 = useAPI()


  async function loadUserSkills() {
    const token = await getTokenFromAuth0({redirectURI: '/skills'})
    let data = [];
    if(isAuthenticated){
      data = await fetchRequests.getUserSkills(user, token);
    }
    setSkills(data);
    setLoading(false);
  }

  useEffect(() => {
    loadUserSkills()
  }, [user])
  
  return (
    (isAuthenticated && loading === false) ? 
    <div id="skills-page">
      <h1>Your current skills:</h1>
      <MostUsedSkills userSkills={skills} />
      <UserSkills userSkills={skills} setUserSkills={setSkills} />
      
      <SlidingWindow 
        Page={<AddSkill userSkills={skills} setUserSkills={setSkills} />}
        ClickableComponent={<ReactButton label={"Add New Skill"}/>} />
    </div>
    :
      <LoadingPage />
  );
}

export default SkillPage;