import React, { useState, useEffect, useRef } from 'react';
import { User, Lock } from 'lucide-react'; 
import ButtonBig from '../UI/Button/ButtonBig';
import InputField from './InputField'; 
// import useSearchParams เพื่อใช้อ่านค่า ?verified=... จาก URL
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import ReCAPTCHA from "react-google-recaptcha";

import api from "../../api/axios";
import verifyImage from '../../assets/verify-email.png';

export default function LoginForm({ onSwitchView, onForgotPassword }) {

  const navigate = useNavigate(); 
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false); 
  const [captchaValue, setCaptchaValue] = useState(null);

  // สร้าง State เก็บค่า Input และข้อความ Error
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [identifierError, setIdentifierError] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  // จัดการในส่วนของ การจดจำการเข้าสู่ระบบ
  const [rememberMe, setRememberMe] = useState(false);

  // สร้างตู้เซฟ Ref เพื่อเก็บค่าล่าสุดแบบ Real-time ไม่ให้ Google ลืม
  const rememberMeRef = useRef(rememberMe);


  // สร้างตัวแปรดักไว้ว่า "แจ้งเตือนไปหรือยัง?" 
  const hasAlerted = useRef(false);

  // 1. useEffect สำหรับจำค่าช่องติ๊ก (แยกออกมาให้ทำงานเดี่ยวๆ)
  useEffect(() => {
    rememberMeRef.current = rememberMe;
  }, [rememberMe]);

  // 2. useEffect สำหรับเช็ค URL แจ้งเตือนอีเมลโดยเฉพาะ
  useEffect(() => {
    const status = searchParams.get('verified');

    // ถ้ามีสถานะแนบมาใน URL และยังไม่เคยแจ้งเตือน
    if (status && !hasAlerted.current) {
      
      hasAlerted.current = true; // ล็อกปุ่ม! บอกระบบว่า "แจ้งเตือนแล้วนะ ห้ามเด้งอีก"

      // ตรวจสอบสถานะและแสดงข้อความ
      if (status === 'success') {
        alert(' ยืนยันอีเมลสำเร็จแล้ว! คุณสามารถเข้าสู่ระบบได้เลยค่ะ');
      } else if (status === 'expired') {
        alert(' ลิงก์ยืนยันอีเมลหมดอายุหรือไม่ถูกต้อง กรุณาเข้าสู่ระบบเพื่อขอรับลิงก์ใหม่ค่ะ');
      } else if (status === 'invalid') {
        alert(' ลิงก์ยืนยันไม่ถูกต้อง กรุณาตรวจสอบอีกครั้งค่ะ');
      }

      // ขั้นตอนสุดท้าย: ลบคำว่า ?verified=... ออกจาก URL บนช่องเบราว์เซอร์
      searchParams.delete('verified');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

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

  // ฟังก์ชันสำหรับกดยิง API ขออีเมลยืนยันตัวตนใหม่
  const handleResendEmail = async () => {
    try {
      const response = await api.post('/email/verification-notification', { 
        email: unverifiedEmail 
      });
      alert('' + response.data.message);
      
      // ส่งเสร็จแล้วให้เคลียร์ค่าทิ้ง เพื่อซ่อนกล่องแจ้งเตือน
      setUnverifiedEmail(''); 
    } catch (error) {
      if (error.response) {
         alert(error.response.data.message || "เกิดข้อผิดพลาดในการส่งอีเมล");
      }
    }
  };

  // Login with google
  // useGoogleLogin is hook for popup login google
  const loginWithGoogle = useGoogleLogin({
    // tokenResponse ตัวแปรที่ google ส่งกลับไปหา react access_token เพื่อเอาไปใช้ต่อ
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try{
        // การส่งข้อมูลกลับหลังบ้าน
        const response = await api.post(`/auth/google`, {
          // ดึงค่า Access Token จาก Google ส่งไปในกล่องที่ชื่อว่า token 
          // ฝั่ง Laravel จะแกะกล่องนี้อ่านด้วยคำสั่ง $request->token
          token: tokenResponse.access_token
        });

        // case ที่หลังบ้านตอบกลับมาว่าสำเร็จ
        if (response.status === 200) {

          // ดึงข้อมูลโปรไฟล์ผู้ใช้ในระบบเรา (ตัวแปร $user จากฝั่ง Laravel) ออกมาเก็บไว้
          const userData = response.data.user;
          const apiToken = response.data.token;

          // เคลียร์ความจำเก่า และเก็บข้อมูลใหม่ลง LocalStorage ให้รูปแบบเดียวกับการล็อกอินปกติ
          localStorage.clear();
          sessionStorage.clear();

          const storage = rememberMeRef.current ? localStorage : sessionStorage;

          storage.setItem('token', apiToken); // เก็บ Token ของ Sanctum
          storage.setItem('user', JSON.stringify(userData)); // เก็บข้อมูล User
          
          window.dispatchEvent(new Event("storage")); // แจ้งเตือนระบบว่าล็อกอินแล้ว

          alert(`เข้าสู่ระบบสำเร็จ!`);

          // ตรวจสอบ role
          if (userData.role === "admin") {
            navigate('/admin'); 
          } else {
            navigate('/dd'); 
          }
        }
      } catch (error) {
        console.error("Google Login Backend Error:", error);
        
        // ตรวจสอบว่ามีข้อมูล Error ตอบกลับมาจาก Backend (Laravel) หรือไม่
        if (error.response) {
          // ถ้าเป็น 403 (โดนแบน) ให้ดึงข้อความจากหลังบ้านมาแสดงเลย
          if (error.response.status === 403) {
            alert(error.response.data.message);
          } else {
            // กรณีพังด้วย Status อื่นๆ
            alert("เซิร์ฟเวอร์เกิดข้อผิดพลาด (Status: " + error.response.status + ")");
          }
        } else {
          // กรณีไม่มี Response กลับมาเลย (เช่น เน็ตหลุด หรือ API ล่ม)
          alert("เข้าสู่ระบบด้วย Google ไม่สำเร็จกรุณาลองใหม่อีกครั้งค่ะ");
        }
        
      } 
      // ไม่ว่าจะทำงานสำเร็จหรือไม่การใช้ finally เป็นการบอกว่าใต้สิ่งนี้จะต้องทำงานเสมอ
      finally {
        setIsLoading(false); 
      }
    },
    onError: (error) => {
      // console.log('Google Popup Error:', error);
      alert("การเข้าสู่ระบบผ่าน Google ถูกยกเลิก");
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
      const response = await api.post(`/login`, payload);
 
      
      // console.log("API Response Data:", response.data);

      const userData = response.data.user;

      if (!userData) {
        throw new Error("หาข้อมูล User จาก API ไม่เจอ");
      }

      localStorage.clear();
      sessionStorage.clear();

      const storage = rememberMeRef.current ? localStorage : sessionStorage;

      storage.setItem('token', response.data.access_token);
      storage.setItem('user', JSON.stringify(userData));
      
      window.dispatchEvent(new Event("storage"));

      alert("เข้าสู่ระบบสำเร็จ!");

      // นำ Role จากฐานข้อมูลมาเช็คเพื่อเปลี่ยนหน้า
      if (userData.role === "admin") {
        navigate('/admin'); 
      } else {
        navigate('/dd'); 
      }

      } catch (error) {
      // console.error("Catch Error:", error);
      
      if (error.response) {
        
        // ดักจับ Error 403 (แยกเป็นกรณียืนยันอีเมล กับ กรณีโดนแบน)
        if (error.response.status === 403) {
          if (error.response.data.is_verified === false) {
            // กรณีที่ 1: บัญชียังไม่ยืนยันอีเมล
            alert(error.response.data.message);
            setUnverifiedEmail(identifier);
          } else {
            // กรณีที่ 2: ถูกแบน (ดึงข้อความ 'บัญชีของคุณถูกระงับ...' จากหลังบ้านมาโชว์เลย)
            alert(error.response.data.message);
          }
        } 
        else if (error.response.status === 429) {
          alert(error.response.data.message); 
        } 
        else if (error.response.status === 401) {
          alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้งค่ะ");
        } 
        else if (error.response.status === 422) {
          alert("รูปแบบข้อมูลไม่ถูกต้อง กรุณาใช้อีเมลในการเข้าสู่ระบบ");
        } 
        else {
          alert("เซิร์ฟเวอร์เกิดข้อผิดพลาด (Status: " + error.response.status + ")");
        }
      } else {
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

      {/* Popup Modal สำหรับแจ้งเตือนให้ยืนยันอีเมล */}
      {unverifiedEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8 text-left">
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                ไปที่อีเมลของคุณเพื่อยืนยันตัวตน
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                บัญชีของคุณยังไม่ได้ยืนยันอีเมล กรุณาตรวจสอบอีเมลของท่านอีกครั้ง หากยังไม่ได้รับลิงก์ในการยืนยันบัญชีกรุณากดปุ่ม "ส่งอีเมลอีกครั้ง" เพื่อยืนยันบัญชีของท่านก่อนการเข้าสู่ระบบ
              </p>

              {/* 🖼️ พื้นที่สำหรับใส่รูปภาพประกอบ (Banner) แบบในภาพตัวอย่าง */}
              <div className="w-full rounded-lg overflow-hidden mb-6 flex justify-center items-center bg-slate-50">
                <img 
                  src={verifyImage} 
                  alt="Email Verification" 
                  className="w-full max-h-48 object-contain" 
                />
              </div>
              
              {/* ส่วนของปุ่มกด จัดเรียงชิดขวา (justify-end) */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-2">
                
                {/* ปุ่มสีเทาสำหรับส่งลิงก์ใหม่ */}
                <button 
                  type="button" 
                  onClick={handleResendEmail}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors"
                >
                  ส่งอีเมลอีกครั้ง
                </button>
                
                {/* ปุ่มสีน้ำเงินสำหรับปิด Popup (ยืนยันอีเมลแล้ว) */}
                <button 
                  type="button" 
                  onClick={() => setUnverifiedEmail('')}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                >
                  ยืนยันอีเมลแล้ว
                </button>

              </div>

            </div>
          </div>
        </div>
      )}
      

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
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
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