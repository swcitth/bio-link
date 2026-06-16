// ============================================================
// src/pages/DashboardPage.jsx
// ============================================================

import React, { useState, useEffect } from "react"; // นำเข้า useEffect
import { FaPlus, FaChevronRight } from "react-icons/fa";

// Components
import Navbar        from "../components/Layout/NavbarDetail";
import ProfileEditor from "../components/Editors/ProfileEditor";
import LinkItem      from "../components/Blocks/LinkItem";
import AddBlockModal from "../components/Modals/AddBlockModal";
import DesignEditor  from "../components/Editors/DesignEditor";
import PhonePreview  from "../components/Previews/PhonePreview";
import StatsPage     from "../pages/StatsPage";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ShareModal from "../components/Modals/ShareModal";
import axios from "axios"; // นำเข้า Axios เพื่อเตรียมยิงข้อมูลไปหา Laravel

// Hooks
import { useDragSort } from "../hooks/useDragSort";

// Mock Data
import {
  MOCK_PROFILE,
  MOCK_LINKS,
  MOCK_DESIGN,
  MOCK_STATS,
} from "../data/mockData";

const DashboardPage = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleEditClick = (link) => {
    if (link.icon === "Image") {
      navigate(`/edit-shop?id=${link.id}`);
    } 
    else if (link.icon === "Youtube" || link.icon === "TikTok") {
      navigate(`/edit-video?id=${link.id}`); 
    } 
    else {
      navigate(`/edit-link?id=${link.id}`);
    }
  };

  const [activeTab,   setActiveTab]   = useState("info");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. ย้าย loadData ขึ้นมาไว้บนสุด เพื่อให้ตัวแปรด้านล่างเรียกใช้งานได้
  const loadData = (key, defaultValue) => {
    const savedData = localStorage.getItem(key);
    if (savedData) {
      return JSON.parse(savedData); // ถ้าเคยเซฟไว้ ให้ดึงกลับมาใช้
    }
    return defaultValue; // ถ้ายังไม่เคยเซฟ ให้ใช้ค่าเริ่มต้น
  };

  // 2. เรียกใช้ฟังก์ชัน loadData เพื่อกำหนดค่าเริ่มต้นตอนรีเฟรช
  const [profile, setProfile] = useState(() => loadData("bio_profile", MOCK_PROFILE));
  const [links,   setLinks]   = useState(() => loadData("bio_links", []));
  const [design,  setDesign]  = useState(() => loadData("bio_design", MOCK_DESIGN));

  useEffect(() => {
    setProfile(loadData("bio_profile", MOCK_PROFILE));
    setLinks(loadData("bio_links", []));
    setDesign(loadData("bio_design", MOCK_DESIGN));
  }, [location]);

  

  // 🟢 บันทึกข้อมูลลง localStorage ทุกครั้งที่ profile, links หรือ design มีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("preview_profile", JSON.stringify(profile));
    localStorage.setItem("preview_links", JSON.stringify(links));
    localStorage.setItem("preview_design", JSON.stringify(design));
    
    // ⭐ เพิ่มบรรทัดนี้: ส่งสัญญาณบอกทุกหน้าจอในเบราว์เซอร์ว่าข้อมูลเปลี่ยนแล้วนะ!
    window.dispatchEvent(new Event("storage"));
  }, [profile, links, design]);

  const { handleDragStart, handleDragEnter, handleDragEnd } =
    useDragSort(links, setLinks);

  const handleUpdateLink = (updatedLink) =>
    setLinks((prev) => prev.map((l) => (l.id === updatedLink.id ? updatedLink : l)));

  const handleDeleteLink = (id) =>
    setLinks((prev) => prev.filter((l) => l.id !== id));

  const handleToggleVisibility = (id) =>
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );

  const handleAddNewBlock = (type, defaultTitle, defaultIcon) => {

    const newId = links.length > 0 ? Math.max(...links.map((l) => l.id)) + 1 : 1;
    const newLink = {
      id:      newId,
      title:   defaultTitle,
      url:     "",
      icon:    defaultIcon,
      visible: true,
      clicks:  0,
      items:   []
    };

    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);


    localStorage.setItem("bio_links", JSON.stringify(updatedLinks));
    localStorage.setItem("bio_profile", JSON.stringify(profile)); 
    localStorage.setItem("bio_design", JSON.stringify(design));

    window.dispatchEvent(new Event("storage"));
    setIsModalOpen(false);
    if (defaultIcon === "Image") {
      navigate(`/edit-shop?id=${newId}`);
    } 
    else if (defaultIcon === "Youtube" || defaultIcon === "TikTok") {
      navigate(`/edit-video?id=${newId}`);
    } 
    else {
      navigate(`/edit-link?id=${newId}`);
    }
  };
  

  const handleSave = async () => {
    try {
      // 1. บันทึกใน localStorage ตามปกติ
      localStorage.setItem("bio_profile", JSON.stringify(profile));
      localStorage.setItem("bio_links", JSON.stringify(links));
      localStorage.setItem("bio_design", JSON.stringify(design));

      // เช็คดักไว้ก่อน: ถ้าผู้ใช้ลืมกรอก username หรือเป็นค่าว่าง จะได้ไม่ยิงไปมั่วๆ
      if (!profile.username) {
        alert("⚠️ บันทึกไม่ได้: กรุณากรอกช่อง username บนหน้าเว็บก่อนครับ!");
        return;
      }

      // 2. จับคู่ข้อมูลเตรียมส่งให้ Laravel
      const payload = {
        username: profile.username,
        display_name: profile.name,         
        bio: profile.bio,
        avatar_url: profile.avatar,
        cover_url: profile.cover,
        contact_name: profile.contactName,  
        contact_phone: profile.phone,       
        contact_email: profile.email,       
        contact_company: profile.company,   
        contact_job_title: profile.title,   
        contact_website: profile.website,   
        show_save_contact: profile.showSaveContact !== false ? 1 : 0,
      };

      // 3. ยิงข้อมูลไปหาหลังบ้าน
      const response = await axios.put(
        `http://127.0.0.1:8000/api/profiles/${profile.username}/test-update`, 
        payload
      );
      
      if (response.status === 200) {
        alert("💾 บันทึกข้อมูลลงฐานข้อมูล MySQL จริงสำเร็จเรียบร้อยแล้วครับ!");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);

      // 🔥 [ทีเด็ดอยู่ตรงนี้] แกะกล่องเอาข้อความด่าจาก Laravel ออกมาโชว์บน Alert ตรงๆ ทันที!
      const errorFromLaravel = error.response?.data?.error_from_backend;
      const generalMessage   = error.response?.data?.message;
      const systemError      = error.message;

      const finalReport = errorFromLaravel || generalMessage || systemError;

      alert(`❌ บันทึกไม่สำเร็จ! หลังบ้านฟ้องว่า:\n\n👉 "${finalReport}"`);
    }
  };
  
  const handleShare = () => {
    setIsShareModalOpen(true); 
  };

  return (
    <div className="min-h-screen bg-[#eef0f8] font-sans overflow-x-hidden relative">

      <BackgroundBlobs />

      <div className="relative z-10">

        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSave={handleSave}
          onShare={handleShare}
        />

        <AddBlockModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddNewBlock}
        />

        <ShareModal 
          isOpen={isShareModalOpen} 
          onClose={() => setIsShareModalOpen(false)} 
          profile={profile} 
        />

        <main className="max-w-6xl mx-auto px-4 py-6">

          {activeTab === "stats" ? (
            <StatsPage links={links} stats={MOCK_STATS} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

              <div>

                {activeTab === "info" && (
                  <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">

                    <ProfileEditor profile={profile} setProfile={setProfile} />

                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-bold text-slate-600 text-sm">
                        🔗 ลิงก์ทั้งหมด ({links.length})
                      </h2>
                      <span className="text-xs text-slate-400">ลากเพื่อเรียงลำดับ</span>
                    </div>

                    {links.map((link, index) => (
                      <LinkItem
                        key={link.id}
                        link={link}
                        index={index}
                        onUpdate={handleUpdateLink}
                        onDelete={handleDeleteLink}
                        onToggleVisibility={handleToggleVisibility}
                        onDragStart={handleDragStart}
                        onDragEnter={handleDragEnter}
                        onDragEnd={handleDragEnd}
                        onEdit={handleEditClick}
                      />
                    ))}

                    {links.length === 0 && (
                      <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
                        ยังไม่มีลิงก์ กดปุ่มเพิ่มด้านล่างได้เลย
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-5">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg shadow-indigo-200 hover:opacity-90 transition-opacity"
                      >
                        <FaPlus size={16} /> เพิ่มรูปแบบ
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg shadow-indigo-200 hover:opacity-90 transition-opacity"
                      >
                        บันทึก 
                      </button>
                    </div>

                  </div>
                )}

                {activeTab === "design" && (
                  <div>
                    <DesignEditor design={design} setDesign={setDesign} profile={profile} />
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3 rounded-full font-semibold text-sm shadow-lg shadow-indigo-200 hover:opacity-90 transition-opacity"
                      >
                        บันทึกการออกแบบ
                      </button>
                    </div>
                  </div>
                )}

              </div>

              <div className="flex justify-center">
                <PhonePreview profile={profile} links={links} design={design} />
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};

const BackgroundBlobs = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute top-[-8%] left-[-8%] w-[420px] h-[420px] rounded-full bg-violet-300/20 blur-[100px]" />
    <div className="absolute top-[25%] right-[-8%] w-[360px] h-[360px] rounded-full bg-orange-200/20 blur-[90px]" />
    <div className="absolute bottom-[-8%] left-[18%] w-[500px] h-[500px] rounded-full bg-indigo-200/15 blur-[110px]" />
  </div>
);

export default DashboardPage;