import React, { useState } from 'react';
import { User, Lock } from 'lucide-react'; 
import ButtonBig from '../UI/Button/ButtonBig';
import InputField from './InputField'; 
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import ReCAPTCHA from "react-google-recaptcha";

import axios from 'axios';

export default function LoginForm({ onSwitchView, onForgotPassword }) {

  const navigate = useNavigate(); 
  const [isLoading, setIsLoading] = useState(false); 
  const [captchaValue, setCaptchaValue] = useState(null);

  // สร้าง State เก็บค่า Input และข้อความ Error
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [identifierError, setIdentifierError] = useState('');

  // ฟังก์ชันตรวจสอบอีเมลแบบ Real-time
  const handleIdentifierChange = (e) => {
    const value = e.target.value;
    setIdentifier(value); // อัปเดตค่าที่พิมพ์

    // ถ้ามีเครื่องหมาย @ แปลว่าตั้งใจพิมพ์อีเมล เราจะเช็ค Format ทันที
    if (value.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setIdentifierError("ไม่ถูกต้อง"); // ขึ้นข้อความสีแดง
      } else {
        setIdentifierError(""); // พิมพ์ถูกแล้ว เอาข้อความแดงออก
      }
    } else {
      setIdentifierError(""); // ถ้าไม่มี @ (กรอก username) ไม่ต้องเช็ค
    }
  };

  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const syncUserToAdminDatabase = (newUser) => {
    const savedUsersStr = localStorage.getItem("system_users");
    let existingUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    const isUserExist = existingUsers.find(u => u.email === newUser.email);

    if (!isUserExist && newUser.email) {
      const newUserForAdmin = {
        id: Date.now(), 
        name: newUser.name || "Unknown User",
        email: newUser.email,
        role: newUser.role.toUpperCase(), 
        date: new Date().toISOString().split('T')[0], 
        status: "Active",
        avatar: newUser.avatar || `https://ui-avatars.com/api/?name=${newUser.username}&background=random&color=fff`
      };
      existingUsers.push(newUserForAdmin);
      localStorage.setItem("system_users", JSON.stringify(existingUsers));
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true); 
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        const userSession = {
          name: userInfo.name,
          email: userInfo.email,
          avatar: userInfo.picture,
          isLoggedIn: true,
          role: 'user' 
        };
        localStorage.setItem("user_session", JSON.stringify(userSession)); 
        
        const defaultProfile = {
          name: userInfo.name,
          bio: "ยินดีต้อนรับสู่ MyBioLink ของฉัน ✨",
          avatar: userInfo.picture,
          username: userInfo.email.split('@')[0] 
        };
        localStorage.setItem("bio_profile", JSON.stringify(defaultProfile));

        syncUserToAdminDatabase(userSession);

        alert(`ยินดีต้อนรับคุณ ${userInfo.name}!`);
        navigate('/dd'); 
        
      } catch (error) {
        alert("ไม่สามารถเข้าถึงข้อมูลสิทธิ์ของผู้ใช้งานได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setIsLoading(false); 
      }
    },
    onError: (error) => {
      alert("การเข้าสู่ระบบผ่าน Google ถูกยกเลิกหรือล้มเหลว");
    }
  });

  // ส่วนนี้จะเป็นส่วนที่ทำงานร่วมกับ backend API
  const handleLogin = async (e) => {
    e.preventDefault(); 

    // ดักไว้ว่าถ้าหน้าจอมี Error สีแดงอยู่ ห้ามกดเข้าสู่ระบบเด็ดขาด
    if (identifierError) {
      alert("กรุณาแก้ไขข้อมูลที่ผิดพลาดก่อน");
      return;
    }

    if (!identifier.trim() || !password) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return; 
    }

    if (!captchaValue) {
      alert("กรุณายืนยันว่าคุณไม่ใช่โปรแกรมอัตโนมัติ");
      return;
    }

    try {

      // เช็คอีเมล (มี @) หรือเป็น Username
      const isEmail = identifier.includes('@');

      const payload = isEmail
      ? { email: identifier, password: password}
      : { username: identifier, password: password};

      // ยิง API ไปหา Laravel Backend
      const response = await axios.post('http://127.0.0.1:8000/api/login', payload);

      console.log("API Response Data:", response.data);

      const userData = response.data.user;

      if (!userData) {
        throw new Error("หาข้อมูล User จาก API ไม่เจอ");
      }

      localStorage.clear();

      // ถ้าสำเร็จ เก็บ Token และข้อมูล User ลง LocalStorage(จดจำสถานะการล็อกอิน (Session))

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.data.access_token);

      alert("เข้าสู่ระบบสำเร็จ!");

      // นำ Role จากฐานข้อมูลมาเช็คเพื่อเปลี่ยนหน้า
      if (userData.role === "admin") {
        navigate('/admin'); 
      } else {
        navigate('/dd'); 
      }

      } catch (error) {
      console.error("Catch Error:", error);
      
      if (error.response) {
        // ถ้าเข้าเงื่อนไขนี้ แปลว่าเป็น Error จากฝั่ง Laravel ตอบกลับมา
        if (error.response.status === 401) {
          alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้งค่ะ");
        } else if (error.response.status === 422) {
          alert("รูปแบบข้อมูลไม่ถูกต้อง กรุณาใช้อีเมลในการเข้าสู่ระบบ");
        } else {
          alert("เซิร์ฟเวอร์เกิดข้อผิดพลาด (Status: " + error.response.status + ")");
        }
      } else {
        // ถ้าเข้าเงื่อนไขนี้ แปลว่าโค้ด React ของเราเองที่ทำงานผิดพลาด (เช่น พิมพ์ชื่อตัวแปรผิด)
        alert("เกิดข้อผิดพลาดในหน้าเว็บ: " + error.message);
      }
    }

  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">ยินดีต้อนรับกลับมา</h1>
        <p className="text-sm text-slate-500">กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleLogin} method="">
        
        {/* 3. ส่ง State ลงไปให้ InputField */}
        <InputField 
          id="login-identifier" 
          label="อีเมล หรือ ชื่อผู้ใช้" 
          type="text" 
          placeholder="your@email.com หรือ username" 
          icon={User} 
          value={identifier}
          onChange={handleIdentifierChange}
          error={identifierError} // ถ้ามีข้อความในนี้ ขอบจะแดงทันที
        />

        <InputField 
          id="login-password" 
          label="รหัสผ่าน" 
          type="password" 
          placeholder="••••••••" 
          icon={Lock} 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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

        <div className="flex justify-center w-full my-2">
          <ReCAPTCHA
            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            onChange={onCaptchaChange}
          />
        </div>

        <ButtonBig type="submit">
          เข้าสู่ระบบ
        </ButtonBig>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-wider font-medium">หรือดำเนินการต่อด้วย</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <div className="flex justify-center w-full">
          <button 
            type="button" 
            onClick={loginWithGoogle}
            disabled={isLoading} 
            className="w-full sm:w-2/3 md:w-1/2 flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
        </div>
      </form>

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