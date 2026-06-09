// ============================================================
// src/components/AddBlockModal.jsx
// Modal ป๊อปอัปสำหรับเลือกประเภทลิงก์ที่จะเพิ่ม
// ============================================================

import React from "react";
import { FaTimes, FaYoutube, FaInstagram, FaShoppingCart, FaMusic } from "react-icons/fa";

const AddBlockModal = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  const SECTIONS = [
    {
      title: "ลิงก์",
      items: [
        {
          emoji: "🔗",
          label: "ปุ่มลิงก์",
          sub: "1 คอลัมน์",
          action: () => onAdd("link", "ลิงก์ใหม่", "Link"),
        },
        {
          emoji: "⊞",
          label: "2 คอลัมน์",
          sub: "เร็วๆ นี้",
          disabled: true,
        },
      ],
    },
    {
      title: "รูปภาพ / สินค้า",
      items: [
        { emoji: "🖼️", label: "สไลเดอร์",  sub: "เร็วๆ นี้", disabled: true },
        { emoji: "📷", label: "รูปเดี่ยว", sub: "เร็วๆ นี้", disabled: true },
      ],
    },
    {
      title: "เพิ่มเติม",
      items: [
        {
          icon: <FaYoutube size={36} />,
          label: "YouTube",
          sub: "ฝังวิดีโอ (ผ่านลิงก์)",
          action: () => onAdd("link", "YouTube Video", "Youtube"),
        },
        {
          icon: <FaInstagram size={36} />,
          label: "Instagram",
          sub: "เพิ่มลิงก์โปรไฟล์",
          action: () => onAdd("link", "Instagram", "Instagram"),
        },
        {
          icon: <FaShoppingCart size={36} />,
          label: "Shopee / Lazada",
          sub: "ลิงก์สินค้า",
          action: () => onAdd("link", "สั่งซื้อสินค้า", "ShoppingCart"),
        },
        {
          icon: <FaMusic size={36} />,
          label: "Spotify / Music",
          sub: "เพลย์ลิสต์",
          action: () => onAdd("link", "My Playlist", "Music"),
        },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">➕ เพิ่มรูปแบบ</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 no-scrollbar">
          {SECTIONS.map(({ title, items }) => (
            <div key={title}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                {title}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {items.map((item, i) => (
                  <button
                    key={i}
                    onClick={item.disabled ? undefined : item.action}
                    disabled={item.disabled}
                    className={`
                      flex flex-col items-center gap-3 p-5 rounded-2xl border text-center
                      transition-all duration-150
                      ${item.disabled
                        ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                        : "border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer"
                      }
                    `}
                  >
                    <div className="text-slate-400">
                      {item.icon
                        ? item.icon
                        : <span style={{ fontSize: 36 }}>{item.emoji}</span>
                      }
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-700">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
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