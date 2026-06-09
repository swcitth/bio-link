import React from 'react';
import { Mail, Lock, User, AtSign } from 'lucide-react';
import ButtonBig from '../Button/button_big';
import InputField from './InputField'; 
import { useNavigate } from 'react-router-dom';


export default function SignupForm({ onSwitchView }) {
  
  const navigate = useNavigate();
  // ฟังก์ชันจัดการเมื่อกดปุ่ม Submit ฟอร์ม
  const handleRegister = (e) => {
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรช
    
    // ส่งข้อมูลลงทะเบียนไปให้ Backend 
    console.log("บันทึกข้อมูลสมัครสมาชิกสำเร็จ!");

    //เมื่อทุกอย่างเสร็จสิ้น ค่อยสั่งให้เปลี่ยนหน้าไปที่ Login
    navigate('/login'); 
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">สร้างบัญชีใหม่</h1>
        <p className="text-sm text-slate-500">เริ่มต้นสร้างหน้าโปรไฟล์ของคุณ ฟรี!</p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleRegister} >
        <InputField id="displayName" label="ชื่อที่แสดง (Display Name)" placeholder="ชื่อที่จะแสดง..." icon={User} />
        <InputField id="username" label="ชื่อผู้ใช้ (Username)" placeholder="ตั้งชื่อผู้ใช้..." icon={AtSign} />
        <InputField type="email" id="email" label="อีเมล" placeholder="your@email.com" icon={Mail} />
        <InputField type="password" id="password" label="รหัสผ่าน" placeholder="••••••••" icon={Lock} />

        <div className="mt-2">
          <ButtonBig type="submit">ลงทะเบียน</ButtonBig>
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-slate-600">
        มีบัญชีอยู่แล้ว?{' '}
        <button onClick={onSwitchView} className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none">
          เข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
}