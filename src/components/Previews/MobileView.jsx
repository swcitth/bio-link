import React from "react";
import { ICON_MAP } from "../../constants/icons";

const MobileView = ({ profile, links, design, activeTheme }) => {
  // Logic: ตรวจสอบว่าโหมด Custom หรือไม่
  const isCustom = design.theme === "custom";

  // กำหนดสไตล์หน้าปก (Cover) แยก Property เพื่อป้องกัน Error CSS Conflict
  const coverStyle = {
    backgroundColor: profile.cover 
      ? "transparent" 
      : (design.coverColor || (isCustom ? (design.bgColor || "#f0f2ff") : (activeTheme?.cfg?.bgGradient || "#f0f2ff"))),
    backgroundImage: profile.cover ? `url(${profile.cover})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  };

  // กำหนดสไตล์พื้นหลังหน้าจอ
  const screenStyle = {
    backgroundColor: design.bgImage 
      ? "transparent" 
      : (isCustom ? (design.bgColor || "#f0f2ff") : (activeTheme?.cfg?.bgGradient || "#f0f2ff"))
  };

  return (
    <div className="w-full h-full overflow-hidden relative" style={{ borderRadius: "2rem", ...screenStyle }}>
      {/* Background Image Layer */}
      {design.bgImage && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${design.bgImage})`, opacity: 0.6 }} 
        />
      )}

      <div className="relative z-10 h-full overflow-y-auto no-scrollbar">
        {/* Cover */}
        <div className="h-[100px] shrink-0 relative shadow-sm" style={coverStyle} />

        <div className="flex flex-col items-center px-4 pb-5 -mt-10 relative z-20">
          <div className="p-1 bg-white rounded-full shadow-lg">
            <img 
              src={profile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
              className="w-16 h-16 rounded-full object-cover" 
              alt="avatar"
            />
          </div>
          <p className="mt-3 font-bold text-sm" style={{ color: design.textColor }}>{profile.name || "ชื่อของคุณ"}</p>
          <p className="text-[11px] opacity-70" style={{ color: design.textColor }}>{profile.bio || "Bio ของคุณ"}</p>
          
          <div className="w-full flex flex-col gap-3 mt-4">
            {links.filter((l) => l.visible).map((link) => {
              const IconComp = ICON_MAP[link.icon] || ICON_MAP["Link"];
              return (
                <div key={link.id} style={{ 
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", 
                    backgroundColor: design.btnBgColor, color: design.btnTextColor, 
                    borderRadius: { square: "0px", rounded: "14px", pill: "999px" }[design.btnRounded] || "999px",
                    border: design.btnStyle !== "none" ? `2px solid ${design.btnBorderColor || "transparent"}` : "none",
                    boxShadow: design.btnStyle === "shadow3d" ? "3px 3px 0px rgba(0,0,0,0.8)" : "none"
                }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-black/5"><IconComp size={12} /></div>
                  <span className="flex-1 text-center font-semibold text-[11px]">{link.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileView;