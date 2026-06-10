// ============================================================
// src/constants/themes.js
// เพิ่ม coverColor ให้ตรงปกกับรูป Preview
// ============================================================

export const THEME_LIST = [
  {
    id: "t1",
    name: "Modern White",
    previewBg: "bg-white",
    previewItem: "bg-gray-200",
    cfg: {
      textColor: "#111827",
      btnBgColor: "rgba(255, 255, 255, 0.7)",
      btnTextColor: "#111827",
      btnBorderColor: "#e5e7eb",
      btnRounded: "rounded",
      btnStyle: "outline",
      bgGradient: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      bgImage: "",
      coverColor: "#e5e7eb", // สีเทาอ่อน (gray-200)
    },
  },
  {
    id: "t2",
    name: "Midnight Dark",
    previewBg: "bg-slate-950",
    previewItem: "bg-slate-700",
    cfg: {
      textColor: "#f8fafc",
      btnBgColor: "rgba(255, 255, 255, 0.08)",
      btnTextColor: "#f8fafc",
      btnBorderColor: "rgba(255, 255, 255, 0.15)",
      btnRounded: "rounded",
      btnStyle: "outline",
      bgGradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
      bgImage: "",
      coverColor: "#1e293b", // สีน้ำเงินเข้ม (slate-800) ให้ดูมีมิติกับพื้นหลัง
    },
  },
  {
    id: "t3",
    name: "Sweet Pastel",
    previewBg: "bg-purple-100",
    previewItem: "bg-purple-300",
    cfg: {
      textColor: "#581c87",
      btnBgColor: "rgba(255, 255, 255, 0.6)",
      btnTextColor: "#7e22ce",
      btnBorderColor: "#e9d5ff",
      btnRounded: "pill",
      btnStyle: "none",
      bgGradient: "linear-gradient(135deg, #fce7f3 0%, #e0e7ff 100%)",
      bgImage: "",
      coverColor: "#d8b4fe", // สีม่วงพาสเทล (purple-300)
    },
  },
  {
    id: "t4",
    name: "Forest Green",
    previewBg: "bg-emerald-100",
    previewItem: "bg-emerald-500",
    cfg: {
      textColor: "#064e3b",
      btnBgColor: "rgba(255, 255, 255, 0.5)",
      btnTextColor: "#065f46",
      btnBorderColor: "#a7f3d0",
      btnRounded: "rounded",
      btnStyle: "outline",
      bgGradient: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
      bgImage: "",
      coverColor: "#6ee7b7", // สีเขียวมิ้นต์ (emerald-300)
    },
  },
  {
    id: "t5",
    name: "Sunset Orange",
    previewBg: "bg-orange-100",
    previewItem: "bg-orange-400",
    cfg: {
      textColor: "#7c2d12",
      btnBgColor: "rgba(255, 255, 255, 0.5)",
      btnTextColor: "#9a3412",
      btnBorderColor: "#fed7aa",
      btnRounded: "pill",
      btnStyle: "none",
      bgGradient: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
      bgImage: "",
      coverColor: "#fb923c", // สีส้ม (orange-400)
    },
  },
  {
    id: "t6",
    name: "Ocean Blue",
    previewBg: "bg-sky-100",
    previewItem: "bg-blue-500",
    cfg: {
      textColor: "#1e3a8a",
      btnBgColor: "rgba(255, 255, 255, 0.5)",
      btnTextColor: "#1e40af",
      btnBorderColor: "#bfdbfe",
      btnRounded: "rounded",
      btnStyle: "outline",
      bgGradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
      bgImage: "",
      coverColor: "#93c5fd", // สีฟ้าสว่าง (blue-300)
    },
  },
  {
    id: "t7",
    name: "Rose Gold",
    previewBg: "bg-pink-100",
    previewItem: "bg-pink-400",
    cfg: {
      textColor: "#881337",
      btnBgColor: "rgba(255, 255, 255, 0.5)",
      btnTextColor: "#be123c",
      btnBorderColor: "#fecdd3",
      btnRounded: "pill",
      btnStyle: "outline",
      bgGradient: "linear-gradient(135deg, #fff1f2 0%, #fce7f3 100%)",
      bgImage: "",
      coverColor: "#f472b6", // สีชมพู (pink-400)
    },
  },
  {
    id: "t8",
    name: "Neon Dark",
    previewBg: "bg-black",
    previewItem: "bg-cyan-400",
    cfg: {
      textColor: "#f0fdff",
      btnBgColor: "rgba(6, 182, 212, 0.1)",
      btnTextColor: "#22d3ee",
      btnBorderColor: "#22d3ee",
      btnRounded: "rounded",
      btnStyle: "outline",
      bgGradient: "linear-gradient(135deg, #020617 0%, #083344 100%)",
      bgImage: "",
      coverColor: "#164e63", // สีเขียวอมฟ้าเข้ม (cyan-900) ให้หน้าปกดูดาร์กแต่มีสีสัน
    },
  },
];