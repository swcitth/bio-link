import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function InputField({ id, label, type = "text", placeholder, icon: Icon,onChange, error, value }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  

  const currentType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative flex items-center group">
        {/* ไอคอนด้านซ้าย (ถ้ามีการส่ง prop icon มา) */}
        {Icon && (
          <Icon 
            className="absolute left-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" 
            strokeWidth={1.5} 
          />
        )}
        
        {/* ช่อง Input */}
        <input
          type={currentType}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-11 py-2.5 bg-slate-50/50 border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all 
            ${error 
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' //  ถ้ามี error ให้ขอบแดง
              : 'border-slate-200 hover:border-slate-300 focus:ring-indigo-600/20 focus:border-indigo-600' // ปกติขอบเทา/น้ำเงิน
            } 
            ${isPassword ? 'pr-11' : 'pr-4'}
          `}
        />

        {/* ปุ่มเปิด/ปิดรหัสผ่าน (แสดงเฉพาะตอน type="password") */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
          </button>
        )}
      </div>
      {error && (
        <span className="text-red-500 text-sm mt-0.5">{error}</span>
      )}
    </div>
  );
}