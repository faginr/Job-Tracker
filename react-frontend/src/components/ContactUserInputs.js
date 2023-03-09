import React from 'react';

function ContactUserInputs({ 
  last_name, 
  setLastName, 
  first_name, 
  setFirstName,
  email, 
  setEmail,
  phone, 
  setPhone,
  notes, 
  setNotes }) {

  return (
    <div className='wrapper'>

      <label className='one'>First Name:</label>
      <input className='one-two'
        required
        type="text"
        maxLength="30"
        placeholder="required field"
        value={first_name}
        onChange={e => setFirstName(e.target.value)} /><br />

      <label className='two'>Last Name:</label>
      <input className='two-two'
        required
        type="text"
        maxLength="30"
        placeholder="required field"
        value={last_name}
        onChange={e => setLastName(e.target.value)} /><br />
        
      <label className='three'>Email:</label>
      <input className='three-two'
        type="text"
        maxLength="30"
        placeholder="optional field"
        value={email}
        onChange={e => setEmail(e.target.value)} /><br />

      <label className='four'>Phone:</label>
      <input className='four-two'
        type="text"
        maxLength="30"
        placeholder="optional field"
        value={phone}
        onChange={e => setPhone(e.target.value)} /><br />

      <label className='five'>Notes:</label>
      <textarea className='five-two'
        type="text"
        rows="8"
        maxLength="500"
        placeholder="optional field (max 500 characters)"
        value={notes}
        onChange={e => setNotes(e.target.value)} />

    </div>
  )
};

export default ContactUserInputs;