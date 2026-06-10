// src/pages/CookieSettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Navbar/Header';
// 🟢 1. นำเข้าไอคอน FaArrowLeft
import { FaArrowLeft } from 'react-icons/fa';

export default function CookieSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    necessary: true, // จำเป็นต้องเปิดเสมอ
    analytics: false,
  });

  useEffect(() => {
    // โหลดค่าเดิมที่เคยบันทึกไว้
    const saved = localStorage.getItem('cookieSettings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const handleToggle = (key) => {
    if (key === 'necessary') return; // ห้ามปิดคุกกี้ที่จำเป็น
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSettings = () => {
    // บันทึกการตั้งค่า
    localStorage.setItem('cookieSettings', JSON.stringify(settings));
    localStorage.setItem('cookieAccepted', 'true');
    
    // ส่งสัญญาณบอก CookieBanner ให้ปิดตัวเองทันที
    window.dispatchEvent(new Event('storageUpdate'));
    
    // นำทางกลับหน้าหลัก
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 🟢 2. เรียกใช้งาน Header และใส่ปุ่มย้อนกลับแบบเดียวกับหน้า Preview */}
      <Header onLogoClick={() => navigate('/')}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#5a4bfc] transition-colors underline underline-offset-2"
        >
          <FaArrowLeft size={14} /> ย้อนกลับ
        </button>
      </Header>
      
      <div className="pt-24 pb-10 px-4">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold mb-6">ตั้งค่าคุกกี้</h1>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">คุกกี้ที่จำเป็น (Strictly Necessary)</p>
                <p className="text-xs text-gray-500">จำเป็นต่อการใช้งานเว็บไซต์</p>
              </div>
              {/* ใช้ div เพื่อทำ toggle แบบอ่านอย่างเดียวสำหรับค่าจำเป็น */}
              <div className="w-12 h-6 rounded-full bg-indigo-600 flex items-center px-1">
                <div className="w-4 h-4 bg-white rounded-full translate-x-6" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">คุกกี้เพื่อการวิเคราะห์ (Analytics)</p>
                <p className="text-xs text-gray-500">ช่วยให้เราพัฒนาเว็บไซต์ให้ดีขึ้น</p>
              </div>
              <button 
                onClick={() => handleToggle('analytics')}
                className={`w-12 h-6 rounded-full transition ${settings.analytics ? 'bg-indigo-600' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition transform ${settings.analytics ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <button 
            onClick={saveSettings}
            className="w-full mt-10 bg-[#5a4bfc] text-white py-4 rounded-xl font-bold hover:bg-[#4f3df5] transition-all"
          >
            บันทึกการตั้งค่า
          </button>
        </div>
      </div>
    </div>
  );
}