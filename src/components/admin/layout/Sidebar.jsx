import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Link2, X, LayoutDashboard, Users, LayoutTemplate, LogOut } from 'lucide-react';
import api from "../../../api/axios";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  // State สำหรับเก็บข้อมูลโปรไฟล์ของ Admin ที่จะนำมาแสดงผลบนหน้าจอ
  const [adminUser, setAdminUser] = useState({
    name: 'Super Admin',
    email: 'admin@biolink.com',
    initials: 'AU'
  });

  // useEffect ดึงข้อมูลแอดมินจริงจากระบบจัดเก็บข้อมูล (Storage) ทันทีเมื่อหน้าเว็บโหลดขึ้นมา
  useEffect(() => {
    try {
      // ดึงข้อมูลจาก sessionStorage ก่อน (ความจำชั่วคราว) ถ้าไม่มีค่อยไปดึงจาก localStorage (ความจำถาวร)
      const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');

      if (userStr) {
        const user = JSON.parse(userStr);
        
        // ฟังก์ชันย่อยสำหรับสร้างตัวย่อชื่อภาษาอังกฤษ 2 ตัว (เช่น Tanattha Potikarn -> TP)
        const getInitials = (name) => {
          if (!name) return 'AU';
          const names = name.split(' ');
          // ถ้ามีทั้งชื่อและนามสกุล ให้เอาตัวอักษรตัวแรกของทั้งคู่มาต่อกัน
          if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
          // ถ้ามีชื่ออย่างเดียว ให้เอาตัวอักษร 2 ตัวแรกของชื่อมาแสดง
          return name.substring(0, 2).toUpperCase();
        };

        // อัปเดตข้อมูลจริงเข้าสู่กระเป๋าความจำ State
        setAdminUser({
          name: user.display_name || user.name || 'Super Admin', // รองรับทั้งชื่อเล่นและชื่อจริง
          email: user.email || 'admin@biolink.com',
          initials: getInitials(user.display_name || user.name) // ส่งชื่อไปแปลงเป็นตัวย่อ
        });
      }
    } catch (error) {
      console.error("รูปแบบข้อมูล User ไม่ถูกต้องใน Sidebar:", error);
    }
  }, []);

  // ฟังก์ชันจัดการเมื่อแอดมินกดปุ่มออกจากระบบ (Logout)
  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
        // ทำลายข้อมูลและเคลียร์ตู้เก็บความจำทั้งหมดในระบบเบราว์เซอร์
        localStorage.clear();
        sessionStorage.clear(); 

        // ลบค่า Token ยืนยันสิทธิ์ในวงจร HTTP Header ของ Axios ออก
        if (api.defaults.headers.common['Authorization']) {
           delete api.defaults.headers.common['Authorization'];
        }
        
        // ดีดตัวกลับไปที่หน้าแรกสุด (หน้า Login)
        window.location.href = '/';
    }
  };

  // ฟังก์ชันตรวจสอบว่าเมนูนี้ตรงกับ URL ปัจจุบันที่แอดมินกำลังเปิดอยู่หรือไม่ (เพื่อทำไฮไลท์สีปุ่ม)
  const isActive = (path) => {
      return location.pathname === path;
  }

  return (
    <aside 
      className={`${
        isOpen ? 'w-[260px] translate-x-0' : 'w-0 -translate-x-full'
      } bg-[#23327B] text-white flex flex-col transition-all duration-300 ease-in-out shrink-0 z-20 overflow-hidden h-full`}
    >
      {/* ส่วนหัวของ Sidebar (Logo & ปุ่มปิดสำหรับหน้าจอมือถือ) */}
      <div className="h-[80px] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#5a4bfc] p-2 rounded-[14px] flex items-center justify-center">
            <Link2 className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[22px] font-extrabold text-white tracking-tight flex items-center gap-1.5">
            MyBioLink
          </span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-indigo-300 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* ส่วนเมนูหลักของ Sidebar (Main Navigation Links) */}
      <div className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
        <p className="text-xs font-bold text-indigo-300/70 uppercase tracking-wider mb-2 px-2">Main Menu</p>
        
        {/* ปุ่มเมนู Dashboard */}
        <RouterLink 
            to="/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive('/admin') 
              ? 'bg-indigo-600/40 text-white font-bold border border-indigo-500/30 shadow-sm' // สีตอนกำลังเปิดใช้งานหน้าปัจจุบัน (Active)
              : 'text-indigo-200 hover:text-white hover:bg-white/5 font-semibold border border-transparent' // สีตอนโหมดปกติ (Normal)
          }`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </RouterLink>
        
        {/* ปุ่มเมนู User Management */}
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
        
        {/* ปุ่มเมนู CRM Dashboard */}
        <RouterLink 
          to="/admin/crm" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive('/admin/crm') 
              ? 'bg-indigo-600/40 text-white font-bold border border-indigo-500/30 shadow-sm' 
              : 'text-indigo-200 hover:text-white hover:bg-white/5 font-semibold border border-transparent'
          }`}
        >
          <LayoutTemplate size={20} />
          CRM Dashboard
        </RouterLink>
      </div>

      {/* ส่วนล่างสุดของ Sidebar (แสดงข้อมูลผู้ใช้ Admin จริง และปุ่มออกจากระบบ) */}
      <div className="p-4 border-t border-indigo-500/30">
        <div className="flex items-center gap-3 px-2 py-2">
          
          {/* จุดแก้ไขที่ 1: แสดงผลอักษรตัวย่อจริงของแอดมินคนนั้นๆ */}
          <div className="w-10 h-10 rounded-full bg-white text-[#23327B] flex items-center justify-center font-bold text-sm shrink-0">
            {adminUser.initials}
          </div>
          
          <div className="flex-1 overflow-hidden">
            {/* จุดแก้ไขที่ 2: แสดงผลชื่อแอดมินจริงที่ดึงมาจากฐานข้อมูล */}
            <p className="font-bold text-sm truncate">{adminUser.name}</p>
            
            {/* จุดแก้ไขที่ 3: แสดงผลอีเมลจริงของแอดมิน */}
            <p className="text-xs text-indigo-300 truncate">{adminUser.email}</p>
          </div> 
          
          {/* ปุ่มไอคอนสำหรับกดออกจากระบบ */}
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