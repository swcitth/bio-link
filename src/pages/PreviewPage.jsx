// ============================================================
// src/pages/PreviewPage.jsx
// ============================================================

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom"; 
import { FaArrowLeft } from "react-icons/fa";

import Header from "../components/Layout/Header";
import { THEME_LIST } from "../constants/themes";
import BioContent from "../components/Editors/BioContent"; 
import axios from "axios"; 

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
  const trackAnalytics = (targetUsername, blockId = null) => {
    // ถ้านี่คือการเปิดพรีวิวจากหน้าแอดมินหรือหน้าแก้ไข จะไม่นับยอดวิวเพื่อไม่ให้สถิติเพี้ยน
    if (isFromAdmin || !targetUsername) return; 

    // สร้างหรือดึง Session ID ของคนที่เข้ามาดู (ใช้ Session Storage เพื่อกันการ F5 ปั่นวิว)
    let sessionId = sessionStorage.getItem("analytics_session");
    if (!sessionId) {
      sessionId = "sess_" + Math.random().toString(36).substr(2, 9) + Date.now();
      sessionStorage.setItem("analytics_session", sessionId);
    }

    // ยิง API ไปหลังบ้านแบบเงียบๆ (ไม่ต้องใช้ await เพราะไม่ต้องการให้หน้าเว็บรอ)
    axios.post(`${import.meta.env.VITE_API_URL}/analytics/track/${targetUsername}`, {
      session_id: sessionId,
      block_id: blockId, // ถ้าเป็น null = ยอดเข้าชมหน้าเว็บ / ถ้ามีไอดี = ยอดคลิกลิงก์
      referrer_url: document.referrer // เก็บข้อมูลว่าเข้ามาจากแอปไหน (FB, IG, LINE)
    }).catch(err => console.log("Analytics Tracking Error:", err));
  };

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("preview_profile"));
    const savedLinks   = JSON.parse(localStorage.getItem("preview_links"));
    const savedDesign  = JSON.parse(localStorage.getItem("preview_design"));

    if (username) {
      setIsLoading(true);
      setError(null);
      
      axios.get(`${import.meta.env.VITE_API_URL}/profiles/${username}`)
        .then((response) => {
          const apiData = response.data.data || response.data;
          
          // ⭐️ แก้ไข: เอา ...MOCK_PROFILE หรือตัวแปร MOCK ออกทั้งหมด
          setProfile({
            username: apiData.username,
            name: apiData.display_name || "",
            bio: apiData.bio || "",
            avatar: apiData.images?.avatar ? `http://127.0.0.1:8000${apiData.images.avatar}` : "",
            cover: apiData.images?.cover ? `http://127.0.0.1:8000${apiData.images.cover}` : "",
            contactName: apiData.contact?.name || "",
            phone: apiData.contact?.phone || "",
            email: apiData.contact?.email || "",
            company: apiData.contact?.company || "",
            title: apiData.contact?.job_title || "",
            website: apiData.contact?.website || "",
            showSaveContact: apiData.contact?.is_enabled === 1 || apiData.contact?.is_enabled === true
          });

          // จัดการ ธีม/ดีไซน์
          const themeData = apiData.theme || apiData.theme_config;
          if (themeData) {
            const themeCfg = typeof themeData === 'string' ? JSON.parse(themeData) : themeData;
            setDesign({
              theme: "t1", font: "kanit", // ค่าพื้นฐาน
              ...themeCfg,
              bgImage: apiData.images?.background ? `http://127.0.0.1:8000${apiData.images.background}` : null,
            });
          } else {
             setDesign({ theme: "t1", font: "kanit" });
          }

          // ============================================================
          // ⭐️ ตัวดักจับและจัดระเบียบข้อมูลลิงก์ (เพิ่มระบบ Auto-Detect สแกน URL)
          // ============================================================
          const rawBlocks = apiData.blocks || [];
          
          const formattedBlocks = rawBlocks.map(block => {
            // 1. เช็คจาก type ของฐานข้อมูลเผื่อไว้ก่อน (ดักทั้งตัวพิมพ์เล็กและพิมพ์ใหญ่)
            let typeStr = String(block.type || '').toUpperCase();
            let correctIcon = block.icon || "Link";

            if (typeStr === 'YOUTUBE' || typeStr === 'VIDEO') correctIcon = 'Youtube';
            else if (typeStr === 'TIKTOK') correctIcon = 'TikTok';
            else if (typeStr === 'IMAGE') correctIcon = 'Image';
            else if (typeStr === 'SHOP') correctIcon = 'Shop';

            // 2. จัดระเบียบ items ดึงข้อมูลลิงก์ที่ซ่อนอยู่ออกมา
            let correctItems = block.items || (block.content_data && block.content_data.items) || [];
            if (typeof correctItems === 'string') {
              try { correctItems = JSON.parse(correctItems); } 
              catch(e) { correctItems = []; }
            }

            // ⭐️ 3. ไม้ตายสุดยอด! Auto-detect จาก URL โดยตรง
            // ถ้าเป็นกล่องลิงก์ธรรมดา แต่ URL ข้างในเป็น Youtube ให้บังคับแปลงเป็นวิดีโอทันที!
            if (correctIcon === 'Link' && correctItems.length > 0) {
              const checkUrl = String(correctItems[0]?.url || correctItems[0]?.link || "").toLowerCase();
              if (checkUrl.includes('youtube.com') || checkUrl.includes('youtu.be')) {
                correctIcon = 'Youtube'; // บังคับให้เป็นคลิป Youtube
              } else if (checkUrl.includes('tiktok.com')) {
                correctIcon = 'TikTok'; // บังคับให้เป็นคลิป TikTok
              }
            }

            return {
              ...block,                     
              ...(block.content_data || {}), 
              items: correctItems,          
              icon: correctIcon,            
              isVisible: block.is_visible !== undefined ? block.is_visible : true, 
            };
          });

          // นำข้อมูลที่จัดระเบียบแล้วไปใช้งาน
          setLinks(formattedBlocks);
          // ============================================================

          setIsLoading(false);

          // ⭐️ 2. เรียกใช้งานฟังก์ชันเก็บสถิติ "ยอดเข้าชม" เมื่อโหลดข้อมูลสำเร็จ
          trackAnalytics(apiData.username, null);
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
          setError("ไม่พบข้อมูลโปรไฟล์ของผู้ใช้นี้ในระบบ");
          setIsLoading(false);
        });
    } else {
      // ⭐️ โหมด Preview ในหน้าแก้ไข (เอา || MOCK ออกให้หมด)
      setProfile(savedProfile || {});
      setLinks(savedLinks || []);
      setDesign(savedDesign || { theme: "t1", font: "kanit" });
      setIsLoading(false);
    }
  }, [username]);

  const handleLogoClick = () => {
    if (isFromAdmin) {
      navigate('/admin'); 
    } else {
      navigate('/dd'); 
    }
  };

  const handleBackClick = () => {
    if (isFromAdmin) {
      window.close(); 
    } else {
      navigate(-1); 
    }
  };

  const activeTheme = THEME_LIST.find((t) => t.id === design.theme) || THEME_LIST[0];
  const selectedFont = FONT_MAP[design.font] || FONT_MAP.kanit;
  const screenBackground = design.theme === "custom" 
    ? (design.bgColor || "#f0f2ff") 
    : (activeTheme?.cfg?.bgGradient || "#f0f2ff");

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
    <div className="min-h-screen relative bg-slate-100" style={{ fontFamily: selectedFont }}>
      
      {/* ⭐️ ถ้า ไม่ใช่หน้า Public ค่อยโชว์ Header (Navbar) */}
      {!isPublic && (
        <div className="relative z-30">
          <Header onLogoClick={handleLogoClick}>
            <button 
              onClick={handleBackClick} 
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors underline underline-offset-2"
            >
              <FaArrowLeft size={14} /> ย้อนกลับ
            </button>
          </Header>
        </div>
      )}

      {/* ⭐️ ปรับ pt ให้สัมพันธ์กับการมีหรือไม่มี Header */}
      <div className={`max-w-xl mx-auto min-h-screen relative shadow-2xl ${!isPublic ? 'pt-[72px]' : 'pt-0'}`}>
       
        <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl z-0 overflow-hidden" style={{ background: screenBackground }}>
          {design.bgImage && (
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${design.bgImage})`, opacity: 0.6 }} />
          )}
        </div>

        {/* ⭐️ 3. ส่ง Props ฟังก์ชันจับการคลิกไปให้ BioContent ใช้งาน */}
        <BioContent 
          profile={profile} 
          links={links} 
          design={design} 
          onLinkClick={(blockId) => trackAnalytics(profile.username, blockId)}
        />
       
      </div>
    </div>
  );
};

export default PreviewPage;