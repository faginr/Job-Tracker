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
  const [proficiency, setProficiency] = useState(0)
  const [skillsModified, setSkillsModified] = useState(0)

  const skillsMap = {
    "A": [], "B": [], "C": [], "D": [], "E": [], "F": [], "G": [],
    "H": [], "I": [], "J": [], "K": [], "L": [], "M": [], "N": [],
    "O": [], "P": [], "Q": [], "R": [], "S": [], "T": [], "U": [],
    "V": [], "W": [], "X": [], "Y": [], "Z": [], "Other": [],
  }
  
  function groupSkills() {
    for(let skill of skills) {
      try{
        skillsMap[skill.description[0]].push(skill)
      } catch(e){
        skillsMap.Other.push(skill)
      }
    }
  }

  function filterSkillsByProf(){
    if(proficiency === 0){
      return skillsMap
    } 
    if(proficiency === 6){
      return filterForNull()
    }
    
    const newSkillMap = createBlankSkillMap()
    // loop through skillsMap and filter based on prof
    for(let letter in skillsMap){
      for(let skill of skillsMap[letter]){
        if(skill.proficiency === proficiency){
          newSkillMap[letter].push(skill)
        }
      }
    }
    return newSkillMap
  }

  function filterForNull(){
    const newSkillMap = createBlankSkillMap()
    for(let letter in skillsMap){
      for(let skill of skillsMap[letter]){
        if(skill.proficiency == undefined){
          newSkillMap[letter].push(skill)
        }
      }
    }
    return newSkillMap
  }

  function createBlankSkillMap(){
    // create blank copy of skillsMap
    const newSkillMap = {}
    for(let letter in skillsMap){
      newSkillMap[letter] = []
    }
    return newSkillMap
  }


  async function loadUserSkills() {
    const data = await fetchRequests.getUserSkills(user, user)
    setSkills(data)
  }

  groupSkills()
  const filteredSkillMap = filterSkillsByProf()

  useEffect(() => {
    loadUserSkills()
  }, [skillsModified])
  
  return (
    <div id="skills-page">
      <h1>Your current skills:</h1>
      <label>
        Filter By Proficiency: 
        <select onChange={(e)=>setProficiency(parseInt(e.target.value))}>
          <option value={0}>--No Filter--</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>No Rating</option>

        </select>
      </label>
      <UserSkills userSkills={filteredSkillMap} skillsModified={skillsModified} setSkillsModified={setSkillsModified} />
      
      <div>
        <SlidingWindow 
          Page={<AddSkill skillAdded={skillsModified} setSkillAdded={setSkillsModified} userSkills={skills}/>}
          ClickableComponent={<ReactButton label={"Add New Skill"}/>} />
      </div>
    </div>
  );
}

export default SkillPage;