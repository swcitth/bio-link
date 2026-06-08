import React from 'react';
import ButtonBig from './Button/button_big';

export default function OTPForm({ onBack }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Texts */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          ยืนยันรหัส OTP
        </h1>
        <p className="text-sm text-slate-500">
          กรุณากรอกรหัส 4 หลักที่เราส่งไปยังอีเมลของคุณเพื่อยืนยันตัวตน
        </p>
      </div>

      {/* OTP Form */}
      <form className="flex flex-col gap-8">
        
        {/* 4-Digit OTP Inputs */}
        <div className="flex justify-center gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((digit) => (
            <input
              key={digit}
              type="text"
              maxLength={1}
              className="w-14 h-16 text-center text-2xl font-bold text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all hover:border-slate-300"
              placeholder="-"
            />
          ))}
        </div>

        {/* 👈 ดึง ButtonBig มาใช้ */}
        <ButtonBig type="button">
          ตกลง
        </ButtonBig>
      </form>

      {/* Resend Link & Back */}
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