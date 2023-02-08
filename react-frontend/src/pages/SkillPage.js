import React, { useEffect, useState } from 'react';
import UserSkills from '../components/UserSkills';
import SkillForm from '../components/SkillForm';
import DisplayButton from '../components/DisplayButton';
import { user } from '../components/User';
import AddSkill from '../components/AddSkill';

function SkillPage({setFeatureChild}) {
  const [skills, setSkills] = useState([])

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
    const response = await fetch(`/users/${JSON.parse(user).sub}/skills`, {
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
    setSkills(data);
  }

  useEffect(() => {loadUserSkills()}, [])

  return (
    <div id="skills-page">
      <h1>Your current skills:</h1>
      <UserSkills userSkills={skills} handleClickAction={setSkillFormAsFeature} />
      
      <div>------------------</div>
      <DisplayButton displayTitle={"Add New Skill"} handleClickAction={setAddSkillAsFeature} />
    </div>
  );
}

export default SkillPage;