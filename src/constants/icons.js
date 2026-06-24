import { 
  FaYoutube, 
  FaInstagram, 
  FaShoppingCart, 
  FaFileAlt, 
  FaLink, 
  FaMusic, 
  FaTrash, 
  FaGripVertical,
  FaTiktok,
  FaFacebook,
  // ⭐️ นำเข้าไอคอนใหม่ให้ครบตามหน้าต่างเลือกไอคอน
  FaGlobe,
  FaTwitter,
  FaLine,
  FaEnvelope,
  FaPhone,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaShoppingBag
} from "react-icons/fa";

import { FiImage } from "react-icons/fi";  

export const ICON_MAP = {
  // 🟢 รายการเดิมของคุณ
  Youtube: FaYoutube,
  Instagram: FaInstagram,
  ShoppingCart: FaShoppingCart,
  Facebook: FaFacebook,
  FileText: FaFileAlt,
  Link: FaLink,
  Music: FaMusic,
  TikTok: FaTiktok,  
  Image: FiImage,    

  // ⭐️ รายการที่เพิ่มใหม่ให้ตรงกับหน้าต่างเป๊ะๆ
  Website: FaGlobe,
  Twitter: FaTwitter,
  YouTube: FaYoutube, // ดักจับ YouTube ตัว T ใหญ่
  "Line/Chat": FaLine, // ถ้าชื่อมีเครื่องหมายทับ (/) ต้องใส่เครื่องหมายคำพูดครอบไว้
  Chat: FaLine,        // ⭐️ เพิ่มเพื่อให้เลือก Chat แล้วแสดงผลได้ถูกต้อง
  Email: FaEnvelope,
  Phone: FaPhone,
  GitHub: FaGithub,
  Git: FaGithub,       // ⭐️ เพิ่มเพื่อแก้ปัญหา Git ไม่แสดงผล
  LinkedIn: FaLinkedin,
  Location: FaMapMarkerAlt,
  Shop: FaShoppingBag
};

export const ICON_EMOJI = {
  Youtube: "🎬",
  Instagram: "📸",
  ShoppingCart: "🛒",
  FileText: "📄",
  Link: "🔗",
  Music: "🎵",
  TikTok: "📱",      
  Image: "🖼️",
  // ⭐️ เพิ่มอีโมจิเผื่อไว้ใช้งานด้วย
  Website: "🌐",
  Facebook: "📘",
  Twitter: "🐦",
  YouTube: "▶️",
  "Line/Chat": "💬",
  Chat: "💬",          // ⭐️ เพิ่มอีโมจิให้ Chat
  Email: "✉️",
  Phone: "📞",
  GitHub: "🐙",
  Git: "🐙",           // ⭐️ เพิ่มอีโมจิให้ Git
  LinkedIn: "💼",
  Location: "📍",
  Shop: "🛍️"
};

export const ICON_OPTIONS = Object.keys(ICON_MAP);