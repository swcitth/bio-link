// ============================================================
// src/components/NavbarDetail.jsx
// ============================================================

import React from "react";
import { useNavigate } from "react-router-dom"; 
import { FaSignOutAlt } from "react-icons/fa";
import { Eye } from "lucide-react"; 

// 🟢 นำเข้า Header จากไฟล์ของคุณมาใช้งาน
import Header from "./Header"; 

const Navbar = ({ activeTab, setActiveTab, onShare }) => {
  const navigate = useNavigate();

  const TABS = [
    { key: "info",   label: "ข้อมูล" },
    { key: "design", label: "ออกแบบ" },
    { key: "stats",  label: "สถิติ" },
  ];

  // 🟢 สร้างฟังก์ชันออกจากระบบ และกลับไปหน้า Landing Page
  const handleLogout = () => {
    // (Optional) หากมีระบบ Login สามารถเพิ่มโค้ดลบ Token หรือ Session ได้ที่นี่
    navigate("/");
  };

  return (
    <>
      {/* 🟢 เรียกใช้ Header และส่งฟังก์ชันเปลี่ยนแท็บเมื่อคลิกโลโก้ */}
      <Header onLogoClick={() => setActiveTab("info")}>
        
        {/* Tab Switcher (แท็บตรงกลาง) คงโค้ดเดิมของคุณไว้ทั้งหมด */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`
                px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                ${activeTab === key
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Actions (ปุ่มด้านขวา) คงโค้ดเดิมของคุณไว้ทั้งหมด */}
        <div className="flex items-center gap-2">
          {/* ปุ่มดู — ไปหน้า /preview */}
          <button
            onClick={() => navigate("/preview")}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <Eye size={15} /> ดู
          </button>
          <button
            onClick={onShare}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            แชร์
          </button>
          
          {/* ปุ่มออกจากระบบ (สีแดง) */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-md shadow-red-200"
          >
            <FaSignOutAlt size={15} /> ออกจากระบบ
          </button>
        </div>

      </Header>

      {/* 🟢 เพิ่มช่องว่าง 72px เพื่อดันเนื้อหาใน Dashboard ลงมา ไม่ให้ Header ที่ fixed อยู่ด้านบนบัง */}
      <div className="h-[72px] w-full shrink-0"></div>
    </>
  );
};

export default Navbar;