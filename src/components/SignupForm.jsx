import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, AtSign } from 'lucide-react';
import ButtonBig from './Button/button_big';

export default function SignupForm({ onSwitchView }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Texts */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          สร้างบัญชีใหม่
        </h1>
        <p className="text-sm text-slate-500">
          เริ่มต้นสร้างหน้าโปรไฟล์ของคุณ ฟรี!
        </p>
      </div>

      <form className="flex flex-col gap-4">
        {/* Display Name Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="displayName" className="text-sm font-medium text-slate-700">
            ชื่อที่แสดง (Display Name)
          </label>
          <div className="relative flex items-center group">
            <User className="absolute left-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" strokeWidth={1.5} />
            <input
              type="text"
              id="displayName"
              placeholder="ชื่อที่จะแสดง..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all hover:border-slate-300"
            />
          </div>
        </div>

        {/* Username Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="username" className="text-sm font-medium text-slate-700">
            ชื่อผู้ใช้ (Username)
          </label>
          <div className="relative flex items-center group">
            <AtSign className="absolute left-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" strokeWidth={1.5} />
            <input
              type="text"
              id="username"
              placeholder="ตั้งชื่อผู้ใช้..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all hover:border-slate-300"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            อีเมล
          </label>
          <div className="relative flex items-center group">
            <Mail className="absolute left-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" strokeWidth={1.5} />
            <input
              type="email"
              id="email"
              placeholder="your@email.com"
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all hover:border-slate-300"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5 mb-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            รหัสผ่าน
          </label>
          <div className="relative flex items-center group">
            <Lock className="absolute left-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" strokeWidth={1.5} />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              className="w-full pl-11 pr-11 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all hover:border-slate-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" strokeWidth={1.5} />
              ) : (
                <Eye className="w-4 h-4" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <ButtonBig type="button">
          ลงทะเบียน
        </ButtonBig>
      </form>

      {/* Login Link */}
      <div className="mt-8 text-center text-sm text-slate-600">
        มีบัญชีอยู่แล้ว?{' '}
        <button 
          onClick={onSwitchView}
          className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none"
        >
          เข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
}