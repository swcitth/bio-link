// ============================================================
// src/pages/PreviewPage.jsx
// หน้าพรีวิวแบบเต็มจอ (อัปเดตแก้บักสีพื้นหลัง/หน้าปกโหมด Custom + จำกัดความกว้างพื้นหลัง)
// ============================================================

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { ICON_MAP } from "../constants/icons";
import { MOCK_PROFILE, MOCK_LINKS, MOCK_DESIGN } from "../data/mockData";
import Header from "../components/Navbar/Header";
import { THEME_LIST } from "../constants/themes";

const FONT_MAP = {
  kanit: "'Kanit', sans-serif",
  sarabun: "'Sarabun', sans-serif",
  mali: "'Mali', cursive",
  prompt: "'Prompt', sans-serif"
};

const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const getTiktokId = (url) => {
  if (!url) return null;
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : null;
};

const PreviewPage = () => {
  const navigate = useNavigate();

  // ⭐️ ดึงข้อมูลจาก localStorage
  const savedProfile = JSON.parse(localStorage.getItem("preview_profile"));
  const savedLinks   = JSON.parse(localStorage.getItem("preview_links"));
  const savedDesign  = JSON.parse(localStorage.getItem("preview_design"));

  const profile = savedProfile || MOCK_PROFILE;
  const links   = savedLinks   || MOCK_LINKS;
  const design  = savedDesign  || MOCK_DESIGN;

  const visibleLinks = links.filter((l) => l.isVisible !== false && l.visible !== false);
  const activeTheme = THEME_LIST.find((t) => t.id === design.theme) || THEME_LIST[0];
  const selectedFont = FONT_MAP[design.font] || FONT_MAP.kanit;

  const btnRadius = { square: "8px", rounded: "14px", pill: "999px" }[design.btnRounded] || "999px";
  const btnBoxShadow = { none: "none", outline: "none", shadow3d: "0px 4px 0px rgba(0,0,0,0.2)" }[design.btnStyle] || "none";
  const btnBorder = design.btnStyle !== "none" ? `2px solid ${design.btnBorderColor || "transparent"}` : "none";

  // ⭐️ จุดสำคัญ: กำหนดสีพื้นหลังและสีหน้าปกให้รองรับโหมด Custom แบบเดียวกับจอมือถือ
  const screenBackground = design.theme === "custom" 
    ? (design.bgColor || "#f0f2ff") 
    : (activeTheme?.cfg?.bgGradient || "#f0f2ff");

  const coverBackground = design.theme === "custom"
    ? (design.coverColor || "#D8B4FE")
    : (activeTheme?.cfg?.coverBg || activeTheme?.cfg?.bgGradient || "#D8B4FE");

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

  return (
    // ⭐️ 1. เปลี่ยนพื้นหลังด้านนอกสุดให้เป็นสีเทาอ่อน (bg-slate-100)
    <div className="min-h-screen relative bg-slate-100" style={{ fontFamily: selectedFont }}>
      
      {/* Header ด้านบนสุด */}
      <div className="relative z-30">
        <Header onLogoClick={() => navigate('/')}>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors underline underline-offset-2">
            <FaArrowLeft size={14} /> ย้อนกลับ
          </button>
        </Header>
      </div>

      {/* ⭐️ 2. คอนเทนเนอร์หลัก จำกัดความกว้างตรงกลาง (max-w-xl) พร้อมใส่เงาให้ดูลอยขึ้นมา */}
      <div className="max-w-xl mx-auto min-h-screen relative shadow-2xl pt-[72px]">
        
        {/* ⭐️ 3. พื้นหลังและรูปภาพ ถูกขังไว้ในกรอบกว้างสุดแค่ max-w-xl */}
        <div 
          className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl z-0 overflow-hidden"
          style={{ background: screenBackground }}
        >
          {design.bgImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
              style={{ backgroundImage: `url(${design.bgImage})`, opacity: 0.6 }} 
            />
          )}
        </div>

        {/* ⭐️ 4. โซนเนื้อหาทั้งหมด (ต้องใส่ relative z-10 เพื่อให้อยู่เหนือพื้นหลัง) */}
        <div className="relative z-10 pb-20">
          
          <div className="h-48 relative overflow-hidden" style={{ background: coverBackground }}>
            {profile.cover && <img src={profile.cover} alt="Cover" className="w-full h-full object-cover" />}
          </div>

          <div className="flex flex-col items-center px-6 pb-12 -mt-12 relative z-10">
            <img src={profile.avatar || defaultAvatar} alt="avatar" className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover bg-white" />
            <h1 className="mt-4 text-2xl font-bold text-center" style={{ color: design.textColor || "#333" }}>{profile.name || "ชื่อของคุณ"}</h1>
            <p className="mt-2 text-sm text-center opacity-80 max-w-sm leading-relaxed" style={{ color: design.textColor || "#666" }}>{profile.bio || "Bio ของคุณ"}</p>

            <div className="w-full mt-8 flex flex-col gap-4">
              {visibleLinks.length === 0 && <p className="text-center text-sm text-slate-400 mt-4" style={{ color: design.textColor }}>ยังไม่มีลิงก์แสดงผล</p>}

              {visibleLinks.map((link) => {
                const subItems = link.items && link.items.length > 0 ? link.items : [link];

                if (link.icon === "Youtube") {
                  return (
                    <div key={link.id} className="flex flex-col gap-3 mb-4 w-full">
                      {link.items && link.title && <h3 className="text-base font-bold px-2" style={{ color: design.textColor || "#000" }}>{link.title}</h3>}
                      {subItems.filter(item => item.isVisible !== false && item.visible !== false).map((item, idx) => {
                        const videoId = getYoutubeId(item.url || item.link || "");
                        return (
                          <div key={item.id || idx} className="flex flex-col gap-2">
                            <div className="w-full rounded-2xl overflow-hidden shadow-md bg-black aspect-video relative">
                              {videoId ? <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}?rel=0`} frameBorder="0" allowFullScreen /> : <div className="w-full h-full flex items-center justify-center text-white text-base">ยังไม่มีวิดีโอ</div>}
                            </div>
                            {(item.name || item.title) && <p className="text-sm font-medium px-2 mt-1" style={{ color: design.textColor || "#000" }}>{item.name || item.title}</p>}
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                if (link.icon === "TikTok") {
                  return (
                    <div key={link.id} className="flex flex-col gap-2 mb-2 w-full">
                      {link.items && link.title && (
                        <h3 className="text-[16px] font-bold px-2" style={{ color: design.textColor || "#000" }}>{link.title}</h3>
                      )}
                      {subItems.filter(item => item.isVisible !== false && item.visible !== false).map((item, idx) => {
                        const videoUrl = item.link || item.url || "";
                        let tiktokId = getTiktokId(videoUrl);
                        const TiktokIcon = ICON_MAP["TikTok"] || ICON_MAP["Link"];

                        return (
                          <div key={item.id || idx} className="flex flex-col gap-2 mb-2">
                            {/* ปรับสัดส่วนเป็น 9:16 สำหรับแนวตั้ง */}
                            <div 
                              className="w-full rounded-2xl overflow-hidden shadow-md bg-black relative"
                              style={{ aspectRatio: '9/16', maxHeight: '600px' }} 
                            >
                              {tiktokId ? (
                                <iframe
                                  className="w-full h-full"
                                  src={`https://www.tiktok.com/embed/v2/${tiktokId}`}
                                  title={item.name || item.title || link.title}
                                  frameBorder="0"
                                  allow="encrypted-media;"
                                  allowFullScreen
                                  scrolling="no"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-white text-center px-2 min-h-[300px]">
                                  <TiktokIcon size={40} className="mb-2 opacity-40" />
                                  <p className="font-bold text-base">ยังไม่มีวิดีโอ TikTok</p>
                                  <p className="text-sm opacity-70 mt-1">โปรดใส่ลิงก์แบบเต็ม<br/>(ที่มี /video/...)</p>
                                </div>
                              )}
                            </div>
                            {(item.name || item.title) && (
                              <p className="text-[14px] font-medium px-2 mt-1" style={{ color: design.textColor || "#000" }}>
                                {item.name || item.title}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                if (link.icon === "Image") {
                  return (
                    <div key={link.id} className="flex flex-col gap-4 mb-4 w-full">
                      {link.items && link.title && <h3 className="text-base font-bold px-2" style={{ color: design.textColor || "#000" }}>{link.title}</h3>}
                      <div className="grid grid-cols-2 gap-4">
                        {subItems.filter(item => item.isVisible !== false && item.visible !== false).map((item, idx) => (
                          <a key={item.id || idx} href={item.url || item.link || "#"} target="_blank" rel="noopener noreferrer" className="flex flex-col hover:opacity-90 group" style={{ textDecoration: 'none' }}>
                            <img src={item.image || item.imageUrl || "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&q=80"} alt={item.name || item.title} className="w-full aspect-square object-cover rounded-2xl shadow-sm mb-3 group-hover:shadow-md" />
                            <h4 className="text-sm font-bold px-1" style={{ color: design.textColor || "#000" }}>{item.name || item.title || "ชื่อสินค้า"}</h4>
                            <p className="text-xs opacity-70 px-1 mt-1 line-clamp-2" style={{ color: design.textColor || "#000" }}>{item.description || "รายละเอียดสินค้า"}</p>
                            <p className="text-sm font-bold px-1 mt-2" style={{ color: design.textColor || "#000" }}>{item.price ? `${item.price} THB` : "100 THB"}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={link.id} className="w-full mb-2 flex flex-col gap-3">
                    {link.items && link.title && <h3 className="text-base font-bold px-2 mb-1" style={{ color: design.textColor || "#000" }}>{link.title}</h3>}
                    {subItems.filter(item => item.isVisible !== false && item.visible !== false).map((item, idx) => {
                      const ItemIcon = ICON_MAP[item.iconId] || ICON_MAP[item.icon] || ICON_MAP[link.icon] || ICON_MAP["Link"];
                      return (
                        <a key={item.id || idx} href={item.url || item.link || "#"} target="_blank" rel="noopener noreferrer" className="w-full flex items-center p-4 transition-transform hover:scale-[1.02]"
                          style={{ backgroundColor: design.btnStyle === "outline" ? "transparent" : (design.btnBgColor || "#ffffff"), color: design.btnTextColor || "#000000", borderRadius: btnRadius, border: btnBorder, boxShadow: btnBoxShadow, textDecoration: "none" }}>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(0,0,0,0.06)", color: design.btnTextColor || "#000000" }}>
                            {ItemIcon && <ItemIcon size={20} />}
                          </div>
                          <span className="flex-1 text-center pr-10 font-bold" style={{ fontSize: "16px", color: design.btnTextColor || "#000000" }}>{item.title || item.name || "ชื่อลิงก์"}</span>
                        </a>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <p className="mt-14 text-sm font-medium opacity-60" style={{ color: design.textColor || "#94a3b8" }}>mybiolink.com/{profile.username || "username"}</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;