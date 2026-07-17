import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Layout/Header";
import Card from '../components/UI/Card'; 
import SignupForm from '../components/Auth/SignupForm';
import LoginForm from '../components/Auth/LoginForm';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm'; 
import OTPForm from '../components/Auth/OTPForm';
import ResetPasswordForm from '../components/Auth/ResetPasswordForm';

export default function AuthPage({ defaultView = 'login' }) {
  // รับค่า defaultView มาตั้งเป็นค่าเริ่มต้นว่าหน้าไหนควรแสดง
  const [currentView, setCurrentView] = useState(defaultView);
  const navigate = useNavigate();

  //สร้าง State สำหรับเป็นกระเป๋าความจำส่วนกลาง
  const [resetEmail, setResetEmail] = useState(''); // จำอีเมลตอนลืมรหัส
  const [verifiedOtp, setVerifiedOtp] = useState(''); // จำ OTP ที่ยืนยันผ่านแล้ว

  // ดักจับว่าถ้า URL เปลี่ยน (defaultView เปลี่ยน) ให้เปลี่ยนหน้าต่างตาม
  useEffect(() => {
    // 🌟 ดึงข้อมูลแบบแยกตู้ ตามโครงสร้างเดิมของทีม
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const userRole = user.role ? user.role.toLowerCase() : '';

        // ถ้ามีข้อมูลครบ เช็ค Role แล้วพาไปหน้าให้ถูกต้อง
        if (userRole === "admin") {
          navigate('/admin');
        } else {
          navigate('/dd');
        }
      } catch (error) {
        // console.error("รูปแบบข้อมูล User ไม่ถูกต้อง:", error);
      }
    }
  }, [navigate]);

  useEffect(() => {
    setCurrentView(defaultView);
  }, [defaultView]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      
      <Header onLogoClick={() => navigate('/')} />

      <main className="flex-1 flex flex-col justify-center items-center px-4 pt-24 pb-12">
        <Card>

          {/* Maps('/ชื่อหน้า') ระบบจะเปลี่ยน URL ด้านบนเบราว์เซอร์ และทำลายหน้าเก่าทิ้งเพื่อสร้างหน้าใหม่ */}
          {/* ความจำใน usestate จะหายไป */}
          {currentView === 'signup' && (
            // ดึง SignupForm มา show
            <SignupForm onSwitchView={() => navigate('/login')} />
          )}
          
          {currentView === 'login' && (
            <LoginForm 
              onSwitchView={() => navigate('/signup')} 
              onForgotPassword={() => navigate('/forgot-password')} 
            />
          )}

          {/* setCurrentView('ชื่อหน้า') URL เดิมแต่เปลี่ยนการแสดงผล */}
          {/* ความจำใน usestate ไม่หาย */}
          {currentView === 'forgot-password' && (
            <ForgotPasswordForm 
              onSubmit={(emailFromInput) => {
                setResetEmail(emailFromInput); // setResetEmail รับค่าของ emailFromInput แล้วเก็บไว้ที่ resetEmail
                setCurrentView('otp');        
              }} 
              onSwitchView={() => setCurrentView('login')} 
            />
          )}


          {currentView === 'otp' && (
            <OTPForm 
              email={resetEmail} //เemail = ค่าใน resetEmail เราจะเอาค่านี้ไปเรียกใช้ใน OTPForm เพื่อเทียบกับหลังบ้าน
              onBack={() => setCurrentView('forgot-password')} // onback คือการกลับไปหน้าก่อนหน้า(ขึ้นอยู่กับที่เราจะเซ็ทใน currentview)โดยที่ยังคงข้อมูลและ url เดิมไว้
              // onSuccess feellike onSubmit แค่ชื่อต่าง
              onSuccess={(otpString) => {
                setVerifiedOtp(otpString);
                setCurrentView('reset-password'); 
              }} 
            />
          )}

          {currentView === 'reset-password' && (
            <ResetPasswordForm 
              email={resetEmail}
              otp={verifiedOtp}
              onSubmit={() => navigate('/login')} 
              />
          )}

        </Card>
      </main>
      
    </div>
  );
}