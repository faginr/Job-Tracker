import React, { useEffect, useState } from 'react';
import UserSkills from '../components/UserSkills';
import AddSkill from '../components/AddSkill';
import SlidingWindow from '../components/SlidingWindow';
import { user } from '../utils/User';
import {datastore_url} from '../utils/Constants';
import ReactButton from '../components/ReactButton';

function SkillPage() {
  const [groupedSkills, setGroupedSkills] = useState({})
  const [skills, setSkills] = useState([])
  const [skillsModified, setSkillsModified] = useState(0)

  function splitSkillsByProf(userSkills) {
    console.log("bucketing")
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
    const response = await fetch(`${datastore_url}/users/${JSON.parse(user).sub}/skills`, {
      headers: {
        'Authorization': `Bearer ${user}`
      }
    });
    if (response.status !== 200) {
      // show error page??
      console.log("Whoops! Fetch to skills failed")
      return setSkills([])
    }
    const data = await response.json();
    setSkills(data)
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