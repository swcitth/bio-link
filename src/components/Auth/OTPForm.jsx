import React, { useState, useRef } from 'react'; // 👈 นำเข้า useState และ useRef
import ButtonBig from '../UI/Button/ButtonBig';

export default function OTPForm({ onBack, onSubmit }) {
  // 1. สร้าง State เก็บค่า OTP 4 หลัก
  const [otp, setOtp] = useState(['', '', '', '']);
  // 2. สร้าง Ref เก็บอ้างอิงของกล่อง input ทั้ง 4 กล่อง
  const inputRefs = useRef([]);

  // ฟังก์ชันจัดการเมื่อมีการพิมพ์
  const handleChange = (e, index) => {
    const value = e.target.value;
    
    // ดักไว้ให้พิมพ์ได้เฉพาะตัวเลข (ถ้าไม่อยากจำกัดให้ลบบรรทัดนี้ได้ครับ)
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // ดึงมาแค่ตัวอักษรล่าสุดที่พิมพ์
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // เลื่อนโฟกัสไปช่องถัดไป ถ้ามีการพิมพ์และยังไม่ใช่ช่องสุดท้าย
    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // ฟังก์ชันจัดการเมื่อกดปุ่มบนคีย์บอร์ด (เอาไว้ดักปุ่ม Backspace)
  const handleKeyDown = (e, index) => {
    // ถ้ากล่องนั้นว่างอยู่ แล้วผู้ใช้กด Backspace ให้กระโดดกลับไปลบกล่องก่อนหน้า
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">ยืนยันรหัส OTP</h1>
        <p className="text-sm text-slate-500">
          กรุณากรอกรหัส 4 หลักที่เราส่งไปยังอีเมลของคุณเพื่อยืนยันตัวตน
        </p>
      </div>

      <form className="flex flex-col gap-8">
        <div className="flex justify-center gap-3 sm:gap-4">
          {/* เปลี่ยนจาก [1,2,3,4] เป็น [0,1,2,3] เพื่อให้ตรงกับ Index ของ Array */}
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)} // 👈 เก็บอ้างอิง (Ref) ของแต่ละกล่อง
              type="text"
              maxLength={1}
              value={otp[index]} // 👈 ผูกค่ากับ State
              onChange={(e) => handleChange(e, index)} // 👈 เรียกฟังก์ชันตอนพิมพ์
              onKeyDown={(e) => handleKeyDown(e, index)} // 👈 เรียกฟังก์ชันตอนกดคีย์บอร์ด
              className="w-14 h-16 text-center text-2xl font-bold text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all hover:border-slate-300"
              placeholder="-"
            />
          ))}
        </div>

        <ButtonBig type="button" onClick={onSubmit}>
          ตกลง
        </ButtonBig>
      </form>

      <div className="mt-8 text-center text-sm flex flex-col gap-3">
        <div className="text-slate-600">
          ไม่ได้รับรหัส?{' '}
          <button className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none">
            ส่งอีกครั้ง
          </button>
        </div>
        <button 
          onClick={onBack}
          className="font-medium text-slate-500 hover:text-slate-700 transition-colors focus:outline-none mt-2"
        >
          กลับไปหน้าก่อนหน้า
        </button>
      </div>
    </div>
  );
}