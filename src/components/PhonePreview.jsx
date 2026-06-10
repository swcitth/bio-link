// ============================================================
// src/components/PhonePreview.jsx
// จำลองหน้าจอมือถือ (Live Preview) — sticky บนหน้าจอ
// ============================================================
import React from "react";
import { ICON_MAP } from "../constants/icons";
import { THEME_LIST } from "../constants/themes";

// ⭐️ เพิ่ม FONT_MAP ตามที่คุณต้องการ
const FONT_MAP = {
  kanit: "'Kanit', sans-serif",
  sarabun: "'Sarabun', sans-serif",
  mali: "'Mali', cursive",
  prompt: "'Prompt', sans-serif"
};

// ฟังก์ชันช่วยดึง Video ID จาก YouTube URL (รองรับทุกรูปแบบรวมถึง Shorts)
const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const PhonePreview = ({ profile = {}, links = [], design = {} }) => {
  // กรองเฉพาะลิงก์ที่ visible = true
  const visibleLinks = links.filter((l) => l.visible);

  // ธีม active สำหรับ background
  const activeTheme = THEME_LIST.find((t) => t.id === design.theme) || THEME_LIST[0];

  // ⭐️ ดึงฟอนต์ที่เลือก ถ้าไม่มีให้ใช้ kanit เป็นค่าเริ่มต้น
  const selectedFont = FONT_MAP[design.font] || FONT_MAP.kanit;

  // Computed styles จาก design state
  const btnRadius = {
    square: "6px",
    rounded: "14px",
    pill: "999px",
  }[design.btnRounded] || "999px";

  const btnBoxShadow = {
    none: "none",
    outline: "none",
    shadow3d: "3px 3px 0px rgba(0,0,0,0.8)",
  }[design.btnStyle] || "none";

  const btnBorder =
    design.btnStyle !== "none" ? `2px solid ${design.btnBorderColor || "transparent"}` : "none";

  // เช็ค Fallback ของรูปภาพ
  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

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
          width: 270,
          height: 540,
          background: "#1a1a2e",
          borderRadius: "2.4rem",
          padding: 10,
          boxShadow: "0 32px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* Notch (รอยบากมือถือ) */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#1a1a2e] z-20"
          style={{ width: 80, height: 22, borderRadius: "0 0 14px 14px" }}
        />

        {/* Screen */}
        <div
          className="w-full h-full overflow-hidden relative"
          style={{
            borderRadius: "2rem",
            background: activeTheme.cfg?.bgGradient || "#eef2ff",
            fontFamily: selectedFont, // ⭐️ นำฟอนต์มาใช้ตรงนี้ เพื่อให้ครอบคลุมทั้งหน้าจอ
          }}
        >
          {/* Background image layer */}
          {design.bgImage && (
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${design.bgImage})`, opacity: 0.6 }}
            />
          )}

          {/* Scrollable content */}
          <div className="relative z-10 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
            {/* Cover Image */}
            <div 
              className="h-[90px] shrink-0 overflow-hidden bg-slate-200"
              style={{
                background: activeTheme?.cfg?.coverBg || activeTheme?.cfg?.bgGradient || design?.coverBgColor
              }}
            >
              {profile.cover && (
                <img
                  src={profile.cover}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Profile Section */}
            <div className="flex flex-col items-center px-4 pb-5 -mt-7">
              {/* Avatar */}
              <img
                src={profile.avatar || defaultAvatar}
                alt="avatar"
                className="w-14 h-14 rounded-full border-[3px] border-white shadow-md object-cover shrink-0 bg-white"
              />

              {/* Name */}
              <p
                className="mt-2 font-bold text-sm text-center leading-tight"
                style={{ color: design.textColor || "#333" }}
              >
                {profile.name || "ชื่อของคุณ"}
              </p>

              {/* Bio */}
              <p
                className="text-[11px] mt-1 text-center opacity-70 leading-snug"
                style={{ color: design.textColor || "#666" }}
              >
                {profile.bio || "Bio ของคุณ"}
              </p>

              {/* Links List */}
              <div className="w-full flex flex-col gap-3 mt-5">
                {visibleLinks.length === 0 && (
                  <p className="text-center text-[11px] text-slate-400 mt-3">
                    ยังไม่มีลิงก์แสดงผล
                  </p>
                )}

                {visibleLinks.map((link) => {
                  const IconComp = ICON_MAP[link.icon] || ICON_MAP["Link"];
                  const subItems = link.items && link.items.length > 0 ? link.items : [link];

                  // ==========================================
                  // 1. ถ้ารูปแบบเป็น "Youtube" 
                  // ==========================================
                  if (link.icon === "Youtube") {
                    return (
                      <div key={link.id} className="flex flex-col gap-2 mb-2">
                        {link.items && link.title && (
                          <h3 className="text-[13px] font-bold px-1" style={{ color: design.textColor }}>
                            {link.title}
                          </h3>
                        )}

                        {subItems.filter(item => item.isVisible !== false && item.visible !== false).map((item, idx) => {
                          const videoUrl = item.link || item.url || "";
                          let videoId = "";
                          if (videoUrl.includes("v=")) {
                            videoId = videoUrl.split("v=")[1]?.split("&")[0];
                          } else if (videoUrl.includes("youtu.be/")) {
                            videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
                          } else if (!videoUrl && !link.items) {
                            videoId = "M7lc1UVf-VE"; 
                          }

                          return (
                            <div key={item.id || idx} className="flex flex-col gap-1">
                              <div className="w-full rounded-2xl overflow-hidden shadow-sm bg-black aspect-video relative">
                                {videoId ? (
                                  <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                                    title={item.name || item.title || link.title}
                                    frameBorder="0"
                                    allowFullScreen
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-white text-center px-2">
                                    <p className="font-bold text-sm">ยังไม่มีวิดีโอ</p>
                                  </div>
                                )}
                              </div>
                              {(item.name || item.title) && (
                                <p className="text-[11px] font-medium px-1 mt-1" style={{ color: design.textColor }}>
                                  {item.name || item.title}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  // ==========================================
                  // 2. ถ้ารูปแบบเป็น "Image" 
                  // ==========================================
                  if (link.icon === "Image") {
                    return (
                      <div key={link.id} className="flex flex-col gap-3 mb-2">
                        {link.items && link.title && (
                          <h3 className="text-[13px] font-bold px-1" style={{ color: design.textColor }}>
                            {link.title}
                          </h3>
                        )}

                        {subItems.filter(item => item.isVisible !== false && item.visible !== false).map((item, idx) => (
                          <a 
                            key={item.id || idx} 
                            href={item.url || item.link || "#"} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex flex-col hover:opacity-90 transition-opacity"
                            style={{ textDecoration: 'none' }}
                          >
                            <img
                              src={item.image || item.imageUrl || "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&q=80"}
                              alt={item.name || item.title}
                              className="w-full aspect-square object-cover rounded-2xl shadow-sm mb-2"
                            />
                            <h4 className="text-[13px] font-bold px-1" style={{ color: design.textColor }}>
                              {item.name || item.title || "ชื่อสินค้า"}
                            </h4>
                            <p className="text-[10px] opacity-70 px-1 mt-0.5" style={{ color: design.textColor }}>
                              {item.description || "รายละเอียดสินค้า"}
                            </p>
                            <p className="text-[11px] font-bold px-1 mt-1" style={{ color: design.textColor }}>
                              {item.price ? `${item.price} THB` : "100 THB"}
                            </p>
                          </a>
                        ))}
                      </div>
                    );
                  }

                  // ==========================================
                  // 3. รูปแบบปุ่มลิงก์ปกติ (⭐️ แก้ไขให้คลิกได้แล้ว)
                  // ==========================================
                  return (
                    <div key={link.id} className="w-full mb-3 flex flex-col gap-2">
                      {link.items && link.title && (
                        <h3 className="text-[13px] font-bold px-1 mb-1" style={{ color: design.textColor }}>
                          {link.title}
                        </h3>
                      )}

                      {subItems.filter(item => item.isVisible !== false && item.visible !== false).map((item, idx) => {
                        
                        // ⭐️ ดึงไอคอนจาก item ก่อน (ถ้าผู้ใช้เลือก) ถ้าไม่มีให้ใช้ของ Block หลัก
                        const ItemIcon = ICON_MAP[item.iconId] || ICON_MAP[item.icon] || ICON_MAP[link.icon] || ICON_MAP["Link"];
                        
                        return (
                          <a // ⭐️ เปลี่ยนจาก <div> เป็น <a> เพื่อให้คลิกเชื่อมโยงไปหน้าอื่นได้
                            key={item.id || idx}
                            href={item.url || item.link || "#"} // ⭐️ ดึง URL มาใส่
                            target="_blank" // เปิดในแท็บใหม่
                            rel="noopener noreferrer"
                            className="block hover:scale-[1.02] transition-transform cursor-pointer" // เพิ่ม Effect ตอนชี้เมาส์
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "8px 12px",
                              backgroundColor: design.btnBgColor,
                              color: design.btnTextColor,
                              borderRadius: btnRadius,
                              border: btnBorder,
                              boxShadow: btnBoxShadow,
                              textDecoration: "none" // เอาเส้นใต้ลิงก์ออก
                            }}
                          >
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                              style={{ background: "rgba(0,0,0,0.06)", color: design.btnTextColor }}
                            >
                              {ItemIcon && <ItemIcon size={16} />}
                            </div>

                            <span
                              className="flex-1 text-center pr-8 font-semibold"
                              style={{ fontSize: 13, color: design.btnTextColor }}
                            >
                              {/* ⭐️ ดึงชื่อลิงก์มาแสดงผล */}
                              {item.title || item.name || "ชื่อลิงก์"}
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
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