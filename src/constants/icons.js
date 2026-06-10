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
  FaFacebook
} from "react-icons/fa";

import { FiImage } from "react-icons/fi";  

export const ICON_MAP = {
  Youtube: FaYoutube,
  Instagram: FaInstagram,
  ShoppingCart: FaShoppingCart,
  Facebook: FaFacebook,
  FileText: FaFileAlt,
  Link: FaLink,
  Music: FaMusic,
  TikTok: FaTiktok,  
  Image: FiImage,    
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
};

export const ICON_OPTIONS = Object.keys(ICON_MAP);