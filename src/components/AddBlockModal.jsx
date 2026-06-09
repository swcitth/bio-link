import React, { useState } from "react";
import { FiX, FiList, FiGrid, FiImage, FiCopy } from "react-icons/fi";
import { FaYoutube, FaTiktok } from "react-icons/fa";

// ============================================================
// AddBlockModal Component
// ============================================================
const AddBlockModal = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  // ข้อมูลของปุ่มต่างๆ แบ่งตามหมวดหมู่
  const SECTIONS = [
    {
      title: "ลิงก์",
      items: [
        {
          icon: <FiList size={32} />,
          label: "ปุ่มลิงก์",
          sub: "1 คอลัมน์",
          action: () => onAdd("link", "ลิงก์ใหม่", "Link"),
        },
        {
          icon: <FiGrid size={32} />,
          label: "ปุ่มลิงก์",
          sub: "เร็วๆนี้",
          disabled: true,
        },
      ],
    },
    {
      title: "รูปภาพ/สินค้า",
      items: [
        { 
          icon: <FiImage size={32} />, 
          label: "รูปเดี่ยว", 
          sub: "ขนาดใหญ่", 
          action: () => onAdd("image", "รูปภาพ", "Image") 
        },
        { 
          icon: <FiCopy size={32} />, // ใช้ FiCopy (รูปซ้อนกัน) แทน Images สไลเดอร์
          label: "สไลเดอร์", 
          sub: "เร็วๆนี้", 
          disabled: true 
        },
      ],
    },
    {
      title: "เพิ่มเติม",
      items: [
        {
          icon: <FaYoutube size={32} />,
          label: "Youtube",
          sub: "ฝังวิดีโอ",
          action: () => onAdd("youtube", "YouTube Video", "Youtube"),
        },
        {
          // 👈 ใช้ FaTiktok จาก react-icons ได้เลย สะดวกมาก!
          icon: <FaTiktok size={30} />,
          label: "TikTok",
          sub: "ฝัง",
          action: () => onAdd("tiktok", "TikTok", "TikTok"),
        },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2rem] w-full max-w-[480px] overflow-hidden shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (มุมขวาบน) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors z-10 focus:outline-none"
        >
          {/* เปลี่ยน X เป็น FiX */}
          <FiX size={16} strokeWidth={2.5} />
        </button>

        {/* Content Area */}
        <div className="p-8 pt-12 max-h-[85vh] overflow-y-auto space-y-8 no-scrollbar">
          {SECTIONS.map(({ title, items }) => (
            <div key={title} className="space-y-3">
              {/* Section Title */}
              <h4 className="font-bold text-slate-800 text-lg ml-1">
                {title}
              </h4>
              
              {/* Grid of Buttons */}
              <div className="grid grid-cols-2 gap-4">
                {items.map((item, i) => (
                  <button
                    key={i}
                    onClick={item.disabled ? undefined : item.action}
                    disabled={item.disabled}
                    className={`
                      flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-2xl text-center
                      transition-all duration-200 border border-transparent
                      ${item.disabled
                        ? "bg-[#F4F5F7] opacity-60 cursor-not-allowed"
                        : "bg-[#F4F5F7] hover:bg-white hover:border-slate-200 hover:shadow-sm cursor-pointer"
                      }
                    `}
                  >
                    {/* Icon */}
                    <div className={`${item.disabled ? "text-slate-300" : "text-slate-600"}`}>
                      {item.icon}
                    </div>
                    
                    {/* Text */}
                    <div className="space-y-0.5">
                      <p className={`font-bold text-[15px] leading-tight ${item.disabled ? "text-slate-400" : "text-slate-800"}`}>
                        {item.label}
                      </p>
                      <p className="text-[13px] text-slate-500 font-medium">
                        {item.sub}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddBlockModal;