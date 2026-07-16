// ============================================================
// src/components/NavbarDetail.jsx
// ============================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FaSignOutAlt, FaHome, FaPalette, FaChartBar } from "react-icons/fa";
// 🟢 เพิ่ม Menu และ X จาก lucide-react สำหรับไอคอน 3 ขีดและกากบาท
import { Eye, Share2, Menu, X } from "lucide-react"; 

import Header from "./Header"; 
import api from "../../api/axios";

const Navbar = ({ activeTab, setActiveTab, onShare }) => {
  const navigate = useNavigate();
  // 🟢 State สำหรับจัดการการเปิด/ปิดเมนูบนมือถือ
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const TABS = [
    { key: "info",   label: "ข้อมูล", icon: <FaHome size={18} /> },
    { key: "design", label: "ออกแบบ", icon: <FaPalette size={18} /> },
    { key: "stats",  label: "สถิติ", icon: <FaChartBar size={18} /> },
  ];

  const handleLogout = async () => {
    try { 
      await api.post('/logout'); 
    } catch (error) { 
      // console.error("Logout API Error:", error); 
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    }
  };

  return (
    <>
      {/* 🟢 HEADER (ด้านบน) */}
      <Header onLogoClick={() => setActiveTab("info")}>
        {/* แท็บเมนู (โชว์เฉพาะ Desktop) */}
        <div className="hidden md:flex gap-1 bg-slate-100 p-1 rounded-xl">
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === key ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 🟢 ส่วนปุ่มและเมนู 3 ขีด */}
        {/* เพิ่ม relative เพื่อให้เมนู Dropdown อิงตำแหน่งจากกล่องนี้ */}
        <div className="relative flex items-center gap-2">
          
          {/* ปุ่ม "ดู" (Desktop เห็น) */}
          <button
            onClick={() => navigate("/preview")}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <Eye size={15} /> ดู
          </button>

          {/* ปุ่ม "แชร์" (Desktop เห็น) */}
          <button
            onClick={onShare}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Share2 size={15} /> แชร์
          </button>
          
          {/* ปุ่ม "ออกจากระบบ" (Desktop เห็น) */}
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-md shadow-red-200"
          >
            <FaSignOutAlt size={15} /> ออกจากระบบ
          </button>

          {/* 🌟 ปุ่ม 3 ขีด (Mobile เท่านั้น) */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            title="เมนู"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* 🌟 Dropdown Menu สำหรับมือถือ */}
          {isMobileMenuOpen && (
            <div className="absolute top-full right-0 mt-3 w-48 bg-white border border-slate-200 rounded-xl shadow-lg md:hidden z-[100] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => {
                  onShare();
                  setIsMobileMenuOpen(false); // กดแล้วปิดเมนู
                }}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 text-left transition-colors border-b border-slate-100"
              >
                <Share2 size={16} className="text-slate-500" /> แชร์
              </button>
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 active:bg-red-100 text-left transition-colors"
              >
                <FaSignOutAlt size={16} className="text-red-500" /> ออกจากระบบ
              </button>
            </div>
          )}

        </div>
      </Header>

      {/* 🟢 MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around items-center px-2 py-3 z-50 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {TABS.map(({ key, label, icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex flex-col items-center gap-1 w-full ${activeTab === key ? "text-indigo-600" : "text-slate-400"}`}
          >
            {icon}
            <span className="text-[10px] font-bold">{label}</span>
          </button>
        ))}
        <button onClick={() => navigate("/preview")} className="flex flex-col items-center gap-1 w-full text-slate-400 hover:text-indigo-600 transition-colors">
          <Eye size={18} />
          <span className="text-[10px] font-bold">ดู</span>
        </button>
      </div>

      <div className="h-[72px] w-full shrink-0"></div>
    </>
  );
};

export default Navbar;