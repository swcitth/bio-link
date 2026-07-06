import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import Header from "../components/Layout/Header";
import ButtonAdd from "../components/UI/Button/ButtonAdd";
import ButtonSave from "../components/UI/Button/ButtonSave";
import BlockLink from "../components/Blocks/Blocklink";
import IconModal, { getIconComponent } from "../components/Modals/IconModal";
import { useForm, useFieldArray } from "react-hook-form";
import api from '../api/axios';

export default function EditLink() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const linkId = parseInt(searchParams.get("id")); // ดึง ID จาก URL (ถ้ามี)
 // console.log("linkId ที่ได้จาก URL คือ:", searchParams.get("id"));

  // State สำหรับเปิด/ปิดหน้าต่างเลือกไอคอน
  const [isIconPopupOpen, setIsIconPopupOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  // ติดตั้ง React Hook Form สำหรับจัดการข้อมูลทั้งหมดในฟอร์ม
  const { register, control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      title: "",
      items: []
    }
  });

  // เครื่องมือจัดการอาร์เรย์ (เพิ่ม/ลบ/สลับตำแหน่งกล่องลิงก์)
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "items", 
  });

  // ใช้ watch เพื่อดูการเปลี่ยนแปลงแบบ Real-time (เอาไว้เช็คสถานะรูปตา เปิด/ปิด)
  const watchedItems = watch("items");

  // ฟังก์ชันดึงข้อมูลเดิมมาแสดง (ทำงานอัตโนมัติเมื่อเปิดหน้านี้)
  useEffect(() => {
    const fetchBlockData = async () => {
      try {

        const response = await api.get(`/blocks/${linkId}`);
      
        const blockData = response.data.data;
       // console.log(blockData);

        if (blockData) {
          // เอาข้อมูลที่ได้มา ยัดใส่ฟอร์ม
          reset({
            title: blockData.title || "",
            items: blockData.content_data || [] 
          });
        }
      } catch (error) {
       // console.error("ดึงข้อมูลไม่สำเร็จ:", error);
      }
    };

    // ถ้ามี linkId ใน URL ถึงจะยิงไปดึงข้อมูล (ถ้าไม่มีแปลว่าสร้างใหม่ ก็ให้ฟอร์มโล่งๆ ไป)
    if (linkId) {
      fetchBlockData();
    }
  }, [linkId, reset]);

  // ฟังก์ชันเพิ่มกล่องลิงก์ใหม่ (เมื่อกดปุ่ม + เพิ่มลิงก์)
  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      title: "",
      url: "",
      iconId: null,
      isVisible: true, // ค่าเริ่มต้นให้แสดงผลเสมอ
    };
    append(newItem); 
  };

  // ฟังก์ชันซ่อน/แสดงลิงก์ (รูปตา)
  const handleToggleVisibility = (index) => {
    if (!watchedItems || !watchedItems[index]) return; 
    const currentValue = watchedItems[index].isVisible;
    // บังคับสลับค่า true เป็น false / false เป็น true
    setValue(`items.${index}.isVisible`, !currentValue);
  };

  // ฟังก์ชันเปิดหน้าต่างเลือก Icon
  const openIconPopup = (index) => { 
    setActiveIndex(index);
    setIsIconPopupOpen(true);
  };

  // ฟังก์ชันเมื่อคลิกเลือก Icon เสร็จแล้ว
  const selectIcon = (iconId) => {
    if (activeIndex !== null) {
      // เซฟชื่อไอคอนลงไปในฟอร์มของกล่องนั้นๆ
      setValue(`items.${activeIndex}.iconId`, iconId); 
    }
    setIsIconPopupOpen(false); // ปิดหน้าต่าง
    setActiveIndex(null); // ล้างค่าที่จำไว้
  };

  // ฟังก์ชันเมื่อลากวางกล่องสลับตำแหน่งเสร็จสิ้น (Drag & Drop)
  const handleDragEnd = (result) => {
    if (!result.destination) return; // ถ้าลากไปปล่อยนอกเขต ให้ยกเลิก
    // สลับตำแหน่งในระบบของ React Hook Form
    move(result.source.index, result.destination.index);
  };

  // ฟังก์ชันหลักเมื่อกดปุ่ม "บันทึกการเปลี่ยนแปลง" 
  const onSubmit = async (data) => {
    try {
      // เตรียมข้อมูลให้ตรงกับที่ Laravel ต้องการ (title และ content_data)
      const payload = {
        title: data.title,
        type: "LINK",
        content_data: data.items 
      };


      let response; 

      // เช็คเงื่อนไขพระเอก: มี ID = แก้ไข / ไม่มี ID = สร้างใหม่
      if (linkId) {
        // โหมดแก้ไข (PUT)
        response = await api.put(`/blocks/${linkId}`, payload);
      } else {
        // โหมดสร้างใหม่ (POST)
        response = await api.post(`/blocks`, payload);
      }

      // ถ้ายิงผ่านฉลุย (200 = OK, 201 = Created)
      if (response.status === 200 || response.status === 201) {
        // สร้างเสียงกระดิ่งเตือนให้หน้ามือถือจำลอง (Phone Preview) โหลดข้อมูลใหม่
        window.dispatchEvent(new Event("db_updated"));

        alert("บันทึกข้อมูลสำเร็จ!");
        navigate("/dd"); // ย้ายกลับไปหน้า Dashboard หลัก
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึก:", error);
      alert("ไม่สามารถบันทึกข้อมูลได้ค่ะ โปรดลองอีกครั้ง");
    }
  };


  return (
    // หุ้มทั้งหมดด้วย <form> และผูกฟังก์ชัน onSubmit
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="min-h-screen bg-[#f8f9fa] font-sans pb-20 flex flex-col"
    >
      <Header
        onLogoClick={() => navigate("/dd")}
        showBackButton={true}
      />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 pt-28 pb-20">
        
        {/* หัวข้อบล็อกด้านบนสุด */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex overflow-hidden h-20 mb-8">
          <div className="bg-[#f1f5f9] w-48 px-4 flex flex-col justify-center border-r border-slate-200">
            <span className="font-bold text-slate-800 text-sm md:text-base">หัวข้อบล็อก</span>
            <span className="text-xs text-slate-500">โปรดระบุได้</span>
          </div>

          <div className="flex-1 px-4 flex items-center">
            <input
              type="text"
              placeholder="เช่น ช่องทางการติดต่อ"
              className="w-full text-slate-700 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300 text-lg font-medium"
              {...register("title")} // ลงทะเบียนกับฟอร์ม
            />
          </div>
        </div>

        {/* ระบบลากวาง (Drag & Drop) */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links-items-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-4"
              >
                
                {fields.map((field, index) => {
                  const currentItem = watchedItems[index] || field; 

                  return (
                    <Draggable 
                      key={field.id} 
                      draggableId={field.id} 
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{ ...provided.draggableProps.style }}
                        >
                          <BlockLink
                            link={currentItem} 
                            index={index}
                            register={register}
                            IconComponent={getIconComponent(currentItem.iconId)}
                            onOpenPopup={() => openIconPopup(index)}
                            onRemove={() => remove(index)} 
                            onToggleVisibility={() => handleToggleVisibility(index)}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* ปุ่มเพิ่มลิงก์ และ ปุ่มบันทึก */}
        <div className="mt-8 flex flex-col items-center gap-6">
          <ButtonAdd onClick={handleAddItem} text="เพิ่มลิงก์" />
          <ButtonSave onClick={handleSubmit(onSubmit)} />
        </div>
      </main>

      {/* หน้าต่างเด้งสำหรับเลือกไอคอน */}
      <IconModal
        isOpen={isIconPopupOpen}
        onClose={() => setIsIconPopupOpen(false)}
        onSelectIcon={selectIcon}
      />
    </form>
  );
}