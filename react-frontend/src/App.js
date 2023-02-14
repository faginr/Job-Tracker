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
import AddContactPage from './pages/AddContactPage';
import EditContactPage from './pages/EditContactPage';
import NotFound from './pages/NotFound';
import CallBackPage from './pages/CallBackPage';

import Navigation from './components/Navigation';
import Header from './components/Header';
import FeaturePane from './components/FeaturePane';
import Footer from './components/Footer';

function App() {
  const [applicationToEdit, setApplicationToEdit] = useState();
  const [contactToEdit, setContactToEdit] = useState();
  const [featureChild, setFeatureChild] = useState()
  const [featureClass, setFeatureClass] = useState("hidden")

  function toggleFeatureClass() {
    // if featureChild is not null, then display feature-pane
    if (featureChild) {
      setFeatureClass("feature-pane")
    } else {
      setFeatureClass("hidden")
    }
  }

  useEffect(() => {
    // toggle between displaying feature pane and not
    // every time featureChild is updated
    toggleFeatureClass()
  }, [featureChild])

  return (
    <div>
      <Header />
      
      <div className="App">
        <Navigation setFeatureChild={setFeatureChild}/>

        <main className="App-main">
          <div id='main-display'>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/applications" element={<ApplicationPage setApplicationToEdit={setApplicationToEdit} />} />
              <Route path="/add-application" element={<AddApplicationPage />} />
              <Route path="/edit-application" element={<EditApplicationPage applicationToEdit={applicationToEdit} />} />
              <Route path="/skills" element={<SkillPage setFeatureChild={setFeatureChild}/>} />
              <Route path="/contacts" element={<ContactPage setContactToEdit={setContactToEdit} />} />
              <Route path="/add-contact" element={<AddContactPage />} />
              <Route path="/edit-contact" element={<EditContactPage contactToEdit={contactToEdit} />} />
              <Route path="/callback" element={<CallBackPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* This area controls hiding/unhiding pane on right */}
      <FeaturePane featureClass={featureClass} setFeatureChild={setFeatureChild} child={featureChild} />

      <Footer />
    </div>
  );
}

export default App;