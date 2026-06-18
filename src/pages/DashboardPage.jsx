// ============================================================
// src/pages/DashboardPage.jsx
// ============================================================

import React, { useState, useEffect } from "react";
import { FaPlus, FaChevronRight } from "react-icons/fa";

// Components
import Navbar        from "../components/Layout/NavbarDetail";
import ProfileEditor from "../components/Editors/ProfileEditor";
import LinkItem      from "../components/Blocks/LinkItem";
import AddBlockModal from "../components/Modals/AddBlockModal";
import DesignEditor  from "../components/Editors/DesignEditor";
import PhonePreview  from "../components/Previews/PhonePreview";
import StatsPage     from "../pages/StatsPage";
import { useNavigate, useLocation } from "react-router-dom";
import ShareModal    from "../components/Modals/ShareModal";
import axios         from "axios"; 

// Hooks
import { useDragSort } from "../hooks/useDragSort";

import {
  MOCK_DESIGN,
  MOCK_STATS,
} from "../data/mockData";

const DashboardPage = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // ⭐️ ดึงข้อมูล User ตัวจริงและเจาะเข้าไปใน object `user`
  const realUserStr = localStorage.getItem('user');
  let realUser = realUserStr ? JSON.parse(realUserStr) : null;
  
  // ถ้าข้อมูลที่เก็บไว้มีหน้าตาเป็น { status: 'success', user: {...} } ให้เจาะเอาแค่ user มาใช้
  if (realUser && realUser.user) {
    realUser = realUser.user;
  }

  // ⭐️ ดักจับและลบช่องว่าง (Spacebar) ออกจาก username ทันทีที่โหลดข้อมูลมา
  if (realUser && typeof realUser.username === 'string') {
    realUser.username = realUser.username.trim();
  }

  // ถ้าไม่มีข้อมูล User แปลว่ายังไม่ Login ให้เตะกลับหน้า Login ทันที
  useEffect(() => {
    if (!realUser) {
      navigate('/login'); 
    }
  }, [navigate, realUser]);

  // สร้าง โปรไฟล์เริ่มต้น อิงจากฐานข้อมูลจริงของผู้ใช้งาน
  const INITIAL_PROFILE = {
    name: realUser?.display_name || realUser?.username || "ผู้ใช้งานใหม่",
    username: realUser?.username || "",
    email: realUser?.email || "",
    bio: "ยินดีต้อนรับสู่พื้นที่ของฉัน ✨",
    avatar: `https://ui-avatars.com/api/?name=${realUser?.username || 'User'}&background=random&color=fff`,
    cover: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80", 
    contactName: "",
    phone: "",
    company: "",
    title: "",
    website: "",
    showSaveContact: true
  };

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

  // ฟังก์ชันโหลดข้อมูลจาก LocalStorage
  const loadData = (key, defaultValue) => {
    const savedData = localStorage.getItem(key);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return defaultValue;
  };

  // State เก็บข้อมูลต่างๆ
  const [profile, setProfile] = useState(() => loadData("bio_profile", INITIAL_PROFILE));
  const [links,   setLinks]   = useState(() => loadData("bio_links", []));
  const [design,  setDesign]  = useState(() => loadData("bio_design", MOCK_DESIGN));

  // ⭐️ ฟังก์ชัน fetchMyProfile สำหรับดึงข้อมูลจาก Database ⭐️
  const fetchMyProfile = async () => {
    console.log("👉 User ที่กำลังใช้งานอยู่คือ:", realUser);

    if (!realUser?.username) {
        console.log("❌ ไม่พบ username ในระบบ (หา realUser.username ไม่เจอ)");
        return;
    }

    try {
      // url จะไม่มี %20 แน่นอนเพราะโดน trim() ไปแล้วด้านบน
      console.log(`📡 กำลังดึงข้อมูลจาก: http://127.0.0.1:8000/api/profiles/${realUser.username}`);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profiles/${realUser.username}`);
      
      console.log("✅ ข้อมูลที่ดึงได้จาก DB:", response.data);

      const dbData = response.data.data || response.data; 

      if (response.status === 200 && dbData) {
        setProfile(prev => ({
          ...prev,
          username: dbData.username || realUser.username,
          name: dbData.display_name || prev.name,
          bio: dbData.bio || prev.bio,
          
          // ⭐️ แก้ไขให้ตรงกับโครงสร้าง ProfileResource (images และ contact) ⭐️
          avatar: dbData.images?.avatar ? `http://127.0.0.1:8000${dbData.images.avatar}` : prev.avatar,
          cover: dbData.images?.cover ? `http://127.0.0.1:8000${dbData.images.cover}` : prev.cover,
          avatarFile: null,
          coverFile: null,
          
          contactName: dbData.contact?.name || "",
          phone: dbData.contact?.phone || "",
          email: dbData.contact?.email || "",
          company: dbData.contact?.company || "",
          title: dbData.contact?.job_title || "",
          website: dbData.contact?.website || "",
          showSaveContact: dbData.contact?.is_enabled === 1 || dbData.contact?.is_enabled === true
        }));

        if (dbData.theme) {
          // ตรวจสอบว่าข้อมูลที่ส่งกลับมาต้องทำการแปลงรูปวัตถุหรือไม่
          const themeCfg = typeof dbData.theme === 'string' ? JSON.parse(dbData.theme) : dbData.theme;
          
          setDesign(prev => ({ 
            ...prev, 
            theme: themeCfg.theme || prev.theme,
            font: themeCfg.font || prev.font,
            bgColor: themeCfg.bgColor || prev.bgColor,
            coverColor: themeCfg.coverColor || prev.coverColor,
            textColor: themeCfg.textColor || prev.textColor,
            btnBgColor: themeCfg.btnBgColor || prev.btnBgColor,
            btnTextColor: themeCfg.btnTextColor || prev.btnTextColor,
            btnBorderColor: themeCfg.btnBorderColor || prev.btnBorderColor,
            btnRounded: themeCfg.btnRounded || prev.btnRounded,
            btnStyle: themeCfg.btnStyle || prev.btnStyle,
            // คงค่ารูปภาพพื้นหลังเดิมไว้
            bgImage: dbData.images?.background ? `http://127.0.0.1:8000${dbData.images.background}` : prev.bgImage,
            bgImageFile: null
          }));
        }
      }
    } catch (error) {
      console.error("❌ ไม่พบข้อมูล Profile เดิม หรือเกิดข้อผิดพลาด:", error);
    }
  };

  // ⭐️ เรียกใช้ fetchMyProfile ตอนเปิดหน้าเว็บครั้งแรก ⭐️
  useEffect(() => {
    fetchMyProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // 🟢 บันทึกข้อมูลลง localStorage ทุกครั้งที่มีการเปลี่ยนแปลง เพื่อให้ Preview แสดงผลเรียลไทม์
  useEffect(() => {
    localStorage.setItem("preview_profile", JSON.stringify(profile));
    localStorage.setItem("preview_links", JSON.stringify(links));
    localStorage.setItem("preview_design", JSON.stringify(design));
    
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
  
  // ⭐️ ฟังก์ชันบันทึกข้อมูลและอัปโหลดไฟล์ไปที่ Laravel ⭐️
  const handleSave = async () => {
  try {
    // ⭐️ ลบช่องว่างส่วนเกินออกจาก username ที่ผู้ใช้กรอกบนหน้าเว็บ
    const cleanProfileUsername = profile.username ? profile.username.trim() : "";

    if (!cleanProfileUsername) {
      alert("⚠️ บันทึกไม่ได้: กรุณากรอกช่อง username บนหน้าเว็บก่อนครับ!");
      return;
    }

    // 1. บันทึกใน localStorage ด้วยชื่อที่ไม่มีช่องว่าง
    localStorage.setItem("bio_profile", JSON.stringify({ ...profile, username: cleanProfileUsername }));
    localStorage.setItem("bio_links", JSON.stringify(links));
    localStorage.setItem("bio_design", JSON.stringify(design));

    // 2. สร้าง FormData สำหรับส่งข้อมูลและไฟล์รูปภาพ
    const formData = new FormData();
    formData.append("_method", "PUT"); // หลอก Laravel ว่าเป็น PUT request

    // เพิ่มข้อมูล Text เข้าไปใน FormData
    formData.append("username", cleanProfileUsername); // ส่งชื่อที่ไม่มีช่องว่างไปฐานข้อมูล
    formData.append("display_name", profile.name || "");
    formData.append("bio", profile.bio || "");
    formData.append("contact_name", profile.contactName || "");
    formData.append("contact_phone", profile.phone || "");
    formData.append("contact_email", profile.email || "");
    formData.append("contact_company", profile.company || "");
    formData.append("contact_job_title", profile.title || "");
    formData.append("contact_website", profile.website || "");
    formData.append("show_save_contact", profile.showSaveContact !== false ? 1 : 0);

    // ─── ⭐️ เพิ่มโค้ดส่วนนี้เพื่อมัดรวมข้อมูลดีไซน์ส่งไปหลังบ้าน ⭐️ ───
    const themeConfigData = {
      theme: design.theme || "custom",
      font: design.font || "kanit",
      bgColor: design.bgColor || "",
      coverColor: design.coverColor || "",
      textColor: design.textColor || "",
      btnBgColor: design.btnBgColor || "",
      btnTextColor: design.btnTextColor || "",
      btnBorderColor: design.btnBorderColor || "",
      btnRounded: design.btnRounded || "rounded",
      btnStyle: design.btnStyle || "none",
    };
    formData.append("theme_config", JSON.stringify(themeConfigData));

    // 3. แนบไฟล์รูปภาพของจริง (ถ้ามีไฟล์ใหม่เลือกเข้ามา)
    if (profile.avatarFile) {
      formData.append("avatar", profile.avatarFile);
    }
    if (profile.coverFile) {
      formData.append("cover", profile.coverFile);
    }
    if (design.bgImageFile) {
      formData.append("bg_image", design.bgImageFile);
    }

    // 4. ยิง API ด้วย POST โดยอ้างอิงจาก username เดิม
    const response = await axios.post(
      `http://127.0.0.1:8000/api/profiles/${realUser.username}/test-update`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      alert("💾 บันทึกข้อมูลและรูปภาพลงฐานข้อมูล MySQL จริงสำเร็จเรียบร้อยแล้วครับ!");
      
      // อัปเดต state ให้หน้าจอโชว์ชื่อที่ลบช่องว่างแล้ว
      setProfile(prev => ({ ...prev, username: cleanProfileUsername }));

      // อัปเดต Username ในระบบจำล็อกอิน เผื่อผู้ใช้เปลี่ยนชื่อบนหน้าเว็บ
      const updatedUser = { ...realUser, username: cleanProfileUsername };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      realUser.username = cleanProfileUsername; // อัปเดตตัวแปรปัจจุบันทันที

      // เรียกใช้ฟังก์ชัน fetchMyProfile เพื่อดึงรูปจริงและเคลียร์ไฟล์ออกจาก state
      if (typeof fetchMyProfile === 'function') {
        fetchMyProfile();
      }
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);

    const errorFromLaravel = error.response?.data?.error_from_backend;
    const generalMessage = error.response?.data?.message;
    const systemError = error.message;

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