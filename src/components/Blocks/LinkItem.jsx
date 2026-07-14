// ============================================================
// src/components/LinkItem.jsx (หรือ src/components/Blocks/LinkItem.jsx)
// ============================================================

import React, { useState } from "react";
import { FiEdit2, FiEye, FiEyeOff, FiTrash2, FiCopy } from "react-icons/fi";
import { FaGripVertical, FaLink } from "react-icons/fa";
import { ICON_MAP } from "../../constants/icons";

const LinkItem = ({
  link,
  index,
  onDelete,
  onToggleVisibility,
  onEdit,
  provided, // 🌟 รับมาจาก Dashboard
  snapshot  // 🌟 รับมาจาก Dashboard
}) => {
  // (ไม่ต้องมี State isDragOver แล้ว)

// 1. ระบบแกะกล่องข้อมูล
  let safeItems = link?.items || [];
  if (typeof safeItems === 'string') {
    try {
      safeItems = JSON.parse(safeItems);
    } catch (error) {
      safeItems = [];
    }
  }

  // 2. ดึงชื่อไอคอนอย่างปลอดภัย
  const firstItemIcon = safeItems?.[0]?.iconId || safeItems?.[0]?.icon;
  
  // 3. กำหนด IconComponent แยกตามประเภทของบล็อก
  let IconComponent;
  
  // เช็คว่าเป็นบล็อกประเภทรูปภาพหรือไม่
  if (link.icon === "Image") {
    IconComponent = ICON_MAP["Image"] || FaLink;
  } 
  // เช็คว่าเป็นบล็อกวิดีโอ (YouTube/TikTok) ให้แสดงไอคอนตามที่เลือก
  else if (link.icon === "Youtube" || link.icon === "TikTok") {
    IconComponent = ICON_MAP[firstItemIcon] || ICON_MAP[link?.icon] || ICON_MAP["Link"];
  } 
  // 🌟 เพิ่มส่วนนี้: ถ้าเป็นสไลด์ ให้ใช้ไอคอน FiCopy
  else if (link.icon === "Slider" || link.icon === "SLIDER") {
    IconComponent = FiCopy;
  }
  // 🌟 เพิ่มส่วนนี้ด้วยเลย: ถ้าเป็นของขาย (Shop) ให้ใช้ FaImage
  else if (link.icon === "Shop" || link.icon === "SHOP") {
    IconComponent = ICON_MAP["Image"] || FaLink;
  }
  // กรณีอื่นๆ (บล็อก "ปุ่มลิงก์") ให้แสดงห่วงโซ่เสมอ
  else {
    IconComponent = FaLink;
  }
  
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={provided.draggableProps.style} // 🌟 จุดที่ 1: เพิ่มบรรทัดนี้สำคัญมาก! (ช่วยให้ลื่น 60FPS)
      className={`
        rounded-2xl mb-3 overflow-hidden transition-colors transition-shadow duration-200
        ${snapshot.isDragging
          ? "border-2 border-dashed border-indigo-400 bg-indigo-50 scale-[1.02] shadow-lg"
          : "border border-white/80 bg-white/80 shadow-sm hover:shadow-md hover:border-indigo-100"
        }
        ${!link.visible ? "opacity-60 grayscale-[40%]" : ""}
      `}
    >
      <div className="flex items-center gap-3 p-3">

        {/* Drag Handle */}
        <div 
          {...provided.dragHandleProps} 
          // 🌟 จุดที่ 2: เพิ่ม touch-none เข้าไปที่บรรทัดนี้ (ทำให้แตะแล้วขยับทันที ไม่ต้องรอกดค้าง)
          className="p-1 -ml-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 shrink-0 transition-colors touch-none"
        >
          <FaGripVertical size={16} />
        </div>

        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center shrink-0 text-slate-600">
          <IconComponent size={18} />
        </div>

        {/* Title + URL */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold text-slate-700 ${!link.visible ? "opacity-50" : ""}`}>
            {link.title}
          </p>
          {link.url && (
            <p className="text-xs text-slate-400 truncate">{link.url}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Edit */}
          <button 
            onClick={() => onEdit(link)}
            title="แก้ไข"
            className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors"
          >
            <FiEdit2 size={14} />
          </button>

          {/* Toggle Visibility */}
          <button
            onClick={() => onToggleVisibility(link.id)}
            title={link.visible ? "ซ่อน" : "แสดง"}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              link.visible
                ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
            }`}
          >
            {link.visible ? <FiEye size={14} /> : <FiEyeOff size={14} />}
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(link.id)}
            title="ลบ"
            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
          >
            <FiTrash2 size={14} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default LinkItem;