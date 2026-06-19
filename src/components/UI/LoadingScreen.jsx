import React from 'react';
import { Hourglass } from 'lucide-react';

const LoadingScreen = () => {
  return (
    // ⭐️ เปลี่ยนเป็น fixed inset-0 z-[9999] เพื่อให้ลอยทับทุกหน้าจอ
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-fuchsia-400/20 rounded-full blur-3xl animate-pulse delay-150" />

      <div className="relative z-10 flex flex-col items-center p-10 rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white/80 shadow-2xl shadow-indigo-100/50">
        
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-50 to-white shadow-inner mb-6 border border-slate-100">
          <Hourglass 
            size={36} 
            strokeWidth={1.5} 
            className="text-indigo-500 animate-[spin_2.5s_ease-in-out_infinite]" 
          />
        </div>

        <h3 className="text-lg font-bold text-slate-700 tracking-wide mb-2">
          กำลังเตรียมข้อมูล
        </h3>
        <p className="text-sm font-medium text-slate-400 animate-pulse">
          โปรดรอสักครู่...
        </p>
        
      </div>
    </div>
  );
};

export default LoadingScreen;