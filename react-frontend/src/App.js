import './App.css';
import { Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
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
  const [typeToEdit, settypeToEdit] = useState();

  return (
    <div>
      <header className="App-header">
        <h5>Welcome to Job Tracker!</h5>
      </header>
      
      <div className="App">
        <Navigation />

        <main className="App-main">
          <div id='main-display'>
            <Routes>
              <Route path="/" element={<HomePage />} />
              
              <Route path="/applications" element={<ApplicationPage settypeToEdit={settypeToEdit} />} />
              
              <Route path="/add-application" element={<AddApplicationPage />} />
              
              <Route path="/edit-application" element={<EditApplicationPage typeToEdit={typeToEdit} />} />
              
              <Route path="/skills" element={<SkillPage typeToEdit={typeToEdit} settypeToEdit={settypeToEdit}/>} />
              
              <Route path="/contacts" element={<ContactPage />} />
             
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          
        </main>
      </div>

      <footer className="App-footer">
        <h4><a href="https://forms.gle/3W7bCuVhibz82q6W6">Request Support</a></h4>
        <h5>©2023 Rex Fagin, Philip Peiffer, Patrycjusz Bachleda</h5>
      </footer>
    </div>
  );
}

export default App;