import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MOCK_PROFILE, MOCK_LINKS, MOCK_DESIGN } from "../data/mockData";
import Header from "../components/Navbar/Header";
import { THEME_LIST } from "../constants/themes";
import BioContent from "../components/BioContent"; const FONT_MAP = {
  kanit: "'Kanit', sans-serif",
  sarabun: "'Sarabun', sans-serif",
  mali: "'Mali', cursive",
  prompt: "'Prompt', sans-serif"
};const PreviewPage = () => {
  const navigate = useNavigate();
  const { username } = useParams();   // เพิ่มระบบเช็คเส้นทาง
  const [searchParams] = useSearchParams();
  const isFromAdmin = searchParams.get('source') === 'admin';  // ฟังก์ชันจัดการเมื่อกด Logo
  const handleLogoClick = () => {
    if (isFromAdmin) {
      navigate('/admin');
    } else {
      navigate('/dd');
    }
  };  // ฟังก์ชันจัดการเมื่อกดปุ่มย้อนกลับ
  const handleBackClick = () => {
    if (isFromAdmin) {
      window.close();
    } else {
      navigate(-1);
    }
  };  // ดึงข้อมูลจาก localStorage
  const savedProfile = JSON.parse(localStorage.getItem("preview_profile"));
  const savedLinks   = JSON.parse(localStorage.getItem("preview_links"));
  const savedDesign  = JSON.parse(localStorage.getItem("preview_design"));  const profile = savedProfile || MOCK_PROFILE;
  const links   = savedLinks   || MOCK_LINKS;
  const design  = savedDesign  || MOCK_DESIGN;  const activeTheme = THEME_LIST.find((t) => t.id === design.theme) || THEME_LIST[0];  //ประกาศตัวแปร selectedFont เพื่อให้ div ด้านล่างดึงไปใช้งานได้
  const selectedFont = FONT_MAP[design.font] || FONT_MAP.kanit;  const screenBackground = design.theme === "custom"
    ? (design.bgColor || "#f0f2ff")
    : (activeTheme?.cfg?.bgGradient || "#f0f2ff");  return (
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
      </div>      {/* Main Container */}
      <div className="max-w-xl mx-auto min-h-screen relative shadow-2xl pt-[72px]">
       
        {/* Background Layer */}
        <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl z-0 overflow-hidden" style={{ background: screenBackground }}>
          {design.bgImage && (
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${design.bgImage})`, opacity: 0.6 }} />
          )}
        </div>        {/* ⭐️ เรียกใช้งาน BioContent */}
        <BioContent
          profile={profile}
          links={links}
          design={design}
        />
       
      </div>
    </div>
  );
};export default PreviewPage;