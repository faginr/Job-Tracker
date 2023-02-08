import React, { useEffect, useState } from 'react';
import SharedSkills from '../components/SharedSkill';
import SkillForm from '../components/SkillForm';
import DisplayButton from '../components/DisplayButton';
import { user } from '../components/User';

function SkillPage({setFeaturePane}) {
  const [skills, setSkills] = useState([])

  function handleFormSubmit() {
    // on form submission, close the feature pane and update your list of 
    // existing skills to match what you just submitted
    setFeaturePane()
    loadSkills()
  }

  function setSkillFormAsFeature(skillToEdit) {
    setFeaturePane(<SkillForm skillToEdit={skillToEdit} handleFormSubmittal={handleFormSubmit}/>)
  }

  async function loadSkills() {
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

  useEffect(() => {loadSkills()}, [])

  return (
    <div id="skills-page">
      <h1>Your current skills:</h1>
      <SharedSkills skills={skills} handleClickAction={setSkillFormAsFeature} />
      
      <div>------------------</div>
      <DisplayButton displayTitle={"Add New Skill"} handleClickAction={setSkillFormAsFeature} />
    </div>
  );
}

export default SkillPage;