import React from 'react';

const BlockSlider = ({ items = [] }) => {
  // ⭐️ 1. ฟังก์ชันเช็ค URL ของรูปภาพ (แก้ปัญหารูปจากหลังบ้านไม่ขึ้น)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('data:') || imagePath.startsWith('http')) {
      return imagePath;
    }
    return `http://127.0.0.1:8000${imagePath}`; // เติม URL หลังบ้าน Laravel
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
        <div className="w-[70%] shrink-0 snap-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center aspect-square text-slate-400">
          <p className="text-sm font-medium">ยังไม่มีสินค้า</p>
          <p className="text-xs opacity-70 mt-1">เพิ่มสินค้าเพื่อดูพรีวิว</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
      {items.map((item, index) => {
        // เช็คว่ามีลิงก์ไหม ถ้าไม่มีให้ใส่ # ไปก่อน
        const itemLink = item.link || "#";

        return (
          // ⭐️ 2. เปลี่ยน <div> เป็น <a> เพื่อให้ครอบลิงก์คลิกได้
          <a 
            key={index} 
            href={itemLink}
            target={itemLink !== "#" ? "_blank" : "_self"} // เปิดแท็บใหม่ถ้ามีลิงก์จริง
            rel="noopener noreferrer"
            className="w-[70%] shrink-0 snap-center bg-white rounded-xl shadow-sm border border-slate-100 p-3 transition-transform hover:scale-[1.02] block cursor-pointer"
          >
            {/* เรียกใช้ getImageUrl ตรงนี้ */}
            <img 
              src={getImageUrl(item.image) || "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image"} 
              alt={item.name || `สินค้าชิ้นที่ ${index + 1}`} 
              className="w-full aspect-square object-cover rounded-lg bg-slate-100" 
            />
            
            <h4 className="font-bold mt-3 truncate text-slate-800">
              {item.name || "ไม่มีชื่อสินค้า"}
            </h4>
            
            <p className="text-xs text-slate-500 mt-1 truncate">
              {item.description || "ไม่มีรายละเอียด"}
            </p>
            
            <div className="text-sm font-bold text-indigo-600 mt-2">
              {item.price ? `฿${item.price}` : "฿0"}
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default BlockSlider;