import React, { useRef, useState } from "react";
// นำเข้าไอคอน User เพิ่มเติมสำหรับช่องกรอกชื่อ
import { Pencil, Camera, UploadCloud, Trash2, Phone, Mail, Building, Briefcase, User, Globe } from "lucide-react";

// ⭐️ เพิ่มฟังก์ชันผู้ช่วยแปลง URL เพื่อให้ดึงรูปจาก Laravel ได้ถูกต้อง
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) return path;
  return `http://127.0.0.1:8000${path}`;
};

const ProfileEditor = ({ profile, setProfile }) => {
  const avatarRef = useRef(null);
  const coverRef  = useRef(null);
  const [hoverAvatar, setHoverAvatar] = useState(false);

  // ✨ อัปเดตฟังก์ชันจัดการรูปภาพให้รองรับ File Upload จริงๆ
  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

     const maxFileSize = 20 * 1024 * 1024
    if (file.size > maxFileSize) {
      alert("❌ รูปภาพมีขนาดใหญ่เกินไป! กรุณาเลือกรูปภาพที่มีขนาดไม่เกิน 5MB");
      e.target.value = ""; 
      return;
    }

    // 1. สร้าง URL พรีวิวชั่วคราวให้แสดงบนหน้าเว็บได้ทันที
    const previewUrl = URL.createObjectURL(file);

    // 2. เก็บทั้ง "ไฟล์จริง (สำหรับส่งไป Laravel)" และ "URL พรีวิว (สำหรับโชว์บนหน้าจอ)"
    setProfile((prev) => ({ 
      ...prev, 
      [`${field}File`]: file, // จะได้ตัวแปร avatarFile หรือ coverFile
      [field]: previewUrl     // จะได้ตัวแปร avatar หรือ cover (เอาไว้โชว์ในแท็บ img)
    }));
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl shadow-sm mb-5 overflow-hidden p-6">

      {/* Hidden File Inputs */}
      <input type="file" accept="image/*" ref={coverRef} onChange={(e) => handleImageChange(e, "cover")} className="hidden" />
      <input type="file" accept="image/*" ref={avatarRef} onChange={(e) => handleImageChange(e, "avatar")} className="hidden" />

      {/* Cover Image */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">รูปหน้าปก</label>
        <div 
          onClick={() => coverRef.current.click()}
          className={`relative border-2 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden ${
            (profile.cover || profile.cover_url) ? "border-transparent shadow-sm" : "border-dashed border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/50"
          }`}
          // ⭐️ ครอบด้วย getImageUrl() และเช็คตัวแปร cover_url
          style={(profile.cover || profile.cover_url) ? { backgroundImage: `url(${getImageUrl(profile.cover || profile.cover_url)})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
        >
          {(profile.cover || profile.cover_url) && <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />}
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
              <UploadCloud size={24} className="text-indigo-500" />
            </div>
            {(profile.cover || profile.cover_url) ? (
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
        {(profile.cover || profile.cover_url) && (
          <div className="flex justify-end mt-3">
            <button 
              // ✨ อัปเดตตอนกดลบรูปปก ให้ล้าง cover_url ของเดิมทิ้งด้วย
              onClick={(e) => { 
                e.stopPropagation(); 
                setProfile({ ...profile, cover: "", cover_url: "", coverFile: null }); 
              }} 
              className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={16} /> ลบรูปหน้าปก
            </button>
          </div>
        )}
      </div>

      <hr className="border-slate-100 mb-6" />

      {/* Avatar + Fields */}
      <div className="flex gap-5 items-start">
        {/* Avatar */}
        <div
          className="relative shrink-0 cursor-pointer z-10"
          onClick={() => avatarRef.current.click()}
          onMouseOver={() => setHoverAvatar(true)}
          onMouseOut={() => setHoverAvatar(false)}
        >
          <div className="w-[72px] h-[72px] rounded-full border-4 border-white shadow-lg overflow-hidden">
            {/* ⭐️ ครอบด้วย getImageUrl() และเช็คตัวแปร avatar_url */}
            <img
              src={getImageUrl(profile.avatar || profile.avatar_url) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
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
              placeholder="ชื่อที่แสดงบนเว็บ"
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

          {/* Username */}
          <div className="flex items-center gap-2 mt-1 mb-2">
            <span className="text-xs text-slate-400 font-medium shrink-0">mybiolink.com/</span>
            <input
              type="text"
              value={profile.username || ""}
              onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))}
              placeholder="username"
              className="border border-slate-200 focus:border-indigo-400 bg-slate-50 outline-none rounded-lg px-2.5 py-1.5 text-xs text-indigo-600 font-semibold w-full max-w-[160px] transition-colors"
            />
          </div>

          {/* ข้อมูลติดต่อ (เพิ่มช่องกรอก "ชื่อสำหรับการบันทึก") */}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <p className="text-xs font-bold text-slate-500">ข้อมูลติดต่อ (สำหรับปุ่ม Save Contact)</p>
            
            <div className="relative">
              <input
                type="text"
                value={profile.contactName || ""}
                onChange={(e) => setProfile((p) => ({ ...p, contactName: e.target.value }))}
                placeholder="ชื่อสำหรับการบันทึก (ถ้าไม่ใส่จะใช้ชื่อด้านบน)"
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 outline-none rounded-xl px-3.5 py-2.5 text-slate-700 text-sm pr-10 transition-colors"
              />
              <User size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <input
                type="tel"
                value={profile.phone || ""}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                placeholder="เบอร์โทรศัพท์"
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 outline-none rounded-xl px-3.5 py-2.5 text-slate-700 text-sm pr-10 transition-colors"
              />
              <Phone size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <input
                type="email"
                value={profile.email || ""}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                placeholder="อีเมล"
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 outline-none rounded-xl px-3.5 py-2.5 text-slate-700 text-sm pr-10 transition-colors"
              />
              <Mail size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* กลุ่มที่อยู่บรรทัดเดียวกัน (บริษัท / ตำแหน่ง) */}
            <div className="flex gap-3">
              <div className="relative w-1/2">
                <input
                  type="text"
                  value={profile.company || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))}
                  placeholder="ชื่อบริษัท"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 outline-none rounded-xl px-3.5 py-2.5 text-slate-700 text-sm pr-10 transition-colors"
                />
                <Building size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              
              <div className="relative w-1/2">
                <input
                  type="text"
                  value={profile.title || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))}
                  placeholder="ตำแหน่งงาน"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 outline-none rounded-xl px-3.5 py-2.5 text-slate-700 text-sm pr-10 transition-colors"
                />
                <Briefcase size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* ช่องกรอกเว็บไซต์ */}
            <div className="relative">
              <input
                type="url"
                value={profile.website || ""}
                onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
                placeholder="เว็บไซต์"
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 outline-none rounded-xl px-3.5 py-2.5 text-slate-700 text-sm pr-10 transition-colors"
              />
              <Globe size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

          </div>

          {/* สวิตช์เปิด-ปิด ปุ่ม Save Contact */}
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-700">แสดงปุ่ม Save Contact</p>
              <p className="text-xs text-slate-500">เปิดเพื่อแสดงปุ่มบันทึกรายชื่อบนหน้าโปรไฟล์</p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={profile.showSaveContact !== false} 
                onChange={(e) => setProfile((p) => ({ ...p, showSaveContact: e.target.checked }))}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;