import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import EditLink from './pages/Edit_link';
import EditShop from './pages/Edit_shop';
import EditVideo from './pages/Edit_video';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage defaultView="login" />} />
      <Route path="/signup" element={<AuthPage defaultView="signup" />} />
      <Route path="/forgot-password" element={<AuthPage defaultView="forgot-password" />} /> 
      <Route path="/otp" element={<AuthPage defaultView="otp" />} />
      <Route path="/reset-password" element={<AuthPage defaultView="reset-password" />} />



      <Route path="/edit-link" element={<EditLink />} />
      <Route path="/edit-shop" element={<EditShop />} />
      <Route path="/edit-video" element={<EditVideo />} />


    </Routes>
  );
}

export default App;