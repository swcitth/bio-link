// ============================================================
// src/components/DesignEditor.jsx
// แท็บ "ออกแบบ" — ปรับสี ปุ่ม ธีม และรูปพื้นหลัง
// ============================================================

import React, { useRef } from "react";
// 🟢 เพิ่ม Import ไอคอน UploadCloud และ Trash2
import { Sparkles, Type, UploadCloud, Trash2 } from "lucide-react";
import { THEME_LIST } from "../constants/themes";

/**
 * Props:
 * - design    : MOCK_DESIGN object
 * - setDesign : (updater) => void
 */
const DesignEditor = ({ design, setDesign }) => {
  const bgRef = useRef(null);

  /** อัปเดต field เดียว */
  const update = (field, value) =>
    setDesign((prev) => ({ ...prev, [field]: value }));

  /** โหลดรูปพื้นหลัง */
  const handleBgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => update("bgImage", reader.result);
    reader.readAsDataURL(file);
  };

  /** Apply ธีมสำเร็จรูป */
  const applyTheme = (themeId) => {
    const theme = THEME_LIST.find((t) => t.id === themeId);
    if (theme) setDesign((prev) => ({ ...prev, ...theme.cfg, theme: themeId }));
  };

  // ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-400">

      {/* ─── Background Image Upload (แบบกล่องเส้นประ) ─── */}
      <div className={sectionClass}>
        <SectionTitle icon={<Sparkles size={16} className="text-violet-500" />}>
          รูปภาพพื้นหลัง
        </SectionTitle>

        <div
          onClick={() => bgRef.current.click()}
          className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all bg-white relative overflow-hidden group"
        >
          {design.bgImage ? (
            <>
              {/* กรณีมีรูปพื้นหลังแล้ว */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-20 transition-opacity"
                style={{ backgroundImage: `url(${design.bgImage})` }}
              />
              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-white/90 p-3 rounded-full shadow-sm mb-3 text-indigo-600">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-semibold text-slate-800">คลิกเพื่อเปลี่ยนรูปพื้นหลังใหม่</p>
              </div>
            </>
          ) : (
            <>
              {/* กรณีที่ยังไม่มีรูปพื้นหลัง */}
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

        <input
          type="file" accept="image/*" ref={bgRef}
          onChange={handleBgChange} className="hidden"
        />

        {/* ปุ่มลบรูปพื้นหลัง (แสดงเมื่อมีรูป) */}
        {design.bgImage && (
          <div className="flex justify-end mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation(); // ป้องกันไม่ให้เด้งเปิดไฟล์ซ้ำตอนกดลบ
                update("bgImage", "");
              }}
              className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={16} />
              ลบรูปพื้นหลัง
            </button>
          </div>
        )}
      </div>

      {/* ─── Button Style ─── */}
      <div className={sectionClass}>
        <SectionTitle icon={<Sparkles size={16} className="text-violet-500" />}>
          สไตล์ปุ่มลิงก์
        </SectionTitle>

        {/* Color Pickers */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            ["btnBgColor",     "พื้นหลังปุ่ม"],
            ["btnTextColor",   "สีข้อความ"],
            ["btnBorderColor", "สีเส้นขอบ"],
          ].map(([field, label]) => (
            <div key={field}>
              <span className="block text-xs text-slate-400 font-semibold mb-1.5">{label}</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={design[field] === "transparent" ? "#ffffff" : design[field]}
                  onChange={(e) => update(field, e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-2 border-slate-200"
                />
                <span className="text-xs font-mono text-slate-500 hidden sm:block">
                  {design[field]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Rounded + Shadow Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Rounded */}
          <div>
            <span className="block text-xs text-slate-400 font-semibold mb-1.5">ความโค้งมน</span>
            <SegmentedControl
              value={design.btnRounded}
              onChange={(v) => update("btnRounded", v)}
              options={[
                { value: "square",  label: "เหลี่ยม" },
                { value: "rounded", label: "โค้ง"    },
                { value: "pill",    label: "แคปซูล"  },
              ]}
            />
          </div>

          {/* Button Style */}
          <div>
            <span className="block text-xs text-slate-400 font-semibold mb-1.5">สไตล์เงา</span>
            <SegmentedControl
              value={design.btnStyle}
              onChange={(v) => update("btnStyle", v)}
              options={[
                { value: "none",     label: "ธรรมดา" },
                { value: "outline",  label: "ขอบ"    },
                { value: "shadow3d", label: "3D"     },
              ]}
            />
          </div>

        </div>
      </div>

      {/* ─── Text Color ─── */}
      <div className={sectionClass}>
        <SectionTitle icon={<Type size={16} className="text-slate-400" />}>
          สีข้อความหลัก (ชื่อ + Bio)
        </SectionTitle>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={design.textColor}
            onChange={(e) => update("textColor", e.target.value)}
            className="w-10 h-10 rounded-xl cursor-pointer border-2 border-slate-200"
          />
          <input
            type="text"
            value={design.textColor}
            onChange={(e) => update("textColor", e.target.value)}
            className="w-28 border border-slate-200 focus:border-indigo-400 outline-none rounded-xl px-3 py-2 text-sm font-mono text-slate-700 transition-colors"
          />
          <div
            className="flex-1 h-10 rounded-xl border border-slate-100"
            style={{ backgroundColor: design.textColor }}
          />
        </div>
      </div>

      {/* ─── Preset Themes ─── */}
      <div className={sectionClass}>
        <SectionTitle icon={<span>✨</span>}>ธีมสำเร็จรูป</SectionTitle>
        <div className="grid grid-cols-4 gap-3">
          {THEME_LIST.map((theme) => (
            <div
              key={theme.id}
              onClick={() => applyTheme(theme.id)}
              className="cursor-pointer group"
            >
              {/* 🟢 Thumbnail อัปเดตใหม่ให้มีหน้าปกและรูปโปรไฟล์ */}
              <div
                className={`
                  relative w-full aspect-[3/4] rounded-xl border-2 flex flex-col items-center
                  overflow-hidden transition-all duration-200
                  ${design.theme === theme.id
                    ? "border-indigo-500 shadow-md shadow-indigo-100"
                    : "border-slate-200 group-hover:border-indigo-300"
                  }
                `}
                style={{ background: theme.cfg.bgGradient || theme.cfg.bgColor || "#fff" }}
              >
                {/* 1. จำลองหน้าปก (Cover) */}
                <div className={`w-full h-8 ${theme.previewItem} opacity-40`} />
                
                {/* 2. จำลองรูปโปรไฟล์ (Avatar) ขยับขึ้นไปทับขอบหน้าปกด้วย -mt-3.5 */}
                <div className={`w-7 h-7 rounded-full border-2 border-white -mt-3.5 z-10 ${theme.previewItem} opacity-80`} />
                
                {/* 3. จำลองชื่อ/Bio */}
                <div className={`h-1.5 w-3/5 rounded-full mt-2 ${theme.previewItem} opacity-60`} />
                
                {/* 4. จำลองปุ่มลิงก์ด้านล่าง */}
                <div className="w-full px-2.5 mt-auto mb-2.5 flex flex-col gap-1.5">
                  <div className={`h-2.5 w-full rounded-md ${theme.previewItem} opacity-90`} />
                  <div className={`h-2.5 w-full rounded-md ${theme.previewItem} opacity-70`} />
                </div>
              </div>
              <p className="text-center text-xs font-semibold text-slate-500 mt-1.5 leading-tight">
                {theme.name}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// ────────────────────────────────────────────────────────────
// Helper Components (เฉพาะภายใน DesignEditor)
// ────────────────────────────────────────────────────────────

const sectionClass =
  "bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-sm";

const SectionTitle = ({ icon, children }) => (
  <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4 text-sm">
    {icon}
    {children}
  </h3>
);

/** Tab-style segmented control */
const SegmentedControl = ({ value, onChange, options }) => (
  <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`
          flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150
          ${value === opt.value
            ? "bg-white text-indigo-700 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
          }
        `}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export default DesignEditor;