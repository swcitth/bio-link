import React from "react";
import { ICON_MAP } from "../../constants/icons";
import { THEME_LIST } from "../../constants/themes";
import SaveContactButton from "../Button/SaveContactButton"; // Import ปุ่ม Save Contact

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

// รับ Props: isCompact เข้ามา เพื่อเช็คว่าเป็นหน้าจอมือถือจำลอง (true) หรือหน้าจอพรีวิวเต็ม (false)
const BioContent = ({ profile = {}, links = [], design = {}, isCompact = false }) => {
  // ระบบป้องกันตัวแปรเป็น null หรือ undefined
  const safeLinks = Array.isArray(links) ? links : [];
  const safeProfile = profile || {};
  const safeDesign = design || {};

  const visibleLinks = safeLinks.filter((l) => l?.isVisible !== false && l?.visible !== false);
  const activeTheme = THEME_LIST?.find((t) => t.id === safeDesign.theme) || THEME_LIST?.[0] || {};
  const selectedFont = FONT_MAP[safeDesign.font] || FONT_MAP.kanit;

  // ปรับขนาดปุ่มตาม isCompact
  const btnRadius = { square: isCompact ? "6px" : "8px", rounded: "14px", pill: "999px" }[safeDesign.btnRounded] || "999px";
  const btnBoxShadow = { none: "none", outline: "none", shadow3d: isCompact ? "3px 3px 0px rgba(0,0,0,0.8)" : "0px 4px 0px rgba(0,0,0,0.2)" }[safeDesign.btnStyle] || "none";
  const btnBorder = safeDesign.btnStyle !== "none" ? `2px solid ${safeDesign.btnBorderColor || "transparent"}` : "none";

  const coverBackground = (safeDesign.theme === "custom" && safeDesign.coverColor)
    ? safeDesign.coverColor
    : (activeTheme?.cfg?.coverBg || activeTheme?.cfg?.bgGradient || "#D8B4FE");

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

  return (
    <div className={`relative z-10 ${isCompact ? "pb-5" : "pb-20"}`} style={{ fontFamily: selectedFont }}>
      
      {/* Cover Image */}
      <div 
        className={`${isCompact ? "h-[90px]" : "h-48"} shrink-0 overflow-hidden bg-slate-200 relative bg-cover bg-center`}
        style={activeTheme?.cfg?.coverImage ? { backgroundImage: activeTheme.cfg.coverImage } : { background: coverBackground }}
      >
        {safeProfile.cover && <img src={safeProfile.cover} alt="Cover" className="w-full h-full object-cover" />}
      </div>

      {/* Profile Section */}
      <div className={`flex flex-col items-center px-4 ${isCompact ? "-mt-7" : "-mt-12"} relative z-10`}>
        {/* Avatar */}
        <img
          src={safeProfile.avatar || defaultAvatar}
          alt="avatar"
          className={`${isCompact ? "w-14 h-14 border-[3px]" : "w-24 h-24 border-4"} rounded-full border-white shadow-xl object-cover shrink-0 bg-white`}
        />

        {/* Name */}
        <h1
          className={`${isCompact ? "mt-2 text-sm" : "mt-4 text-2xl"} font-bold text-center leading-tight`}
          style={{ color: safeDesign.textColor || "#333" }}
        >
          {safeProfile.name || "ชื่อของคุณ"}
        </h1>

        {/* Bio */}
        <p
          className={`${isCompact ? "text-[11px] mt-1" : "mt-2 text-sm max-w-sm"} text-center opacity-80 leading-relaxed`}
          style={{ color: safeDesign.textColor || "#666" }}
        >
          {safeProfile.bio || "Bio ของคุณ"}
        </p>

        {/* Links List */}
        <div className={`w-full flex flex-col ${isCompact ? "gap-3 mt-5" : "gap-4 mt-8"}`}>
          
        {/* ✅ เพิ่ม design={design} เข้าไปด้วยเพื่อให้ปุ่มมีข้อมูลไปอ่านค่า */}
            {safeProfile.showSaveContact !== false && (
            <SaveContactButton 
                profileData={safeProfile} 
                design={design} 
                isCompact={isCompact} 
            />
            )}
          {visibleLinks.length === 0 && (
            <p className={`text-center ${isCompact ? "text-[11px]" : "text-sm"} text-slate-400 mt-3`} style={{ color: safeDesign.textColor }}>
              ยังไม่มีลิงก์แสดงผล
            </p>
          )}

          {visibleLinks.map((link) => {
            const subItems = link?.items && link.items.length > 0 ? link.items : [link];
            const titleClass = `${isCompact ? "text-[13px]" : "text-base"} font-bold px-2`;
            const nameClass = `${isCompact ? "text-[11px]" : "text-sm"} font-medium px-2 mt-1`;

            // 1. Youtube
            if (link?.icon === "Youtube") {
              return (
                <div key={link.id || Math.random()} className={`flex flex-col ${isCompact ? "gap-2 mb-2" : "gap-3 mb-4"} w-full`}>
                  {link.items && link.title && <h3 className={titleClass} style={{ color: safeDesign.textColor || "#000" }}>{link.title}</h3>}
                  {subItems.filter(item => item?.isVisible !== false && item?.visible !== false).map((item, idx) => {
                    const videoUrl = item?.link || item?.url || "";
                    
                    // ถ้าไม่มี url ให้คืนค่าว่าง
                    let videoId = getYoutubeId(videoUrl); 

                    return (
                      <div key={item?.id || idx} className="flex flex-col gap-1">
                        <div className="w-full rounded-2xl overflow-hidden shadow-md bg-black aspect-video relative">
                          {videoId ? (
                            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}?rel=0`} title={item?.name || item?.title || link.title} frameBorder="0" allowFullScreen />
                          ) : (
                            // โชว์หน้าจอดำ "ยังไม่มีวิดีโอ" ถ้าไม่ได้ใส่ลิงก์
                            <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">ยังไม่มีวิดีโอ</div>
                          )}
                        </div>
                        {(item?.name || item?.title) && <p className={nameClass} style={{ color: safeDesign.textColor || "#000" }}>{item?.name || item?.title}</p>}
                      </div>
                    );
                  })}
                </div>
              );
            }

            // 2. TikTok
            if (link?.icon === "TikTok") {
              return (
                <div key={link.id || Math.random()} className={`flex flex-col ${isCompact ? "gap-2 mb-2" : "gap-3 mb-4"} w-full`}>
                  {link.items && link.title && <h3 className={titleClass} style={{ color: safeDesign.textColor || "#000" }}>{link.title}</h3>}
                  {subItems.filter(item => item?.isVisible !== false && item?.visible !== false).map((item, idx) => {
                    const tiktokId = getTiktokId(item?.link || item?.url || "");
                    const TiktokIcon = ICON_MAP["TikTok"] || ICON_MAP["Link"];
                    return (
                      <div key={item?.id || idx} className="flex flex-col gap-1">
                        <div className="w-full rounded-2xl overflow-hidden shadow-md bg-black relative" style={{ aspectRatio: '9/16', maxHeight: isCompact ? '480px' : '600px' }}>
                          {tiktokId ? (
                            <iframe className="w-full h-full" src={`https://www.tiktok.com/embed/v2/${tiktokId}`} title={item?.name || item?.title || link.title} frameBorder="0" allow="encrypted-media;" allowFullScreen scrolling="no" />
                          ) : (
                            <div className={`w-full h-full flex flex-col items-center justify-center text-white text-center px-2 ${isCompact ? "min-h-[200px]" : "min-h-[300px]"}`}>
                              {TiktokIcon && <TiktokIcon size={isCompact ? 32 : 40} className="mb-2 opacity-40" />}
                              <p className={`font-bold ${isCompact ? "text-sm" : "text-base"}`}>ยังไม่มีวิดีโอ TikTok</p>
                              <p className={`${isCompact ? "text-[10px]" : "text-sm"} opacity-70 mt-1`}>โปรดใส่ลิงก์แบบเต็ม</p>
                            </div>
                          )}
                        </div>
                        {(item?.name || item?.title) && <p className={nameClass} style={{ color: safeDesign.textColor || "#000" }}>{item?.name || item?.title}</p>}
                      </div>
                    );
                  })}
                </div>
              );
            }

            // 3. Image
            if (link?.icon === "Image") {
              return (
                <div key={link.id || Math.random()} className={`flex flex-col ${isCompact ? "gap-2 mb-2" : "gap-4 mb-4"} w-full`}>
                  {link.items && link.title && <h3 className={titleClass} style={{ color: safeDesign.textColor || "#000" }}>{link.title}</h3>}
                  <div className={`grid ${isCompact ? "grid-cols-1" : "grid-cols-2 gap-4"}`}>
                    {subItems.filter(item => item?.isVisible !== false && item?.visible !== false).map((item, idx) => {
                      const itemUrl = item?.url || item?.link;
                      const imageUrl = item?.image || item?.imageUrl; // ดึงรูปจริงมาเช็ค
                      const WrapperTag = itemUrl ? "a" : "div";
                      
                      return (
                        <WrapperTag key={item?.id || idx} {...(itemUrl ? { href: itemUrl, target: "_blank", rel: "noopener noreferrer" } : {})} className={`flex flex-col group ${itemUrl ? "hover:opacity-90 cursor-pointer" : "cursor-default"}`} style={{ textDecoration: 'none' }}>
                          
                          {/* ถ้ามีรูปให้โชว์รูป ถ้าไม่มีให้โชว์กล่องสีเทา*/}
                          {imageUrl ? (
                            <img src={imageUrl} alt={item?.name || item?.title} className="w-full aspect-square object-cover rounded-2xl shadow-sm mb-2" />
                          ) : (
                            <div className="w-full aspect-square bg-slate-200 rounded-2xl shadow-sm mb-2 flex items-center justify-center">
                              <span className="text-slate-400 text-xs font-bold">ยังไม่มีรูปภาพ</span>
                            </div>
                          )}
                          
                          <h4 className={`${isCompact ? "text-[13px]" : "text-sm"} font-bold px-1`} style={{ color: safeDesign.textColor || "#000" }}>{item?.name || item?.title || "สินค้า"}</h4>
                          {isCompact && <p className="text-[10px] opacity-70 px-1 mt-0.5" style={{ color: safeDesign.textColor }}>{item?.description || "รายละเอียดสินค้า"}</p>}
                          {isCompact && <p className="text-[11px] font-bold px-1 mt-1" style={{ color: safeDesign.textColor }}>{item?.price ? `${item.price} THB` : "0 THB"}</p>}
                        </WrapperTag>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // 4. Normal Link
            return (
              <div key={link?.id || Math.random()} className="w-full mb-2 flex flex-col gap-2">
                {link?.items && link?.title && <h3 className={`${titleClass} mb-1`} style={{ color: safeDesign.textColor || "#000" }}>{link.title}</h3>}
                {subItems.filter(item => item?.isVisible !== false && item?.visible !== false).map((item, idx) => {
                  const itemUrl = item?.url || item?.link;
                  const WrapperTag = itemUrl ? "a" : "div";
                  const ItemIcon = ICON_MAP[item?.iconId] || ICON_MAP[item?.icon] || ICON_MAP[link?.icon] || ICON_MAP["Link"];
                  
                  return (
                    <WrapperTag 
                      key={item?.id || idx} 
                      {...(itemUrl ? { href: itemUrl, target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={`block w-full flex items-center transition-transform ${itemUrl ? "hover:scale-[1.02] cursor-pointer" : "cursor-default"}`}
                      style={{
                        padding: isCompact ? "8px 12px" : "16px",
                        backgroundColor: safeDesign.btnStyle === "outline" ? "transparent" : (safeDesign.btnBgColor || "#ffffff"),
                        color: safeDesign.btnTextColor || "#000000",
                        borderRadius: btnRadius,
                        border: btnBorder,
                        boxShadow: btnBoxShadow,
                        textDecoration: "none"
                      }}
                    >
                      <div className={`${isCompact ? "w-8 h-8" : "w-10 h-10"} rounded-full flex items-center justify-center shrink-0`} style={{ background: "rgba(0,0,0,0.06)", color: safeDesign.btnTextColor }}>
                        {ItemIcon && <ItemIcon size={isCompact ? 16 : 20} />}
                      </div>
                      <span className={`flex-1 text-center ${isCompact ? "pr-8" : "pr-10"} font-bold`} style={{ fontSize: isCompact ? "13px" : "16px", color: safeDesign.btnTextColor }}>
                        {item?.title || item?.name || "ชื่อลิงก์"}
                      </span>
                    </WrapperTag>
                  );
                })}
              </div>
            );
          })}
        </div>
        
        {/* URL footer (เฉพาะจอใหญ่ โชว์ด้านล่างสุด) */}
        {!isCompact && (
          <p className="mt-14 text-sm font-medium opacity-60 text-center" style={{ color: safeDesign.textColor || "#94a3b8" }}>
            mybiolink.com/{safeProfile.username || "username"}
          </p>
        )}
      </div>
    </div>
  );
};

export default BioContent;