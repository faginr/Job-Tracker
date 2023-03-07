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
  // const [groupedSkills, setGroupedSkills] = useState({})
  const [skills, setSkills] = useState([])
  const [proficiency, setProficiency] = useState(0)
  const [skillsModified, setSkillsModified] = useState(0)
  const {user, isAuthenticated} = useAuth0()
  const getTokenFromAuth0 = useAPI()

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
    const token = await getTokenFromAuth0({redirectURI: '/skills'})
    let data = [];
    if(isAuthenticated){
      data = await fetchRequests.getUserSkills(user, token);
    }
    setSkills(data);
  }

  groupSkills()
  const filteredSkillMap = filterSkillsByProf()

  useEffect(() => {
    loadUserSkills()
  }, [skillsModified, user])
  
  return (
    isAuthenticated?
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
    :
      <LoadingPage />
  );
}

export default SkillPage;