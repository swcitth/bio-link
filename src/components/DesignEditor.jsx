// ============================================================
// src/components/DesignEditor.jsx
// รวมระบบ: ดักขนาดรูป 5MB, แสดงพรีวิวชัดเจนไม่มีขอบขุ่น, และปุ่มลบชิดขวา
// ============================================================

import React, { useRef } from "react";
import { Sparkles, Type, UploadCloud, Trash2 } from "lucide-react";
import { THEME_LIST } from "../constants/themes";

const FONT_OPTIONS = [
  { id: "kanit", name: "Kanit (ทันสมัย)", family: "'Kanit', sans-serif" },
  { id: "sarabun", name: "Sarabun (อ่านง่าย)", family: "'Sarabun', sans-serif" },
  { id: "mali", name: "Mali (ลายมือ)", family: "'Mali', cursive" },
  { id: "prompt", name: "Prompt (โมเดิร์น)", family: "'Prompt', sans-serif" },
];

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const DesignEditor = ({ design, setDesign, profile }) => {
  const bgRef = useRef(null);

  // เปลี่ยน theme เป็น custom เฉพาะตอนที่แก้สีพื้นหลัง
  const update = (field, value) => {
    setDesign((prev) => {
      const newState = { ...prev, [field]: value };
      
      // ถ้าเปลี่ยนสีพื้นหลัง ให้หลุดจากธีม (กลายเป็น custom)
      if (field === "bgColor") {
        newState.theme = "custom";
      }
      
      return newState;
    });
  };

  const handleBgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ระบบตรวจสอบขนาดรูปภาพไม่ให้เกิน 5MB
    const maxFileSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxFileSize) {
      alert("❌ รูปภาพมีขนาดใหญ่เกินไป! กรุณาเลือกรูปภาพที่มีขนาดไม่เกิน 5MB");
      e.target.value = ""; // เคลียร์ค่าไฟล์ที่เลือกมาทิ้งไป
      return;
    }

    // ถ้าขนาดผ่านเงื่อนไข (ไม่เกิน 5MB) ค่อยทำการแปลงรูป
    const reader = new FileReader();
    reader.onloadend = () => update("bgImage", reader.result);
    reader.readAsDataURL(file);
  };

  const applyTheme = (themeId) => {
    const theme = THEME_LIST.find((t) => t.id === themeId);
    if (theme) {
      setDesign((prev) => ({ 
        ...prev, 
        ...theme.cfg, 
        theme: themeId,
        bgColor: "", 
        coverColor: theme.cfg.coverColor || "", 
        textColor: theme.cfg.textColor || "#000000"
      }));
    }
  };

  const canChangeCoverColor = !(profile || {}).cover;

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-400">
      
      {/* ─── Background Image Upload ─── */}
      <div className={sectionClass}>
        <SectionTitle icon={<Sparkles size={16} className="text-violet-500" />}>รูปภาพพื้นหลัง</SectionTitle>
        
        {/* 🟢 UI อัปโหลดรูป (แก้ไขแผ่นใสให้เป็นสีดำอ่อนๆ รูปจะเนียนและสีสดใส 100%) */}
        <div 
          onClick={() => bgRef.current.click()} 
          className={`relative border-2 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden ${
            design.bgImage 
              ? "border-transparent shadow-sm" 
              : "border-dashed border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/50"
          }`}
          style={design.bgImage ? { backgroundImage: `url(${design.bgImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
        >
          {/* เอาสีขาวขุ่นออก เปลี่ยนเป็นสีดำโปร่งแสงบางๆ แทน */}
          {design.bgImage && <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />}

          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
              <UploadCloud size={24} className="text-indigo-500" />
            </div>
            
            {/* เปลี่ยนสีตัวหนังสือเป็นสีขาวและเอาขอบออก เพื่อให้เข้ากับรูปพื้นหลัง */}
            {design.bgImage ? (
              <p className="text-sm font-bold text-white drop-shadow-md">คลิกเพื่อเปลี่ยนรูปพื้นหลังใหม่</p>
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
        
        <input type="file" accept="image/*" ref={bgRef} onChange={handleBgChange} className="hidden" />
        
        {/* ปุ่มลบชิดขวา (justify-end) */}
        {design.bgImage && (
          <div className="flex justify-end mt-3">
            <button 
              onClick={() => update("bgImage", "")} 
              className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 font-semibold transition-colors"
            >
              <Trash2 size={16} /> ลบรูปพื้นหลัง
            </button>
          </div>
        )}
      </div>

      {/* ─── ปรับแต่งเอง (Custom) ─── */}
      <div className={sectionClass}>
        <SectionTitle icon={<Type size={16} className="text-violet-500" />}>ปรับแต่งเอง (Custom)</SectionTitle>
        
        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">เลือกฟอนต์ (Font Style)</label>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => update("font", f.id)}
              className={`p-3 border rounded-lg text-left transition-all ${design.font === f.id ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600 shadow-sm" : "border-slate-200 hover:border-slate-300"}`}
              style={{ fontFamily: f.family }}
            >
              <div className="text-sm font-bold">{f.name}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <ColorInput 
            label="สีพื้นหลัง" 
            value={design.bgColor} 
            onChange={(e) => update("bgColor", e.target.value)} 
          />
          <ColorInput 
            label="สีหน้าปก" 
            disabled={!canChangeCoverColor}
            disabledText="(มีรูปปก)"
            value={design.coverColor} 
            onChange={(e) => update("coverColor", e.target.value)} 
          />
          <ColorInput 
            label="สีตัวอักษร" 
            value={design.textColor} 
            onChange={(e) => update("textColor", e.target.value)} 
          />
        </div>
      </div>

      {/* ─── Button Style & Colors ─── */}
      <div className={sectionClass}>
        <SectionTitle icon={<Sparkles size={16} className="text-violet-500" />}>สไตล์ปุ่มลิงก์</SectionTitle>
        
        <div className="grid grid-cols-3 gap-3 mb-5">
          <ColorInput label="พื้นหลังปุ่ม" value={design.btnBgColor} onChange={(e) => update("btnBgColor", e.target.value)} />
          <ColorInput label="ตัวอักษรปุ่ม" value={design.btnTextColor} onChange={(e) => update("btnTextColor", e.target.value)} />
          <ColorInput label="เส้นขอบปุ่ม" value={design.btnBorderColor} onChange={(e) => update("btnBorderColor", e.target.value)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="block text-xs text-slate-400 font-semibold mb-1.5">ความโค้งมน</span>
            <SegmentedControl value={design.btnRounded} onChange={(v) => update("btnRounded", v)} options={[{ value: "square", label: "เหลี่ยม" }, { value: "rounded", label: "โค้ง" }, { value: "pill", label: "แคปซูล" }]} />
          </div>
          <div>
            <span className="block text-slate-400 font-semibold mb-1.5 text-xs">สไตล์เงา</span>
            <SegmentedControl value={design.btnStyle} onChange={(v) => update("btnStyle", v)} options={[{ value: "none", label: "ธรรมดา" }, { value: "outline", label: "ขอบ" }, { value: "shadow3d", label: "3D" }]} />
          </div>
        </div>
      </div>

      {/* ─── Preset Themes ─── */}
      <div className={sectionClass}>
        <SectionTitle icon={<span>✨</span>}>ธีมสำเร็จรูป</SectionTitle>
        <div className="grid grid-cols-4 gap-3">
          {THEME_LIST.map((theme) => (
            <div key={theme.id} onClick={() => applyTheme(theme.id)} className="cursor-pointer group">
              <div className={`relative w-full aspect-[3/4] rounded-xl border-2 overflow-hidden transition-all duration-300 ${design.theme === theme.id ? "border-indigo-500 shadow-md scale-105" : "border-slate-200 group-hover:border-indigo-300"}`} style={{ background: theme.cfg.bgGradient }}>
                <div className={`w-full h-8 ${theme.previewItem} opacity-40`} />
                <div className={`w-7 h-7 rounded-full border-2 border-white -mt-3.5 z-10 ${theme.previewItem} opacity-80 mx-auto shadow-sm`} />
              </div>
              <p className={`text-center text-xs mt-2 truncate font-medium transition-colors ${design.theme === theme.id ? "text-indigo-600" : "text-slate-500"}`}>{theme.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// Helper Components
// ---------------------------------------------------------

const sectionClass = "bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-sm";
const SectionTitle = ({ icon, children }) => (
  <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4 text-sm">{icon}{children}</h3>
);

// 🟢 แก้ไข ColorInput ให้มี Local State: สีเปลี่ยนทันที + ไม่ดีเลย์
const ColorInput = ({ label, disabled, disabledText, value, onChange }) => {
  // สร้าง Local State จำค่าสีชั่วคราวเพื่อให้ปุ่มสีเปลี่ยนทันทีที่ลาก
  const [localColor, setLocalColor] = React.useState(value || "#ffffff");

  // ถ้าค่าหลักเปลี่ยนจากภายนอก (เช่น กดเลือกธีม) ให้อัปเดต Local State ด้วย
  React.useEffect(() => {
    setLocalColor(value || "#ffffff");
  }, [value]);

  // สร้างฟังก์ชันส่งค่ากลับไปให้ Parent แบบหน่วงเวลา
  const debouncedOnChange = React.useCallback(
    debounce((newColor) => onChange({ target: { value: newColor } }), 80),
    [onChange]
  );

  const handleChange = (e) => {
    const newColor = e.target.value;
    setLocalColor(newColor); // อัปเดตสีที่ตัวปุ่ม Color Picker ทันที (ไม่ดีเลย์)
    debouncedOnChange(newColor); // สั่งอัปเดตระบบใหญ่แบบหน่วงเวลาเพื่อลดการค้าง
  };

  return (
    <div className={`flex flex-col gap-1.5 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      <span className="text-[11px] text-slate-400 font-semibold truncate">
        {label} {disabled && disabledText}
      </span>
      <label className={`flex items-center gap-2 p-1.5 border border-slate-200 rounded-xl bg-slate-50 transition-all ${!disabled && "hover:border-indigo-300 hover:bg-white cursor-pointer"}`}>
        <div className="relative w-6 h-6 rounded-full overflow-hidden shadow-sm border border-slate-200/50 shrink-0">
          <input
            type="color"
            disabled={disabled}
            value={localColor}
            onChange={handleChange}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] cursor-pointer"
          />
        </div>
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider truncate">
          {localColor.toUpperCase()}
        </span>
      </label>
    </div>
  );
};

const SegmentedControl = ({ value, onChange, options }) => (
  <div className="flex bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200/50">
    {options.map((opt) => (
      <button key={opt.value} onClick={() => onChange(opt.value)} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${value === opt.value ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
        {opt.label}
      </button>
    ))}
  </div>
);

export default DesignEditor;