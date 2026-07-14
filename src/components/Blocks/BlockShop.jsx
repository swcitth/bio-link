import React, { useRef } from 'react';
import { GripVertical, Eye, EyeOff, Trash2, Plus } from 'lucide-react';
import api, { getImageUrl } from "../../api/axios";

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

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-4 transition-opacity ${item.isVisible ? 'opacity-100' : 'opacity-50'}`}>
      
      {/* 🌟 1. ส่วน Header (แถบเครื่องมือด้านบน) 🌟 */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        {/* ด้านซ้าย: ปุ่มลาก + ป้ายชื่อ Block */}
        <div 
          {...dragHandleProps} 
          className="text-slate-400 cursor-grab active:cursor-grabbing hover:text-slate-600 flex items-center gap-1.5"
          title="ลากเพื่อย้ายตำแหน่ง"
        >
          <GripVertical size={20} />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">PICTURE</span>
        </div>

        {/* ด้านขวา: ปุ่มแสดง/ซ่อน และ ลบ */}
        <div className="flex items-center gap-2">
          <button 
            type='button'
            onClick={onToggleVisibility}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors focus:outline-none"
            title={item.isVisible ? "ซ่อน" : "แสดง"}
          >
            {item.isVisible ? <Eye size={18} strokeWidth={2.5} /> : <EyeOff size={18} strokeWidth={2.5} />}
          </button>
          <button
            type='button' 
            onClick={onRemove}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none"
            title="ลบ"
          >
            <Trash2 size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* 🌟 2. ส่วนเนื้อหา (รูปภาพ + ฟอร์มกรอกข้อมูล) 🌟 */}
      {/* 🟢 แก้ไขตรงนี้: เพิ่ม sm:items-center เพื่อให้รูปและช่องกรอกข้อมูลอยู่กึ่งกลางแนวตั้งพอดีกัน */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 min-w-0">
        
        {/* Image Uploader */}
        {/* 🟢 แก้ไข: เปลี่ยนจาก sm:items-start เป็น justify-center ให้รูปจัดกึ่งกลางเสมอ */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div 
            onClick={handleImageClick}
            className="w-32 h-32 md:w-40 md:h-40 bg-[#f8f9fa] border border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden hover:bg-slate-100 transition-colors relative group"
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
        <div className="flex-1 flex flex-col gap-3 min-w-0 w-full justify-center">
          <div className="flex items-center gap-2">
            <span className="w-12 sm:w-14 text-sm font-medium text-slate-700 shrink-0">ชื่อ</span>
            <input
              type="text"
              placeholder="เช่น เสื้อยืด"
              className="flex-1 min-w-0 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-300 bg-slate-50/50 transition-all"
              {...register(`items.${index}.name`)}
            />
          </div>

          {showDescription && (
            <div className="flex items-center gap-2">
              <span className="w-12 sm:w-14 text-sm font-medium text-slate-700 shrink-0">อธิบาย</span>
              <input
                type="text"
                placeholder="คำอธิบายเพิ่มเติม..."
                className="flex-1 min-w-0 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-300 bg-slate-50/50 transition-all"
                {...register(`items.${index}.description`)}
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="w-12 sm:w-14 text-sm font-medium text-slate-700 shrink-0">ลิงก์</span>
            <input
              type="text"
              placeholder="https://"
              className="flex-1 min-w-0 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-300 bg-slate-50/50 transition-all"
              {...register(`items.${index}.link`)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-12 sm:w-14 text-sm font-medium text-slate-700 shrink-0">ราคา</span>
            <input
              type="text"
              placeholder="0.00"
              className="flex-1 min-w-0 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-300 bg-slate-50/50 transition-all"
              {...register(`items.${index}.price`)}
            />
          </div>
        </div>

      </div>

    </div>
  );
}