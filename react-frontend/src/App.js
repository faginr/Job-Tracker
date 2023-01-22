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
import NotFound from './pages/NotFound';

import Navigation from './components/Navigation';

function App() {
  const [applicationToEdit, setApplicationToEdit] = useState();

  return (
    <div className="App">
      <header className="App-header">
        <h5>Welcome to Job Tracker!</h5>
      </header>

      <Navigation />

      <main className="App-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            <Route path="/applications" element={<ApplicationPage setApplicationToEdit={setApplicationToEdit} />} />
            
            <Route path="/add-application" element={<AddApplicationPage />} />
            
            <Route path="/edit-application" element={<EditApplicationPage applicationToEdit={applicationToEdit} />} />
            
            <Route path="/skills" element={<SkillPage />} />
            
            <Route path="/contacts" element={<ContactPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
      </main>

      <footer className="App-footer">
        <h5>©2023 Rex Fagin, Philip Peiffer, Patrycjusz Bachleda</h5>
      </footer>
    </div>
  );
}

export default App;