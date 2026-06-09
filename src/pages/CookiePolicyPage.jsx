// src/pages/CookiePolicyPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Navbar/Header';

export default function CookiePolicyPage() {
  const navigate = useNavigate();

  const handleAcceptAndBack = () => {
    // บันทึกสถานะการยอมรับ
    localStorage.setItem('cookieAccepted', 'true');
    
    // ส่งสัญญาณให้ CookieBanner ปิดตัวลงทันทีโดยไม่ต้องรีเฟรช
    window.dispatchEvent(new Event('storageUpdate'));
    
    // กลับหน้าแรก
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ส่วนหัวของหน้า */}
      <Header onLogoClick={() => navigate('/')} />
      
      {/* ส่วนเนื้อหาหลัก */}
      <div className="pt-24 pb-10 px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          
          {/* ปุ่มกลับ */}
          <button 
            onClick={() => navigate(-1)} 
            className="text-sm text-gray-500 mb-6 hover:text-black transition-colors"
          >
            &larr; กลับ
          </button>

          <h1 className="text-3xl font-bold mb-2">นโยบายการใช้คุกกี้</h1>
          <p className="text-gray-400 text-sm mb-8">อัปเดตล่าสุด: 9 มิถุนายน 2026</p>

          <div className="prose text-gray-600 space-y-6">
            <section>
              <h2 className="font-bold text-lg text-black mb-2 flex items-center gap-2">
                <span>🍪</span> คุกกี้คืออะไร?
              </h2>
              <p className="leading-relaxed">
                คุกกี้คือไฟล์ข้อความขนาดเล็กที่จัดเก็บไว้ในเบราว์เซอร์ของท่าน เพื่อช่วยให้เว็บไซต์สามารถจดจำการตั้งค่าและปรับปรุงประสบการณ์การใช้งานของท่านให้ดียิ่งขึ้น
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg text-black mb-3">ประเภทของคุกกี้ที่เราใช้:</h2>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="font-semibold text-sm text-black">1. คุกกี้ที่จำเป็นอย่างยิ่ง (Strictly Necessary)</p>
                  <p className="text-xs text-gray-500 mt-1">จำเป็นต่อการทำงานพื้นฐานของเว็บไซต์ ไม่สามารถปิดได้</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="font-semibold text-sm text-black">2. คุกกี้เพื่อการวิเคราะห์ (Analytical)</p>
                  <p className="text-xs text-gray-500 mt-1">ช่วยให้เราเข้าใจพฤติกรรมผู้ใช้งานเพื่อนำไปพัฒนาเว็บไซต์ให้ดียิ่งขึ้น</p>
                </div>
              </div>
            </section>

            <section className="pt-4">
              <p className="text-sm">
                หากท่านต้องการปรับเปลี่ยนการตั้งค่าคุกกี้ ท่านสามารถไปที่หน้า 
                <button 
                  onClick={() => navigate('/cookie-settings')} 
                  className="text-[#5a4bfc] font-bold ml-1 hover:underline"
                >
                  ตั้งค่าคุกกี้
                </button>
              </p>
            </section>
          </div>

          {/* ปุ่มกดยอมรับ */}
          <button 
            onClick={handleAcceptAndBack}
            className="w-full mt-10 bg-[#5a4bfc] text-white py-4 rounded-2xl font-semibold hover:bg-[#4f3df5] transition-all"
          >
            ยอมรับนโยบายทั้งหมดและกลับหน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
}