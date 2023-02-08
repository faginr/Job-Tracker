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

function App() {
  const [applicationToEdit, setApplicationToEdit] = useState();
  const [contactToEdit, setContactToEdit] = useState();
  const [featureObj, setFeatureObj] = useState()

  return (
    <div>
      <header className="App-header">
        <h5>Welcome to Job Tracker!</h5>
      </header>
      
      <div className="App">
        <Navigation setFeatureObj={setFeatureObj}/>

        <main className="App-main">
          <div id='main-display'>
            <Routes>
              <Route path="/" element={<HomePage />} />
              
              <Route path="/applications" element={<ApplicationPage setApplicationToEdit={setApplicationToEdit} />} />
              
              <Route path="/add-application" element={<AddApplicationPage />} />
              
              <Route path="/edit-application" element={<EditApplicationPage applicationToEdit={applicationToEdit} />} />
              
              <Route path="/skills" element={<SkillPage setFeaturePane={setFeatureObj}/>} />
              
              <Route path="/contacts" element={<ContactPage setContactToEdit={setContactToEdit} />} />

              <Route path="/add-contact" element={<AddContactPage />} />
              
              <Route path="/edit-contact" element={<EditContactPage contactToEdit={contactToEdit} />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          
        </main>
      </div>
      
      {/* This area controls hiding/unhiding pane on right */}
      {featureObj}

      <footer className="App-footer">
        <h4><a href="https://forms.gle/3W7bCuVhibz82q6W6">Request Support</a></h4>
        <h5>©2023 Rex Fagin, Philip Peiffer, Patrycjusz Bachleda</h5>
      </footer>
    </div>
  );
}

export default App;