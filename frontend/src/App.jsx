import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StudioPlayer from './pages/StudioPlayer';
import LoginPage from './pages/LoginPage';   
import SignupPage from './pages/SignupPage'; 
import SongDetailPage from './pages/SongDetailPage'; // <-- Import the new page
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import DisclaimerPage from './pages/DisclaimerPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/studio" element={<StudioPlayer />} />
        <Route path="/login" element={<LoginPage />} />    
        <Route path="/signup" element={<SignupPage />} />  
        <Route path="/song/:id" element={<SongDetailPage />} /> {/* <-- Add the new route! */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
      </Routes>
    </Router>
  );
}

export default App;