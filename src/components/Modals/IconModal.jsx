import React from 'react';
// นำเข้าไอคอนจาก react-icons แบ่งตามหมวดหมู่
import { FiX, FiGlobe, FiMessageCircle, FiMail, FiPhone, FiMapPin, FiShoppingBag } from 'react-icons/fi';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaGithub, FaLinkedin } from 'react-icons/fa';


const ICON_MAP = {
  Globe: FiGlobe,
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  Twitter: FaTwitter,
  Youtube: FaYoutube,
  Message: FiMessageCircle,
  Mail: FiMail,
  Phone: FiPhone,
  Github: FaGithub,
  Linkedin: FaLinkedin,
  Map: FiMapPin,
  Shop: FiShoppingBag
};

export const AVAILABLE_ICONS = [
  { id: 'Globe', icon: FiGlobe, name: 'Website' },
  { id: 'Facebook', icon: FaFacebook, name: 'Facebook' },
  { id: 'Instagram', icon: FaInstagram, name: 'Instagram' },
  { id: 'Twitter', icon: FaTwitter, name: 'Twitter' },
  { id: 'Youtube', icon: FaYoutube, name: 'YouTube' },
  { id: 'Message', icon: FiMessageCircle, name: 'Line/Chat' },
  { id: 'Mail', icon: FiMail, name: 'Email' },
  { id: 'Phone', icon: FiPhone, name: 'Phone' },
  { id: 'Github', icon: FaGithub, name: 'GitHub' },
  { id: 'Linkedin', icon: FaLinkedin, name: 'LinkedIn' },
  { id: 'Map', icon: FiMapPin, name: 'Location' },
  { id: 'Shop', icon: FiShoppingBag, name: 'Shop' },
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
                {/* 👈 เอา strokeWidth ออก เพราะ react-icons บางหมวดไม่รองรับ */}
                {IconComponent ? <IconComponent size={28} /> : null}
                <span className="text-[11px] font-medium text-slate-500">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}