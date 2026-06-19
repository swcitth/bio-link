import React, { useState, useEffect } from "react";
import { THEME_LIST } from "../../constants/themes";
import BioContent from "../Editors/BioContent";
import axios from 'axios';

const PhonePreview = ({ profile = {}, links = [], design = {} }) => {
  const activeTheme = THEME_LIST.find((t) => t.id === design.theme) || THEME_LIST[0];
  
  // จัดการสีพื้นหลัง
  const screenBackground = (design.theme === "custom" && design.bgColor) 
    ? design.bgColor 
    : (activeTheme?.cfg?.bgGradient || "#F8FAFC");

  // ✨ จัดการเรื่องฟอนต์ (Font Family) เพื่อให้เปลี่ยนตามที่ผู้ใช้เลือก
  const getFontFamily = (fontId) => {
    switch(fontId) {
      case "sarabun": return "'Sarabun', sans-serif";
      case "mali":    return "'Mali', cursive";
      case "prompt":  return "'Prompt', sans-serif";
      case "kanit":
      default:        return "'Kanit', sans-serif";
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 sticky top-24">
      {/* Label */}
      <div className="text-xs font-bold text-slate-400 tracking-[.2em] uppercase bg-white border border-slate-200 px-4 py-1.5 rounded-full shadow-sm">
        LIVE PREVIEW
      </div>

      {/* Phone Shell */}
      <div
        className="relative"
        style={{
          width: 270, height: 540, background: "#1a1a2e", borderRadius: "2.4rem", padding: 10,
          boxShadow: "0 32px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* Notch (รอยบากมือถือ) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#1a1a2e] z-20" style={{ width: 80, height: 22, borderRadius: "0 0 14px 14px" }} />

        {/* Screen */}
        <div 
          className="w-full h-full overflow-hidden relative" 
          style={{ 
            borderRadius: "2rem", 
            background: screenBackground,
            fontFamily: getFontFamily(design.font) // ✨ สั่งให้แสดงฟอนต์ตามที่ออกแบบไว้
          }}
        >
          
          {/* Background Image Layer */}
          {design.bgImage && (
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center" 
              style={{ backgroundImage: `url(${design.bgImage})`, opacity: 0.6 }} 
            />
          )}

          {/* Scrollable Content */}
          <div className="relative z-10 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* ⭐️ เรียกใช้งาน BioContent แบบโหมดมือถือ (isCompact={true}) */}
            <BioContent 
              isCompact={true} 
              profile={profile} 
              links={links} 
              design={design} 
            />
          </div>
        </div>
      </div>

      {/* URL badge */}
      <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full mt-2">
        mybiolink.com/{profile.username || "username"}
      </div>
    </div>
  );
};

export default PhonePreview;