import { 
  FaYoutube, FaInstagram, FaShoppingCart, FaFileAlt, FaLink, 
  FaMusic, FaTiktok, FaFacebook, FaGlobe, FaTwitter, FaLine, 
  FaEnvelope, FaPhone, FaGithub, FaLinkedin, FaMapMarkerAlt, FaShoppingBag 
} from "react-icons/fa";
import { FiImage } from "react-icons/fi"; 

export const ICON_MAP = {
  // 🟢 รายการทั่วไป
  Youtube: FaYoutube,
  Instagram: FaInstagram,
  ShoppingCart: FaShoppingCart,
  Facebook: FaFacebook,
  FileText: FaFileAlt,
  Link: FaLink,
  Music: FaMusic,
  TikTok: FaTiktok,  
  Image: FiImage,    

  // ⭐️ รายการที่อัปเดตให้ตรงกับ ID ในหน้า Modal เป๊ะๆ
  Globe: FaGlobe,          // ใช้ ID: 'Globe'
  Twitter: FaTwitter,      // ใช้ ID: 'Twitter'
  Message: FaLine,         // ใช้ ID: 'Message' (ซึ่งคือ Line/Chat)
  Mail: FaEnvelope,        // ใช้ ID: 'Mail'
  Phone: FaPhone,          // ใช้ ID: 'Phone'
  Github: FaGithub,        // ใช้ ID: 'Github'
  Linkedin: FaLinkedin,    // ใช้ ID: 'Linkedin'
  Map: FaMapMarkerAlt,     // ใช้ ID: 'Map'
  Shop: FaShoppingBag      // ใช้ ID: 'Shop'
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
  Globe: "🌐",
  Facebook: "📘",
  Twitter: "🐦",
  Message: "💬",
  Mail: "✉️",
  Phone: "📞",
  Github: "🐙",
  Linkedin: "💼",
  Map: "📍",
  Shop: "🛍️"
};

export const ICON_OPTIONS = Object.keys(ICON_MAP);