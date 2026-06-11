import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react'; 
import ButtonBig from '../Button/button_big';
import InputField from './InputField'; 
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginForm({ onSwitchView, onForgotPassword }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // นำ Access Token วิ่งไปขอข้อมูลรายละเอียดของบัญชีผู้ใช้จาก Google API ตรงๆ
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        console.log("เข้าสู่ระบบสำเร็จ ข้อมูลบัญชี:", userInfo);

        // เก็บข้อมูล Session การเข้าสู่ระบบลงบน LocalStorage (รอเชื่อมโยงกับฐานข้อมูล Backend ในอนาคต)
        const userSession = {
          name: userInfo.name,
          email: userInfo.email,
          avatar: userInfo.picture,
          isLoggedIn: true
        };
        localStorage.setItem("user_session", JSON.stringify(userSession));
        
        // บันทึกหรือเปลี่ยนข้อมูลภาพโปรไฟล์/ชื่อในระบบ เพื่อให้หน้าจอจำลองดึงค่าไปเปลี่ยนตามโปรไฟล์จริง
        const defaultProfile = {
          name: userInfo.name,
          bio: "ยินดีต้อนรับสู่ MyBioLink ของฉัน ✨",
          avatar: userInfo.picture,
          username: userInfo.email.split('@')[0] // ดึงข้อความหน้า @ มาทำเป็น username ตั้งต้น
        };
        localStorage.setItem("bio_profile", JSON.stringify(defaultProfile));

        alert(`ยินดีต้อนรับคุณ ${userInfo.name}!`);
        navigate('/dd'); // เปลี่ยนหน้าไปยังระบบจัดการลิงก์หลักของคุณทันที
        
      } catch (error) {
        console.error("Error retrieving user identity data:", error);
        alert("ไม่สามารถเข้าถึงข้อมูลสิทธิ์ของผู้ใช้งานได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      alert("การเข้าสู่ระบบผ่าน Google ถูกยกเลิกหรือล้มเหลว");
    }
  });


  const handleLogin = async (e) => {
    e.preventDefault(); // 1. หยุดไม่ให้หน้าเว็บโหลดใหม่

    // สมมติว่าตรงนี้คือโค้ดสำหรับส่งอีเมล/รหัสผ่านไปเช็คกับ Backend
    const isSuccess = true; // สมมติว่าเช็คแล้วรหัสผ่านถูกต้อง

    if (isSuccess) {
      console.log("เข้าสู่ระบบสำเร็จ!");
      // 2. รหัสถูก ค่อยเปลี่ยนหน้าไปหน้า Dashboard หรือหน้าจัดการลิงก์
      navigate('/dd'); 
    } else {
      // 3. รหัสผิด ไม่ต้องเปลี่ยนหน้า แต่โชว์ข้อความแจ้งเตือนแทน
      alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง"); 
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Texts */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          ยินดีต้อนรับกลับมา
        </h1>
        <p className="text-sm text-slate-500">
          กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleLogin}>
        
        {/* 👈 เปลี่ยนมาใช้ InputField จัดการ Email */}
        <InputField 
          id="login-email" 
          label="อีเมล" 
          type="email" 
          placeholder="your@email.com" 
          icon={Mail} 
        />

        {/* 👈 เปลี่ยนมาใช้ InputField จัดการ Password */}
        <InputField 
          id="login-password" 
          label="รหัสผ่าน" 
          type="password" 
          placeholder="••••••••" 
          icon={Lock} 
        />

        {/* Options Row */}
        <div className="flex items-center justify-between mt-1 mb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-slate-600">จดจำฉันไว้ในระบบ</span>
          </label>
          
          <button 
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors focus:outline-none"
          >
            ลืมรหัสผ่าน?
          </button>
        </div>

        {/* Submit Button */}
        <ButtonBig type="submit">
          เข้าสู่ระบบ
        </ButtonBig>

        {/* Divider */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-wider font-medium">หรือดำเนินการต่อด้วย</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button" 
            onClick={loginWithGoogle}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>


          <button type="button" className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
            <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>
      </form>

      {/* Sign Up Link */}
      <div className="mt-8 text-center text-sm text-slate-600">
        ยังไม่มีบัญชีใช่ไหม?{' '}
        <button 
          onClick={onSwitchView}
          className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none"
        >
          สมัครสมาชิก
        </button>
      </div>
    </div>
  );
}