import React, { useState } from 'react';
import { FiX, FiShare, FiDownload } from 'react-icons/fi';

export default function ShareModal({ isOpen, onClose, profile }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const username = profile?.username || "username";

  // ดึง Domain ปัจจุบันอัตโนมัติ
  const baseUrl = window.location.origin; 
  
  //นำ URL ปัจจุบัน มาต่อกับชื่อ Username
  const fullUrl = `${baseUrl}/${username}`;
  const shortUrl = `${baseUrl}/s/${username}`;
  
  // ใช้ API ฟรีในการเจน QR Code (ไม่ต้องลงไลบรารีเพิ่ม)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(fullUrl)}`;

  // ฟังก์ชันคัดลอกลิงก์
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); // กลับมาเป็นคำว่า "คัดลอก" หลังผ่านไป 2 วิ
  };

  // ฟังก์ชันโหลด QR Code
  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `QR_${username}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // กรณีบราวเซอร์บล็อคการโหลด ให้เปิดหน้าต่างใหม่แทน
      window.open(qrCodeUrl, '_blank');
    }
  };

  // ฟังก์ชันแชร์ (Native Web Share API)
  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile?.name || 'MyBioLink'}`,
        text: 'ดูโปรไฟล์และลิงก์ทั้งหมดของฉันได้ที่นี่!',
        url: fullUrl,
      }).catch(console.error);
    } else {
      alert('เบราว์เซอร์ของคุณไม่รองรับปุ่มแชร์นี้ โปรดใช้ปุ่มคัดลอกแทนครับ');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="bg-[#f6f7f6] w-full max-w-sm rounded-[2rem] p-6 relative flex flex-col items-center shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* ปุ่มปิด */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 w-8 h-8 bg-slate-200/60 hover:bg-slate-300 rounded-full flex items-center justify-center text-slate-600 transition-colors"
        >
          <FiX size={18} strokeWidth={2.5} />
        </button>

        <h2 className="text-lg font-bold text-slate-800 mb-6 mt-1 text-center w-full pr-8">
          แชร์ MyBioLink ของคุณ
        </h2>

        {/* ช่องลิงก์ที่ 1 */}
        <div className="w-full flex items-center bg-slate-100 rounded-xl px-4 py-3 mb-3 border border-slate-200">
          <span className="flex-1 text-sm text-slate-700 truncate mr-2">{fullUrl}</span>
          <button 
            onClick={() => handleCopy(fullUrl, 1)}
            className="text-indigo-600 font-bold text-sm shrink-0 hover:text-indigo-700 transition-colors"
          >
            {copiedIndex === 1 ? 'คัดลอกแล้ว!' : 'คัดลอก'}
          </button>
        </div>

        <p className="text-sm font-bold text-slate-600 mb-3">หรือ</p>

        {/* QR Code */}
        <div className="bg-white p-2 rounded-2xl mb-6 shadow-sm border border-slate-200">
          <img 
            src={qrCodeUrl} 
            alt="QR Code" 
            className="w-48 h-48 rounded-xl object-contain"
          />
        </div>

        {/* ปุ่ม Action ด้านล่าง */}
        <div className="flex gap-3 w-full">
          <button 
            onClick={handleDownloadQR}
            className="flex-1 bg-slate-200/80 hover:bg-slate-300 text-slate-800 font-bold py-3.5 rounded-2xl flex justify-center items-center gap-2 text-[13px] transition-colors"
          >
             รับ QR code
          </button>
          <button 
            onClick={handleNativeShare}
            className="flex-1 bg-slate-200/80 hover:bg-slate-300 text-slate-800 font-bold py-3.5 rounded-2xl flex justify-center items-center gap-2 text-[13px] transition-colors"
          >
            <FiShare size={16} /> แชร์ลิงก์
          </button>
        </div>

      </div>
    </div>
  );
}