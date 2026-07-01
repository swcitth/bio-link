import React from "react";
import { ICON_MAP } from "../../constants/icons";
import { THEME_LIST } from "../../constants/themes";
import SaveContactButton from "../UI/Button/SaveContactButton"; 

const FONT_MAP = {
  kanit: "'Kanit', sans-serif",
  sarabun: "'Sarabun', sans-serif",
  mali: "'Mali', cursive",
  prompt: "'Prompt', sans-serif"
};

// ⭐️ อัปเกรดฟังก์ชันดึง Embed URL ของ YouTube ให้รองรับการเปิด-ปิด Autoplay อัตโนมัติ
const getYoutubeEmbedUrl = (url, isAutoplay) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    const videoId = match[2];
    let embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
    
    // หาก item นั้นตั้งค่าให้เปิดเล่นอัตโนมัติ (และบังคับ mute ตามนโยบาย Browser)
    if (isAutoplay) {
      embedUrl += `&autoplay=1&mute=1`;
    }
    return embedUrl;
  }
  return null;
};

// อัปเกรด Regex ให้ดักจับ TikTok ID ได้แม่นยำขึ้น
const getTiktokId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:video|v)\/(\d+)/);
  return match ? match[1] : null;
};

const BioContent = ({ profile = {}, links = [], design = {}, isCompact = false, onLinkClick }) => {
  const safeLinks = Array.isArray(links) ? links : [];
  const safeProfile = profile || {};
  const safeDesign = design || {};

  const visibleLinks = safeLinks.filter((l) => l?.isVisible !== false && l?.visible !== false);
  const activeTheme = THEME_LIST?.find((t) => t.id === safeDesign.theme) || THEME_LIST?.[0] || {};
  const selectedFont = FONT_MAP[safeDesign.font] || FONT_MAP.kanit;

  const btnRadius = { square: isCompact ? "6px" : "8px", rounded: "14px", pill: "999px" }[safeDesign.btnRounded] || "999px";
  const btnBoxShadow = { none: "none", outline: "none", shadow3d: isCompact ? "3px 3px 0px rgba(0,0,0,0.8)" : "0px 4px 0px rgba(0,0,0,0.2)" }[safeDesign.btnStyle] || "none";
  const btnBorder = safeDesign.btnStyle !== "none" ? `2px solid ${safeDesign.btnBorderColor || "transparent"}` : "none";

  const coverBackground = (safeDesign.theme === "custom" && safeDesign.coverColor)
    ? safeDesign.coverColor
    : (activeTheme?.cfg?.coverBg || activeTheme?.cfg?.bgGradient || "#D8B4FE");

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
  console.log("ดึงข้อมูล Links มาได้คือ:", safeLinks);
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
          {/* เรียก display_name ก่อนเพื่อความชัวร์ */}
          {safeProfile.display_name || safeProfile.name || "ชื่อของคุณ"}
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
          
          {/* ดักจับตัวแปรเปิดปิดปุ่ม (เขียนให้ Clean และรองรับ Boolean จาก Resource) */}
          {(safeProfile.showSaveContact === true || safeProfile.show_save_contact === true || 
            safeProfile.showSaveContact === 1 || safeProfile.show_save_contact === 1) && (
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

            // ⭐️ 1 & 2. Video Block (รวมศูนย์ YouTube และ TikTok)
            if (link?.icon === "Youtube" || link?.icon === "TikTok" || link?.type === "VIDEO") {
              return (
                <div key={link.id || Math.random()} className={`flex flex-col ${isCompact ? "gap-2 mb-2" : "gap-3 mb-4"} w-full`}>
                  {link.items && link.title && <h3 className={titleClass} style={{ color: safeDesign.textColor || "#000" }}>{link.title}</h3>}
                  {subItems.filter(item => item?.isVisible !== false && item?.visible !== false).map((item, idx) => {
                    const videoUrl = item?.link || item?.url || "";
                    
                    // เช็คว่าลิงก์ใน item นี้เป็น TikTok หรือไม่
                    const isTikTokItem = videoUrl.toLowerCase().includes("tiktok") || (link?.icon === "TikTok" && !videoUrl);

                    if (isTikTokItem) {
                      // --- เรนเดอร์ TikTok ---
                      const tiktokId = getTiktokId(videoUrl);
                      const TiktokIcon = ICON_MAP["TikTok"] || ICON_MAP["Link"];
                      return (
                        <div key={item?.id || idx} className="flex flex-col gap-1">
                          <div className="w-full rounded-2xl overflow-hidden shadow-md bg-black relative" style={{ aspectRatio: '9/16', maxHeight: isCompact ? '480px' : '600px' }}>
                            {tiktokId ? (
                              <iframe 
                                className="w-full h-full" 
                                src={`https://www.tiktok.com/embed/v2/${tiktokId}?lang=th-TH`} 
                                title={item?.name || item?.title || link.title} 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowFullScreen 
                                scrolling="no" 
                              />
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
                    } else {
                      // --- เรนเดอร์ YouTube ---
                      const youtubeEmbedUrl = getYoutubeEmbedUrl(videoUrl, item?.isAutoplay || link?.isAutoplay); 
                      return (
                        <div key={item?.id || idx} className="flex flex-col gap-1">
                          <div className="w-full rounded-2xl overflow-hidden shadow-md bg-black aspect-video relative">
                            {youtubeEmbedUrl ? (
                              <iframe 
                                className="w-full h-full" 
                                src={youtubeEmbedUrl} 
                                title={item?.name || item?.title || link.title} 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">ยังไม่มีวิดีโอ</div>
                            )}
                          </div>
                          {(item?.name || item?.title) && <p className={nameClass} style={{ color: safeDesign.textColor || "#000" }}>{item?.name || item?.title}</p>}
                        </div>
                      );
                    }
                  })}
                </div>
              );
            }

            // ⭐️ 3. SLIDER Block (ดักจับทั้งจาก Type และ Icon เพื่อความแม่นยำ)
            if (String(link?.type || "").toUpperCase() === "SLIDER" || String(link?.icon || "").toUpperCase() === "SLIDER") {
              return (
                <div key={link.id || Math.random()} className={`flex flex-col ${isCompact ? "gap-2 mb-2" : "gap-4 mb-4"} w-full overflow-hidden`}>
                  {link.title && <h3 className={titleClass} style={{ color: safeDesign.textColor || "#000" }}>{link.title}</h3>}
                  
                  {/* กล่องเลื่อนแนวนอน */}
                  <div className="flex items-start overflow-x-auto gap-4 pb-4 px-1 snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: "none" }}>
                    {subItems.filter(item => item?.isVisible !== false && item?.visible !== false).map((item, idx) => {
                      const itemUrl = item?.url || item?.link;
                      const imageUrl = item?.image || item?.imageUrl; 
                      const WrapperTag = itemUrl ? "a" : "div";
                      
                      // เช็คว่าการ์ดใบนี้มีการพิมพ์ข้อความหรือไม่
                      const hasContent = 
                        (item?.name && String(item.name).trim() !== "") ||
                        (item?.title && String(item.title).trim() !== "") ||
                        (item?.description && String(item.description).trim() !== "") ||
                        (item?.price && String(item.price).trim() !== "");
                      
                      return (
                        <WrapperTag 
                          key={item?.id || idx} 
                          {...(itemUrl ? { href: itemUrl, target: "_blank", rel: "noopener noreferrer" } : {})} 
                          // ⭐️ 1. ปรับการ์ดหลักเป็น relative และล็อคให้เป็นสี่เหลี่ยมจัตุรัส (aspect-square) เสมอ
                          className={`relative snap-center shrink-0 w-[85%] max-w-[280px] aspect-square group rounded-[20px] shadow-sm overflow-hidden ${itemUrl ? "hover:opacity-90 cursor-pointer" : "cursor-default"}`} 
                          style={{ textDecoration: 'none' }}
                          onClick={() => { if(itemUrl && onLinkClick) onLinkClick(link?.id, itemUrl) }}
                        >
                          {/* ⭐️ 2. รูปภาพสินค้ากางเต็มพื้นที่การ์ด */}
                          {imageUrl ? (
                            <img src={imageUrl} alt={item?.name || item?.title} className="w-full h-full object-cover bg-white" />
                          ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                              <span className="text-slate-400 text-xs font-bold">ไม่มีรูปภาพ</span>
                            </div>
                          )}
                          
                          {/* ⭐️ 3. กล่องข้อความซ้อนทับ (ปรับให้แถบเงาเตี้ยลงและพอดีกับข้อความ) */}
                          {hasContent && (
                            <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-end px-3 pb-3 pt-2 bg-gradient-to-t from-black/30 via-black/30 to-transparent ">
                              
                              {(item?.name || item?.title) && String(item?.name || item?.title).trim() !== "" && (
                                <h4 className={`${isCompact ? "text-[14px]" : "text-base"} font-bold text-left break-words text-white drop-shadow-md leading-tight mb-1`}>
                                  {item?.name || item?.title}
                                </h4>
                              )}
                              
                              {item?.description && String(item.description).trim() !== "" && (
                                <p className={`${isCompact ? "text-[12px]" : "text-[13px]"} opacity-90 text-left break-words text-slate-100 drop-shadow mb-1 leading-snug line-clamp-2`}>
                                  {item.description}
                                </p>
                              )}
                              
                              {item?.price && String(item.price).trim() !== "" && (
                                <p className={`${isCompact ? "text-[13px]" : "text-sm"} font-bold text-left text-white drop-shadow-md`}>
                                  {item.price} THB
                                </p>
                              )}
                              
                            </div>
                          )}
                        </WrapperTag>
                      );
                    })}
                  </div>
                </div>
              );
            }
            // 4. Image Block
            if (link?.icon === "Image") {
              return (
                <div key={link.id || Math.random()} className={`flex flex-col ${isCompact ? "gap-2 mb-2" : "gap-4 mb-4"} w-full`}>
                  {link.items && link.title && <h3 className={titleClass} style={{ color: safeDesign.textColor || "#000" }}>{link.title}</h3>}
                  
                  <div className={`flex flex-col items-start w-full ${isCompact ? "gap-4" : "gap-6"}`}>
                    {subItems.filter(item => item?.isVisible !== false && item?.visible !== false).map((item, idx) => {
                      const itemUrl = item?.url || item?.link;
                      const imageUrl = item?.image || item?.imageUrl; 
                      const WrapperTag = itemUrl ? "a" : "div";
                      
                      return (
                        <WrapperTag 
                          key={item?.id || idx} 
                          {...(itemUrl ? { href: itemUrl, target: "_blank", rel: "noopener noreferrer" } : {})} 
                          className={`flex flex-col group items-start ${itemUrl ? "hover:opacity-90 cursor-pointer" : "cursor-default"} w-full`} 
                          style={{ textDecoration: 'none' }}
                          onClick={() => { if(itemUrl && onLinkClick) onLinkClick(link?.id, itemUrl) }}
                        >
                          {imageUrl ? (
                            <img src={imageUrl} alt={item?.name || item?.title} className="w-full h-auto max-h-[500px] object-contain rounded-2xl shadow-sm mb-3 bg-white/50" />
                          ) : (
                            <div className="w-full aspect-square bg-slate-200 rounded-2xl shadow-sm mb-3 flex items-center justify-center">
                              <span className="text-slate-400 text-xs font-bold">ยังไม่มีรูปภาพ</span>
                            </div>
                          )}
                          
                          <div className="flex flex-col px-1 w-full gap-1">
                            {(item?.name || item?.title) && (
                              <h4 className={`${isCompact ? "text-[14px]" : "text-base"} font-bold text-left break-words`} style={{ color: safeDesign.textColor || "#000" }}>
                                {item?.name || item?.title}
                              </h4>
                            )}
                            {(item?.description) && (
                              <p className={`${isCompact ? "text-[12px]" : "text-sm"} opacity-75 text-left break-words`} style={{ color: safeDesign.textColor }}>
                                {item.description}
                              </p>
                            )}
                            {(item?.price) && (
                              <p className={`${isCompact ? "text-[13px]" : "text-sm"} font-bold text-left`} style={{ color: safeDesign.textColor }}>
                                {item.price} THB
                              </p>
                            )}
                          </div>
                        </WrapperTag>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // 5. Normal Link
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
                      onClick={() => { if(itemUrl && onLinkClick) onLinkClick(link?.id, itemUrl) }}
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