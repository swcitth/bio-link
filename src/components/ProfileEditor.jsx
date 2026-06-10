// ============================================================
// src/components/ProfileEditor.jsx
// แก้ไขข้อมูลโปรไฟล์: รูปปก, รูปโปรไฟล์, ชื่อ, bio, username
// ============================================================

import React, { useRef, useState } from "react";
// 🟢 เพิ่ม Import ไอคอน UploadCloud และ Trash2 สำหรับกล่องอัปโหลด
import { Pencil, Camera, UploadCloud, Trash2 } from "lucide-react";

/**
 * Props:
 * - profile    : { name, bio, username, avatar, cover }
 * - setProfile : (updater) => void
 */
const ProfileEditor = ({ profile, setProfile }) => {
  const avatarRef = useRef(null);
  const coverRef  = useRef(null);
  const [hoverAvatar, setHoverAvatar] = useState(false);

  /** แปลงไฟล์รูปเป็น base64 แล้วอัปเดต state */
  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
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

      {/* ─── Cover Image (แบบกล่องอัปโหลดเส้นประ) ─── */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">
          รูปหน้าปก
        </label>
        
        <div 
          onClick={() => coverRef.current.click()}
          className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all bg-white relative overflow-hidden group"
        >
          {profile.cover ? (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-20 transition-opacity" 
                style={{ backgroundImage: `url(${profile.cover})` }} 
              />
              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-white/90 p-3 rounded-full shadow-sm mb-3 text-indigo-600">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-semibold text-slate-800">คลิกเพื่อเปลี่ยนรูปหน้าปกใหม่</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-slate-50 p-3 rounded-full mb-3 text-slate-400 group-hover:text-indigo-500 transition-colors">
                <UploadCloud size={28} />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                ลากไฟล์มาวางที่นี่ หรือ <span className="text-indigo-600">คลิกเพื่ออัปโหลด</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">รองรับ JPG, PNG</p>
            </>
          )}
        </div>

        {/* ปุ่มลบรูปหน้าปก */}
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
              src={profile.avatar} alt="avatar"
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
              value={profile.name}
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
              value={profile.bio}
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