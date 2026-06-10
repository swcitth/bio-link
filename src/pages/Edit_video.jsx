import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // 1. นำเข้า useSearchParams
import Header from '../components/Navbar/Header'; 
import ButtonAdd from '../components/Button/button_add'; 
import ButtonSave from '../components/Button/button_save'; 
import BlockVideo from '../components/BlockVideo'; 
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'; 

export default function EditVideo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const linkId = parseInt(searchParams.get("id")); // 2. ดึง ID มาจาก URL

  const [headerText, setHeaderText] = useState('');
  const [items, setItems] = useState([]);

  // 3. โหลดข้อมูลจาก localStorage เมื่อเปิดหน้า
  useEffect(() => {
    const savedLinks = JSON.parse(localStorage.getItem("bio_links") || "[]");
    const currentLink = savedLinks.find(l => l.id === linkId);
    
    if (currentLink) {
      setHeaderText(currentLink.title || '');
      // ถ้ามีข้อมูลใน items (กรณีมีหลายวิดีโอในบล็อกเดียว) ให้ดึงมา ถ้าไม่มีให้เริ่มที่ว่างๆ
      setItems(currentLink.items || [{ id: Date.now(), name: '', link: '', isVisible: true }]);
    }
  }, [linkId]);

  // 4. ฟังก์ชันบันทึกข้อมูล
  const handleSave = () => {
    const savedLinks = JSON.parse(localStorage.getItem("bio_links") || "[]");
    
    // อัปเดตข้อมูลของ link id นี้
    const updatedLinks = savedLinks.map(l => 
      l.id === linkId ? { ...l, title: headerText, items: items } : l
    );
    
    localStorage.setItem("bio_links", JSON.stringify(updatedLinks));
    alert("บันทึกการเปลี่ยนแปลงสำเร็จ!");
    navigate('/dd'); // รีไดเรกต์กลับหน้าหลัก
  };

  const handleAddItem = () => {
    const newItem = { id: Date.now(), name: '', link: '', isVisible: true };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id) => setItems(items.filter((item) => item.id !== id));

  const handleToggleVisibility = (id) => {
    setItems(items.map((item) => item.id === id ? { ...item, isVisible: !item.isVisible } : item));
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedItems = Array.from(items);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);
    setItems(reorderedItems);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-20 flex flex-col">
      <Header 
        onLogoClick={() => navigate('/dd')} 
        showBackButton={true} 
      />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 pt-28 pb-20">
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex overflow-hidden h-20 mb-8">
          <div className="bg-[#f1f5f9] w-40 md:w-48 px-4 flex flex-col justify-center border-r border-slate-200">
            <span className="font-bold text-slate-800 text-sm md:text-base">หัวข้อบล็อก</span>
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

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="video-items-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-4">
                {items.map((item, index) => (
                  <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} style={{ ...provided.draggableProps.style }}>
                        <BlockVideo
                          item={item}
                          onRemove={() => handleRemoveItem(item.id)}
                          onToggleVisibility={() => handleToggleVisibility(item.id)}
                          onChange={(field, value) => handleItemChange(item.id, field, value)}
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

        <div className="mt-8 flex flex-col items-center gap-6">
          <ButtonAdd onClick={handleAddItem} text="เพิ่มวิดีโอ" />
          <ButtonSave onClick={handleSave} />
        </div>
      </main>
    </div>
  );
}