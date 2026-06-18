// useState จะใช้จำข้อมูลที่พิมลงไปในฟอร์ม
import React, { useState } from 'react';
import { Mail, Lock, User, AtSign } from 'lucide-react';
import ButtonBig from '../UI/Button/ButtonBig';
import InputField from './InputField'; 
import { useNavigate } from 'react-router-dom';

// ใช้ axios สำหรับส่งข้อมูลไปยัง API
import axios from 'axios';

export default function SignupForm({ onSwitchView }) {
  const navigate = useNavigate();
  
  // สร้าง State สำหรับเก็บค่าต่างๆ ที่พิมพ์ลงไป
  // setDisplayName คือการรับค่า
  // displayName คือการเอาค่าไปใช้
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State สำหรับเก็บข้อความ Error ของอีเมล
  const [emailError, setEmailError] = useState('');

  // ฟังก์ชันตรวจสอบอีเมลแบบ Real-time
  // e = event ผู้ใช้กดปุ่ม 1 ทีจะส่งช้อมูลกลับมาให้ react
  const handleEmailChange = (e) => {
    // เก็บข้อความล่าสุดที่ผู้ใช้พิมในช่อง input ไว้ที่ value
    const value = e.target.value;
    setEmail(value); // อัปเดตค่าอีเมลทันทีที่พิมพ์

    // ถ้ามีการพิมพ์อะไรลงไป ให้เริ่มเช็ค Format ทันที
    if (value.length > 0) {
      // check format emsil -> ข้อความ @ ข้อความ . ข้อความ
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

  // ฟังก์ชันจัดการเมื่อกดปุ่ม Submit ฟอร์ม และ async เข้าไป เพื่อให้ใช้งาน await ยิง API ได้
  const handleRegister = async (e) => {
    e.preventDefault(); // คำสั่งนี้จะเป็นการห้ามไม่ให้หน้าเว็บรีเฟรช
    
    // ดักไว้: ถ้าหน้าจอมี Error แจ้งเตือนอยู่ ห้ามส่งข้อมูลเด็ดขาด
    if (emailError) {
      alert("กรุณาแก้ไขอีเมลให้ถูกต้องก่อน");
      return;
    }

    // ดักไว้: ถ้ามีช่องไหนเว้นว่าง ห้ามส่งข้อมูล
    // trim จะเป้นคำสังในการลบช่องว่าง
    if (!displayName.trim() || !username.trim() || !email.trim() || !password) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // การส่งข้อมูลไปยัง API ด้วย axios 
    // try คือกรลองส่งถ้าเกิดพังจะไปทำงานต่อที่ catch แล้วเว็บก็จะยังไม่พัง 
    // await ให้โปรแกรมรอจนกว่า laravel จะทำงานเสร็จ
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        // คีย์ฝั่งซ้าย (ชื่อที่ส่งไปหา Laravel) ต้องเหมือนกับที่ Laravel รอรับใน Controller
        // ตัวแปรฝั่งขวา (ชื่อแปรใน React)
        display_name: displayName,
        username: username,
        email: email,
        password: password
      });
    
    console.log("บันทึกข้อมูลสมัครสมาชิกสำเร็จ!");

    // เมื่อลงทะเบียนสำเร็จ จะให้เปลี่ยนหน้า
    onSwitchView(); // อันนี้สลับกลับไปหน้า Login ให้อัตโนมัติ (ตามที่เขียน prop มาจากหน้า Auth)
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการสมัครสมาชิก:", error);

    // error.response: เช็คก่อนว่าเซิร์ฟเวอร์ยังตอบกลับมาอยู่ไหม
    // error.response.status: เช็คสถานะ HTTP ว่าเป็น 422 หรือเปล่า (ซึ่ง Laravel ใช้สำหรับ Validation Error)
    if (error.response && error.response.status === 422) {
        // ดึงข้อความ error ตัวแรกสุดที่ Laravel ออกมาโชว์ให้ User เห็น
        const errors = error.response.data.errors;
        const firstErrorMessage = Object.values(errors)[0][0];
        alert(`ไม่สามารถสมัครได้: ${firstErrorMessage}`);
      } else {
        alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้งค่ะ");
      }
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">สร้างบัญชีใหม่</h1>
        <p className="text-sm text-slate-500">เริ่มต้นสร้างหน้าโปรไฟล์ของคุณ ฟรี!</p>
      </div>

      {/*onSubmit การเอาฟังก์ชันส่ง API มาผูกไว้ที่นี่เมื่อมีการส่ง handleRegister จะทำงานทันที*/ }
      <form className="flex flex-col gap-4" onSubmit={handleRegister} > 
        
        <InputField 
          id="displayName" 
          label="ชื่อที่แสดง (Display Name)" 
          placeholder="ชื่อที่จะแสดง..." 
          icon={User} 
          
          // การผูกค่าในช่องนี้กับ displayName
          value={displayName}
          // เมื่อผู้ใช้พิมมาให้เอาข้อมูลไปอัพเดทใน state 
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
          {/*type="submit" เป็นการระบุว่าหากผู้ใช้กดปุ่มนนี้มันจะทำให้คำสั่ง onSubmit={handleRegister} ที่อยู่ในform ทำงาน*/ }
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