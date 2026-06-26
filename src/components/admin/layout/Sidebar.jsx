import React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Link2, X, LayoutDashboard, Users, LayoutTemplate, LogOut } from 'lucide-react';
import api from "../../../api/axios";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
        localStorage.clear();
        sessionStorage.clear(); 

        if (api.defaults.headers.common['Authorization']) {
        delete api.defaults.headers.common['Authorization'];
        }
        window.location.href = '/';
    }
    };

    const isActive = (path) => {
        return location.pathname === path;
    }



  return (
    <aside 
      className={`${
        isOpen ? 'w-[260px] translate-x-0' : 'w-0 -translate-x-full'
      } bg-[#23327B] text-white flex flex-col transition-all duration-300 ease-in-out shrink-0 z-20 overflow-hidden h-full`}
    >
      <div className="h-[80px] flex items-center justify-between px-6 shrink-0">
       
        {/* ส่วน Logo */}
        <div className="flex items-center gap-2.5">
          <div className="bg-[#5a4bfc] p-2 rounded-[14px] flex items-center justify-center">
            <Link2 className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[22px] font-extrabold text-white tracking-tight flex items-center gap-1.5">
            MyBioLink <span className="text-sm font-semibold text-indigo-300 mt-1"></span>
          </span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-indigo-300 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
        <p className="text-xs font-bold text-indigo-300/70 uppercase tracking-wider mb-2 px-2">Main Menu</p>
        
        {/* เมนู Dashboard */}
        <RouterLink 
            to="/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive('/admin') 
              ? 'bg-indigo-600/40 text-white font-bold border border-indigo-500/30 shadow-sm' // สีตอนคลิก (Active)
              : 'text-indigo-200 hover:text-white hover:bg-white/5 font-semibold border border-transparent' // สีตอนปกติ
          }`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </RouterLink>
        
        {/* เมนู User Management */}
        <RouterLink 
          to="/admin/users" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive('/admin/users') 
              ? 'bg-indigo-600/40 text-white font-bold border border-indigo-500/30 shadow-sm' 
              : 'text-indigo-200 hover:text-white hover:bg-white/5 font-semibold border border-transparent'
          }`}
          >
            <Users size={20} />
            User Management
        </RouterLink>
        
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-indigo-200 hover:text-white hover:bg-white/5 rounded-xl font-semibold transition-colors">
          <LayoutTemplate size={20} />
          CRM Dashboard
        </a>
      </div>

      {/* Sidebar Footer (User Profile & Logout) */}
      <div className="p-4 border-t border-indigo-500/30">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 rounded-full bg-white text-[#23327B] flex items-center justify-center font-bold text-sm shrink-0">
            AU
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-bold text-sm truncate">Super Admin</p>
            <p className="text-xs text-indigo-300 truncate">admin@biolink.com</p>
          </div>
          
          {/* ปุ่ม Logout ที่เรียกใช้งาน handleLogout */}
          <button 
            onClick={handleLogout}
            className="text-indigo-300 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors shrink-0"
            title="ออกจากระบบ"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}