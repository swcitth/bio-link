// ============================================================
// src/pages/PreviewPage.jsx
// ============================================================

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom"; 
import { FaArrowLeft } from "react-icons/fa";
import { MOCK_PROFILE, MOCK_LINKS, MOCK_DESIGN } from "../data/mockData";
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

const PreviewPage = () => {
  const navigate = useNavigate();
  const { username } = useParams(); 

  const [searchParams] = useSearchParams();
  const isFromAdmin = searchParams.get('source') === 'admin';

  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [links, setLinks] = useState(MOCK_LINKS);
  const [design, setDesign] = useState(MOCK_DESIGN);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ดึงค่าสำรองจาก LocalStorage เผื่อกรณีอินเทอร์เน็ตมีปัญหา
    const savedProfile = JSON.parse(localStorage.getItem("preview_profile"));
    const savedLinks   = JSON.parse(localStorage.getItem("preview_links"));
    const savedDesign  = JSON.parse(localStorage.getItem("preview_design"));

    if (username) {
      setIsLoading(true);
      setError(null);
      
      // ⭐️ แก้ไข: เติม /api/ เข้าไปให้ถูกต้องแล้วครับ ⭐️
      axios.get(`${import.meta.env.VITE_API_URL}/api/profiles/${username}`)
        .then((response) => {
          const apiData = response.data.data || response.data;
          
          // เปลี่ยนชื่อตัวแปรให้ตรงกับที่หน้าบ้านต้องการ (name, avatar, cover)
          setProfile({
            ...MOCK_PROFILE,
            username: apiData.username,
            name: apiData.display_name || "",
            bio: apiData.bio || "",
            avatar: apiData.images?.avatar ? `http://127.0.0.1:8000${apiData.images.avatar}` : MOCK_PROFILE.avatar,
            cover: apiData.images?.cover ? `http://127.0.0.1:8000${apiData.images.cover}` : MOCK_PROFILE.cover,
            contactName: apiData.contact?.name || "",
            phone: apiData.contact?.phone || "",
            email: apiData.contact?.email || "",
            company: apiData.contact?.company || "",
            title: apiData.contact?.job_title || "",
            website: apiData.contact?.website || "",
            showSaveContact: apiData.contact?.is_enabled === 1 || apiData.contact?.is_enabled === true
          });

          // ดึงข้อมูลการออกแบบ (Theme & Colors) มาจากฐานข้อมูล
          const themeData = apiData.theme || apiData.theme_config;
          if (themeData) {
            const themeCfg = typeof themeData === 'string' ? JSON.parse(themeData) : themeData;
            setDesign({
              ...MOCK_DESIGN,
              ...themeCfg,
              bgImage: apiData.images?.background ? `http://127.0.0.1:8000${apiData.images.background}` : null,
            });
          } else if (savedDesign) {
            setDesign(savedDesign);
          }

          // จัดการลิงก์ (ดึงจากฐานข้อมูลก่อน ถ้าไม่มีค่อยดึงจาก LocalStorage)
          if (apiData.blocks && apiData.blocks.length > 0) {
            setLinks(apiData.blocks);
          } else if (savedLinks) {
            setLinks(savedLinks);
          }

          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
          setError("ไม่พบข้อมูลโปรไฟล์ของผู้ใช้นี้ในระบบ");
          setIsLoading(false);
        });
    } else {
      setProfile(savedProfile || MOCK_PROFILE);
      setLinks(savedLinks || MOCK_LINKS);
      setDesign(savedDesign || MOCK_DESIGN);
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
      
      {/* Header */}
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

      {/* Main Container */}
      <div className="max-w-xl mx-auto min-h-screen relative shadow-2xl pt-[72px]">
       
        {/* Background Layer */}
        <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl z-0 overflow-hidden" style={{ background: screenBackground }}>
          {design.bgImage && (
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${design.bgImage})`, opacity: 0.6 }} />
          )}
        </div>

        {/* ⭐️ เรียกใช้งาน BioContent โดยส่งข้อมูลจริงที่ได้จาก API */}
        <BioContent 
          profile={profile} 
          links={links} 
          design={design} 
        />
       
      </div>
    </div>
  );
};

export default PreviewPage;