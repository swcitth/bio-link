import React, { useRef } from 'react';
import { GripVertical, Eye, EyeOff, Trash2, Plus } from 'lucide-react';

export default function BlockShop({ item, index, register, setValue, onRemove, onToggleVisibility, dragHandleProps, showDescription = true }) {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // อัปเดตค่ารูปลงในฟอร์มของ React Hook Form ทันทีที่แปลงไฟล์เสร็จ
        setValue(`items.${index}.image`, reader.result, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  // ฟังก์ชันเช็ค URL ของรูปภาพ
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // ถ้าเพิ่งอัปโหลดใหม่ (เป็น Base64) หรือเป็นลิงก์เว็บอื่น ให้โชว์ได้เลย
    if (imagePath.startsWith('data:') || imagePath.startsWith('http')) {
      return imagePath;
    }
    // ถ้าดึงมาจาก Database (เป็น /storage/...) ให้เติม URL หลังบ้านเข้าไป
    return `http://127.0.0.1:8000${imagePath}`;
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-start md:items-center gap-3 md:gap-6 transition-opacity ${item.isVisible ? 'opacity-100' : 'opacity-50'}`}>
      
      {/* Drag Handle */}
      <div 
        {...dragHandleProps} 
          className="text-slate-300 cursor-grab active:cursor-grabbing mt-3 sm:mt-0 flex flex-col justify-center h-full hover:text-slate-500"
          >
        <GripVertical size={20} />
      </div>

      {/* Image Uploader */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <div 
          onClick={handleImageClick}
          className="w-24 h-24 md:w-28 md:h-28 bg-[#f8f9fa] border border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden hover:bg-slate-100 transition-colors relative group"
        >
          {item.image ? (
            <>
              <img src={getImageUrl(item.image)} alt="Uploaded" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-white text-xs font-medium">เปลี่ยนรูป</span>
              </div>
            </>
          ) : (
            <div className="text-slate-300 flex border-2 border-dashed border-slate-300 p-4 rounded-xl">
               <Plus size={24} />
            </div>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="flex-1 flex flex-col gap-2.5 w-full">
        <div className="flex items-center">
          <span className="w-14 text-sm font-medium text-slate-700">ชื่อ</span>
          <input
            type="text"
            placeholder="เช่น เสื้อยืด"
            className="flex-1 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-300 bg-slate-50/50 transition-all"
            {...register(`items.${index}.name`)}
          />
        </div>

        {/* 🌟 เพิ่มเงื่อนไขครอบช่องอธิบายตรงนี้ครับ 🌟 */}
        {showDescription && (
          <div className="flex items-center">
            <span className="w-14 text-sm font-medium text-slate-700">อธิบาย</span>
            <input
              type="text"
              placeholder="คำอธิบายเพิ่มเติม..."
              className="flex-1 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-300 bg-slate-50/50 transition-all"
              {...register(`items.${index}.description`)}
            />
          </div>
        )}

        <div className="flex items-center">
          <span className="w-14 text-sm font-medium text-slate-700">ลิงก์</span>
          <input
            type="text"
            placeholder="https://"
            className="flex-1 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-300 bg-slate-50/50 transition-all"
            {...register(`items.${index}.link`)}
          />
        </div>
        <div className="flex items-center">
          <span className="w-14 text-sm font-medium text-slate-700">ราคา</span>
          <input
            type="text"
            placeholder="0.00"
            className="flex-1 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-300 bg-slate-50/50 transition-all"
            {...register(`items.${index}.price`)}
          />
        </div>
      </div>
 
      {/* Actions (Visible Toggle & Delete) */}
      <div className="flex flex-col items-center justify-start gap-4 h-full pt-2">
        <button 
          type = 'button'
          onClick={onToggleVisibility}
          className="text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
          title={item.isVisible ? "ซ่อน" : "แสดง"}
        >
          {item.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
        <button
          type = 'button' 
          onClick={onRemove}
          className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
          title="ลบ"
        >
          <Trash2 size={18} />
        </button>
      </div>

    </div>
  );
}