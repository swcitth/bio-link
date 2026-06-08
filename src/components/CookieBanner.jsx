import React from 'react';
import { X } from 'lucide-react';

export default function CookieBanner({ showCookie, onAccept, onClose }) {
  return (
    <div
      className={`fixed bottom-0 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md w-full z-50 transition-all duration-500 transform ${showCookie ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}
    >
      <div className="bg-white/90 backdrop-blur-md p-6 sm:rounded-2xl shadow-2xl border border-slate-200/50 relative overflow-hidden">
        {/* Accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
          🍪 นโยบายคุกกี้
        </h4>
        <p className="text-sm text-slate-600 mb-5 leading-relaxed">
          เว็บไซต์นี้มีการใช้คุกกี้ โปรดยอมรับนโยบายคุกกี้เพื่อประสบการณ์การใช้บริการที่ดีที่สุดของท่าน ท่านสามารถศึกษาวิธีการตั้งค่าการควบคุมคุกกี้ของท่านได้ที่หน้า <a href="#" className="text-indigo-600 hover:underline font-medium">นโยบายความเป็นส่วนตัว</a>
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onAccept}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-colors"
          >
            ยินยอมทั้งหมด
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors"
          >
            ตั้งค่าคุกกี้
          </button>
        </div>
      </div>
    </div>
  );
}