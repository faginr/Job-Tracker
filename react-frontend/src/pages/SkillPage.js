import React, { useEffect, useState } from 'react';
import UserSkills from '../components/UserSkills';
import AddSkill from '../components/AddSkill';
import SlidingWindow from '../components/SlidingWindow';
import { user } from '../utils/User';
import ReactButton from '../components/ReactButton';
import fetchRequests from '../data_model/fetchRequests';

function SkillPage() {
  // const [groupedSkills, setGroupedSkills] = useState({})
  const [skills, setSkills] = useState([])
  const [skillsModified, setSkillsModified] = useState(0)

  const skillsMap = {
    "A": [], "B": [], "C": [], "D": [], "E": [], "F": [], "G": [],
    "H": [], "I": [], "J": [], "K": [], "L": [], "M": [], "N": [],
    "O": [], "P": [], "Q": [], "R": [], "S": [], "T": [], "U": [],
    "V": [], "W": [], "X": [], "Y": [], "Z": [], "Other": [],
  }
  
  splitSkillsByFirstLetter()
  function splitSkillsByFirstLetter() {

    for(let skill of skills) {
        try{
          skillsMap[skill.description[0]].push(skill)
        } catch(e){
          skillsMap.Other.push(skill)
        }
      }
  }


  async function loadUserSkills() {
    const data = await fetchRequests.getUserSkills(user, user)
    setSkills(data)
  }

  useEffect(() => {
    loadUserSkills()
  }, [skillsModified])
  
  return (
    <div id="skills-page">
      <h1>Your current skills:</h1>
      <UserSkills userSkills={skillsMap} skillsModified={skillsModified} setSkillsModified={setSkillsModified} />
      
      <div>
        <SlidingWindow 
          Page={<AddSkill skillAdded={skillsModified} setSkillAdded={setSkillsModified} userSkills={skills}/>}
          ClickableComponent={<ReactButton label={"Add New Skill"}/>} />
      </div>
    </div>
  );
}

export default SkillPage;