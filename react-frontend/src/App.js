import './App.css';
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import { useState } from 'react';

import HomePage from './pages/HomePage';
import ApplicationPage from './pages/ApplicationPage';
import AddApplicationPage from './pages/AddApplicationPage';
import EditApplicationPage from './pages/EditApplicationPage';
import SkillPage from './pages/SkillPage';
import ContactPage from './pages/ContactPage';
import AddContactPage from './pages/AddContactPage';
import EditContactPage from './pages/EditContactPage';
import NotFound from './pages/NotFound';

import Navigation from './components/Navigation';
import FeaturePane from './components/FeaturePane';

function App() {
  const [applicationToEdit, setApplicationToEdit] = useState();
  const [contactToEdit, setContactToEdit] = useState();
  const [user, setUser] = useState('{"username": "tester1", "sub": "1234567890"}')
  const [hide, setHide] = useState(true)
  const [featureObj, setFeatureObj] = useState({})

  function toggleHidePanel() {
    setHide(!hide)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h5>Welcome to Job Tracker!</h5>
      </header>

      <Navigation />

      <main className="App-main">
        <div className='main-display'>
          <Routes>
            <Route path="/" element={<HomePage setUser={setUser}/>} />
            
            <Route path="/applications" element={<ApplicationPage setApplicationToEdit={setApplicationToEdit} />} />
            
            <Route path="/add-application" element={<AddApplicationPage />} />
            
            <Route path="/edit-application" element={<EditApplicationPage applicationToEdit={applicationToEdit} />} />
            
            <Route path="/skills" element={<SkillPage user={user} setFeatureObj={setFeatureObj} setDisplay={toggleHidePanel}/>} />
            
            <Route path="/contacts" element={<ContactPage setContactToEdit={setContactToEdit} />} />

            <Route path="/add-contact" element={<AddContactPage />} />
            
            <Route path="/edit-contact" element={<EditContactPage contactToEdit={contactToEdit} />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        
        {/* This area controls hiding/unhiding pane on right */}
        <div className="feature-pane">
          {!hide?<FeaturePane featureObj={featureObj}/>:<div/>}
        </div>
      </main>

      <footer className="App-footer">
        <h4><a href="https://forms.gle/3W7bCuVhibz82q6W6">Request Support</a></h4>
        <h5>©2023 Rex Fagin, Philip Peiffer, Patrycjusz Bachleda</h5>
      </footer>
    </div>
  );
}

export default App;