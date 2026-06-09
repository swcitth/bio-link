// ============================================================
// src/data/mockData.js
// ข้อมูลจำลอง (Mock Data) สำหรับพัฒนาและ Demo
// ในโปรเจกต์จริงจะแทนที่ด้วย API call
// ============================================================

/**
 * MOCK_PROFILE
 * ข้อมูลโปรไฟล์ผู้ใช้
 */
export const MOCK_PROFILE = {
  name: "มะระ ครีเอเตอร์",
  bio: "ติดตามผลงานของฉันได้ที่นี่ 👇",
  username: "mara.creator",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",

};

/**
 * MOCK_LINKS
 * รายการลิงก์ทั้งหมดของผู้ใช้
 * - id       → unique identifier
 * - title    → ชื่อที่แสดงบนปุ่ม
 * - url      → ปลายทาง
 * - icon     → key จาก ICON_MAP / ICON_EMOJI
 * - visible  → แสดง/ซ่อนบนหน้า public
 * - clicks   → จำนวนคลิก (mock stats)
 */
export const MOCK_LINKS = [
  {
    id: 1,
    title: "YouTube Channel",
    url: "https://youtube.com/@maracreator",
    icon: "Youtube",
    visible: true,
    clicks: 1240,
  },
  {
    id: 2,
    title: "Instagram",
    url: "https://instagram.com/mara.creator",
    icon: "Instagram",
    visible: true,
    clicks: 876,
  },
  {
    id: 3,
    title: "สั่งซื้อสินค้า (Shopee)",
    url: "https://shopee.co.th/mara",
    icon: "ShoppingCart",
    visible: true,
    clicks: 543,
  },
  {
    id: 4,
    title: "Portfolio Website",
    url: "https://maracreator.com",
    icon: "FileText",
    visible: false,
    clicks: 210,
  },
];

/**
 * MOCK_DESIGN
 * การตั้งค่าธีมและสไตล์เริ่มต้น
 */
export const MOCK_DESIGN = {
  textColor: "#1f2937",
  btnBgColor: "#ffffff",
  btnTextColor: "#1f2937",
  btnBorderColor: "#e5e7eb",
  btnRounded: "pill",    // 'square' | 'rounded' | 'pill'
  btnStyle: "none",      // 'none' | 'outline' | 'shadow3d'
  theme: "t1",
  bgGradient: "linear-gradient(135deg, #e0e7ff 0%, #fdf2f8 100%)",
  bgImage: "",           // base64 หรือ URL รูปพื้นหลัง
};

/**
 * MOCK_STATS
 * ข้อมูลสถิติสรุป (mock)
 */
export const MOCK_STATS = {
  totalViews: 4892,
  totalClicks: 2869,
  ctRate: "58.6%",
  topLink: "YouTube Channel",
  weeklyViews: [320, 480, 290, 610, 550, 720, 680], // จ-อา
};
