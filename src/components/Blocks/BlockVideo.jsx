import React from 'react';
import { GripVertical, Eye, EyeOff, Trash2 } from 'lucide-react';
import { FaYoutube, FaTiktok } from 'react-icons/fa';

// ฟังก์ชันสำหรับดึง ID ของวิดีโอและสร้างลิงก์รูปปกจาก YouTube
const getYoutubeThumbnail = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
  }
  return null;
}; 

//ฟังก์ชันตรวจสอบว่าเป็นลิงก์ TikTok หรือไม่
const isTikTokLink = (url) => {
  if (!url) return false;
  return url.toLowerCase().includes('tiktok');
};

export default function BlockVideo({ item, index, register, onRemove, onToggleVisibility, dragHandleProps ,platform }) {
  const thumbnailUrl = getYoutubeThumbnail(item.link);

  // ⭐️ แก้ไข: เช็คให้แม่นยำขึ้น ถ้ามีลิงก์ TikTok หรืออยู่ในโหมด TikTok แล้วไม่ใช่ลิงก์ Youtube ให้เป็น TikTok ทันที
  const isTikTok = isTikTokLink(item.link) || (platform === "TikTok" && !thumbnailUrl);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center gap-3 md:gap-5 transition-opacity ${item.isVisible ? 'opacity-100' : 'opacity-50'}`}>
      
      {/* Drag Handle */}
      <div 
        {...dragHandleProps} 
          className="text-slate-300 cursor-grab active:cursor-grabbing mt-3 sm:mt-0 flex flex-col justify-center h-full hover:text-slate-500"
          >
        <GripVertical size={20} />
      </div>

      {/* Thumbnail Box */}
      <div className="flex-shrink-0 w-32 h-20 md:w-56 md:h-32 bg-[#e2e8f0] rounded-lg overflow-hidden flex items-center justify-center border border-slate-100">
        {thumbnailUrl ? (
          // ถ้าเป็นลิงก์ YouTube และมีรูปปก ให้แสดงรูปปก
          <img src={thumbnailUrl} alt="YouTube Thumbnail" className="w-full h-full object-cover" />
        ) : isTikTok ? (
          // ถ้าเป็น TikTok โชว์ฉากหลังดำ + ไอคอน TikTok (ปรับให้เข้ากับธีม TikTok)
          <div className="w-full h-full bg-black flex items-center justify-center">
            <FaTiktok size={32} className="text-white opacity-80" />
          </div>
        ) : (
          // ถ้ายังไม่มีลิงก์ + อยู่ในโหมด YouTube -> โชว์ไอคอน YouTube กลางกล่องเทา
          <div className="w-full h-full bg-[#d1d5db]/40 flex items-center justify-center">
            <FaYoutube size={32} className="text-slate-400 opacity-50" />
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="flex-1 flex flex-col gap-3 justify-center">
        <div className="flex items-center">
          <span className="w-10 md:w-12 text-sm font-medium text-slate-700">ชื่อ</span>
          <input
            type="text"
            placeholder="ชื่อวิดีโอ"
            className="flex-1 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-300 bg-slate-50/50 transition-all"
            {...register(`items.${index}.name`)}
          />
        </div>
        <div className="flex items-center">
          <span className="w-10 md:w-12 text-sm font-medium text-slate-700">ลิงก์</span>
          <input
            type="text"
            placeholder={isTikTok ? "https://www.tiktok.com/@..." : "https://youtu.be/..."}
            className="flex-1 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-300 bg-slate-50/50 transition-all"
            {...register(`items.${index}.link`)}
          />
        </div>
      </div>

      {/* Actions (Edit Label, Visible Toggle & Delete) */}
      <div className="flex flex-col items-center justify-center gap-3 px-1 md:px-2">
        <button
          type="button" 
          onClick={onToggleVisibility}
          className="text-slate-500 hover:text-indigo-600 transition-colors focus:outline-none"
          title={item.isVisible ? "ซ่อน" : "แสดง"}
        >
          {item.isVisible ? <Eye size={18} strokeWidth={2.5} /> : <EyeOff size={18} strokeWidth={2.5} />}
        </button>
        <button 
          type="button"
          onClick={onRemove}
          className="text-slate-500 hover:text-red-600 transition-colors focus:outline-none"
          title="ลบ"
        >
          <Trash2 size={18} strokeWidth={2.5} />
        </button>
      </div>

    </div>
  );
}