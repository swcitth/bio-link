// ============================================================
// src/components/admin/dashboard/DashboardHeader.jsx
// ============================================================

import React from 'react';
import { Download } from 'lucide-react';

export default function DashboardHeader({ 
  title, 
  activeFilter, 
  onFilterChange, 
  dateText, 
  onDownload, 
  downloadText = "ดาวน์โหลดรายงาน" 
}) {
  
  // คลาสสีปุ่มแบบแคปซูล (Pill Button)
  const getButtonClass = (filterType) => {
    return activeFilter === filterType
      ? "px-5 py-2 text-[13px] font-bold bg-[#6B46FF] text-white rounded-full shadow-sm transition-all"
      : "px-5 py-2 text-[13px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-all";
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pt-2">
      <div>
        <h1 className="text-[26px] font-extrabold text-[#1E293B] tracking-tight">{title}</h1>
        
        <div className="mt-5">
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100">
            <button className={getButtonClass('today')} onClick={() => onFilterChange('today')}>วันนี้</button>
            <button className={getButtonClass('7days')} onClick={() => onFilterChange('7days')}>7 วัน</button>
            <button className={getButtonClass('30days')} onClick={() => onFilterChange('30days')}>30 วัน</button>
            <button className={getButtonClass('custom')} onClick={() => onFilterChange('custom')}>กำหนดเอง</button>
          </div>
          <p className="text-[11px] font-semibold text-slate-400 mt-2.5 ml-3 tracking-wide">
            {dateText}
          </p>
        </div>
      </div>
      
      <div className="mb-[26px]">
        <button 
          onClick={onDownload}
          className="bg-[#6B46FF] hover:bg-[#5835E5] text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20 active:scale-95"
        >
          <Download size={18} strokeWidth={2.5} />
          {downloadText}
        </button>
      </div>
    </div>
  );
}