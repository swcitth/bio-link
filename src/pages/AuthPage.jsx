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

  //สร้าง State สำหรับเป็น "กระเป๋าความจำ" ส่วนกลาง
  const [resetEmail, setResetEmail] = useState(''); // จำอีเมลตอนลืมรหัส
  const [verifiedOtp, setVerifiedOtp] = useState(''); // จำ OTP ที่ยืนยันผ่านแล้ว

  // ดักจับว่าถ้า URL เปลี่ยน (defaultView เปลี่ยน) ให้เปลี่ยนหน้าต่างตาม
  useEffect(() => {
    setCurrentView(defaultView);
  }, [defaultView]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      
      {/* 1. ส่วน Layout คงที่: Header */}
      <Header onLogoClick={() => navigate('/')} />

      <main className="flex-1 flex flex-col justify-center items-center px-4 pt-24 pb-12">
        {/* 2. ส่วน Layout คงที่: กล่องขาว (Card) */}
        <Card>
          
          {/* 3. ส่วนเนื้อหาที่เปลี่ยนไปตามเงื่อนไข (Conditional Rendering) */}
          {currentView === 'signup' && (
            <SignupForm onSwitchView={() => navigate('/login')} />
          )}
          
          {currentView === 'login' && (
            <LoginForm 
              onSwitchView={() => navigate('/signup')} 
              onForgotPassword={() => navigate('/forgot-password')} 
            />
          )}

          {currentView === 'forgot-password' && (
            <ForgotPasswordForm 
              onSubmit={(emailFromInput) => {
                setResetEmail(emailFromInput); 
                navigate('/otp'); 
              }} 
              onSwitchView={() => navigate('/login')} 
            />
          )}


          {currentView === 'otp' && (
            <OTPForm 
            email={resetEmail}
            onBack={() => navigate('/forgot-password')} 
            onSubmit={() => navigate('/reset-password')} 
            onSuccess={(otpString) => {
                setVerifiedOtp(otpString);
                navigate('/reset-password');
              }}
            />
          )}

          {currentView === 'reset-password' && (
            <ResetPasswordForm 
              mail={resetEmail}
              otp={verifiedOtp}
              onSubmit={() => navigate('/login')} 
              />
          )}

        </Card>
      </main>
      
    </div>
  );
}