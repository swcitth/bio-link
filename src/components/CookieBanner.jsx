// src/components/CookieBanner.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CookieBanner({ onAccept, onClose }) {
  const [showCookie, setShowCookie] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkConsent = () => {
      const hasAccepted = localStorage.getItem('cookieAccepted');
      setShowCookie(hasAccepted !== 'true');
    };

    checkConsent();
    window.addEventListener('storageUpdate', checkConsent);
    return () => window.removeEventListener('storageUpdate', checkConsent);
  }, []);

  // ฟังก์ชันไปหน้าอ่านนโยบาย
  const handleNavigateToPolicy = (e) => {
    e.preventDefault();
    navigate('/cookie-policy');
  };

  // ฟังก์ชันไปหน้าตั้งค่า
  const handleNavigateToSettings = (e) => {
    e.preventDefault();
    navigate('/cookie-settings');
  };

  const handleAcceptAll = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setShowCookie(false);
    if (onAccept) onAccept();
    window.dispatchEvent(new Event('storageUpdate'));
  };

  if (!showCookie) return null;

  return (
    <div className="fixed bottom-0 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md w-full z-[9999] transition-all duration-500 transform translate-y-0 opacity-100">
      <div className="bg-white/90 backdrop-blur-md p-6 sm:rounded-2xl shadow-2xl border border-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        
        <button
          onClick={() => { if(onClose) onClose(); }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">🍪 นโยบายคุกกี้</h4>
        <p className="text-sm text-slate-600 mb-5 leading-relaxed">
          เว็บไซต์นี้มีการใช้คุกกี้ โปรดยอมรับนโยบายเพื่อประสบการณ์ที่ดีที่สุด ท่านสามารถศึกษารายละเอียดได้ที่ 
          <button 
            onClick={handleNavigateToPolicy} 
            className="text-indigo-600 hover:underline font-medium ml-1"
          >
            นโยบายความเป็นส่วนตัว
          </button>
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={handleAcceptAll}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-colors"
          >
            ยินยอมทั้งหมด
          </button>
          <button
            onClick={handleNavigateToSettings}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors"
          >
            ตั้งค่าคุกกี้
          </button>
        </div>
      </div>
    </div>
  );
}