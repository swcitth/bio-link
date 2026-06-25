import React from 'react';
// ⭐️ นำเข้าไอคอนจากแหล่งเดียว (เน้น Font Awesome เพื่อให้สไตล์ตรงกัน)
import { FiX } from 'react-icons/fi';
import { 
  FaGlobe, FaFacebook, FaInstagram, FaTwitter, FaYoutube, 
  FaLine, FaEnvelope, FaPhone, FaGithub, FaLinkedin, 
  FaMapMarkerAlt, FaShoppingBag 
} from 'react-icons/fa';

// ⭐️ ICON_MAP ที่ตรงกับหน้าพรีวิวเป๊ะๆ
export const ICON_MAP = {
  Globe: FaGlobe,
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  Twitter: FaTwitter,
  Youtube: FaYoutube,
  Message: FaLine,       // ⭐️ ตรงกัน: ใช้ FaLine เหมือนที่หน้าพรีวิวใช้
  Mail: FaEnvelope,
  Phone: FaPhone,
  Github: FaGithub,
  Linkedin: FaLinkedin,
  Map: FaMapMarkerAlt,
  Shop: FaShoppingBag
};

// ⭐️ AVAILABLE_ICONS ที่อัปเดตให้ใช้ Icon ชุดเดียวกับ ICON_MAP
export const AVAILABLE_ICONS = [
  { id: 'Globe', icon: FaGlobe, name: 'Website' },
  { id: 'Facebook', icon: FaFacebook, name: 'Facebook' },
  { id: 'Instagram', icon: FaInstagram, name: 'Instagram' },
  { id: 'Twitter', icon: FaTwitter, name: 'Twitter' },
  { id: 'Youtube', icon: FaYoutube, name: 'YouTube' },
  { id: 'Message', icon: FaLine, name: 'Line/Chat' },    // ⭐️ ใช้ FaLine
  { id: 'Mail', icon: FaEnvelope, name: 'Email' },
  { id: 'Phone', icon: FaPhone, name: 'Phone' },
  { id: 'Github', icon: FaGithub, name: 'GitHub' },
  { id: 'Linkedin', icon: FaLinkedin, name: 'LinkedIn' },
  { id: 'Map', icon: FaMapMarkerAlt, name: 'Location' },
  { id: 'Shop', icon: FaShoppingBag, name: 'Shop' },
];

export const getIconComponent = (iconId) => {
  return ICON_MAP[iconId] || null;
};

export default function IconModal({ isOpen, onClose, onSelectIcon }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">เลือกไอคอน</h3>
          <button onClick={onClose} className="text-slate-400 p-1.5 rounded-lg hover:bg-slate-100">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-5 grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto">
          {AVAILABLE_ICONS.map((item) => {
            const IconComponent = item.icon; 
            return (
              <button
                key={item.id}
                onClick={() => onSelectIcon(item.id)}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-slate-100 bg-white hover:bg-indigo-50 transition-all"
              >
                {IconComponent ? <IconComponent size={28} className="text-slate-700" /> : null}
                <span className="text-[11px] font-medium text-slate-500">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}