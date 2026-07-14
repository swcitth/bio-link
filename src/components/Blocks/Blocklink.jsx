import React from 'react';
// ⭐️ เปลี่ยนมาใช้ react-icons/fa
import { FaGripVertical, FaEye, FaEyeSlash, FaTrashAlt, FaPlus } from 'react-icons/fa';

export default function Blocklink({ 
  link, 
  IconComponent, 
  onOpenPopup, 
  onToggleVisibility, 
  onRemove,
  dragHandleProps,
  onChange,
  index,
  register
}) {

  return (
    // 🟢 เปลี่ยน Container หลักให้เป็น flex-col (เรียงจากบนลงล่าง)
    <div 
      className={`bg-white border ${link.isVisible ? 'border-slate-200' : 'border-slate-200 bg-slate-50 opacity-75'} rounded-2xl p-4 flex flex-col gap-4 shadow-sm relative group transition-all`}
    >
      
      {/* 🌟 1. ส่วน Header (แถบเครื่องมือด้านบน) 🌟 */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        {/* ด้านซ้าย: ปุ่มลาก + ป้ายชื่อ Block */}
        <div 
          {...dragHandleProps} 
          className="text-slate-400 cursor-grab active:cursor-grabbing hover:text-slate-600 flex items-center gap-1.5"
          title="ลากเพื่อย้ายตำแหน่ง"
        >
          <FaGripVertical size={20} />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Link Item</span>
        </div>

        {/* ด้านขวา: ปุ่มแสดง/ซ่อน และ ลบ */}
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => onToggleVisibility(link.id)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors focus:outline-none" 
            title={link.isVisible ? "ซ่อนลิงก์นี้" : "แสดงลิงก์นี้"}
          >
            {link.isVisible ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
          </button>
          <button 
            type="button"
            onClick={() => onRemove(link.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none" 
            title="ลบลิงก์"
          >
            <FaTrashAlt size={18} />
          </button>
          <span className="text-sm font-medium text-slate-600 w-8 shrink-0">ลิงก์</span>
          {/* ⭐️ แก้ไขให้ถูกต้อง: เปลี่ยนจาก MdAppRegistration เป็น register */}
          <input 
            type="text" 
            // 🌟 แนะนำให้เปลี่ยน placeholder เพื่อบอกใบ้ผู้ใช้งาน
            placeholder="https://..., เบอร์โทร, หรือ Email"
            {...register(`items.${index}.url`)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all" 
          />
        </div>
      </div>

      {/* 🌟 2. ส่วนเนื้อหา (ปุ่มไอคอน + ฟอร์มกรอกข้อมูล) 🌟 */}
      <div className="flex flex-row items-center gap-3 sm:gap-6 min-w-0">
        
        {/* Icon Selector Button */}
        {/* 🟢 จัดให้อยู่ตรงกลางเมื่ออยู่บนมือถือ และกลับมาอยู่ชิดซ้ายบนจอคอม */}
        <div className="flex-shrink-0 flex justify-center sm:block">
          <button
            type="button"
            onClick={() => onOpenPopup(link.id)}
            className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
          >
            {IconComponent ? (
              <IconComponent size={28} strokeWidth={1.5} />
            ) : (
              <div className="w-8 h-8 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                <FaPlus size={16} className="text-slate-300" />
              </div>
            )}
          </button>
        </div>

        {/* Inputs Area */}
        <div className="flex-1 flex flex-col gap-2.5 min-w-0 w-full justify-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600 w-8 shrink-0">ชื่อ</span>
            <input 
              type="text" 
              placeholder="เช่น Facebook"
              {...register(`items.${index}.title`)}
              className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all" 
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600 w-8 shrink-0">ลิงก์</span>
            <input 
              type="text" 
              placeholder="https://"
              {...register(`items.${index}.url`)}
              className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all" 
            />
          </div>
        </div>
        
      </div>
    </div>
  );
}