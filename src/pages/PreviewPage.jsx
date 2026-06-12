import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom"; 
import { FaArrowLeft } from "react-icons/fa";
import { MOCK_PROFILE, MOCK_LINKS, MOCK_DESIGN } from "../data/mockData";
import Header from "../components/Navbar/Header";
import { THEME_LIST } from "../constants/themes";
import BioContent from "../components/BioContent"; // ⭐️ Import component ที่เราสร้าง

const PreviewPage = () => {
  const navigate = useNavigate();
  const { username } = useParams(); // เผื่อเอาไว้ใช้แสดงชื่อใน URL

  // เพิ่มระบบเช็คเส้นทาง 
  const [searchParams] = useSearchParams();
  const isFromAdmin = searchParams.get('source') === 'admin';

  // ฟังก์ชันจัดการเมื่อกด Logo
  const handleLogoClick = () => {
    if (isFromAdmin) {
      navigate('/admin'); // ถ้ามาจากแอดมิน กลับไปหน้าจัดการผู้ใช้
    } else {
      navigate('/dd'); 
    }
  };

  // ฟังก์ชันจัดการเมื่อกดปุ่มย้อนกลับ
  const handleBackClick = () => {
    if (isFromAdmin) {
      window.close(); // แอดมินเปิดมาเป็นแท็บใหม่ พอกดกลับก็สั่ง "ปิดแท็บ" นี้ทิ้งไปเลย!
    } else {
      navigate(-1); // ผู้ใช้ปกติ ให้ย้อนกลับประวัติเบราว์เซอร์ 1 หน้า
    }
  };

  // ดึงข้อมูลจาก localStorage

  const savedProfile = JSON.parse(localStorage.getItem("preview_profile"));
  const savedLinks   = JSON.parse(localStorage.getItem("preview_links"));
  const savedDesign  = JSON.parse(localStorage.getItem("preview_design"));

  const profile = savedProfile || MOCK_PROFILE;
  const links   = savedLinks   || MOCK_LINKS;
  const design  = savedDesign  || MOCK_DESIGN;

  const activeTheme = THEME_LIST.find((t) => t.id === design.theme) || THEME_LIST[0];

  const btnRadius = { square: "8px", rounded: "14px", pill: "999px" }[design.btnRounded] || "999px";
  const btnBoxShadow = { none: "none", outline: "none", shadow3d: "0px 4px 0px rgba(0,0,0,0.2)" }[design.btnStyle] || "none";
  const btnBorder = design.btnStyle !== "none" ? `2px solid ${design.btnBorderColor || "transparent"}` : "none";

  const screenBackground = design.theme === "custom" 
    ? (design.bgColor || "#f0f2ff") 
    : (activeTheme?.cfg?.bgGradient || "#f0f2ff");

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

        {/* ⭐️ เรียกใช้งาน BioContent แบบจอใหญ่ (isCompact={false} เป็นค่าเริ่มต้นอยู่แล้ว) */}
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