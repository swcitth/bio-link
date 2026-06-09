// ============================================================
// src/pages/PreviewPage.jsx
// หน้าพรีวิวแบบเต็มจอ
// ============================================================

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { ICON_MAP } from "../constants/icons";
import { MOCK_PROFILE, MOCK_LINKS, MOCK_DESIGN } from "../data/mockData";

const PreviewPage = () => {
  const navigate = useNavigate();
  const profile = MOCK_PROFILE;
  const links   = MOCK_LINKS;
  const design  = MOCK_DESIGN;

  const radius = { square: "8px", rounded: "14px", pill: "999px" }[design.btnRounded] || "999px";
  const border = design.btnStyle !== "none" ? `2px solid ${design.btnBorderColor}` : "none";
  const shadow = design.btnStyle === "shadow3d" ? "3px 3px 0 rgba(0,0,0,0.8)" : "none";

  return (
    <div
      className="min-h-screen"
      style={{ background: design.bgGradient || "#f0f2ff" }}
    >
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/60">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <FaArrowLeft size={14} /> กลับ
          </button>
          <span className="text-sm font-bold text-slate-500"> ตัวอย่างหน้าเพจ</span>
          <div className="w-16" /> {/* spacer */}
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-lg mx-auto">

        {/* Cover */}
        <div
            className="h-48 relative overflow-hidden bg-gradient-to-br from-indigo-200 to-pink-200"
            style={profile.cover ? { backgroundImage: `url(${profile.cover})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
/>

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