// ============================================================
// src/components/NavbarDetail.jsx
// ============================================================

import React from "react";
import { useNavigate } from "react-router-dom"; 
import { FaSignOutAlt, FaHome, FaPalette, FaChartBar } from "react-icons/fa";
import { Eye, Share2 } from "lucide-react"; 

import Header from "./Header"; 
import api from "../../api/axios";

const Navbar = ({ activeTab, setActiveTab, onShare }) => {
  const navigate = useNavigate();

  const TABS = [
    { key: "info",   label: "ข้อมูล", icon: <FaHome size={18} /> },
    { key: "design", label: "ออกแบบ", icon: <FaPalette size={18} /> },
    { key: "stats",  label: "สถิติ", icon: <FaChartBar size={18} /> },
  ];

  const handleLogout = async () => {
  try { 
    // แจ้งหลังบ้านให้ทำลาย Token ทิ้งเพื่อความปลอดภัย
    await api.post('/logout'); 
  } catch (error) { 
    console.error("Logout API Error:", error); 
  } finally {
    // เคลียร์ข้อมูลทั้งใน localStorage และ sessionStorage ให้เกลี้ยง
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // หรือถ้าในเว็บไม่ได้เก็บค่าสำคัญอื่นๆ ไว้ จะใช้คำสั่งเหมาเข่งแบบนี้ก็ได้ครับ
    // localStorage.clear();
    // sessionStorage.clear();

    // แจ้งเตือน Tab อื่นๆ ว่าเราทำการ Logout แล้ว (อิงจากที่คุณเขียนในหน้า Login)
    window.dispatchEvent(new Event("storage"));

    // เด้งกลับไปหน้าแรก
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

        {/* ปุ่มทั้งหมด (Desktop เห็นครบ) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/preview")}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <Eye size={15} /> ดู
          </button>

          <button
            onClick={onShare}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Share2 size={15} /> แชร์
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-md shadow-red-200"
          >
            <FaSignOutAlt size={15} /> ออกจากระบบ
          </button>
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
        {/* แก้ไขปุ่มดูให้เป็น text-slate-400 เหมือนปุ่มอื่นแล้วครับ */}
        <button onClick={() => navigate("/preview")} className="flex flex-col items-center gap-1 w-full text-slate-400 hover:text-indigo-600 transition-colors">
          <Eye size={18} />
          <span className="text-[10px] font-bold">ดู</span>
        </button>
      </div>

      <div className="h-[72px] w-full shrink-0"></div>
      <div className="md:hidden h-[60px] w-full shrink-0"></div>
    </>
  );
};

export default Navbar;