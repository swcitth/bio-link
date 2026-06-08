import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Navbar/Header';
import SignupForm from '../components/SignupForm';
import LoginForm from '../components/LoginForm';

// 👈 1. รับค่า defaultView เข้ามาเป็น Prop
export default function AuthPage({ defaultView = 'signup' }) {
  const [currentView, setCurrentView] = useState(defaultView);
  const navigate = useNavigate();

  // 👈 2. เพิ่ม useEffect เพื่อให้อัปเดตฟอร์มเมื่อสลับ URL ไปมา
  useEffect(() => {
    setCurrentView(defaultView);
  }, [defaultView]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      
      <Header onLogoClick={() => navigate('/')} />

      <main className="flex-1 flex flex-col justify-center items-center px-4 pt-24 pb-12">
        <div className="bg-white w-full max-w-[440px] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 sm:p-10 border border-slate-100 transition-all duration-300">
          
          {currentView === 'signup' ? (
            // 👈 3. ถ้าอยู่ในหน้า Signup แต่ผู้ใช้กด "เข้าสู่ระบบ" ด้านล่างฟอร์ม ให้เปลี่ยน URL
            <SignupForm onSwitchView={() => navigate('/login')} />
          ) : (
            // 👈 4. ถ้าอยู่ในหน้า Login แต่ผู้ใช้กด "สมัครสมาชิก" ด้านล่างฟอร์ม ให้เปลี่ยน URL
            <LoginForm onSwitchView={() => navigate('/signup')} />
          )}

        </div>
      </main>
      
    </div>
  );
}