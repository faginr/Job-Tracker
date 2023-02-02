import React, { useEffect, useState } from 'react';
import SharedSkills from '../components/SharedSkill';

function AboutPage() {
  const [skills, setSkills] = useState([])

  async function loadSkills() {
    const response = await fetch('/skills');
    const data = await response.json();
    setSkills(data);
  }

  useEffect(() => {loadSkills()}, [])

  return (
    <>
      <h1>Skill Page</h1>
      <SharedSkills skills={skills} />
    </>
  );
}

export default AboutPage;