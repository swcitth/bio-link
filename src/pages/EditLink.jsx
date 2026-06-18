import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";

import Header from "../components/Layout/Header";
import ButtonAdd from "../components/UI/Button/ButtonAdd";
import ButtonSave from "../components/UI/Button/ButtonSave";
import BlockLink from "../components/Blocks/Blocklink";
import IconModal, { getIconComponent } from "../components/Modals/IconModal";

// เปลี่ยนเป็น URL ของ Backend คุณ
const API_BASE_URL = "http://localhost:5000/api"; 

export default function EditLink() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const linkId = parseInt(searchParams.get("id"));

  const [isIconPopupOpen, setIsIconPopupOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null); // ใช้ Index แทน ID เพื่อให้อัปเดตได้ง่าย

  // 1. ตั้งค่า React Hook Form
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      headerText: "",
      items: []
    }
  });

  // 2. ตั้งค่า useFieldArray สำหรับจัดการ Array แบบ Drag & Drop
  const { fields, append, remove, move, update } = useFieldArray({
    control,
    name: "items"
  });

  // 3. ดึงข้อมูลจาก API (GET)
  useEffect(() => {
    const fetchLinkData = async () => {
      if (!linkId) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/blocks/${linkId}`);
        // สมมติว่า Backend ส่งกลับมาในรูปแบบ { title: '...', items: [...] }
        reset({
          headerText: response.data.title || "",
          items: response.data.items || []
        });
      } catch (error) {
        console.error("ดึงข้อมูลไม่สำเร็จ:", error);
      }
    };
    fetchLinkData();
  }, [linkId, reset]);

  // 4. เพิ่มลิงก์ใหม่เข้า Form
  const handleAddItem = () => {
    append({ 
      title: "", 
      url: "", 
      iconId: null, 
      isVisible: true,
      isNew: true // Flag ไว้เผื่อ Backend ต้องการรู้ว่าเป็นของใหม่
    });
  };

  // 5. ลบลิงก์ (ยิง API ทันทีเฉพาะตัวที่มี ID ในฐานข้อมูลแล้ว)
  const handleRemoveItem = async (index, itemId) => {
    const confirmDelete = window.confirm("คุณต้องการลบลิงก์นี้ใช่หรือไม่?");
    if (!confirmDelete) return;

    try {
      // ถ้ารายการนั้นมี ID จาก Database ให้ยิง API ลบเส้นเดียว
      if (itemId && !fields[index].isNew) {
        await axios.delete(`${API_BASE_URL}/links/${itemId}`);
      }
      // ลบออกจากหน้าจอ UI
      remove(index); 
    } catch (error) {
      console.error("ลบข้อมูลไม่สำเร็จ:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  // 6. ซ่อน/แสดง
  const handleToggleVisibility = (index) => {
    const currentItem = fields[index];
    update(index, { ...currentItem, isVisible: !currentItem.isVisible });
  };

  // 7. จัดการ Popup Icon
  const openIconPopup = (index) => {
    setActiveIndex(index);
    setIsIconPopupOpen(true);
  };

  const selectIcon = (iconId) => {
    if (activeIndex !== null) {
      const currentItem = fields[activeIndex];
      update(activeIndex, { ...currentItem, iconId: iconId });
    }
    setIsIconPopupOpen(false);
    setActiveIndex(null);
  };

  // 8. Drag & Drop (ใช้คำสั่ง move ของ react-hook-form)
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  // 9. Submit Form (บันทึกข้อมูลทั้งหมด PUT / POST)
  const onSubmit = async (data) => {
   
    try {
      // ส่ง payload ไปอัปเดตที่ Backend รวดเดียว
      const payload = {
        title: data.headerText,
        items: data.items.map((item, index) => ({
          ...item,
          order: index // แนบลำดับที่จัดเรียงใหม่ไปด้วย
        }))
      };

 console.log(payload);
      // await axios.put(`${API_BASE_URL}/blocks/${linkId}`, payload);
      
      alert("บันทึกข้อมูลสำเร็จ");
      navigate("/dd");
    } catch (error) {
      console.error("บันทึกข้อมูลไม่สำเร็จ:", error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-20 flex flex-col">
      <Header onLogoClick={() => navigate("/dd")} showBackButton={true} />

      {/* ห่อฟอร์มทั้งหมดด้วย <form> เพื่อให้ react-hook-form ทำงาน */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 w-full max-w-3xl mx-auto px-4 pt-28 pb-20">
        
        {/* Header Block */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex overflow-hidden h-20 mb-8">
          <div className="bg-[#f1f5f9] w-48 px-4 flex flex-col justify-center border-r border-slate-200">
            <span className="font-bold text-slate-800 text-sm md:text-base">หัวข้อบล็อก</span>
          </div>
          <div className="flex-1 px-4 flex items-center">
            <input
              type="text"
              placeholder="Your Channels"
              {...register("headerText")} // ผูกกับ react-hook-form
              className="w-full text-slate-700 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300 text-lg font-medium"
            />
          </div>
        </div>

        {/* Links List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links-items-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-4">
                {fields.map((item, index) => (
                  <Draggable 
                    key={item.id} // สำคัญ: ต้องใช้ field.id ที่ hook form สร้างให้ เพื่อป้องกันบั๊ก DND
                    draggableId={item.id} 
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{ ...provided.draggableProps.style }}
                      >
                        <BlockLink
                          item={item}
                          index={index}
                          register={register} 
                          IconComponent={getIconComponent(item.iconId)}
                          onOpenPopup={() => openIconPopup(index)}
                          onRemove={() => handleRemoveItem(index, item.id)} // ลบโดยอ้างอิง index
                          onToggleVisibility={() => handleToggleVisibility(index)}
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
          <ButtonAdd type="button" onClick={handleAddItem} text="เพิ่มลิงก์" />
          {/* เปลี่ยนประเภทปุ่มเป็น Submit */}
          <ButtonSave type="submit" /> 
        </div>
      </form>

      {/* Icon Modal */}
      <IconModal
        isOpen={isIconPopupOpen}
        onClose={() => setIsIconPopupOpen(false)}
        onSelectIcon={selectIcon}
      />
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// import Header from "../components/Layout/Header";
// import ButtonAdd from "../components/UI/Button/ButtonAdd";
// import ButtonSave from "../components/UI/Button/ButtonSave";
// import BlockLink from "../components/Blocks/Blocklink";
// import IconModal, { getIconComponent } from "../components/Modals/IconModal";

// export default function EditLink() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const linkId = parseInt(searchParams.get("id"));

//   const [headerText, setHeaderText] = useState("");
//   const [items, setItems] = useState([]);

//   // State สำหรับ Icon Modal
//   const [isIconPopupOpen, setIsIconPopupOpen] = useState(false);
//   const [activeLinkId, setActiveLinkId] = useState(null);

//   // 1. โหลดข้อมูลเดิม (โครงสร้างเดียวกับ EditShop)
//   useEffect(() => {
//     const savedLinks = JSON.parse(localStorage.getItem("bio_links") || "[]");
//     const currentLink = savedLinks.find((l) => l.id === linkId);

//     if (currentLink) {
//       setHeaderText(currentLink.title || "");
//       setItems(currentLink.items || []);
//     }
//   }, [linkId]);

//   // 2. เพิ่มลิงก์
//   const handleAddItem = () => {
//     const newItem = {
//       id: Date.now(),
//       title: "",
//       url: "",
//       iconId: null,
//       isVisible: true,
//     };
//     setItems((prev) => [...prev, newItem]);
//   };

//   // 3. ลบลิงก์
//   const handleRemoveItem = (id) => {
//     setItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   // 4. ซ่อน/แสดง
//   const handleToggleVisibility = (id) => {
//     setItems((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, isVisible: !item.isVisible } : item
//       )
//     );
//   };

//   // 5. แก้ไขข้อมูลใน Input
//   const handleItemChange = (id, field, value) => {
//     setItems((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, [field]: value } : item
//       )
//     );
//   };

//   // 6. ฟังก์ชันเปิดหน้าต่างเลือก Icon
//   const openIconPopup = (itemId) => {
//     setActiveLinkId(itemId);
//     setIsIconPopupOpen(true);
//   };

//   // 7. ฟังก์ชันเมื่อกดเลือก Icon แล้ว
//   const selectIcon = (iconId) => {
//     if (activeLinkId) {
//       handleItemChange(activeLinkId, "iconId", iconId); // ใช้ handleItemChange อัปเดตไอคอนได้เลย
//     }
//     setIsIconPopupOpen(false);
//     setActiveLinkId(null);
//   };

//   // 8. Drag & Drop
//   const handleDragEnd = (result) => {
//     if (!result.destination) return;

//     const reorderedItems = Array.from(items);
//     const [movedItem] = reorderedItems.splice(result.source.index, 1);
//     reorderedItems.splice(result.destination.index, 0, movedItem);

//     setItems(reorderedItems);
//   };

//   // 9. Save
//   const handleSave = () => {
//     const savedLinks = JSON.parse(localStorage.getItem("bio_links") || "[]");

//     const updatedLinks = savedLinks.map((link) =>
//       link.id === linkId
//         ? {
//             ...link,
//             title: headerText,
//             items: items,
//           }
//         : link
//     );

//     localStorage.setItem("bio_links", JSON.stringify(updatedLinks));
    
//     // สำคัญ: สั่งให้ PhonePreview ในหน้า Dashboard อัปเดตตัวเองทันที
//     window.dispatchEvent(new Event("storage"));

//     alert("บันทึกข้อมูลสำเร็จ");
//     navigate("/dd"); 
//   };

//   return (
//     <div className="min-h-screen bg-[#f8f9fa] font-sans pb-20 flex flex-col">
//       <Header
//         onLogoClick={() => navigate("/dd")}
//         showBackButton={true}
//       />

//       <main className="flex-1 w-full max-w-3xl mx-auto px-4 pt-28 pb-20">
        
//         {/* Header Block */}
//         <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex overflow-hidden h-20 mb-8">
//           <div className="bg-[#f1f5f9] w-48 px-4 flex flex-col justify-center border-r border-slate-200">
//             <span className="font-bold text-slate-800 text-sm md:text-base">
//               หัวข้อบล็อก
//             </span>
//             <span className="text-xs text-slate-500">
//               โปรดระบุได้
//             </span>
//           </div>

//           <div className="flex-1 px-4 flex items-center">
//             <input
//               type="text"
//               placeholder="Your Channels"
//               className="w-full text-slate-700 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300 text-lg font-medium"
//               value={headerText}
//               onChange={(e) => setHeaderText(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Links List */}
//         <DragDropContext onDragEnd={handleDragEnd}>
//           <Droppable droppableId="links-items-list">
//             {(provided) => (
//               <div
//                 {...provided.droppableProps}
//                 ref={provided.innerRef}
//                 className="flex flex-col gap-4"
//               >
//                 {items.map((item, index) => (
//                   <Draggable
//                     key={item.id.toString()}
//                     draggableId={item.id.toString()}
//                     index={index}
//                   >
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         style={{ ...provided.draggableProps.style }}
//                       >
//                         <BlockLink
//                           link={item} // ส่งข้อมูล item เข้าไป
//                           IconComponent={getIconComponent(item.iconId)}
//                           onOpenPopup={() => openIconPopup(item.id)} // ส่ง ID ของ item นี้ไปเพื่อเปิด Popup ถูกอัน
//                           onRemove={() => handleRemoveItem(item.id)}
//                           onToggleVisibility={() => handleToggleVisibility(item.id)}
//                           onChange={(field, value) => handleItemChange(item.id, field, value)} // อัปเดตข้อมูล Input
//                           dragHandleProps={provided.dragHandleProps}
//                         />
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </DragDropContext>

//         {/* Buttons */}
//         <div className="mt-8 flex flex-col items-center gap-6">
//           <ButtonAdd onClick={handleAddItem} text="เพิ่มลิงก์" />
//           <ButtonSave onClick={handleSave} />
//         </div>
//       </main>

//       {/* Icon Modal */}
//       <IconModal
//         isOpen={isIconPopupOpen}
//         onClose={() => setIsIconPopupOpen(false)}
//         onSelectIcon={selectIcon}
//       />
//     </div>
//   );
// }