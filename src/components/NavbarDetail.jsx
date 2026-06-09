// ============================================================
// src/components/Navbar.jsx
// Navigation bar หลักของแอป
// ============================================================

import React from "react";
import { InfinityIcon } from "lucide-react";

/**
 * Props:
 * - activeTab   : 'info' | 'design' | 'stats'
 * - setActiveTab: (tab: string) => void
 * - onSave      : () => void  (callback เมื่อกดบันทึก)
 * - onShare     : () => void  (callback เมื่อกดแชร์)
 */
const Navbar = ({ activeTab, setActiveTab, onSave, onShare }) => {
  const TABS = [
    { key: "info",   label: "ข้อมูล" },
    { key: "design", label: "ออกแบบ" },
    { key: "stats",  label: "สถิติ" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-white/60">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-lg text-indigo-900 font-prompt">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-1.5 rounded-xl">
            <InfinityIcon size={18} />
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
