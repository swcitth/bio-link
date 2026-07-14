import React from "react";
import { ICON_MAP } from "../../constants/icons";
import { THEME_LIST } from "../../constants/themes";
import SaveContactButton from "../UI/Button/SaveContactButton"; 
import BlockSlider from "../Blocks/BlockSlider"; 
import api, { getImageUrl } from "../../api/axios";
import TikTok from '../Blocks/TikTok';

const FONT_MAP = {
  kanit: "'Kanit', sans-serif",
  sarabun: "'Sarabun', sans-serif",
  mali: "'Mali', cursive",
  prompt: "'Prompt', sans-serif"
};

const getYoutubeEmbedUrl = (url, isAutoplay) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    const videoId = match[2];
    let embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
    if (isAutoplay) {
      embedUrl += `&autoplay=1&mute=1`;
    }
    return embedUrl;
  }
  return null;
};

const getTiktokId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:video|v)\/(\d+)/);
  return match ? match[1] : null;
};

const formatUrl = (inputUrl) => {
  if (!inputUrl) return null;
  
  const url = String(inputUrl).trim();

  // 🌟 1. ดักจับว่าเป็นอีเมลหรือไม่
  if (url.includes('@') && !url.startsWith('http')) {
    const cleanEmail = url.replace('mailto:', '').trim(); 
    
    // 🌟 2. เช็คว่าอุปกรณ์ที่ใช้เปิดคือ "มือถือ" หรือไม่
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // 📱 สำหรับมือถือ: ใช้ mailto: เพื่อปลุกแอปอีเมลในเครื่อง
      return `mailto:${cleanEmail}`;
    } else {
      // 💻 สำหรับคอมพิวเตอร์: บังคับเปิดหน้าเว็บเขียนจดหมายของ Gmail
      return `https://mail.google.com/mail/?view=cm&fs=1&to=${cleanEmail}`;
    }
  }
  
  // ==========================================
  // ส่วนด้านล่างนี้คือของเบอร์โทรและเว็บปกติ (เหมือนเดิมครับ)
  // ==========================================
  const phoneRegex = /^[0-9\-+]{9,15}$/;
  if (phoneRegex.test(url) && !url.startsWith('tel:')) {
    return `tel:${url.replace(/-/g, '')}`; 
  }

  if (!url.startsWith('http') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
    return `https://${url}`;
  }

  return url;
};

