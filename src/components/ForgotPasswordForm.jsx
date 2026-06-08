import React from 'react';
import { Mail } from 'lucide-react';
import ButtonBig from './Button/button_big';

export default function ForgotPasswordForm({ onSwitchView, onSubmit }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Texts */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">ลืมรหัสผ่าน</h1>
        <p className="text-sm text-slate-500">
          กรุณากรอกอีเมลที่ใช้ลงทะเบียน เราจะส่งลิงก์สำหรับตั้งค่ารหัสผ่านใหม่ไปให้คุณ
        </p>
      </div>

      {/* Reset Password Form */}
      <form className="flex flex-col gap-5">
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reset-email" className="text-sm font-medium text-slate-700">อีเมล</label>
          <div className="relative flex items-center group">
            <Mail className="absolute left-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" strokeWidth={1.5} />
            <input
              type="email"
              id="reset-email"
              placeholder="your@email.com"
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all hover:border-slate-300"
            />
          </div>
        </div>

        {/* Submit Button */}
        <ButtonBig type="button" onClick={onSubmit}>
          ตกลง
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