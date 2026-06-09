// ============================================================
// src/components/DesignEditor.jsx
// แท็บ "ออกแบบ" — ปรับสี ปุ่ม ธีม และรูปพื้นหลัง
// ============================================================

import React, { useRef } from "react";
import { Sparkles, Type } from "lucide-react";
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

      {/* ─── Background Image Upload ─── */}
      <input
        type="file" accept="image/*" ref={bgRef}
        onChange={handleBgChange} className="hidden"
      />
      <div
        onClick={() => bgRef.current.click()}
        style={{
          backgroundImage: design.bgImage ? `url(${design.bgImage})` : design.bgGradient,
        }}
        className="relative h-28 rounded-2xl border-2 border-dashed border-violet-200 cursor-pointer overflow-hidden flex items-center justify-center bg-cover bg-center group"
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all" />
        <span className="relative z-10 text-sm font-bold text-slate-700 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-lg">
          🖼️ เปลี่ยนรูปพื้นหลัง
        </span>
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
              {/* Thumbnail */}
              <div
                className={`
                  w-full aspect-[3/4] rounded-xl border-2 p-2.5 flex flex-col items-center gap-2
                  transition-all duration-200
                  ${design.theme === theme.id
                    ? "border-indigo-500 shadow-md shadow-indigo-100"
                    : "border-slate-200 group-hover:border-indigo-300"
                  }
                `}
                style={{ backgroundColor: theme.cfg.bgGradient ? undefined : "#fff" }}
              >
                {/* mini avatar */}
                <div className={`w-8 h-8 rounded-full mt-1 ${theme.previewItem} opacity-60`} />
                {/* mini links */}
                <div className={`h-2 w-3/4 rounded-full ${theme.previewItem} opacity-80`} />
                <div className={`h-2.5 w-full rounded-md mt-auto ${theme.previewItem}`} />
                <div className={`h-2.5 w-full rounded-md ${theme.previewItem} opacity-70`} />
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