const BioContent = ({ profile = {}, links = [], design = {}, isCompact = false, onLinkClick }) => {
  const safeLinks = Array.isArray(links) ? links : [];
  const safeProfile = profile || {};
  const safeDesign = design || {};

  const visibleLinks = safeLinks.filter((l) => l?.isVisible !== false && l?.visible !== false);
  const activeTheme = THEME_LIST?.find((t) => t.id === safeDesign.theme) || THEME_LIST?.[0] || {};
  const selectedFont = FONT_MAP[safeDesign.font] || FONT_MAP.kanit;

  // 🌟 1. คงค่าปุ่มลิงก์ไว้ให้เป็นแคปซูล (999px)
  const btnRadius = { square: "0px", rounded: "14px", pill: "999px" }[safeDesign.btnRounded] || "999px";
  
  // 🌟 2. เพิ่มตัวแปรใหม่สำหรับกรอบรูป! แคปซูลจะมนแค่ 24px เพื่อไม่ให้รูปกลายเป็นวงกลม
  const blockRadius = { square: "0px", rounded: "14px", pill: "24px" }[safeDesign.btnRounded] || "24px";

  const btnBoxShadow = { none: "none", outline: "none", shadow3d: isCompact ? "3px 3px 0px rgba(0,0,0,0.8)" : "0px 4px 0px rgba(0,0,0,0.2)" }[safeDesign.btnStyle] || "none";
  const btnBorder = safeDesign.btnStyle !== "none" ? `2px solid ${safeDesign.btnBorderColor || "transparent"}` : "none";

  const coverBackground = (safeDesign.theme === "custom" && safeDesign.coverColor)
    ? safeDesign.coverColor
    : (activeTheme?.cfg?.coverBg || activeTheme?.cfg?.bgGradient || "#D8B4FE");

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
  const handleItemClick = async (e, blockId, url) => {
    if (!url) return;

    console.log(`[🔍 Debug] 1. มีคนกดปุ่ม!`);
    console.log(`- Block ID: ${blockId}`);
    console.log(`- URL: ${url}`);

    // ถ้าเป็นเบอร์โทรหรืออีเมล ให้เบรกเบราว์เซอร์ไว้ก่อน
    if (!url.startsWith('http')) {
      e.preventDefault(); 
      console.log(`[🔍 Debug] 2. 🛑 เบรกเบราว์เซอร์สำเร็จ ไม่ให้รีบเด้งเปิดแอป`);
    }

    if (onLinkClick) {
      console.log(`[🔍 Debug] 3. 📡 กำลังส่งข้อมูลให้ API นับยอด...`);
      try {
        // ลองใส่ await เผื่อว่าฟังก์ชัน onLinkClick ของคุณเป็นแบบ Async
        await onLinkClick(blockId, url);
        console.log(`[🔍 Debug] 4. ✅ API ส่งข้อมูลเสร็จเรียบร้อย!`);
      } catch (error) {
        console.error(`[🔍 Debug] ❌ 4. API พัง! ยิงไม่เข้า เพราะ:`, error);
      }
    } else {
      console.warn(`[🔍 Debug] ⚠️ ไม่มีฟังก์ชัน onLinkClick (ไม่ได้เชื่อมกับหลังบ้าน)`);
    }

    // ถ้าเป็นเบอร์/อีเมล ค่อยเปิดแอปหลังจาก API ทำงานเสร็จ
    if (!url.startsWith('http')) {
      console.log(`[🔍 Debug] 5. 📱 สั่งให้เบราว์เซอร์เปิดแอปโทร/อีเมลได้!`);
      
      // เพิ่มเวลาหน่วงเป็น 300ms เพื่อความชัวร์ (0.3 วินาที)
      setTimeout(() => {
        window.location.href = url;
      }, 300); 
    }
  };

  return (
    <div className={`relative z-10 ${isCompact ? "pb-5" : "pb-20"}`} style={{ fontFamily: selectedFont }}>
      
      <div 
        className={`${isCompact ? "h-[90px]" : "h-48"} shrink-0 overflow-hidden bg-slate-200 relative bg-cover bg-center`}
        style={activeTheme?.cfg?.coverImage ? { backgroundImage: activeTheme.cfg.coverImage } : { background: coverBackground }}
      >
        {safeProfile.cover && <img src={getImageUrl(safeProfile.cover)} alt="Cover" className="w-full h-full object-cover" />}
      </div>

      <div className={`flex flex-col items-center px-4 ${isCompact ? "-mt-7" : "-mt-12"} relative z-10`}>
        <img
          src={getImageUrl(safeProfile.avatar) || defaultAvatar}
          alt="avatar"
          className={`${isCompact ? "w-14 h-14 border-[3px]" : "w-24 h-24 border-4"} rounded-full border-white shadow-xl object-cover shrink-0 bg-white`}
        />

        <h1
          className={`${isCompact ? "mt-2 text-sm" : "mt-4 text-2xl"} font-bold text-center leading-tight`}
          style={{ color: safeDesign.textColor || "#333" }}
        >
          {safeProfile.display_name || safeProfile.name || "ชื่อของคุณ"}
        </h1>

        <p
          className={`${isCompact ? "text-[11px] mt-1" : "mt-2 text-sm max-w-sm"} w-full px-2 text-center opacity-80 leading-relaxed break-words whitespace-pre-wrap`}
          style={{ color: safeDesign.textColor || "#666" }}
        >
          {safeProfile.bio || "Bio ของคุณ"}
        </p>

        <div className={`w-full flex flex-col ${isCompact ? "gap-3 mt-5" : "gap-4 mt-8"}`}>
          
          {(safeProfile.showSaveContact === true || safeProfile.show_save_contact === true || 
            safeProfile.showSaveContact === 1 || safeProfile.show_save_contact === 1) && (
              <SaveContactButton 
                profileData={safeProfile} 
                design={design} 
                isCompact={isCompact} 
              />
          )}

          {visibleLinks.map((link) => {
            const subItems = link?.items && link.items.length > 0 ? link.items : [link];
            const titleClass = `${isCompact ? "text-[13px]" : "text-base"} font-bold px-2`;
            const nameClass = `${isCompact ? "text-[11px]" : "text-sm"} font-medium px-2 mt-1`;

            if (link?.icon === "Youtube" || link?.icon === "TikTok" || link?.type === "VIDEO") {
              return (
                <div key={link.id || Math.random()} className={`flex flex-col ${isCompact ? "gap-2 mb-2" : "gap-3 mb-4"} w-full`}>
                  {link.items && link.title && <h3 className={titleClass} style={{ color: safeDesign.textColor || "#000" }}>{link.title}</h3>}
                  {subItems.filter(item => item?.isVisible !== false && item?.visible !== false).map((item, idx) => {
                    const videoUrl = item?.link || item?.url || "";
                    const isTikTokItem = videoUrl.toLowerCase().includes("tiktok") || (link?.icon === "TikTok" && !videoUrl);

                    if (isTikTokItem) {
                      return (
                        <TikTok 
                          key={item?.id || idx}
                          item={item}
                          videoUrl={videoUrl}
                          isCompact={isCompact}
                          blockRadius={blockRadius}
                          ICON_MAP={ICON_MAP}
                          safeDesign={safeDesign}
                          nameClass={nameClass}
                          idx={idx}
                          getTiktokId={getTiktokId}
                        />
                      );
                    } else {
                      const youtubeEmbedUrl = getYoutubeEmbedUrl(videoUrl, item?.isAutoplay || link?.isAutoplay); 
                      return (
                        <div key={item?.id || idx} className="flex flex-col gap-1">
                          <div className="w-full overflow-hidden shadow-md bg-black aspect-video relative" style={{ borderRadius: blockRadius }}>
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

            if (String(link?.type || "").toUpperCase() === "SLIDER" || String(link?.icon || "").toUpperCase() === "SLIDER") {
              return (
                <div key={link.id || Math.random()} className={`flex flex-col ${isCompact ? "gap-2 mb-2" : "gap-4 mb-4"} w-full`}>
                  {link.title && <h3 className={titleClass} style={{ color: safeDesign.textColor || "#000" }}>{link.title}</h3>}
                  <BlockSlider 
                    block={link} 
                    items={subItems} 
                    handleBlockClick={onLinkClick} 
                    design={safeDesign} 
                  />
                </div>
              );
            }

            if (String(link?.type || "").toUpperCase() === "SHOP" || link?.icon === "Shop") {
              return (
                <div key={link.id || Math.random()} className={`flex flex-col ${isCompact ? "gap-2 mb-2" : "gap-4 mb-4"} w-full`}>
                  {link.title && <h3 className={titleClass} style={{ color: safeDesign.textColor || "#000" }}>{link.title}</h3>}
                  
                  <div className="flex items-start overflow-x-auto gap-4 pb-4 px-1 snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: "none" }}>
                    {subItems.filter(item => item?.isVisible !== false && item?.visible !== false).map((item, idx) => {
                      const itemUrl = formatUrl(item?.url || item?.link);
                      const imageUrl = item?.image || item?.imageUrl; 
                      const WrapperTag = itemUrl ? "a" : "div";
                      
                      const hasContent = 
                        (item?.name && String(item.name).trim() !== "") ||
                        (item?.title && String(item.title).trim() !== "") ||
                        (item?.description && String(item.description).trim() !== "") ||
                        (item?.price && String(item.price).trim() !== "");
                      
                      return (
                        <WrapperTag 
                          key={item?.id || idx} 
                          {...(itemUrl ? { href: itemUrl, target: itemUrl.startsWith('http') ? "_blank" : "_self", rel: "noopener noreferrer" } : {})} 
                          className={`relative snap-center shrink-0 w-[85%] max-w-[280px] aspect-square group shadow-sm overflow-hidden ${itemUrl ? "hover:opacity-90 cursor-pointer" : "cursor-default"}`} 
                          style={{ textDecoration: 'none', borderRadius: blockRadius }}
                          onClick={(e) => handleItemClick(e, link?.id, itemUrl)}
                        >
                          {imageUrl ? (
                            <img src={getImageUrl(imageUrl)} alt={item?.name || item?.title} className="w-full h-full object-cover bg-white" />
                          ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                              <span className="text-slate-400 text-xs font-bold">ไม่มีรูปภาพ</span>
                            </div>
                          )}
                          
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

            if (link?.icon === "Image") {
              return (
                <div key={link.id || Math.random()} className={`flex flex-col ${isCompact ? "gap-2 mb-2" : "gap-4 mb-4"} w-full`}>
                  {link.items && link.title && <h3 className={titleClass} style={{ color: safeDesign.textColor || "#000" }}>{link.title}</h3>}
                  
                  <div className={`flex flex-col items-start w-full ${isCompact ? "gap-4" : "gap-6"}`}>
                    {subItems.filter(item => item?.isVisible !== false && item?.visible !== false).map((item, idx) => {
                      const itemUrl = formatUrl(item?.url || item?.link);
                      const imageUrl = item?.image || item?.imageUrl; 
                      const WrapperTag = itemUrl ? "a" : "div";
                      
                      return (
                        <WrapperTag 
                          key={item?.id || idx} 
                          {...(itemUrl ? { href: itemUrl, target: itemUrl.startsWith('http') ? "_blank" : "_self", rel: "noopener noreferrer" } : {})} 
                          className={`flex flex-col group items-start ${itemUrl ? "hover:opacity-90 cursor-pointer" : "cursor-default"} w-full`} 
                          style={{ textDecoration: 'none' }}
                          onClick={(e) => handleItemClick(e, link?.id, itemUrl)}
                        >
                          {imageUrl ? (
                            <img src={getImageUrl(imageUrl)} alt={item?.name || item?.title} className="w-full h-auto max-h-[500px] object-contain shadow-sm mb-3 bg-white/50" style={{ borderRadius: blockRadius }} />
                          ) : (
                            <div className="w-full aspect-square bg-slate-200 shadow-sm mb-3 flex items-center justify-center" style={{ borderRadius: blockRadius }}>
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

            return (
              <div key={link?.id || Math.random()} className="w-full mb-2 flex flex-col gap-2">
                {link?.items && link?.title && <h3 className={`${titleClass} mb-1`} style={{ color: safeDesign.textColor || "#000" }}>{link.title}</h3>}
                {subItems.filter(item => item?.isVisible !== false && item?.visible !== false).map((item, idx) => {
                  const itemUrl = formatUrl(item?.url || item?.link);
                  const WrapperTag = itemUrl ? "a" : "div";
                  const ItemIcon = ICON_MAP[item?.iconId] || ICON_MAP[item?.icon] || ICON_MAP[link?.icon] || ICON_MAP["Link"];
                  
                  return (
                    <WrapperTag 
                      key={item?.id || idx} 
                      {...(itemUrl ? { href: itemUrl, target: itemUrl.startsWith('http') ? "_blank" : "_self", rel: "noopener noreferrer" } : {})}
                      className={`block w-full flex items-center transition-transform ${itemUrl ? "hover:scale-[1.02] cursor-pointer" : "cursor-default"}`}
                      onClick={(e) => handleItemClick(e, link?.id, itemUrl)}
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
      </div>
    </div>
  );
};

export default BioContent;