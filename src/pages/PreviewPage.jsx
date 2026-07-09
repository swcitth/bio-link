// ============================================================
// src/pages/PreviewPage.jsx
// ============================================================

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom"; 
import { FaArrowLeft, FaHome, FaPalette, FaChartBar, FaSignOutAlt } from "react-icons/fa"; 
import { Eye, Share2 } from "lucide-react"; 

import Header from "../components/Layout/Header"; 
import { THEME_LIST } from "../constants/themes";
import BioContent from "../components/Editors/BioContent"; 
import Navbar from "../components/Layout/NavbarDetail";
import api, { getImageUrl } from '../api/axios';

const FONT_MAP = {
  kanit: "'Kanit', sans-serif",
  sarabun: "'Sarabun', sans-serif",
  mali: "'Mali', cursive",
  prompt: "'Prompt', sans-serif"
};

// ⭐️ รับค่า isPublic มาจาก Route ใน App.jsx
const PreviewPage = ({ isPublic }) => {
  const navigate = useNavigate();
  const { username } = useParams(); 

  const [searchParams] = useSearchParams();
  const isFromAdmin = searchParams.get('source') === 'admin';

  // ⭐️ แก้ไข: ตั้งค่าเริ่มต้นเป็นค่าว่างๆ แทน (ลบ MOCK ทิ้ง)
  const [profile, setProfile] = useState({});
  const [links, setLinks] = useState([]);
  const [design, setDesign] = useState({ theme: "t1", font: "kanit" });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐️ 1. ฟังก์ชันแอบยิง API เก็บสถิติ (ทำงานอยู่เบื้องหลัง) ⭐️
  const trackAnalytics = (targetUsername, blockId = null, clickedUrl = null) => {
    console.log("🎯 เช็คการคลิก! ยิงไปที่:", targetUsername, " | Block ID:", blockId, " | URL:", clickedUrl);
    
    // 🟡 [ปิดชั่วคราวเพื่อทดสอบ] ด่านที่ 1: เช็คว่าเป็นหน้าจอ Preview หรือไม่
    // if (!isPublic || isFromAdmin || !targetUsername) {
    //   console.log("🛑 สั่งหยุด: อยู่ในโหมด Preview/Admin");
    //   return; 
    // }

    // 🟡 [ปิดชั่วคราวเพื่อทดสอบ] ด่านที่ 2: เช็คเจ้าของโปรไฟล์
    // try {
    //   const userStr = localStorage.getItem("user");
    //   const token = localStorage.getItem("token"); 
    //   if (userStr && token) {
    //     const userObj = JSON.parse(userStr);
    //     const currentUsername = userObj?.username || userObj?.data?.username || userObj?.user?.username;
    //     if (currentUsername && String(currentUsername).toLowerCase() === String(targetUsername).toLowerCase()) {
    //       console.log("🛑 สั่งหยุด: เจ้าของโปรไฟล์กดเอง (ตรวจเจอจาก LocalStorage)");
    //       return; 
    //     }
    //   }
    //   if (document.referrer && (document.referrer.includes('/dd') || document.referrer.includes('/admin'))) {
    //     console.log("🛑 สั่งหยุด: ไม่นับยอดเพราะคุณเพิ่งกดเปิดมาจากหน้าแก้ไขเว็บของคุณเอง");
    //     return;
    //   }
    // } catch (err) {
    //   console.error("Error parsing user data:", err);
    // }

    // ✅ ปล่อยให้ผ่านฉลุยเพื่อส่งข้อมูลไปหลังบ้านตอนเราเทส
    console.log("✅ ผ่านทุกด่าน: ระบบกำลังยิง API นับยอด... ID:", blockId, "URL:", clickedUrl);
    
    let sessionId = sessionStorage.getItem("analytics_session");
    if (!sessionId) {
      sessionId = "sess_" + Math.random().toString(36).substr(2, 9) + Date.now();
      sessionStorage.setItem("analytics_session", sessionId);
    }

    api.post(`/analytics/track/${targetUsername}`, {
      block_id: blockId,
      session_id: sessionId,           // ค่าเดิมของคุณ
      referrer_url: document.referrer,  // ค่าเดิมของคุณ
      clicked_url: clickedUrl          // 🌟 เติม/เช็คบรรทัดนี้ เพื่อส่ง URL ไปหลังบ้านด้วย!
    })
    .catch((err) => {
      console.error("Analytics error:", err);
    });
  };
  
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("preview_profile"));
    const savedLinks   = JSON.parse(localStorage.getItem("preview_links"));
    const savedDesign  = JSON.parse(localStorage.getItem("preview_design"));

    if (username) {
      setIsLoading(true);
      setError(null);
      
      api.get(`/profiles/${username}`)
        .then((response) => {
          const apiData = response.data.data || response.data;
          
          setProfile({
            username: apiData.username,
            name: apiData.display_name || "",
            bio: apiData.bio || "",
            avatar: getImageUrl(apiData.avatar),
            cover: getImageUrl(apiData.cover),
            contactName: apiData.contactName || apiData.contact_name || "",
            phone: apiData.phone || "",
            email: apiData.email || "",
            company: apiData.company || "",
            title: apiData.title || "",
            website: apiData.website || "",
            showSaveContact: [1, "1", true, "true"].includes(apiData.show_save_contact)
          });

          // จัดการ ธีม/ดีไซน์
          const themeData = apiData.theme || apiData.theme_config;
          if (themeData) {
            const themeCfg = typeof themeData === 'string' ? JSON.parse(themeData) : themeData;
            setDesign({
              theme: "t1", font: "kanit", // ค่าพื้นฐาน
              ...themeCfg,
              bgImage: apiData.background ? `http://127.0.0.1:8000${apiData.background}` : null,
            });
          } else {
             setDesign({ theme: "t1", font: "kanit" });
          }

          // ============================================================
          // ⭐️ ตัวดักจับและจัดระเบียบข้อมูลลิงก์ (ส่วนที่ได้รับการปรับปรุงแก้ไข)
          // ============================================================
          const rawBlocks = apiData.blocks || [];
          
          const formattedBlocks = rawBlocks.map(block => {
            let typeStr = String(block.type || '').toUpperCase();
            // ⭐️ ดักจับทั้ง icon และ icon_id ของตัว Block เองด้วย
            let defaultIcon = block.icon || block.icon_id || "Link";

            // เช็คประเภทเพื่อตั้งค่า Icon เริ่มต้น (กรณีที่ไม่มีการเลือกไว้)
            if (typeStr === 'YOUTUBE' || typeStr === 'VIDEO') defaultIcon = 'Youtube';
            else if (typeStr === 'TIKTOK') defaultIcon = 'TikTok';
            else if (typeStr === 'IMAGE') defaultIcon = 'Image';
            else if (typeStr === 'SHOP') defaultIcon = 'Shop';

            let rawItems = block.items || (block.content_data && block.content_data.items) || [];
            if (typeof rawItems === 'string') {
              try { rawItems = JSON.parse(rawItems); } 
              catch(e) { rawItems = []; }
            }

            // ดักจับ Auto-detect จาก URL (ถ้าเป็น Link ปกติ)
            if (defaultIcon === 'Link' && rawItems.length > 0) {
              const checkUrl = String(rawItems[0]?.url || rawItems[0]?.link || "").toLowerCase();
              if (checkUrl.includes('youtube.com') || checkUrl.includes('youtu.be')) {
                defaultIcon = 'Youtube'; 
              } else if (checkUrl.includes('tiktok.com')) {
                defaultIcon = 'TikTok'; 
              }
            }

            // ⭐️ แก้ไขให้ Logic ดึง iconId แม่นยำที่สุด โดยรองรับ icon_id ที่มาจากหลังบ้าน
            // ลำดับความสำคัญ: ไอคอนที่เลือกใน Item > ไอคอนที่เลือกใน Block > Auto-Detect > ค่าปริยาย (Link)
            const formattedItems = rawItems.map(item => ({
              ...item,
              iconId: item.iconId || item.icon_id || item.icon || block.icon_id || block.icon || defaultIcon
            }));

            return {
              ...block,                    
              ...block.content_data,
              items: formattedItems,
              icon: block.icon || block.icon_id || defaultIcon,            
              isVisible: block.is_visible !== undefined ? block.is_visible : true, 
            };
          });

          setLinks(formattedBlocks);
          setIsLoading(false);
          trackAnalytics(apiData.username, null);
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
          setError("ไม่พบข้อมูลโปรไฟล์ของผู้ใช้นี้ในระบบ");
          setIsLoading(false);
        });
    } else {
      setProfile(savedProfile || {});
      setLinks(savedLinks || []);
      setDesign(savedDesign || { theme: "t1", font: "kanit" });
      setIsLoading(false);
    }
  }, [username]);

  const handleLogoClick = () => {
    if (isFromAdmin) navigate('/admin'); 
    else navigate('/dd'); 
  };

  const handleBackClick = () => {
    if (isFromAdmin) window.close(); 
    else navigate(-1); 
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("คัดลอกลิงก์เรียบร้อยแล้ว!");
  };

  const handleLogout = async () => {
    try { await api.post('/logout'); } catch (error) { console.error(error); }
    finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate("/");
    }
  };

  const selectedFont = FONT_MAP[design.font] || FONT_MAP.kanit;
  const screenBackground = design.theme === "custom" 
    ? (design.bgColor || "#f0f2ff") 
    : (THEME_LIST.find((t) => t.id === design.theme)?.cfg?.bgGradient || "#f0f2ff");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans">
        <div className="text-lg font-semibold text-indigo-600 animate-pulse">กำลังโหลดหน้าโปรไฟล์...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-6 text-center font-sans">
        <div className="text-2xl font-bold text-red-500 mb-2">ขออภัยด้วยครับ</div>
        <div className="text-slate-600 mb-6">{error}</div>
        <button 
          onClick={() => navigate('/')} 
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-all font-medium"
        >
          กลับสู่หน้าหลัก
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-slate-100 font-sans">
      
      {!isPublic && (
        <div className="relative z-30">
          <Header onLogoClick={handleLogoClick}>
            <div className="flex items-center gap-2">
              <button onClick={handleBackClick} className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors underline underline-offset-2">
                <FaArrowLeft size={14} /> ย้อนกลับ
              </button>
              <button onClick={handleShare} className="flex md:hidden items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <Share2 size={15} /> แชร์
              </button>
              <button onClick={handleLogout} className="flex md:hidden items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-md shadow-red-200">
                <FaSignOutAlt size={15} /> ออกจากระบบ
              </button>
            </div>
          </Header>
        </div>
      )}

      {!isPublic && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around items-center px-2 py-3 z-50 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <button onClick={handleBackClick} className="flex flex-col items-center gap-1 w-full text-slate-400 hover:text-indigo-600">
            <FaHome size={18} />
            <span className="text-[10px] font-bold">ข้อมูล</span>
          </button>
          <button onClick={handleBackClick} className="flex flex-col items-center gap-1 w-full text-slate-400 hover:text-indigo-600">
            <FaPalette size={18} />
            <span className="text-[10px] font-bold">ออกแบบ</span>
          </button>
          <button onClick={handleBackClick} className="flex flex-col items-center gap-1 w-full text-slate-400 hover:text-indigo-600">
            <FaChartBar size={18} />
            <span className="text-[10px] font-bold">สถิติ</span>
          </button>
          <button className="flex flex-col items-center gap-1 w-full text-indigo-600">
            <Eye size={18} />
            <span className="text-[10px] font-bold">ดู</span>
          </button>
        </div>
      )}

      <div 
        className={`max-w-xl mx-auto min-h-screen relative z-10 shadow-2xl ${!isPublic ? 'pt-[72px] pb-[72px] md:pb-0' : 'pt-0'}`}
        style={{ fontFamily: selectedFont }}
      >
        <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl z-0 overflow-hidden" style={{ background: screenBackground }}>
          {design.bgImage && (
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${design.bgImage})`, opacity: 0.6 }} />
          )}
        </div>

        <BioContent 
          profile={profile}
          links={links} 
          design={design} 
          onLinkClick={(blockId, url) => trackAnalytics(username || profile.username, blockId, url)}
        />
        
      </div>
    </div>
  );
};

export default PreviewPage;