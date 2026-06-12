import React from "react";

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

const SaveContactButton = ({ profile, design, isCompact }) => {
  const handleSaveContact = () => {
    let photoData = "";
    if (profile.avatar && profile.avatar.includes("base64,")) {
      const base64String = profile.avatar.split("base64,")[1];
      const mimeType = profile.avatar.substring(5, profile.avatar.indexOf(";"));
      let ext = mimeType.split("/")[1]?.toUpperCase() || "JPEG";
      if (ext === "JPG") ext = "JPEG";
      
      photoData = `\nPHOTO;ENCODING=b;TYPE=${ext}:${base64String}`;
    }

    let noteData = "";
    if (profile.company || profile.title) {
      const companyText = profile.company ? `บริษัท: ${profile.company}` : "";
      const titleText = profile.title ? `ตำแหน่ง: ${profile.title}` : "";
      const combinedNote = [companyText, titleText].filter(Boolean).join("  ");
      noteData = `\nNOTE:${combinedNote}`;
    }

    // ⭐️ พระเอกอยู่ตรงนี้: ดึง contactName มาใช้ก่อน ถ้าไม่มีค่อยดึง name ปกติ
    const finalName = profile.contactName || profile.name || "ไม่มีชื่อ";

    const vcardContent = `BEGIN:VCARD\nVERSION:3.0\nFN:${finalName}${noteData}\nTEL;TYPE=CELL:${profile.phone || ""}\nEMAIL:${profile.email || ""}${photoData}\nEND:VCARD`;

    const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    // เปลี่ยนชื่อไฟล์ดาวน์โหลดให้ตรงกับชื่อที่ตั้งไว้
    link.download = `${finalName}.vcf`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!profile.phone && !profile.email) return null;

  const btnRadius = { square: isCompact ? "6px" : "8px", rounded: "14px", pill: "999px" }[design.btnRounded] || "999px";
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