import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import ButtonBig from '../UI/Button/ButtonBig';
import InputField from './InputField';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPasswordForm({ email, otp, onSubmit }) {

  //State สำหรับเก็บรหัสผ่านและสถานะการโหลด
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State สำหรับ เปิด-ปิด ตาเพื่อดูรหัสผ่าน
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //ฟังก์ชันส่งข้อมูลรหัสใหม่ไปหา Laravel
  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      alert("ข้อมูลการทำรายการสูญหาย กรุณากลับไปเริ่มต้นทำรายการใหม่อีกครั้งค่ะ");
      return; 
    }

    if (password.length < 8) {
      alert("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษรค่ะ");
      return;
    }

    if (password !== passwordConfirmation) {
      alert("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกันค่ะ");
      return;
    }

    setIsLoading(true);

    try {
      // ยิงข้อมูลทั้งหมดส่งไปหา Laravel
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/reset-password`, {
        email: email,
        otp: otp,
        password: password,
        password_confirmation: passwordConfirmation // ชื่ออยู่ใน format ที่จะนำไปใช้กับ comfirmed ใน backend
      });

      if (response.status === 200) {
        alert(response.data.message); // แจ้งว่าเปลี่ยนรหัสสำเร็จ
        onSubmit(); // กลับไปหน้า Login 
      }

    } catch (error) {
      // console.error("Reset Password Error:", error);
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert("ระบบมีปัญหาไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้งค่ะ");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Texts */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          แก้ไขรหัสผ่าน
        </h1>
        <p className="text-sm text-slate-500">
          กรุณาตั้งรหัสผ่านใหม่ที่ปลอดภัยและคาดเดาได้ยาก
        </p>
      </div>

      {/* Reset Password Form */}
      <form className="flex flex-col gap-5" onSubmit={handleResetSubmit}>
        
        {/* ช่องรหัสผ่านใหม่ */}
        <InputField
          id="new-password"
          label="รหัสผ่านใหม่"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ช่องยืนยันรหัสผ่าน */}
        <InputField
          id="confirm-password"
          label="ยืนยันรหัสผ่าน"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />

        {/* ปุ่มบันทึก */}
        <ButtonBig type="submit" disabled={isLoading} className="mt-2">
          บันทึก
        </ButtonBig>
      </form>
    </div>
  );
}