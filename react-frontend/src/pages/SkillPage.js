import React, { useEffect, useState } from 'react';
import SharedSkills from '../components/SharedSkill';
import SkillForm from '../components/SkillForm';
import DisplayButton from '../components/DisplayButton';

function SkillPage({user}) {

  const [skills, setSkills] = useState([])
  const [skillToEdit, setSkillToEdit] = useState()
  const [edit, setEdit] = useState(false)
  const [addNew, setAddNew] = useState(false)

  function toggleEdit() {
    setEdit(!edit)
  }

  function toggleAdd() {
    setAddNew(!addNew)
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
      <SharedSkills skills={skills} setShowForm={toggleEdit} setObjectToEdit={setSkillToEdit} />
      {edit?<SkillForm skillToEdit={skillToEdit} closeForm={toggleEdit}/>:<div></div>}
      
      <div>------------------</div>
      <DisplayButton displayTitle={"Add New Skill"} setShowForm={toggleAdd}/>
      {addNew?<SkillForm closeForm={toggleAdd}/>:<div></div>}
    </div>
  );
}

export default SkillPage;