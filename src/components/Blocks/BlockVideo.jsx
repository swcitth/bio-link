import React from 'react';
import { GripVertical, Eye, EyeOff, Trash2 } from 'lucide-react';
import { FaYoutube, FaTiktok } from 'react-icons/fa';

const getYoutubeThumbnail = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
  }
  return null;
}; 

const isTikTokLink = (url) => {
  if (!url) return false;
  return url.toLowerCase().includes('tiktok');
};

export default function BlockVideo({ item, index, register, onRemove, onToggleVisibility, dragHandleProps, platform }) {
  const thumbnailUrl = getYoutubeThumbnail(item.link);
  const isTikTok = isTikTokLink(item.link) || (platform === "TikTok" && !thumbnailUrl);

  return (
    // 🟢 เปลี่ยนโครงสร้างหลักเป็น flex-col (เรียงบนลงล่าง)
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-4 transition-opacity ${item.isVisible ? 'opacity-100' : 'opacity-50'}`}>
      
      {/* 🌟 1. ส่วน Header (แถบเครื่องมือด้านบน) 🌟 */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        {/* ด้านซ้าย: ปุ่มลาก + ป้ายบอกว่าเป็นวิดีโอ */}
        <div 
          {...dragHandleProps} 
          className="text-slate-400 cursor-grab active:cursor-grabbing hover:text-slate-600 flex items-center gap-1"
          title="ลากเพื่อย้ายตำแหน่ง"
        >
          <GripVertical size={20} />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Video Block</span>
        </div>

        {/* ด้านขวา: ปุ่มแสดง/ซ่อน และ ลบ */}
        <div className="flex items-center gap-2">
          <button
            type="button" 
            onClick={onToggleVisibility}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors focus:outline-none"
            title={item.isVisible ? "ซ่อน" : "แสดง"}
          >
            {item.isVisible ? <Eye size={18} strokeWidth={2.5} /> : <EyeOff size={18} strokeWidth={2.5} />}
          </button>
          <button 
            type="button"
            onClick={onRemove}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none"
            title="ลบ"
          >
            <Trash2 size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* 🌟 2. ส่วนเนื้อหา (รูปภาพ + ฟอร์ม) 🌟 */}
      {/* บนมือถือเรียงบนลงล่าง (flex-col) แต่บนจอคอมเรียงซ้ายขวา (md:flex-row) */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-5 min-w-0">
        
        {/* Thumbnail Box */}
        {/* 🟢 ใช้ aspect-video (สัดส่วน 16:9) เพื่อให้รูปสมมาตรเสมอ */}
        <div className="w-full md:w-56 aspect-video bg-[#e2e8f0] rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-slate-100">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt="YouTube Thumbnail" className="w-full h-full object-cover" />
          ) : isTikTok ? (
            <div className="w-full h-full bg-black flex items-center justify-center">
              <FaTiktok size={32} className="text-white opacity-80" />
            </div>
          ) : (
            <div className="w-full h-full bg-[#d1d5db]/40 flex items-center justify-center">
              <FaYoutube size={32} className="text-slate-400 opacity-50" />
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="flex-1 flex flex-col gap-3 justify-center min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-8 sm:w-10 text-sm font-medium text-slate-700 shrink-0">ชื่อ</span>
            <input
              type="text"
              placeholder="ชื่อวิดีโอ"
              className="flex-1 min-w-0 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-300 bg-slate-50/50 transition-all"
              {...register(`items.${index}.name`)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-8 sm:w-10 text-sm font-medium text-slate-700 shrink-0">ลิงก์</span>
            <input
              type="text"
              placeholder={isTikTok ? "https://www.tiktok.com/@..." : "https://youtu.be/..."}
              className="flex-1 min-w-0 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-300 bg-slate-50/50 transition-all"
              {...register(`items.${index}.link`)}
            />
          </div>

          {/* Toggle เล่นอัตโนมัติ */}
          {!isTikTok && (
            <div className="flex items-center gap-2 mt-1">
              <span className="w-8 sm:w-10 shrink-0"></span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  {...register(`items.${index}.isAutoplay`)} 
                />
                <div className="shrink-0 w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ml-3 text-[13px] font-medium text-slate-600">
                  เล่นอัตโนมัติ (Auto-play)
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}