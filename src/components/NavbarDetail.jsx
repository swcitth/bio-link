// ============================================================
// src/components/NavbarDetail.jsx
// ============================================================

import React from "react";
import { Link2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ activeTab, setActiveTab, onSave, onShare }) => {
  const navigate = useNavigate();

  const TABS = [
    { key: "info",   label: "ข้อมูล" },
    { key: "design", label: "ออกแบบ" },
    { key: "stats",  label: "สถิติ" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-white/60">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-slate-800">
          <div className="bg-indigo-600 p-2 rounded-xl hover:bg-indigo-700 transition-colors">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          MyBioLink
        </div>

        {/* Tab Switcher */}
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

        {/* Actions */}
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
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-indigo-200"
          >
            บันทึก
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;