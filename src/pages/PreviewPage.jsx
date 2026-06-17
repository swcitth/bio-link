import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom"; 
import { FaArrowLeft } from "react-icons/fa";
import { MOCK_PROFILE, MOCK_LINKS, MOCK_DESIGN } from "../data/mockData";
import Header from "../components/Layout/Header";
import { THEME_LIST } from "../constants/themes";
import BioContent from "../components/Editors/BioContent"; 
import axios from "axios"; // 1. Import Axios สำหรับยิง API

const FONT_MAP = {
  kanit: "'Kanit', sans-serif",
  sarabun: "'Sarabun', sans-serif",
  mali: "'Mali', cursive",
  prompt: "'Prompt', sans-serif"
};

const PreviewPage = () => {
  const navigate = useNavigate();
  const { username } = useParams(); 

  // เพิ่มระบบเช็คเส้นทาง 
  const [searchParams] = useSearchParams();
  const isFromAdmin = searchParams.get('source') === 'admin';

  // 2. สร้าง State สำหรับจัดการสถานะและการเก็บข้อมูลจาก Backend
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [links, setLinks] = useState(MOCK_LINKS);
  const [design, setDesign] = useState(MOCK_DESIGN);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. ใช้ useEffect ยิง API ไปหา Laravel ทันทีที่เปิดหน้านี้ขึ้นมา
  useEffect(() => {
    // ดึงข้อมูลจาก localStorage เผื่อกรณีเปิดจากหน้า Dashboard หลังบ้านชั่วคราว
    const savedProfile = JSON.parse(localStorage.getItem("preview_profile"));
    const savedLinks   = JSON.parse(localStorage.getItem("preview_links"));
    const savedDesign  = JSON.parse(localStorage.getItem("preview_design"));

    if (username) {
      setIsLoading(true);
      setError(null);
      
      // ยิง GET Request ไปที่ Backend ยืดหยุ่นตามชื่อบน URL
      axios.get(`http://127.0.0.1:8000/api/profiles/${username}`)
        .then((response) => {
          const apiData = response.data.data;
          
          // ทำการ Map จับคู่โครงสร้างข้อมูลของ Laravel JSON เข้ากับ Props ของหน้าบ้าน
          setProfile({
            ...MOCK_PROFILE,
            username: apiData.username,
            display_name: apiData.display_name || "",
            bio: apiData.bio || "",
            avatar_url: apiData.images?.avatar || null,
            cover_url: apiData.images?.cover || null,
            bg_image_url: apiData.images?.background || null,
            contact_name: apiData.contact?.name || null,
            contact_phone: apiData.contact?.phone || null,
            contact_email: apiData.contact?.email || null,
            contact_company: apiData.contact?.company || null,
            contact_job_title: apiData.contact?.job_title || null,
            contact_website: apiData.contact?.website || null,
            show_save_contact: apiData.contact?.is_enabled || false,
          });

          // ถ้าดึงข้อมูลสำเร็จและมีเซฟ Links/Design อยู่ ให้ดึงตามมา
          if (savedLinks) setLinks(savedLinks);
          if (savedDesign) setDesign(savedDesign);

          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
          setError("ไม่พบข้อมูลโปรไฟล์ของผู้ใช้นี้ในระบบ");
          setIsLoading(false);
        });
    } else {
      // หากไม่มี username บน URL ให้ดึงจาก LocalStorage/Mock ตามปกติ (เช่น โหมดพรีวิวด่วน)
      setProfile(savedProfile || MOCK_PROFILE);
      setLinks(savedLinks || MOCK_LINKS);
      setDesign(savedDesign || MOCK_DESIGN);
      setIsLoading(false);
    }
  }, [username]);

  // ฟังก์ชันจัดการเมื่อกด Logo
  const handleLogoClick = () => {
    if (isFromAdmin) {
      navigate('/admin'); 
    } else {
      navigate('/dd'); 
    }
  };

  // ฟังก์ชันจัดการเมื่อกดปุ่มย้อนกลับ
  const handleBackClick = () => {
    if (isFromAdmin) {
      window.close(); 
    } else {
      navigate(-1); 
    }
  };

  // ตัวแปรเหล่านี้จะประมวลผลใหม่โดยอัตโนมัติเมื่อ State ข้อมูลเปลี่ยนไป
  const activeTheme = THEME_LIST.find((t) => t.id === design.theme) || THEME_LIST[0];
  const selectedFont = FONT_MAP[design.font] || FONT_MAP.kanit;
  const screenBackground = design.theme === "custom" 
    ? (design.bgColor || "#f0f2ff") 
    : (activeTheme?.cfg?.bgGradient || "#f0f2ff");

  // 4. หน้าจอระหว่างโหลดข้อมูล (Loading)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans">
        <div className="text-lg font-semibold text-indigo-600 animate-pulse">กำลังโหลดหน้าโปรไฟล์...</div>
      </div>
    );
  }

  // 5. หน้าจอเมื่อเกิดข้อผิดพลาด เช่น หาชื่อผู้ใช้ไม่เจอ (404)
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