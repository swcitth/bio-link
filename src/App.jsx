import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import PreviewPage from './pages/PreviewPage';
import EditLink from './pages/EditLink';
import EditShop from './pages/EditShop';
import EditVideo from './pages/EditVideo';
import CookiePolicyPage from './pages/CookiePolicyPage';
import CookieSettingsPage from './pages/CookieSettingsPage';
import AdminUserManagement from './pages/Admin';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Routes>

      // หน้าแรกและหน้าสำหรับการเข้าสู่ระบบ/สมัครสมาชิก
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage defaultView="login" />} />
      <Route path="/signup" element={<AuthPage defaultView="signup" />} />
      <Route path="/forgot-password" element={<AuthPage defaultView="forgot-password" />} /> 

      // หน้าหลักของระบบจัดการและโปรไฟล์
      <Route path="/dd" element={<DashboardPage />} />
      <Route path="/preview" element={<PreviewPage />} />
      <Route path="/edit-link" element={<EditLink />} />
      <Route path="/edit-shop" element={<EditShop />} />
      <Route path="/edit-video" element={<EditVideo />} />

      // นโยบายคุกกี้และการตั้งค่าคุกกี้
      <Route path="/cookie-policy" element={<CookiePolicyPage />} />  
      <Route path="/cookie-settings" element={<CookieSettingsPage />} />

      // Admin
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminUserManagement />} />
      </Route>

      // แชร์
      <Route path="/:username" element={<PreviewPage />} />


    </Routes>
  );
}

export default App;