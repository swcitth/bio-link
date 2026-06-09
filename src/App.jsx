import React from 'react';
import { Routes, Route } from 'react-router-dom'; // 👈 ลบ BrowserRouter ออกจากบรรทัดนี้
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    // 👈 ลบ <BrowserRouter> ออก เหลือแค่ <Routes>
    <Routes>
      {/* หน้าหลัก */}
      <Route path="/" element={<LandingPage />} />
      
      {/* หน้า Login / Signup */}
      <Route path="/login" element={<AuthPage defaultView="login" />} />
      <Route path="/signup" element={<AuthPage defaultView="signup" />} />
      <Route path="/forgot-password" element={<AuthPage defaultView="forgot-password" />} /> 
      <Route path="/otp" element={<AuthPage defaultView="otp" />} />


    </Routes>
  );
}

export default App;