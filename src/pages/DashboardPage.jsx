// ============================================================
// src/pages/DashboardPage.jsx
// หน้าหลัก — เก็บ state ทั้งหมด + orchestrate layout
// ============================================================

import React, { useState } from "react";
import { Plus, ChevronRight } from "lucide-react";

// Components
import Navbar         from "../components/Navbar";
import ProfileEditor  from "../components/ProfileEditor";
import LinkItem       from "../components/LinkItem";
import AddBlockModal  from "../components/AddBlockModal";
import DesignEditor   from "../components/DesignEditor";
import PhonePreview   from "../components/PhonePreview";
import StatsPage      from "../components/StatsPage";

// Hooks
import { useDragSort } from "../hooks/useDragSort";

// Mock Data
import {
  MOCK_PROFILE,
  MOCK_LINKS,
  MOCK_DESIGN,
  MOCK_STATS,
} from "../data/mockData";

// ─────────────────────────────────────────────────────────────
const DashboardPage = () => {
  /* ── Global UI State ── */
  const [activeTab,   setActiveTab]   = useState("info");
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ── Domain State ── */
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [links,   setLinks]   = useState(MOCK_LINKS);
  const [design,  setDesign]  = useState(MOCK_DESIGN);

  /* ── Drag & Drop ── */
  const { handleDragStart, handleDragEnter, handleDragEnd } =
    useDragSort(links, setLinks);

  // ──────────────────────────────────────────────────────────
  // Link CRUD handlers
  // ──────────────────────────────────────────────────────────

  /** อัปเดตข้อมูลลิงก์ที่แก้ไข */
  const handleUpdateLink = (updatedLink) =>
    setLinks((prev) => prev.map((l) => (l.id === updatedLink.id ? updatedLink : l)));

  /** ลบลิงก์ */
  const handleDeleteLink = (id) =>
    setLinks((prev) => prev.filter((l) => l.id !== id));

  /** สลับ visible/hidden */
  const handleToggleVisibility = (id) =>
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );

  /** เพิ่มลิงก์ใหม่จาก AddBlockModal */
  const handleAddNewBlock = (type, defaultTitle, defaultIcon) => {
    const newId = links.length > 0 ? Math.max(...links.map((l) => l.id)) + 1 : 1;
    const newLink = {
      id:      newId,
      title:   defaultTitle,
      url:     "",
      icon:    defaultIcon,
      visible: true,
      clicks:  0,
    };
    setLinks((prev) => [...prev, newLink]);
    setIsModalOpen(false);
  };

  // ──────────────────────────────────────────────────────────
  // Save / Share (placeholder)
  // ──────────────────────────────────────────────────────────
  const handleSave  = () => alert("💾 บันทึกสำเร็จ!");
  const handleShare = () => {
    const url = `https://mybiolink.com/${profile.username || "username"}`;
    navigator.clipboard?.writeText(url);
    alert(`📋 คัดลอกลิงก์แล้ว: ${url}`);
  };

  // ──────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#eef0f8] font-sans overflow-x-hidden relative">

      {/* ─── Decorative Background Blobs ─── */}
      <BackgroundBlobs />

      {/* ─── App Shell ─── */}
      <div className="relative z-10">

        {/* Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSave={handleSave}
          onShare={handleShare}
        />

        {/* Add Block Modal */}
        <AddBlockModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddNewBlock}
        />

        {/* Main Content
            - แท็บ "ข้อมูล" และ "ออกแบบ": 2 คอลัมน์ (editor | phone preview)
            - แท็บ "สถิติ": 1 คอลัมน์เต็ม
        */}
        <main className="max-w-6xl mx-auto px-4 py-6">

          {activeTab === "stats" ? (
            /* ── Tab: สถิติ — full width ── */
            <StatsPage links={links} stats={MOCK_STATS} />
          ) : (
            /* ── Tab: ข้อมูล / ออกแบบ — 2-column layout ── */
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

              {/* ── Left Column: Editor ── */}
              <div>

                {/* ════ Tab: ข้อมูล ════ */}
                {activeTab === "info" && (
                  <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">

                    <ProfileEditor profile={profile} setProfile={setProfile} />

                    {/* Section header */}
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-bold text-slate-600 text-sm">
                        🔗 ลิงก์ทั้งหมด ({links.length})
                      </h2>
                      <span className="text-xs text-slate-400">ลากเพื่อเรียงลำดับ</span>
                    </div>

                    {/* Link List */}
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
                      />
                    ))}

                    {/* Empty state */}
                    {links.length === 0 && (
                      <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
                        ยังไม่มีลิงก์ กดปุ่มเพิ่มด้านล่างได้เลย
                      </div>
                    )}

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between mt-5">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg shadow-indigo-200 hover:opacity-90 transition-opacity"
                      >
                        <Plus size={16} /> เพิ่มรูปแบบ
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg shadow-indigo-200 hover:opacity-90 transition-opacity"
                      >
                        บันทึก <ChevronRight size={14} />
                      </button>
                    </div>

                  </div>
                )}

                {/* ════ Tab: ออกแบบ ════ */}
                {activeTab === "design" && (
                  <div>
                    <DesignEditor design={design} setDesign={setDesign} />
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3 rounded-full font-semibold text-sm shadow-lg shadow-indigo-200 hover:opacity-90 transition-opacity"
                      >
                        ✅ บันทึกการออกแบบ
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* ── Right Column: Phone Preview (แสดงทั้ง info และ design) ── */}
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

// ─────────────────────────────────────────────────────────────
// Background decorative blobs (แยกออกมาให้อ่านง่าย)
// ─────────────────────────────────────────────────────────────
const BackgroundBlobs = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute top-[-8%] left-[-8%] w-[420px] h-[420px] rounded-full bg-violet-300/20 blur-[100px]" />
    <div className="absolute top-[25%] right-[-8%] w-[360px] h-[360px] rounded-full bg-orange-200/20 blur-[90px]" />
    <div className="absolute bottom-[-8%] left-[18%] w-[500px] h-[500px] rounded-full bg-indigo-200/15 blur-[110px]" />
  </div>
);

export default DashboardPage;
