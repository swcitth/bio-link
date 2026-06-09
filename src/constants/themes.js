// ============================================================
// src/constants/themes.js
// ธีมสำเร็จรูปสำหรับ DesignEditor และ PhonePreview
// ============================================================

/**
 * THEME_LIST
 * แต่ละธีมมี:
 *  - id          → ใช้เป็น key
 *  - name        → ชื่อที่แสดง
 *  - previewBg   → Tailwind class สำหรับ preview thumbnail
 *  - previewItem → Tailwind class สำหรับ item ใน thumbnail
 *  - cfg         → design config ที่จะ merge เข้า design state
 */
export const THEME_LIST = [
  {
    id: "t1",
    name: "Modern White",
    previewBg: "bg-white",
    previewItem: "bg-gray-200",
    cfg: {
      textColor: "#1f2937",
      btnBgColor: "#f3f4f6",
      btnTextColor: "#1f2937",
      btnBorderColor: "transparent",
      btnRounded: "pill",
      btnStyle: "none",
      bgGradient: "linear-gradient(135deg, #e0e7ff 0%, #fdf2f8 100%)",
      bgImage: "",
    },
  },
  {
    id: "t2",
    name: "Midnight Dark",
    previewBg: "bg-slate-900",
    previewItem: "bg-slate-600",
    cfg: {
      textColor: "#f8fafc",
      btnBgColor: "#1e293b",
      btnTextColor: "#f8fafc",
      btnBorderColor: "#334155",
      btnRounded: "rounded",
      btnStyle: "outline",
      bgGradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
      bgImage: "",
    },
  },
  {
    id: "t3",
    name: "Sweet Pastel",
    previewBg: "bg-purple-100",
    previewItem: "bg-purple-300",
    cfg: {
      textColor: "#4c1d95",
      btnBgColor: "#ffffff",
      btnTextColor: "#7c3aed",
      btnBorderColor: "#ddd6fe",
      btnRounded: "pill",
      btnStyle: "shadow3d",
      bgGradient: "linear-gradient(135deg, #fce7f3 0%, #ede9fe 100%)",
      bgImage: "",
    },
  },
  {
    id: "t4",
    name: "Forest Green",
    previewBg: "bg-green-50",
    previewItem: "bg-green-400",
    cfg: {
      textColor: "#14532d",
      btnBgColor: "#22c55e",
      btnTextColor: "#ffffff",
      btnBorderColor: "transparent",
      btnRounded: "square",
      btnStyle: "none",
      bgGradient: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
      bgImage: "",
    },
  },
];
