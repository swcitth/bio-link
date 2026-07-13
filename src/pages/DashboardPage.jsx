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

import api, { getImageUrl } from "../api/axios"; 

// Hooks
import { useDragSort } from "../hooks/useDragSort";

import {
  MOCK_DESIGN,
  MOCK_STATS,
} from "../data/mockData";

// ⭐️ 1. เพิ่มฟังก์ชัน Image Preloading (ผู้ช่วยดาวน์โหลดรูปลง RAM) ⭐️
const preloadImage = (url) => {
  return new Promise((resolve) => {
    if (!url) {
      resolve();
      return;
    }
    const img = new Image();
    img.src = url;
    img.onload = () => resolve();  // แจ้งเตือนเมื่อโหลดเสร็จ
    img.onerror = () => resolve(); // ถ้าไฟล์เสียให้ข้ามไป ระบบจะได้ไม่ค้าง
  });
};

const DashboardPage = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // ดึงข้อมูล User ตัวจริงและเจาะเข้าไปใน object `user`
  const realUserStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  let realUser = realUserStr ? JSON.parse(realUserStr) : null;
  
  // ถ้าข้อมูลที่เก็บไว้มีหน้าตาเป็น { status: 'success', user: {...} } ให้เจาะเอาแค่ user มาใช้
  if (realUser && realUser.user) {
    realUser = realUser.user;
  }

  // ดักจับและลบช่องว่าง (Spacebar) ออกจาก username ทันทีที่โหลดข้อมูลมา
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
    // แยกเอาเฉพาะเลขตัวหน้า
    const cleanId = String(link.id).split(':')[0]; 
    
    console.log("ID ที่ส่งไปหน้า Edit คือ:", cleanId);
    console.log("ไอคอนที่กดคือ:", link.icon);

    if (link.icon === "Image") {
      navigate(`/edit-shop?id=${cleanId}`);
    } 
    // ⭐️ ตรวจสอบคำที่นี่ให้ตรงกับที่ log ออกมา (ถ้า log ออกมาเป็น SLIDER ก็ต้องเขียนเป็น SLIDER)
    else if (link.icon === "Slider" || link.icon === "SLIDER") { 
      navigate(`/edit-slider?id=${cleanId}`);
    } 
    else if (link.icon === "Youtube" || link.icon === "TikTok") {
      navigate(`/edit-video?id=${cleanId}`); 
    } 
    else {
      navigate(`/edit-link?id=${cleanId}`);
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
  
  // ⭐️ 2. เพิ่ม State สำหรับจัดการหน้าจอ Loading ⭐️
  const [isLoading, setIsLoading] = useState(true); 

  // ฟังก์ชัน fetchMyProfile สำหรับดึงข้อมูลจาก Database
  const fetchMyProfile = async () => {
    // console.log("👉 User ที่กำลังใช้งานอยู่คือ:", realUser);

    if (!realUser?.username) {
        // console.log("❌ ไม่พบ username ในระบบ (หา realUser.username ไม่เจอ)");
        return;
    }

    try {
     // console.log(`กำลังดึงข้อมูลจาก: http://127.0.0.1:8000/api/profiles/${realUser.username}`);
      const response = await api.get(`/profiles/${realUser.username}`);
      
     // console.log("✅ ข้อมูลที่ดึงได้จาก DB:", response.data);

      const dbData = response.data.data || response.data; 

      if (response.status === 200 && dbData) {
        
        // 🌟 ฟังก์ชันตัวช่วย: ถ้ามี http อยู่แล้วให้ใช้เลย ถ้าไม่มีให้เติมโดเมนหลังบ้านเข้าไป
        const getValidImageUrl = (path) => {
          if (!path) return null;
          return getImageUrl(path);
        };

        // 🌟 3. เตรียม URL ของรูปภาพ 
        // ถ้า dbData ไม่มีรูป (เป็น null/undefined) ให้ลองดึงจาก realUser (ข้อมูลจาก Google ตอน Login)
        const avatarUrlToLoad = getValidImageUrl(dbData.avatar || realUser?.avatar);
        const coverUrlToLoad = getValidImageUrl(dbData.cover);
        const bgImageUrlToLoad = getValidImageUrl(dbData.background);

        await Promise.all([
          preloadImage(avatarUrlToLoad),
          preloadImage(coverUrlToLoad),
          preloadImage(bgImageUrlToLoad)
        ]);

        // ⭐️ 4. อัปเดตข้อมูลใส่ State โดยใช้ URL ที่โหลดเสร็จแล้ว ⭐️
        setProfile(prev => ({
          ...prev,
          username: dbData.username || realUser.username,
          name: dbData.display_name || prev.name,
          bio: dbData.bio || prev.bio,
          
          avatar: (dbData.avatar === null || dbData.avatar_url === null) ? "" : (avatarUrlToLoad || prev.avatar),
          cover: (dbData.cover === null || dbData.cover_url === null) ? "" : (coverUrlToLoad || prev.cover),
          avatarFile: null,
          coverFile: null,
          
          contactName: dbData.contact?.name || dbData.contact_name || dbData.contactName || "",
          phone: dbData.contact?.phone || dbData.contact_phone || dbData.phone || "",
          email: dbData.contact?.email || dbData.contact_email || dbData.email || "",
          company: dbData.contact?.company || dbData.contact_company || dbData.company || "",
          title: dbData.contact?.job_title || dbData.contact_job_title || dbData.title || "",
          website: dbData.contact?.website || dbData.contact_website || dbData.website || "",
          showSaveContact: 
            [1, "1", true, "true"].includes(dbData.contact?.is_enabled) || 
            [1, "1", true, "true"].includes(dbData.show_save_contact) || 
            [1, "1", true, "true"].includes(dbData.showSaveContact)
        }));

        if (dbData.theme) {
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
            
            bgImage: (dbData.background === null || dbData.bg_image_url === null) ? "" : (bgImageUrlToLoad || prev.bgImage),
            bgImageFile: null
          }));
        }
      }
    } catch (error) {
      console.error("❌ ไม่พบข้อมูล Profile เดิม หรือเกิดข้อผิดพลาด:", error);
    }
  };

  const fetchMyBlocks = async () => {
    try {
      const response = await api.get(`/blocks`);
      console.log("ข้อมูลดิบจาก API:", response.data.data);

      if (response.status === 200) {
        const dbBlocks = response.data.data || [];

        // 🌟 1. สร้างตัวแปรมานับว่ามีบล็อกกี่อันที่โดนแอบลบทิ้ง
        let deletedCount = 0; 

        // ========================================================
        // 🧹 2. ระบบเทศบาลเก็บขยะ (คัดกรองบล็อกที่ไม่สมบูรณ์)
        // ========================================================
        const validBlocks = dbBlocks.filter((block) => {
          const blockType = String(block.type || '').toUpperCase();
          
          // แปลงข้อมูล content_data ให้พร้อมใช้งาน
          let contentData = block.content_data;
          if (typeof contentData === 'string') {
            try { contentData = JSON.parse(contentData); } catch (e) { contentData = []; }
          }

          let hasValidContent = false;
          const hasBlockTitle = block.title && String(block.title).trim() !== '';

          // 🛑 กฎข้อที่ 1: ถ้าเป็นบล็อกลิงก์ (LINK) "บังคับว่าต้องมี URL เท่านั้น"
          if (blockType === 'LINK') {
            if (Array.isArray(contentData) && contentData.length > 0) {
              hasValidContent = contentData.some(item => 
                (item.url && String(item.url).trim() !== '') || 
                (item.link && String(item.link).trim() !== '')
              );
            } else if (typeof contentData === 'object' && contentData !== null && !Array.isArray(contentData)) {
              hasValidContent = (contentData.url && String(contentData.url).trim() !== '') || 
                                (contentData.link && String(contentData.link).trim() !== '');
            }
          } 
          // 🟢 กฎข้อที่ 2: สำหรับบล็อกประเภทอื่นๆ (Shop, Slider, Image, Video) อนุโลมให้มีแค่ชื่อหรือรูปก็ได้
          else {
            if (Array.isArray(contentData) && contentData.length > 0) {
              hasValidContent = contentData.some(item => 
                (item.url && String(item.url).trim() !== '') || 
                (item.link && String(item.link).trim() !== '') || 
                (item.title && String(item.title).trim() !== '') || 
                (item.name && String(item.name).trim() !== '') ||   
                item.image || 
                item.imageUrl
              );
            } else if (typeof contentData === 'object' && contentData !== null && !Array.isArray(contentData)) {
              hasValidContent = (contentData.url && String(contentData.url).trim() !== '') || 
                                (contentData.link && String(contentData.link).trim() !== '') || 
                                (contentData.title && String(contentData.title).trim() !== '') || 
                                (contentData.name && String(contentData.name).trim() !== '') ||   
                                contentData.image || 
                                contentData.imageUrl;
            }

            // ถ้าไม่มีอะไรเลย แต่ตัวกล่องแม่มีการตั้งชื่อไว้ ก็ถือว่ารอด
            if (!hasValidContent && hasBlockTitle) {
              hasValidContent = true;
            }
          }

          // 🗑️ ถ้าไม่ผ่านกฎ (ไม่มีข้อมูลสำคัญ) ให้ลบทิ้งและนับยอดสะสมไว้
          if (!hasValidContent) {
            console.log(`🧹 ตรวจพบดราฟต์ที่ไม่สมบูรณ์ [${blockType}] -> ระบบกำลังลบทิ้ง`);
            api.delete(`/blocks/${block.id}`).catch(err => console.log("ลบดราฟต์ขยะไม่สำเร็จ:", err));
            
            deletedCount++; // 🌟 นับเพิ่มไป 1
            return false; // เตะทิ้ง ไม่ให้เข้ารอบไปแสดงผล
          }

          return true; // ข้อมูลครบถ้วน ให้ผ่านเข้ารอบได้
        });

        // 🌟 3. แจ้งเตือนผู้ใช้ถ้ามีการลบขยะเกิดขึ้น
        if (deletedCount > 0) {
          setTimeout(() => {
            alert(`⚠️ มีบล็อกจำนวน ${deletedCount} รายการ ถูกลบออกอัตโนมัติเนื่องจากคุณไม่ได้กรอกข้อมูลลิงก์ (URL) ครับ`);
          }, 500); // ดีเลย์นิดนึงให้หน้าเว็บโหลดเสร็จก่อนค่อยเด้งเตือน
        }

        // ========================================================
        // ⭐️ 2. นำบล็อกที่รอดจากการคัดกรอง มาจัดรูปแบบไอคอน
        // ========================================================
        const formattedBlocks = validBlocks.map((block) => {
          let iconName = "Link"; 

          if (block.type === "IMAGE") {
            iconName = "Image";
          }
          else if (block.type === "VIDEO") {
            const isTikTokTitle = block.title && block.title.toLowerCase().includes("tiktok");
            const isTikTokLink = Array.isArray(block.content_data) && block.content_data.some(item => {
              const videoStr = item.link || item.url || "";
              return videoStr.toLowerCase().includes("tiktok");
            });
            iconName = (isTikTokTitle || isTikTokLink) ? "TikTok" : "Youtube";
          }
          else if (block.type === "TIKTOK" || block.type === "TikTok") {
            iconName = "TikTok";
          }
          else if (block.type === "YOUTUBE" || block.type === "Youtube") {
            iconName = "Youtube";
          }
          else if (block.type === "SLIDER" || block.type === "Slider") {
            iconName = "Slider";
          }
          else if (block.type === "SHOP") {
            iconName = "Shop";
          }

          return {
            id: block.id,
            title: block.title || "",
            icon: iconName,
            visible: block.is_visible === 1 || block.is_visible === true,
            clicks: 0,
            items: block.content_data || []
          };
        });

        // 🌟 3. อัปเดตลงหน้าจอ
        setLinks(formattedBlocks);
        localStorage.setItem("bio_links", JSON.stringify(formattedBlocks));
      }
    } catch (error) {
      console.error("❌ ดึงข้อมูลบล็อกทั้งหมดไม่สำเร็จ:", error);
    }
  };
  // ⭐️ 5. ปรับ useEffect ให้รอดาวน์โหลดทั้ง Data และ Image จนครบ ค่อยปิดหน้า Loading ⭐️
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await Promise.all([fetchMyProfile(), fetchMyBlocks()]);
      setIsLoading(false); // ปิด Loading ตรงนี้ (เมื่อเสร็จหมดแล้ว)
    };
    
    initializeData();
  }, []);

  // บันทึกข้อมูลลง localStorage ทุกครั้งที่มีการเปลี่ยนแปลง
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

  const handleDeleteLink = async (id) => {
    const isConfirm = window.confirm("แน่ใจหรือไม่ว่าต้องการลบบล็อกนี้?");
    if (!isConfirm) return;

    try {
      // 🌟 Refactor: ลบ URL เต็มและ token ออก ใช้ api.delete ตรงๆ
      await api.delete(`/blocks/${id}`);

      const updatedLinks = links.filter((l) => l.id !== id);
      setLinks(updatedLinks);

      localStorage.setItem("bio_links", JSON.stringify(updatedLinks));
      
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("db_updated")); 

    } catch (error) {
      console.error("ลบข้อมูลไม่สำเร็จ:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูลที่ฐานข้อมูลค่ะ");
    }
  };

  const handleToggleVisibility = async (id) => {
    // 1. อัปเดต State ให้หน้าจอ (ปุ่มตา) เปลี่ยนทันที
    const updatedLinks = links.map((l) =>
      l.id === id ? { ...l, visible: !l.visible } : l
    );
    setLinks(updatedLinks);

    // 2. ซิงค์ข้อมูลลง LocalStorage ทันที ป้องกันบั๊กรูปหายตอนหน้าจอรีเฟรช
    localStorage.setItem("bio_links", JSON.stringify(updatedLinks));
    window.dispatchEvent(new Event("storage"));

    // 3. ยิง API ไปบอกหลังบ้านทันทีเลยว่า "ซ่อน/แสดง" บล็อกนี้ (ไม่ต้องรอกดปุ่มบันทึกใหญ่)
    try {
      const targetLink = updatedLinks.find(l => l.id === id);
      
      // 🌟 Refactor: ลบโค้ดเช็ค Token ออก และใช้ api.put ยิงตรงๆ ได้เลย
      await api.put(`/blocks/${id}`, { 
        is_visible: targetLink.visible ? 1 : 0 
      });
      console.log("อัปเดตสถานะการซ่อนบล็อกสำเร็จ!");
      
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ:", error);
    }
  };

  const handleAddNewBlock = async (type, defaultTitle, defaultIcon) => {
    try {
      // 1. แปลงค่า type ให้ตรงกับที่ Laravel กำหนดไว้
      let dbType = 'LINK';
      if (defaultIcon === "Slider" || type === "SLIDER") dbType = 'SLIDER';
      else if (defaultIcon === "Image") dbType = 'IMAGE';
      else if (defaultIcon === "Youtube" || defaultIcon === "TikTok") dbType = 'VIDEO';

      // 2. ⭐️ ให้หลังบ้าน (Laravel) สร้างบล็อกลง Database ของจริงก่อน
      const response = await api.post('/blocks', {
        type: dbType,
        title: defaultTitle,
        content_data: []
      });

      // 3. เอา ID จริงจาก Database (Primary Key) มาใช้งาน
      const newId = response.data.data.id;

      // 4. อัปเดตข้อมูลลง LocalStorage และ State ตามโค้ดเดิมของคุณ
      const newLink = {
        id:      newId, // 👈 ใช้ ID จริงที่ดึงมาจากหลังบ้านแล้ว
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
      
      // 5. นำทางไปยังหน้าแก้ไข พร้อมแนบ ID ของจริง
      if (dbType === "SLIDER") {
        navigate(`/edit-slider?id=${newId}`); 
      }
      else if (dbType === "IMAGE") {
        navigate(`/edit-shop?id=${newId}`); 
      } 
      else if (dbType === "VIDEO") {
        navigate(`/edit-video?platform=${defaultIcon}&id=${newId}`); 
      } 
      else {
        navigate(`/edit-link?id=${newId}`); 
      }

    } catch (error) {
      console.error("❌ สร้างบล็อกใหม่ใน Database ไม่สำเร็จ:", error);
      alert("ไม่สามารถสร้างบล็อกได้ ลองตรวจสอบการเชื่อมต่อหรือข้อมูลโปรไฟล์อีกครั้ง");
    }
  };
  
  const handleSave = async () => {
  try {
    const cleanProfileUsername = profile.username ? profile.username.trim() : "";

    if (!cleanProfileUsername) {
      alert("⚠️ บันทึกไม่ได้: กรุณากรอกช่อง username บนหน้าเว็บก่อนครับ!");
      return;
    }

    localStorage.setItem("bio_profile", JSON.stringify({ ...profile, username: cleanProfileUsername }));
    localStorage.setItem("bio_links", JSON.stringify(links));
    localStorage.setItem("bio_design", JSON.stringify(design));

const formData = new FormData();
formData.append("_method", "PUT"); 

// ... ข้อมูล Text อื่นๆ ส่งเหมือนเดิม ...
formData.append("username", cleanProfileUsername); 
formData.append("display_name", profile.name || "");
formData.append("bio", profile.bio || "");
formData.append("contact_name", profile.contactName || "");
formData.append("contact_phone", profile.phone || "");
formData.append("contact_email", profile.email || "");
formData.append("contact_company", profile.company || "");
formData.append("contact_job_title", profile.title || "");
formData.append("contact_website", profile.website || "");
formData.append("show_save_contact", profile.showSaveContact !== false ? 1 : 0);

// 🌟🌟🌟 ส่วนที่ต้องแก้: การส่งข้อมูลรูปภาพ 🌟🌟🌟

// 1. จัดการรูป Avatar
if (profile.avatarFile) {
    // ถ้ามีการเลือกไฟล์ใหม่ ให้ส่ง 'ตัวไฟล์' ไปที่ Key 'avatar'
    formData.append("avatar", profile.avatarFile);
}
// ส่ง URL ควบคู่ไปด้วย เพื่อให้ Backend รู้ว่าไม่ได้สั่งลบ (ถ้ากดลบจะเป็นค่าว่าง Backend จะได้ลบให้)
formData.append("avatar_url", profile.avatar || ""); 


// 2. จัดการรูป Cover
if (profile.coverFile) {
    formData.append("cover", profile.coverFile);
}
formData.append("cover_url", profile.cover || "");


// 3. จัดการรูป Background (ถ้ามี)
if (design.bgImageFile) { // สมมติว่าใน design state มีเก็บไฟล์ไว้
    formData.append("bg_image", design.bgImageFile);
}
formData.append("bg_image_url", design.bgImage || "");

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

    if (profile.avatarFile) {
      formData.append("avatar", profile.avatarFile);
    }
    if (profile.coverFile) {
      formData.append("cover", profile.coverFile);
    }
    if (design.bgImageFile) {
      formData.append("bg_image", design.bgImageFile);
    }

    // 🌟 ส่วนนี้ใช้ api.post ถูกต้องอยู่แล้วค่ะ
    const response = await api.post(
      `/profiles/${realUser.username}/test-update`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      alert("💾 บันทึกข้อมูลและรูปภาพลงฐานข้อมูล MySQL จริงสำเร็จเรียบร้อยแล้ว");
      
      setProfile(prev => ({ ...prev, username: cleanProfileUsername }));

      const updatedUser = { ...realUser, username: cleanProfileUsername };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      realUser.username = cleanProfileUsername; 

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

  // ⭐️ 6. เช็คสถานะ Loading ถ้ากำลังโหลดอยู่ จะแสดงหน้านี้บังไว้ ⭐️
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#eef0f8] flex flex-col items-center justify-center relative z-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin shadow-md"></div>
        <p className="mt-4 text-indigo-600 font-semibold animate-pulse">กำลังโหลดข้อมูลและรูปภาพ...</p>
      </div>
    );
  }

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
            <StatsPage links={links} /> // ไม่ต้องส่ง links หรือ stats เข้าไป เพราะ StatsPage เรียก API เองแล้ว
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

              <div>

                {activeTab === "info" && (
                  <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">

                    <ProfileEditor profile={profile} setProfile={setProfile} />

                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-bold text-slate-600 text-sm">
                        🔗 บล็อกทั้งหมด ({links.length})
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
                      <FaPlus size={16} /> 
                        เพิ่มรูปแบบ
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