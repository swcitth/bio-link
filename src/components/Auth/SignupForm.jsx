import React, { useState } from 'react';
import { Mail, Lock, User, AtSign } from 'lucide-react';
import ButtonBig from '../Button/button_big';
import InputField from './InputField'; 
import { useNavigate } from 'react-router-dom';

export default function SignupForm({ onSwitchView }) {
  const navigate = useNavigate();
  
  // สร้าง State สำหรับเก็บค่าต่างๆ ที่พิมพ์ลงไป
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State สำหรับเก็บข้อความ Error ของอีเมล
  const [emailError, setEmailError] = useState('');

  // ฟังก์ชันตรวจสอบอีเมลแบบ Real-time
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value); // อัปเดตค่าอีเมลทันทีที่พิมพ์

    // ถ้ามีการพิมพ์อะไรลงไป ให้เริ่มเช็ค Format ทันที
    if (value.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError("ไม่ถูกต้อง"); // ขอบจะแดงและขึ้นข้อความ
      } else {
        setEmailError(""); // ถ้าถูกแล้ว ให้เคลียร์ Error ทิ้ง
      }
    } else {
      setEmailError(""); // ถ้าลบจนช่องว่างเปล่า ไม่ต้องโชว์ Error
    }
  };

  // ฟังก์ชันจัดการเมื่อกดปุ่ม Submit ฟอร์ม
  const handleRegister = (e) => {
    e.preventDefault(); 
    
    // ดักไว้: ถ้าหน้าจอมี Error แจ้งเตือนอยู่ ห้ามส่งข้อมูลเด็ดขาด
    if (emailError) {
      alert("กรุณาแก้ไขอีเมลให้ถูกต้องก่อน");
      return;
    }

    // ดักไว้: ถ้ามีช่องไหนเว้นว่าง ห้ามส่งข้อมูล
    if (!displayName.trim() || !username.trim() || !email.trim() || !password) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    
    console.log("บันทึกข้อมูลสมัครสมาชิกสำเร็จ!");

    // เมื่อลงทะเบียนสำเร็จ จะให้เปลี่ยนหน้า หรือ สลับ Component ก็ทำได้เลย
    // navigate('/login'); 
    onSwitchView(); // อันนี้สลับกลับไปหน้า Login ให้อัตโนมัติ (ตามที่คุณเขียนส่ง prop มา)
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">สร้างบัญชีใหม่</h1>
        <p className="text-sm text-slate-500">เริ่มต้นสร้างหน้าโปรไฟล์ของคุณ ฟรี!</p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleRegister} >
        
        <InputField 
          id="displayName" 
          label="ชื่อที่แสดง (Display Name)" 
          placeholder="ชื่อที่จะแสดง..." 
          icon={User} 
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        
        <InputField 
          id="username" 
          label="ชื่อผู้ใช้ (Username)" 
          placeholder="ตั้งชื่อผู้ใช้..." 
          icon={AtSign} 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        {/* ช่องอีเมลที่ถูกผูก Validation ไว้ */}
        <InputField 
          type="email" 
          id="email" 
          label="อีเมล" 
          placeholder="your@email.com" 
          icon={Mail} 
          value={email}
          onChange={handleEmailChange}
          error={emailError} // ถ้าค่าตัวนี้ไม่ใช่ช่องว่าง ขอบจะเปลี่ยนเป็นสีแดง
        />
        
        <InputField 
          type="password" 
          id="password" 
          label="รหัสผ่าน" 
          placeholder="••••••••" 
          icon={Lock} 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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