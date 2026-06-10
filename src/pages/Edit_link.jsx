import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import Header from "../components/Navbar/Header";
import ButtonAdd from "../components/Button/button_add";
import ButtonSave from "../components/Button/button_save";
import BlockLink from "../components/Blocklink";
import IconModal, { getIconComponent } from "../components/IconModal";

export default function EditLink() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const linkId = parseInt(searchParams.get("id"));

  const [headerText, setHeaderText] = useState("");
  const [items, setItems] = useState([]);

  // State สำหรับ Icon Modal
  const [isIconPopupOpen, setIsIconPopupOpen] = useState(false);
  const [activeLinkId, setActiveLinkId] = useState(null);

  // 1. โหลดข้อมูลเดิม (โครงสร้างเดียวกับ EditShop)
  useEffect(() => {
    const savedLinks = JSON.parse(localStorage.getItem("bio_links") || "[]");
    const currentLink = savedLinks.find((l) => l.id === linkId);

    if (currentLink) {
      setHeaderText(currentLink.title || "");
      setItems(currentLink.items || []);
    }
  }, [linkId]);

  // 2. เพิ่มลิงก์
  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      title: "",
      url: "",
      iconId: null,
      isVisible: true,
    };
    setItems((prev) => [...prev, newItem]);
  };

  // 3. ลบลิงก์
  const handleRemoveItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 4. ซ่อน/แสดง
  const handleToggleVisibility = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item
      )
    );
  };

  // 5. แก้ไขข้อมูลใน Input
  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // 6. ฟังก์ชันเปิดหน้าต่างเลือก Icon
  const openIconPopup = (itemId) => {
    setActiveLinkId(itemId);
    setIsIconPopupOpen(true);
  };

  // 7. ฟังก์ชันเมื่อกดเลือก Icon แล้ว
  const selectIcon = (iconId) => {
    if (activeLinkId) {
      handleItemChange(activeLinkId, "iconId", iconId); // ใช้ handleItemChange อัปเดตไอคอนได้เลย
    }
    setIsIconPopupOpen(false);
    setActiveLinkId(null);
  };

  // 8. Drag & Drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setItems(reorderedItems);
  };

  // 9. Save
  const handleSave = () => {
    const savedLinks = JSON.parse(localStorage.getItem("bio_links") || "[]");

    const updatedLinks = savedLinks.map((link) =>
      link.id === linkId
        ? {
            ...link,
            title: headerText,
            items: items,
          }
        : link
    );

    localStorage.setItem("bio_links", JSON.stringify(updatedLinks));
    
    // สำคัญ: สั่งให้ PhonePreview ในหน้า Dashboard อัปเดตตัวเองทันที
    window.dispatchEvent(new Event("storage"));

    alert("บันทึกข้อมูลสำเร็จ");
    navigate("/dd"); 
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-20 flex flex-col">
      <Header
        onLogoClick={() => navigate("/dd")}
        showBackButton={true}
      />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 pt-28 pb-20">
        
        {/* Header Block */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex overflow-hidden h-20 mb-8">
          <div className="bg-[#f1f5f9] w-48 px-4 flex flex-col justify-center border-r border-slate-200">
            <span className="font-bold text-slate-800 text-sm md:text-base">
              หัวข้อบล็อก
            </span>
            <span className="text-xs text-slate-500">
              โปรดระบุได้
            </span>
          </div>

          <div className="flex-1 px-4 flex items-center">
            <input
              type="text"
              placeholder="Your Channels"
              className="w-full text-slate-700 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300 text-lg font-medium"
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
            />
          </div>
        </div>

        {/* Links List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links-items-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-4"
              >
                {items.map((item, index) => (
                  <Draggable
                    key={item.id.toString()}
                    draggableId={item.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{ ...provided.draggableProps.style }}
                      >
                        <BlockLink
                          link={item} // ส่งข้อมูล item เข้าไป
                          IconComponent={getIconComponent(item.iconId)}
                          onOpenPopup={() => openIconPopup(item.id)} // ส่ง ID ของ item นี้ไปเพื่อเปิด Popup ถูกอัน
                          onRemove={() => handleRemoveItem(item.id)}
                          onToggleVisibility={() => handleToggleVisibility(item.id)}
                          onChange={(field, value) => handleItemChange(item.id, field, value)} // อัปเดตข้อมูล Input
                          dragHandleProps={provided.dragHandleProps}
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

        {/* Buttons */}
        <div className="mt-8 flex flex-col items-center gap-6">
          <ButtonAdd onClick={handleAddItem} text="เพิ่มลิงก์" />
          <ButtonSave onClick={handleSave} />
        </div>
      </main>

      {/* Icon Modal */}
      <IconModal
        isOpen={isIconPopupOpen}
        onClose={() => setIsIconPopupOpen(false)}
        onSelectIcon={selectIcon}
      />
    </div>
  );
}