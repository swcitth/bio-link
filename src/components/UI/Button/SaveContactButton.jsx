import React from "react";
import api from "../../../api/axios";

const getTextColorBasedOnBg = (bgColor) => {
  if (!bgColor) return "#000000"; 
  let color = bgColor.replace("#", "");
  
  if (color.length === 3) color = color.split("").map(c => c + c).join("");
  if (color.length !== 6) return "#000000";
  
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  return yiq >= 128 ? "#000000" : "#ffffff"; 
};

// ⭐️ ฟังก์ชันตัวช่วย: แปลง WebP/PNG เป็น JPEG ขนาดเล็กสำหรับ iOS โดยเฉพาะ ⭐️
const processImageForVCF = (dataUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // ย่อขนาดไม่ให้เกิน 300px ป้องกัน iOS ดีดรูปทิ้งเพราะไฟล์ใหญ่ไป
      const MAX_SIZE = 300; 
      let width = img.width;
      let height = img.height;

      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      
      // เทพื้นหลังสีขาวทับ (ป้องกันพื้นหลังดำในกรณีที่เป็นรูปใส PNG/WebP)
      ctx.fillStyle = "#FFFFFF"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);

      // บังคับแปลงเป็น JPEG เท่านั้น
      const jpegBase64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
      resolve(jpegBase64);
    };
    img.onerror = () => reject(new Error("Failed to process image"));
    img.src = dataUrl;
  });
};

const SaveContactButton = ({ profileData = {}, design = {}, isCompact = false }) => {
  const profile = profileData || {};
  
  const trackSaveContact = async () => {
    try {
      let sessionId = sessionStorage.getItem("analytics_session");
      if (!sessionId) {
        sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem("analytics_session", sessionId);
      }

      // นุชเพิ่มส่วนนี้น้าเผื่อปอมาดูแล้วมันerror มาทุบนุชได้เลยย
      //ดึงค่า source จาก URL มารอไว้เพื่อเช็คว่าเป็น Admin กดหรือไม่
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get('source');

      // นุชปรับพาร์ทไปใช้ file api/axios naa
      await api.post(`/analytics/track/${profile.username}`, {
        session_id: sessionId, 
        block_id: 999999,
        referrer_url: document.referrer || "direct",
        source: source // ส่งตัวแปร source แนบไปให้หลังบ้านจัดการ
      });
    } catch (err) {
      console.log("Analytics Error:", err);
    }
  };
 
  // นุชจะแก้ส่วนนี้
  const handleSaveContact = async () => {
    trackSaveContact();

    let photoData = "";
    if (profile.avatar) {
      try {
        let dataUrlToProcess = profile.avatar;
        if (profile.avatar.startsWith("http")) {
          const filenameRaw = profile.avatar.split('/').pop();
          const filename = filenameRaw.split('?')[0]; 
          const response = await api.get(`/get-avatar/${filename}`, {
            responseType: 'blob' 
          });
          const blob = response.data; // ดึง blob ออกมาจาก response.data ของ axios
          dataUrlToProcess = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        }
        if (dataUrlToProcess) {
          const cleanJpegBase64 = await processImageForVCF(dataUrlToProcess);
          if (cleanJpegBase64) {
            photoData = `PHOTO;ENCODING=b;TYPE=JPEG:${cleanJpegBase64}`;
          }
        }
      } catch (e) {
        console.error("Error processing avatar image for VCF:", e);
      }
    }

    // ⭐️ 1. ดึงข้อมูลแบบเผื่อเรียกชื่อผิด ทั้งสั้นและยาว
    const phone = profile.phone || profile.contact_phone;
    const email = profile.email || profile.contact_email;
    const website = profile.website || profile.contact_website;
    const company = profile.company || profile.contact_company;
    const title = profile.title || profile.contact_job_title;
    const finalName = profile.contactName || profile.contact_name || profile.name || "ไม่มีชื่อ";

    let noteData = "";
    if (company || title) {
      const companyText = company ? `บริษัท: ${company}` : "";
      const titleText = title ? `ตำแหน่ง: ${title}` : "";
      const combinedNote = [companyText, titleText].filter(Boolean).join("  ");
      if (combinedNote) noteData = `NOTE:${combinedNote}`;
    }

    const websiteData = website ? `URL:${website}` : "";

    // ⭐️ 2. ใช้ตัวแปรใหม่ที่เราดึงมาด้านบน ใส่ลงใน vcardContent
    const vcardContent = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      // 1. บังคับให้มือถืออ่านข้อความทั้งหมดเป็น "ชื่อ" (ไม่ให้แอบตัดวงเล็บทิ้ง)
      `N:;${finalName};;;`,
      `FN:${finalName}`,
     
      // 2. ดึงข้อมูลบริษัทและตำแหน่งมาใส่ (ถ้ามี) มือถือจะจัด Layout ให้สวยงามอัตโนมัติ
      profile?.company ? `ORG:${profile.company}` : "",
      profile?.title ? `TITLE:${profile.title}` : "",
     
      noteData ? noteData.trim() : "",
      `TEL;TYPE=CELL:${phone || ""}`,
      `EMAIL:${email || ""}`,
      websiteData ? websiteData.trim() : "",
      photoData ? photoData.trim() : "",
      "END:VCARD"
    ].filter(Boolean).join("\r\n");

    const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${finalName.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ⭐️ 3. ดักซ่อนปุ่มโดยใช้ตัวแปรแบบเผื่อเรียกชื่อผิด
  const checkPhone = profile.phone || profile.contact_phone;
  const checkEmail = profile.email || profile.contact_email;
  const checkWebsite = profile.website || profile.contact_website;

  if (!checkPhone && !checkEmail && !checkWebsite) return null;

  const btnRadius = { square: isCompact ? "0px" : "0px", rounded: "14px", pill: "999px" }[design.btnRounded] || "999px";
  const btnBoxShadow = { none: "none", outline: "none", shadow3d: isCompact ? "3px 3px 0px rgba(0,0,0,0.8)" : "0px 4px 0px rgba(0,0,0,0.2)" }[design.btnStyle] || "none";

  const buttonBgColor = design.btnTextColor || "#000000"; 
  const buttonTextColor = getTextColorBasedOnBg(buttonBgColor); 
  const btnBorder = design.btnStyle !== "none" ? `2px solid ${buttonBgColor}` : "none";

  return (
    <button
      onClick={handleSaveContact}
      className="w-full flex items-center justify-center transition-transform hover:scale-[1.02] cursor-pointer mb-4"
      style={{
        padding: isCompact ? "8px 12px" : "16px",
        backgroundColor: buttonBgColor, 
        color: buttonTextColor,         
        borderRadius: btnRadius,
        border: btnBorder,
        boxShadow: btnBoxShadow,
        fontSize: isCompact ? "13px" : "16px",
        fontWeight: "bold"
      }}
    >
      <span className="mr-2"></span> Save contacts
    </button>
  );
};

export default SaveContactButton;