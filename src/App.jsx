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

// Admin Components
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/admin/layout/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage'; 
import AdminUserManagement from './pages/admin/UserManagementPage'; 

import { LoadingProvider } from './context/LoadingContext';

function App() {
  return (
    <LoadingProvider>
      <Routes>

        {/* หน้าแรกและหน้าสำหรับการเข้าสู่ระบบ/สมัครสมาชิก */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage defaultView="login" />} />
        <Route path="/signup" element={<AuthPage defaultView="signup" />} />
        <Route path="/forgot-password" element={<AuthPage defaultView="forgot-password" />} /> 

        {/* หน้าหลักของระบบจัดการและโปรไฟล์ (สำหรับ User ทั่วไป) */}
        <Route path="/dd" element={<DashboardPage />} />
        <Route path="/preview" element={<PreviewPage isPublic={false} />} />
        <Route path="/edit-link" element={<EditLink />} />
        <Route path="/edit-shop" element={<EditShop />} />
        <Route path="/edit-video" element={<EditVideo />} />

        {/* นโยบายคุกกี้และการตั้งค่าคุกกี้ */}
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />  
        <Route path="/cookie-settings" element={<CookieSettingsPage />} />

        {/* Admin ทั้งหมดจะถูกครอบด้วย AdminLayout */}
        <Route element={<AdminRoute />}>
          {/* หน้า Dashboard สำหรับ Admin */}
          <Route path="/admin" element={
                                                  <AdminLayout>
                                                    <AdminDashboardPage />
                                                  </AdminLayout> }                             
          />
          {/* หน้า User Management */}
          <Route path="/admin/users" element={
                                              <AdminLayout>
                                                <AdminUserManagement />
                                              </AdminLayout>
                                            } 
          />
        </Route>

        {/* แชร์ */}
        <Route path="/:username" element={<PreviewPage isPublic={true} />} />

      </Routes>
    </LoadingProvider>
  );
}

export default App;