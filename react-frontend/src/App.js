import './styles.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ApplicationPage from './pages/ApplicationPage';
import SkillPage from './pages/SkillPage';
import ContactPage from './pages/ContactPage';
import Navigation from './components/Navigation';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h5>Welcome to Job Tracker!</h5>
      </header>

      <Navigation />

      <main className="App-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/applications" element={<ApplicationPage />} />
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
