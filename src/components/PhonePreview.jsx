// ============================================================
// src/components/PhonePreview.jsx
// จำลองหน้าจอมือถือ (Live Preview) — sticky บนหน้าจอ
// ============================================================

import React from "react";
import { ICON_MAP } from "../constants/icons";
import { THEME_LIST } from "../constants/themes";

/**
 * Props:
 * - profile : { name, bio, username, avatar, cover }
 * - links   : array of link objects
 * - design  : design state object
 */
const PhonePreview = ({ profile, links, design }) => {
  // กรองเฉพาะลิงก์ที่ visible = true
  const visibleLinks = links.filter((l) => l.visible);

  // ธีม active สำหรับ background
  const activeTheme = THEME_LIST.find((t) => t.id === design.theme) || THEME_LIST[0];

  // 🟢 ดึงสีหน้าปกจากธีมปัจจุบัน (ถ้าไม่มีใช้สีเริ่มต้น)
  const coverBgClass = "bg-gradient-to-br from-indigo-200 to-pink-200";

  // Computed styles จาก design state
  const btnRadius = {
    square:  "6px",
    rounded: "14px",
    pill:    "999px",
  }[design.btnRounded] || "999px";

  const btnBoxShadow = {
    none:     "none",
    outline:  "none",
    shadow3d: "3px 3px 0px rgba(0,0,0,0.8)",
  }[design.btnStyle] || "none";

  const btnBorder =
    design.btnStyle !== "none"
      ? `2px solid ${design.btnBorderColor}`
      : "none";

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
        {/* Notch */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#1a1a2e] z-20"
          style={{ width: 80, height: 22, borderRadius: "0 0 14px 14px" }}
        />

        {/* Screen */}
        <div
          className="w-full h-full overflow-hidden relative"
          style={{
            borderRadius: "2rem",
            background: activeTheme.cfg.bgGradient || "#eef2ff",
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
          <div className="relative z-10 h-full overflow-y-auto no-scrollbar">

            {/* 🟢 แก้ไขส่วน Cover ให้เปลี่ยนสีตามธีม (ใช้ตัวแปร coverBgClass) */}
            <div className={`h-[90px] shrink-0 overflow-hidden ${coverBgClass}`}>
              {profile.cover && (
                <img
                  src={profile.cover} alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Profile */}
            <div className="flex flex-col items-center px-4 pb-5 -mt-7">

              {/* Avatar */}
              <img
                src={profile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                alt="avatar"
                className="w-14 h-14 rounded-full border-[3px] border-white shadow-md object-cover shrink-0"
              />

              {/* Name */}
              <p
                className="mt-2 font-bold text-sm text-center leading-tight"
                style={{ color: design.textColor }}
              >
                {profile.name || "ชื่อของคุณ"}
              </p>

              {/* Bio */}
              <p
                className="text-[11px] mt-1 text-center opacity-70 leading-snug"
                style={{ color: design.textColor }}
              >
                {profile.bio || "Bio ของคุณ"}
              </p>

              {/* Links List */}
              <div className="w-full flex flex-col gap-3 mt-4">
                {visibleLinks.length === 0 && (
                  <p className="text-center text-[11px] text-slate-400 mt-3">
                    ยังไม่มีลิงก์แสดงผล
                  </p>
                )}

                {visibleLinks.map((link) => {
                  const IconComp = ICON_MAP[link.icon] || ICON_MAP["Link"];

                  // ==========================================
                  // 1. ถ้ารูปแบบเป็น "Youtube" -> โชว์ตัวเล่นวิดีโอ
                  // ==========================================
                  if (link.icon === "Youtube") {
                    const videoId = link.url && link.url.includes("v=") ? link.url.split("v=")[1] : "Jg1XN0zE9hQ"; 
                    return (
                      <div key={link.id} className="w-full rounded-2xl overflow-hidden shadow-sm bg-black aspect-video relative my-1">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                          title={link.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    );
                  }

                  // ==========================================
                  // 2. ถ้ารูปแบบเป็น "Image" -> โชว์รูปสินค้า + ราคา
                  // ==========================================
                  if (link.icon === "Image") {
                    return (
                      <div key={link.id} className="w-full flex flex-col text-left mb-2 mt-1">
                        <img
                          src={link.imageUrl || "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&q=80"} 
                          alt={link.title}
                          className="w-full aspect-square object-cover rounded-2xl shadow-sm mb-2"
                        />
                        <h3 className="text-[13px] font-bold leading-tight" style={{ color: design.textColor }}>
                          {link.title || "อาหารสุนัข"}
                        </h3>
                        <p className="text-[10px] opacity-70 mt-0.5 leading-snug" style={{ color: design.textColor }}>
                          {link.description || "อาหารสุนัขสำหรับลูกหมาอายุ 1-12 เดือน"}
                        </p>
                        <p className="text-[11px] font-bold mt-1" style={{ color: design.textColor }}>
                          {link.price ? `${link.price} THB` : "100 THB"}
                        </p>
                      </div>
                    );
                  }

                  // ==========================================
                  // 3. รูปแบบปุ่มลิงก์ปกติ
                  // ==========================================
                  return (
                    <div
                      key={link.id}
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
                        cursor: "pointer",
                        transition: "transform 0.15s",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                      onMouseOut={(e)  => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "rgba(0,0,0,0.06)", color: design.btnTextColor }}
                      >
                        <IconComp size={14} />
                      </div>

                      <span
                        className="flex-1 text-center pr-7 font-semibold"
                        style={{ fontSize: 11, color: design.btnTextColor }}
                      >
                        {link.title}
                      </span>
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