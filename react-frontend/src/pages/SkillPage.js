import React, { useEffect, useState } from 'react';
import UserSkills from '../components/UserSkills';
import AddSkill from '../components/AddSkill';
import SlidingWindow from '../components/SlidingWindow';
import { user } from '../utils/User';
import ReactButton from '../components/ReactButton';
import fetchRequests from '../data_model/fetchRequests';

function SkillPage() {
  const [groupedSkills, setGroupedSkills] = useState({})
  const [skills, setSkills] = useState([])
  const [skillsModified, setSkillsModified] = useState(0)

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
    const data = await fetchRequests.getUserSkills(user, user)
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
          Page={<AddSkill skillAdded={skillsModified} setSkillAdded={setSkillsModified} userSkills={skills}/>}
          ClickableComponent={<ReactButton label={"Add New Skill"}/>} />
      </div>
    </div>
  );
}

export default SkillPage;