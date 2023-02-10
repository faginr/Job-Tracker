import React, { useEffect, useState } from 'react';
import SharedSkills from '../components/SharedSkill';
import SkillForm from '../components/SkillForm';
import DisplayButton from '../components/DisplayButton';

function SkillPage({user, setFeaturePane}) {

  const [skills, setSkills] = useState([])

  function setSkillFormAsFeature(skillToEdit) {
    setFeaturePane(<SkillForm skillToEdit={skillToEdit} setFeaturePane={setFeaturePane}/>)
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
    <div>
      <h1>Your current skills:</h1>
      <SharedSkills skills={skills} setFeaturePane={setSkillFormAsFeature} />
      
      <div>------------------</div>
      <DisplayButton displayTitle={"Add New Skill"} setFeaturePane={setSkillFormAsFeature} />
    </div>
  );
}

export default SkillPage;