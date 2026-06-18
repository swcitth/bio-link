import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import ButtonBig from '../UI/Button/ButtonBig';
import axios from 'axios';

export default function ForgotPasswordForm({ onSwitchView, onSubmit }) {
  //สร้าง State ไว้จำอีเมลที่ผู้ใช้พิมพ์ และเช็คสถานะโหลด
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันจัดการเมื่อกดปุ่ม "ตกลง"
  const handleSubmit = async (e) => {
    e.preventDefault(); // ห้ามเบราว์เซอร์รีเฟรชหน้าเว็บ

    if (!email.trim()) {
      alert("กรุณากรอกอีเมลที่ใช้ลงทะเบียนค่ะ");
      return;
    }

    setIsLoading(true);

    try {
      //  ยิง API ขอรหัส OTP จาก Laravel 
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/forgot-password`, {
        email: email
      });

      if (response.status === 200) {
        alert(response.data.message); // แจ้งเตือนว่า "ส่ง OTP สำเร็จ"
        
        // ส่งอีเมลกลับไปให้หน้าแม่ เพื่อให้หน้าแม่ส่งต่อให้หน้า OTP
        onSubmit(email); 
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      // ถ้า Laravel ตอบกลับมาว่า 404 (หาอีเมลไม่เจอ) ให้โชว์แจ้งเตือน
      if (error.response && error.response.data) {
        alert("แจ้งเตือนจากหลังบ้าน: " + error.response.data.message); 
      } else {
        alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้งค่ะ");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Texts */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">ลืมรหัสผ่าน</h1>
        <p className="text-sm text-slate-500">
          กรุณากรอกอีเมลที่ใช้ลงทะเบียน เราจะส่งรหัส OTP 4 หลักสำหรับยืนยันตัวตนไปให้คุณ
        </p>
      </div>


      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reset-email" className="text-sm font-medium text-slate-700">อีเมล</label>
          <div className="relative flex items-center group">
            <Mail className="absolute left-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" strokeWidth={1.5} />
            <input
              type="email"
              id="reset-email"
              placeholder="your@email.com"
              value={email} // ผูก State เข้ากับ Input
              onChange={(e) => setEmail(e.target.value)} //บันทึกค่าตอนพิมพ์
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all hover:border-slate-300"
            />
          </div>
        </div>

        <ButtonBig type="submit" disabled={isLoading}>
          {isLoading ? 'กำลังส่งรหัส OTP...' : 'ตกลง'}
        </ButtonBig>
      </form>

      {/* Back to Login Link */}
      <div className="mt-8 text-center text-sm text-slate-600">
        <button 
          onClick={onSwitchView}
          className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none"
        >
          กลับไปหน้าเข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
}