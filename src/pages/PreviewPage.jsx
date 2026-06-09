// ============================================================
// src/pages/PreviewPage.jsx
// หน้าพรีวิวแบบเต็มจอ
// ============================================================

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { ICON_MAP } from "../constants/icons";
import { MOCK_PROFILE, MOCK_LINKS, MOCK_DESIGN } from "../data/mockData";

// นำเข้า Header Component และ THEME_LIST
import Header from "../components/Navbar/Header";
import { THEME_LIST } from "../constants/themes";

const PreviewPage = () => {
  const navigate = useNavigate();

  // ดึงข้อมูลจาก localStorage ที่ Dashboard บันทึกไว้
  const savedProfile = JSON.parse(localStorage.getItem("preview_profile"));
  const savedLinks   = JSON.parse(localStorage.getItem("preview_links"));
  const savedDesign  = JSON.parse(localStorage.getItem("preview_design"));

  // ถ้ามีข้อมูลที่เซฟไว้ให้ใช้ค่านั้น ถ้าไม่มีให้ใช้ Mock Data
  const profile = savedProfile || MOCK_PROFILE;
  const links   = savedLinks   || MOCK_LINKS;
  const design  = savedDesign  || MOCK_DESIGN;

  // เช็คธีมปัจจุบันเพื่อดึงสีมาใส่หน้าปก
  const currentTheme = THEME_LIST.find((t) => t.id === design.theme);
  const coverBgClass = "bg-gradient-to-br from-indigo-200 to-pink-200";
  const radius = { square: "8px", rounded: "14px", pill: "999px" }[design.btnRounded] || "999px";
  const border = design.btnStyle !== "none" ? `2px solid ${design.btnBorderColor}` : "none";
  const shadow = design.btnStyle === "shadow3d" ? "3px 3px 0 rgba(0,0,0,0.8)" : "none";

  return (
    <div
      className="min-h-screen"
      // รองรับทั้งรูปภาพ (bgImage) และสี (bgGradient)
      style={
        design.bgImage
          ? {
              backgroundImage: `url(${design.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }
          : { background: design.bgGradient || design.bgColor || "#f0f2ff" }
      }
    >
      {/* เรียกใช้งาน Header และแก้ไขปุ่มย้อนกลับ */}
      <Header onLogoClick={() => navigate('/')}>
        <button
          onClick={() => navigate(-1)}
          // เพิ่มคลาส underline และ underline-offset-2 (เพื่อให้เส้นใต้ขยับลงมาสวยงาม)
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors underline underline-offset-2"
        >
          <FaArrowLeft size={14} /> ย้อนกลับ
        </button>
      </Header>

      {/* Page Content: เพิ่ม pt-[72px] เพื่อไม่ให้ Header ที่สูง 72px บังเนื้อหาด้านบน */}
      <div className="max-w-lg mx-auto pt-[72px]">

        {/* Cover : แก้ไขให้ใช้สีของหน้าปกจากธีมที่เลือก และเปลี่ยน alt เป็นค่าว่าง */}
        <div
            className={`h-48 relative overflow-hidden ${profile.cover ? "" : coverBgClass}`}
            style={profile.cover ? { backgroundImage: `url(${profile.cover})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
        >
          {profile.cover && (
            <img
              src={profile.cover}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center px-6 pb-12 -mt-10 relative z-10">

          {/* Avatar */}
          <img
            src={profile.avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover"
          />

          {/* Name */}
          <h1
            className="mt-4 text-2xl font-bold text-center"
            style={{ color: design.textColor }}
          >
            {profile.name}
          </h1>

          {/* Bio */}
          <p
            className="mt-2 text-sm text-center opacity-70 max-w-xs"
            style={{ color: design.textColor }}
          >
            {profile.bio}
          </p>

          {/* Links */}
          <div className="w-full mt-8 flex flex-col gap-3">
            {links.filter((l) => l.visible).map((link) => {
              const IconComp = ICON_MAP[link.icon] || ICON_MAP["Link"];
              return (
             <a   
                  key={link.id}
                  href={link.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-5 py-4 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: design.btnBgColor,
                    color: design.btnTextColor,
                    borderRadius: radius,
                    border,
                    boxShadow: shadow,
                  }}
                >
                  <IconComp size={20} />
                  <span
                    className="flex-1 text-center font-semibold pr-5"
                    style={{ color: design.btnTextColor }}
                  >
                    {link.title}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Footer */}
          <p className="mt-10 text-xs text-slate-400">
            mybiolink.com/{profile.username || "username"}
          </p>

        </div>
      </div>
    </div>
  );
};

export default PreviewPage;