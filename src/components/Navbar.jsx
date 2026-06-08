import React from 'react';
import { Link2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between">
      
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => navigate('/')} 
      >
        <div className="bg-indigo-600 p-2 rounded-xl group-hover:bg-indigo-700 transition-colors">
          <Link2 className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-slate-800">MyBioLink</span>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
        {/* 👈 ปุ่มเข้าสู่ระบบ พาไปหน้า /login */}
        <button 
          onClick={() => navigate('/login')}
          className="text-slate-600 hover:text-indigo-600 font-medium transition-colors hidden sm:block"
        >
          เข้าสู่ระบบ
        </button>
        
        {/* 👈 ปุ่มลงทะเบียน พาไปหน้า /signup */}
        <button 
          onClick={() => navigate('/signup')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5"
        >
          ลงทะเบียน
        </button>
      </div>
    </nav>
  );
}