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


export const chartData = [
  { name: 'Mon', views: 12000 },
  { name: 'Tue', views: 19000 },
  { name: 'Wed', views: 15000 },
  { name: 'Thu', views: 25000 },
  { name: 'Fri', views: 22000 },
  { name: 'Sat', views: 30000 },
  { name: 'Sun', views: 28000 },
];

export const topPages = [
  { id: 1, name: '@sarahstyle', link: 'bio.link/sarahstyle', views: '45.2K', growth: '+12%', color: 'bg-indigo-100' },
  { id: 2, name: 'Tech Reviews', link: 'bio.link/techrev', views: '32.1K', growth: '+8%', color: 'bg-orange-50' },
  { id: 3, name: 'Daily News', link: 'bio.link/news', views: '28.5K', growth: '-2%', color: 'bg-cyan-50' },
  { id: 4, name: 'My Store', link: 'bio.link/store', views: '15.9K', growth: '+24%', color: 'bg-emerald-50' },
];

export const inactiveUsers = [
  { id: 1, initial: 'JD', name: 'Jane Doe', handle: '@janedoe_shop', links: '4 ลิงก์', date: '12 เม.ย. 2026', daysAgo: '44 วันที่แล้ว', status: 'เสี่ยงต่อการเลิกใช้งาน', statusColor: 'bg-orange-500', iconColor: 'bg-red-500' },
  { id: 2, initial: 'JS', name: 'John Smith', handle: '@john_creator', links: '1 ลิงก์', date: '28 ก.พ. 2026', daysAgo: '87 วันที่แล้ว', status: 'ไม่มีความเคลื่อนไหว', statusColor: 'bg-red-500', iconColor: 'bg-emerald-500' },
  { id: 3, initial: 'B', name: 'Bake Me Happy', handle: '@bakemehappy_bkk', links: '0 ลิงก์', date: '20 เม.ย. 2026', daysAgo: '36 วันที่แล้ว', status: 'สมัครแล้วยังไม่ตั้งค่า', statusColor: 'bg-yellow-400', iconColor: 'bg-slate-300' },
];
