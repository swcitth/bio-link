// useState จะใช้จำข้อมูลที่พิมลงไปในฟอร์ม
import React, { useState } from 'react';
import { Mail, Lock, User, AtSign } from 'lucide-react';
import ButtonBig from '../UI/Button/ButtonBig';
import InputField from './InputField'; 
import { useNavigate } from 'react-router-dom';

import api from "../../api/axios";
import verifyImage from '../../assets/verify-email.png';

export default function SignupForm({ onSwitchView }) {
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 🌟 1. ปรับปรุง: สร้าง State เดียวเพื่อเก็บ Error ของทุกช่อง
  const [errors, setErrors] = useState({
    displayName: '',
    username: '',
    email: '',
    password: ''
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // ฟังก์ชันตรวจสอบอีเมลแบบ Real-time
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value); 

    if (value.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        // อัปเดตเฉพาะ error ของอีเมล
        setErrors(prev => ({ ...prev, email: "รูปแบบอีเมลไม่ถูกต้อง" })); 
      } else {
        setErrors(prev => ({ ...prev, email: "" })); 
      }
    } else {
      setErrors(prev => ({ ...prev, email: "" })); 
    }
  };

  // ฟังก์ชันจัดการเมื่อกดปุ่ม Submit ฟอร์ม
  const handleRegister = async (e) => {
    e.preventDefault(); 
    
    // 🌟 2. ดักจับข้อผิดพลาดฝั่งหน้าบ้านก่อนยิง API (ลดการเด้ง alert)
    let currentErrors = { displayName: '', username: '', email: '', password: '' };
    let hasError = false;

    if (!displayName.trim()) { currentErrors.displayName = "กรุณากรอกชื่อที่แสดง"; hasError = true; }
    if (!username.trim()) { currentErrors.username = "กรุณากรอกชื่อผู้ใช้"; hasError = true; }
    
    if (!email.trim()) { currentErrors.email = "กรุณากรอกอีเมล"; hasError = true; }
    else if (errors.email) { currentErrors.email = errors.email; hasError = true; } // ถ้าติด Error Real-time อยู่

    if (!password) { currentErrors.password = "กรุณากรอกรหัสผ่าน"; hasError = true; }
    else if (password.length < 8) { currentErrors.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"; hasError = true; }

    // ถ้ามี Error อย่างน้อย 1 ช่อง ให้แสดงเส้นแดงและหยุดทำงาน
    if (hasError) {
      setErrors(currentErrors);
      return;
    }

    try {
      const response = await api.post('/register',{
        display_name: displayName,
        username: username,
        email: email,
        password: password
      });
    
      if (response.data.status === 'success' || response.status === 201) {
        setDisplayName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setErrors({ displayName: '', username: '', email: '', password: '' });

        setShowSuccessPopup(true);
      }
    } catch (error) {
      // console.error("เกิดข้อผิดพลาดในการสมัครสมาชิก:", error);

      // 🌟 3. ดักจับ Error จาก Laravel (Status 422) แล้วนำไปแสดงใต้ช่อง
      if (error.response && error.response.status === 422) {
        const backendErrors = error.response.data.errors;
        let apiErrors = { ...currentErrors };

        // แปลงข้อความจาก Laravel ลงไปใส่ในแต่ละช่อง
        if (backendErrors.display_name) apiErrors.displayName = backendErrors.display_name[0];
        if (backendErrors.username) apiErrors.username = backendErrors.username[0]; // เช่น "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว"
        if (backendErrors.email) apiErrors.email = backendErrors.email[0];
        if (backendErrors.password) apiErrors.password = backendErrors.password[0];

        setErrors(apiErrors); // สั่งอัปเดตหน้าจอให้กรอบแดงเด้งขึ้นมา
      } else {
        alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้งค่ะ");
      }
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Popup Modal สมัครสมาชิกสำเร็จ (คงเดิม) */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8 text-left">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                สมัครสมาชิกสำเร็จ! กรุณายืนยันอีเมลของท่านก่อนเข้าสู่ระบบ
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                กรุณาตรวจสอบกล่องจดหมาย (และโฟลเดอร์จดหมายขยะ) ในอีเมลของคุณ เพื่อคลิกลิงก์ยืนยันบัญชีค่ะ
              </p>
              <div className="w-full rounded-lg overflow-hidden mb-6 flex justify-center items-center bg-slate-50">
                <img 
                  src={verifyImage} 
                  alt="Registration Success" 
                  className="w-full max-h-48 object-contain" 
                />
              </div>
              <div className="flex items-center justify-end mt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowSuccessPopup(false); 
                    onSwitchView(); 
                  }}
                  className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                >
                  ไปหน้าเข้าสู่ระบบ
                </button>
              </div>
            </div>
          </div>
        </div>
      )} 

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">สร้างบัญชีใหม่</h1>
        <p className="text-sm text-slate-500">เริ่มต้นสร้างหน้าโปรไฟล์ของคุณ ฟรี!</p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleRegister} > 
        
        {/* 🌟 4. ผูกตัวแปร error เข้ากับทุกๆ ช่อง InputField */}
        <InputField 
          id="displayName" 
          label="ชื่อที่แสดง (Display Name)" 
          placeholder="ชื่อที่จะแสดง..." 
          icon={User} 
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          error={errors.displayName} // 👈 เพิ่มการดักจับ Error
        />
        
        <InputField 
          id="username" 
          label="ชื่อผู้ใช้ (Username)" 
          placeholder="ตั้งชื่อผู้ใช้..." 
          icon={AtSign} 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username} // 👈 เพิ่มการดักจับ Error
        />
        
        <InputField 
          type="email" 
          id="email" 
          label="อีเมล" 
          placeholder="your@email.com" 
          icon={Mail} 
          value={email}
          onChange={handleEmailChange}
          error={errors.email} // 👈 ใช้ตัวแปรที่รวมไว้ใน object เดียวกัน
        />
        
        <InputField 
          type="password" 
          id="password" 
          label="รหัสผ่าน" 
          placeholder="••••••••" 
          icon={Lock} 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password} // 👈 เพิ่มการดักจับ Error รหัสผ่าน
        />

        <div className="mt-2">
          <ButtonBig type="submit">ลงทะเบียน</ButtonBig>
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-slate-600">
        มีบัญชีอยู่แล้ว?{' '}
        <button 
          type="button" 
          onClick={onSwitchView} 
          className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none"
        >
          เข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
}