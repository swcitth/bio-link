// ============================================================
// src/components/ProfileEditor.jsx
// แก้ไขข้อมูลโปรไฟล์: รูปปก, รูปโปรไฟล์, ชื่อ, bio, username
// ============================================================

import React, { useRef, useState } from "react";
import { Pencil, Camera } from "lucide-react";

/**
 * Props:
 * - profile    : { name, bio, username, avatar, cover }
 * - setProfile : (updater) => void
 */
const ProfileEditor = ({ profile, setProfile }) => {
  const avatarRef = useRef(null);
  const coverRef  = useRef(null);
  const [hoverAvatar, setHoverAvatar] = useState(false);
  const [hoverCover,  setHoverCover]  = useState(false);

  /** แปลงไฟล์รูปเป็น base64 แล้วอัปเดต state */
  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfile((prev) => ({ ...prev, [field]: reader.result }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl shadow-sm mb-5 overflow-hidden">

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
      <div
        className="relative h-28 cursor-pointer overflow-hidden bg-gradient-to-br from-indigo-200 to-pink-200"
        onClick={() => coverRef.current.click()}
        onMouseOver={() => setHoverCover(true)}
        onMouseOut={() => setHoverCover(false)}
      >
        {profile.cover && (
          <img
            src={profile.cover} alt="cover"
            className="w-full h-full object-cover opacity-85"
          />
        )}
        {/* Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${hoverCover ? "bg-black/30" : "bg-black/0"}`}>
          <span className={`flex items-center gap-2 text-white text-xs font-semibold bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-sm transition-opacity duration-200 ${hoverCover ? "opacity-100" : "opacity-0"}`}>
            <Camera size={14} /> เปลี่ยนรูปหน้าปก
          </span>
        </div>
      </div>

      {/* ─── Avatar + Fields ─── */}
      <div className="flex gap-4 px-5 pb-5 items-start">

        {/* Avatar */}
        <div
          className="relative -mt-8 shrink-0 cursor-pointer z-10"
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
        <div className="flex-1 pt-2 flex flex-col gap-2.5">

          {/* Name */}
          <div className="relative">
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              placeholder="ชื่อของคุณ"
              className="w-full bg-white/70 border border-slate-200 focus:border-indigo-400 outline-none rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold text-sm pr-10 transition-colors"
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
              className="w-full bg-white/70 border border-slate-200 focus:border-indigo-400 outline-none rounded-xl px-3.5 py-2.5 text-slate-500 text-sm pr-10 transition-colors"
            />
            <Pencil size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Username / URL */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium shrink-0">mybiolink.com/</span>
            <input
              type="text"
              value={profile.username || ""}
              onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))}
              placeholder="username"
              className="border border-slate-200 focus:border-indigo-400 outline-none rounded-lg px-2.5 py-1.5 text-xs text-indigo-600 font-semibold w-40 transition-colors"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
