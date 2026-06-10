// ============================================================
// src/components/ProfileEditor.jsx
// แก้ไขข้อมูลโปรไฟล์: รูปปก, รูปโปรไฟล์, ชื่อ, bio, username
// อัปเดต: ดักขนาดรูป 5MB, UI กล่องอัปโหลดแบบใหม่, พรีวิวรูปหน้าปก
// ============================================================

import React, { useRef, useState } from "react";
import { Pencil, Camera, UploadCloud, Trash2 } from "lucide-react";

const ProfileEditor = ({ profile, setProfile }) => {
  const avatarRef = useRef(null);
  const coverRef  = useRef(null);
  const [hoverAvatar, setHoverAvatar] = useState(false);

  /** แปลงไฟล์รูปเป็น base64 แล้วอัปเดต state พร้อมดักขนาด 5MB */
  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // 🟢 ตรวจสอบขนาดรูปภาพไม่ให้เกิน 5MB
    const maxFileSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxFileSize) {
      alert("❌ รูปภาพมีขนาดใหญ่เกินไป! กรุณาเลือกรูปภาพที่มีขนาดไม่เกิน 5MB");
      e.target.value = ""; // เคลียร์ไฟล์ออก
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setProfile((prev) => ({ ...prev, [field]: reader.result }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl shadow-sm mb-5 overflow-hidden p-6">

      {/* ─── Hidden File Inputs ─── */}
      <input
        type="file" accept="image/*" ref={coverRef}
        onChange={(e) => handleImageChange(e, "cover")}
        className="hidden"
      />
      <input
        type="file" accept="image/*" ref={avatarRef}
        onChange={(e) => handleImageChange(e, "avatar")}
        className="hidden"
      />

      {/* ─── Cover Image ─── */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">
          รูปหน้าปก
        </label>
        
        {/* 🟢 อัปเดต UI กล่องอัปโหลดให้เหมือน DesignEditor (แสดงรูป + แผ่นใสสีดำอ่อน) */}
        <div 
          onClick={() => coverRef.current.click()}
          className={`relative border-2 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden ${
            profile.cover 
              ? "border-transparent shadow-sm" 
              : "border-dashed border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/50"
          }`}
          style={profile.cover ? { backgroundImage: `url(${profile.cover})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
        >
          {/* แผ่นใสบังรูปภาพ (Overlay) สีดำอ่อนๆ เพื่อให้อ่านตัวหนังสือสีขาวได้ชัด */}
          {profile.cover && <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />}

          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
              <UploadCloud size={24} className="text-indigo-500" />
            </div>
            
            {profile.cover ? (
              <p className="text-sm font-bold text-white drop-shadow-md">คลิกเพื่อเปลี่ยนรูปหน้าปกใหม่</p>
            ) : (
              <>
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  ลากไฟล์มาวางที่นี่ หรือ <span className="text-indigo-600">คลิกเพื่ออัปโหลด</span>
                </p>
                <p className="text-xs text-slate-400">รองรับ JPG, PNG (ไม่เกิน 5MB)</p>
              </>
            )}
          </div>
        </div>

        {/* ปุ่มลบรูปหน้าปกชิดขวา */}
        {profile.cover && (
          <div className="flex justify-end mt-3">
            <button 
              onClick={(e) => {
                e.stopPropagation(); // ป้องกันไม่ให้เปิดหน้าต่างเลือกไฟล์ซ้ำตอนกดลบ
                setProfile({ ...profile, cover: "" });
              }} 
              className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={16} />
              ลบรูปหน้าปก
            </button>
          </div>
        )}
      </div>

      <hr className="border-slate-100 mb-6" />

      {/* ─── Avatar + Fields ─── */}
      <div className="flex gap-5 items-start">

        {/* Avatar */}
        <div
          className="relative shrink-0 cursor-pointer z-10"
          onClick={() => avatarRef.current.click()}
          onMouseOver={() => setHoverAvatar(true)}
          onMouseOut={() => setHoverAvatar(false)}
        >
          <div className="w-[72px] h-[72px] rounded-full border-4 border-white shadow-lg overflow-hidden">
            <img
              src={profile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Hover overlay */}
          {hoverAvatar && (
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
              <Camera size={18} className="text-white" />
            </div>
          )}
        </div>

        {/* Text Fields */}
        <div className="flex-1 flex flex-col gap-3">

          {/* Name */}
          <div className="relative">
            <input
              type="text"
              value={profile.name || ""}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              placeholder="ชื่อของคุณ"
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 outline-none rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold text-sm pr-10 transition-colors"
            />
            <Pencil size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Bio */}
          <div className="relative">
            <input
              type="text"
              value={profile.bio || ""}
              onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
              placeholder="คำอธิบายตัวตน..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 outline-none rounded-xl px-3.5 py-2.5 text-slate-500 text-sm pr-10 transition-colors"
            />
            <Pencil size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Username / URL */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-400 font-medium shrink-0">mybiolink.com/</span>
            <input
              type="text"
              value={profile.username || ""}
              onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))}
              placeholder="username"
              className="border border-slate-200 focus:border-indigo-400 bg-slate-50 outline-none rounded-lg px-2.5 py-1.5 text-xs text-indigo-600 font-semibold w-full max-w-[160px] transition-colors"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;