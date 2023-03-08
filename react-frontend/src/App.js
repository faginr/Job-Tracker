import './App.css';
import { Routes, Route } from 'react-router-dom';
import React from 'react';

import HomePage from './pages/HomePage';
import ApplicationPage from './pages/ApplicationPage';
import AddApplicationPage from './pages/AddApplicationPage';
import EditApplicationPage from './pages/EditApplicationPage';
import SkillPage from './pages/SkillPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';
import CallBackPage from './pages/CallBackPage';

import Header from './components/Header'
import Navigation from './components/Navigation';

function App() {
  return (
    <div>
      <Header />
      
      <div className="App">
        <Navigation />

        <main className="App-main">
          <div id='main-display'>
            <Routes>
              <Route path="/" element={<HomePage />} />
              
              <Route path="/applications" element={<ApplicationPage />} />
              
              <Route path="/add-application" element={<AddApplicationPage />} />
              
              <Route path="/edit-application" element={<EditApplicationPage />} />
              
              <Route path="/skills" element={<SkillPage />} />
              
              <Route path="/contacts" element={<ContactPage />} />
              <Route path="/callback" element={<CallBackPage />} />
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