import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage defaultView="login" />} />
      <Route path="/signup" element={<AuthPage defaultView="signup" />} />
      <Route path="/forgot-password" element={<AuthPage defaultView="forgot-password" />} /> 
      <Route path="/otp" element={<AuthPage defaultView="otp" />} />


    </Routes>
  );
}

export default App;