import React, { useRef, useState } from 'react';
import api, { getImageUrl } from "../../api/axios";

const BlockSlider = ({ block, items = [], handleBlockClick, design }) => {
  // 🌟 เพิ่ม Hooks สำหรับจัดการการลากเมาส์เลื่อน (Mouse Dragging)
  const sliderRef = useRef(null);
  const dragDistance = useRef(0); // ตัวแปรเก็บระยะทางว่าลากไปไกลแค่ไหน (เพื่อแยกแยะระหว่างการคลิกกับการลาก)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const getRadiusClass = (rounded) => {
    switch (rounded) {
      case 'square': return 'rounded-none';  
      case 'rounded': return 'rounded-lg';   
      case 'pill': return 'rounded-[24px]'; 
      default: return 'rounded-lg';
    }
  };

  // ==========================================
  // ฟังก์ชันควบคุมการทำงานของเมาส์
  // ==========================================
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragDistance.current = 0; // รีเซ็ตระยะทางทุกครั้งที่เริ่มกด
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftPos(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault(); // ป้องกันการคลุมดำข้อความเวลาลาก
    const currentX = e.pageX - sliderRef.current.offsetLeft;
    const walk = currentX - startX; 
    
    dragDistance.current = Math.abs(walk); // เก็บระยะทางการลาก
    sliderRef.current.scrollLeft = scrollLeftPos - (walk * 1.5); // คูณ 1.5 เพื่อให้เลื่อนลื่นและไวขึ้นเล็กน้อย
  };

  // ดักจับการคลิกลิงก์
  const handleItemClick = (e, itemLink) => {
    // 1. ถ้าเมาส์ลากไปไกลกว่า 5px ให้ถือว่าเป็นการ "เลื่อน" ไม่ใช่การ "คลิก"
    if (dragDistance.current > 5) {
      e.preventDefault(); 
      return;
    }
    
    // 🌟 2. ดักเพิ่มตรงนี้: ถ้าไม่มีลิงก์ (ค่าเป็น #) ให้ยกเลิกการคลิกทันที!
    if (itemLink === "#") {
      e.preventDefault();
      return;
    }
    
    // 3. ถ้ามีลิงก์และไม่ได้ลากเมาส์ ถึงจะยอมให้ทำงานต่อ
    if (handleBlockClick) {
      handleBlockClick(block.id, itemLink);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="w-[70%] shrink-0 snap-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center aspect-square text-slate-400">
          <p className="text-sm font-medium">ยังไม่มีสินค้า</p>
          <p className="text-xs opacity-70 mt-1">เพิ่มสินค้าเพื่อดูพรีวิว</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      // 🌟 นำฟังก์ชันเมาส์มาผูกกับ div ตัวแม่ และตั้งค่า Ref
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      // เปลี่ยน cursor เป็นรูปมือจับเวลาคลิกค้าง
      className={`flex overflow-x-auto gap-4 pb-4 hide-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x"}`}
    >
      {/* 🟢 แก้ไขตรงนี้: เพิ่ม .filter ก่อน .map */}
      {items
        .filter(item => item.isVisible !== false) 
        .map((item, index) => {
          // 🌟 1. ตรวจสอบว่ามีลิงก์จริงๆ หรือไม่ (ต้องไม่ใช่ค่าว่าง)
          const hasValidLink = item.link || item.url;
          const itemLink = hasValidLink ? (item.link || item.url) : null;

          // 🌟 2. ดึงเนื้อหาและสไตล์ออกมา เพื่อจะได้ไม่ต้องเขียนโค้ดซ้ำ 2 รอบ
          const baseClass = `w-[70%] shrink-0 snap-center bg-white shadow-sm border border-slate-100 p-3 transition-transform block ${getRadiusClass(design?.btnRounded)}`;
          
          const CardContent = (
            <>
              <img 
                src={getImageUrl(item.image) || "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image"} 
                alt={item.name || `สินค้าชิ้นที่ ${index + 1}`} 
                draggable="false" 
                className={`w-full aspect-square object-cover bg-slate-100 pointer-events-none ${getRadiusClass(design?.btnRounded)}`} 
              />
              <h4 className="font-bold mt-3 truncate text-slate-800 pointer-events-none">
                {item.name || "ไม่มีชื่อสินค้า"}
              </h4>
              <div className="text-sm font-bold text-indigo-600 mt-2 pointer-events-none">
                {item.price ? `฿${item.price}` : "฿0"}
              </div>
            </>
          );

          // 🌟 3. สลับแท็กตามเงื่อนไข (เด็ดขาด 100%)
          if (hasValidLink) {
            return (
              // 🟢 กรณีมีลิงก์: ใช้ <a> และบังคับเมาส์เป็น "รูปนิ้วชี้" เสมอ (cursor-pointer)
              <a 
                key={index} 
                href={itemLink}
                target="_blank"
                onClick={(e) => handleItemClick(e, itemLink)}
                rel="noopener noreferrer"
                draggable="false" 
                className={`${baseClass} cursor-pointer ${!isDragging ? "hover:scale-[1.02]" : ""}`}
              >
                {CardContent}
              </a>
            );
          } else {
            return (
              // 🔴 กรณีไม่มีลิงก์: ใช้ <div> และบังคับเมาส์เป็น "รูปลูกศร" (cursor-default)
              <div 
                key={index} 
                draggable="false" 
                className={`${baseClass} cursor-default`} 
              >
                {CardContent}
              </div>
            );
          }
        })}
    </div>
  );
};

export default BlockSlider;