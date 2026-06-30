import React from 'react';
import { Download, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

export default function DashboardHeader({ 
  title, 
  activeFilter, 
  onFilterChange, 
  buttonDateText, // ข้อความสำหรับในปุ่ม (เช่น 1 มิ.ย. - 5 มิ.ย. (5 วัน))
  subDateText,    // ข้อความสำหรับด้านล่าง (เช่น 30 มิ.ย. 2026 (GMT+7))
  onDownload, 
  downloadText = "ดาวน์โหลดรายงาน" 
}) {
  
  const getButtonClass = (filterType) => {
    return activeFilter === filterType
      ? "px-5 py-2 text-[13px] font-bold bg-[#6B46FF] text-white rounded-full shadow-sm transition-all"
      : "px-5 py-2 text-[13px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-all";
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pt-2 relative">
      <div>
        <h1 className="text-[26px] font-extrabold text-[#1E293B] tracking-tight">{title}</h1>
        
        <div className="mt-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center bg-white rounded-full p-1 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 transition-all duration-300">
              <button className={getButtonClass('today')} onClick={() => onFilterChange('today')}>วันนี้</button>
              <button className={getButtonClass('7days')} onClick={() => onFilterChange('7days')}>7 วัน</button>
              <button className={getButtonClass('30days')} onClick={() => onFilterChange('30days')}>30 วัน</button>
              <button className={getButtonClass('custom')} onClick={() => onFilterChange('custom')}>กำหนดเอง</button>
              
              {/* ปุ่มปฏิทินที่จะโผล่มาเมื่อกด "กำหนดเอง" */}
              {activeFilter === 'custom' && (
                <div className="flex items-center animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="w-px h-5 bg-slate-200 mx-1.5"></div>
                  <button 
                    onClick={() => onFilterChange('custom')} // กดแล้วส่งสัญญาณไปเปิด Modal ที่หน้าหลัก
                    className="flex items-center gap-2 px-3 py-1 mr-1 rounded-full hover:bg-slate-50 transition-colors group"
                  >
                    <CalendarIcon size={14} className="text-[#6B46FF]" strokeWidth={2.5} />
                    <span className="text-sm font-bold text-slate-700 whitespace-nowrap">
                      {buttonDateText}
                    </span>
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* ข้อความวันที่ด้านล่าง (GMT+7) */}
          <p className="text-[11px] font-semibold text-slate-400 mt-2.5 ml-3 tracking-wide">
            {subDateText}
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