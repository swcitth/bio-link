import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'; 

import Header from '../components/Navbar/Header'; 
import ButtonAdd from '../components/Button/button_add';
import ButtonSave from '../components/Button/button_save';
import BlockLink from '../components/Blocklink';
import IconModal, { getIconComponent } from '../components/IconModal'; 

export default function EditLink() {
  const navigate = useNavigate();
  
  // State สำหรับจัดการลิงก์
  const [links, setLinks] = useState([
    { id: 1, title: '', url: '', iconId: null, isVisible: true }
  ]);
  
  // State สำหรับจัดการ Popup เลือกไอคอน
  const [isIconPopupOpen, setIsIconPopupOpen] = useState(false);
  const [activeLinkId, setActiveLinkId] = useState(null);

  // ฟังก์ชันเพิ่มลิงก์ใหม่ (ใช้ชื่อ handleAddItem ให้เป็นมาตรฐานเดียวกับหน้าอื่นๆ)
  const handleAddItem = () => {
    const newId = links.length > 0 ? Math.max(...links.map(l => l.id)) + 1 : 1;
    setLinks([...links, { id: newId, title: '', url: '', iconId: null, isVisible: true }]);
  };

  // ฟังก์ชันลบลิงก์
  const removeLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };
  
  // ฟังก์ชันซ่อน/แสดงลิงก์
  const toggleVisibility = (id) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, isVisible: !link.isVisible } : link
    ));
  };

  // ฟังก์ชันเปิด Popup เพื่อเลือกไอคอน
  const openIconPopup = (linkId) => {
    setActiveLinkId(linkId);
    setIsIconPopupOpen(true);
  };

  // ฟังก์ชันเลือกไอคอนและปิด Popup
  const selectIcon = (iconId) => {
    setLinks(links.map(link => 
      link.id === activeLinkId ? { ...link, iconId: iconId } : link
    ));
    setIsIconPopupOpen(false);
    setActiveLinkId(null);
  };

  // ฟังก์ชันจัดการหลังจากการลากวางเสร็จสิ้น (Drag and Drop)
  const handleDragEnd = (result) => {
    if (!result.destination) return; // ถ้าลากไปปล่อยนอกกรอบ ให้ยกเลิก

    const reorderedLinks = Array.from(links);
    const [movedItem] = reorderedLinks.splice(result.source.index, 1);
    reorderedLinks.splice(result.destination.index, 0, movedItem);

    setLinks(reorderedLinks);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      
      {/* ---------------- Navbar ---------------- */}
      <Header onLogoClick={() => navigate('/')} />

      {/* ---------------- Main Content ---------------- */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 pt-28 pb-20">
        
        {/* Header Block (ส่วนหัวข้อบล็อก) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex overflow-hidden h-20 mb-8">
          <div className="bg-[#f1f5f9] w-48 px-4 flex flex-col justify-center border-r border-slate-200">
            <span className="font-bold text-slate-800 text-sm md:text-base">หัวข้อบล็อก</span>
            <span className="text-xs text-slate-500">โปรดระบุได้</span>
          </div>
          <div className="flex-1 px-4 flex items-center">
            <input
              type="text"
              placeholder="Your Channels"
              className="w-full h-full text-slate-700 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300 text-lg font-medium"
            />
          </div>
        </div>

        {/* Links List Section (พร้อม Drag & Drop) */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links-list">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef} 
                className="flex flex-col gap-4"
              >
                {links.map((link, index) => (
                  <Draggable 
                    key={link.id.toString()} 
                    draggableId={link.id.toString()} 
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{ ...provided.draggableProps.style }}
                      >
                        {/* Component กล่องลิงก์ที่เราแยกไว้ */}
                        <BlockLink 
                          link={link}
                          IconComponent={getIconComponent(link.iconId)}
                          onOpenPopup={openIconPopup}
                          onToggleVisibility={toggleVisibility}
                          onRemove={removeLink}
                          dragHandleProps={provided.dragHandleProps} // 👈 ส่ง props นี้ไปให้ไอคอน GripVertical ใน BlockLink
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Add & Save Buttons (Component แยก) */}
        <div className="mt-8 flex flex-col items-center gap-6">
          <ButtonAdd 
            onClick={handleAddItem} 
            text="เพิ่มลิงก์" 
          />

          <ButtonSave 
            onClick={() => console.log("บันทึกการเปลี่ยนแปลง: ", links)} 
          />
        </div>

      </main>

      {/* ---------------- Icon Selection Popup (Modal) ---------------- */}
      <IconModal 
        isOpen={isIconPopupOpen} 
        onClose={() => setIsIconPopupOpen(false)} 
        onSelectIcon={selectIcon} 
      />
      
    </div>
  );
}