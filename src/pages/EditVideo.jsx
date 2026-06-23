import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // 1. นำเข้า useSearchParams
import Header from "../components/Layout/Header"; 
import ButtonAdd from '../components/UI/Button/ButtonAdd'; 
import ButtonSave from '../components/UI/Button/ButtonSave'; 
import BlockVideo from '../components/Blocks/BlockVideo'; 
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useForm , useFieldArray } from 'react-hook-form'; 
import api from '../api/axios';

export default function EditVideo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const linkId = parseInt(searchParams.get("id"));

  const [platformMode, setPlatformMode] = useState(searchParams.get("platform") || "Youtube");
  // ติดตั้ง RHF
  const { register, control, handleSubmit, setValue, watch, reset } = useForm({
      defaultValues: {
        title: "",
        type: "VIDEO",
        items: []
      }
  });

  // จัดการ array 
  const { fields, append, remove, move } = useFieldArray({
      control,
      name: "items", 
  });

  const watchedItems = watch("items");

  // ดึงข้อมูลจาก Laravel (GET) เมื่อเปิดหน้านี้
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        
        const response = await api.get(`/blocks/${linkId}`);

        const blockData = response.data.data;
        if (blockData) {
          // นำข้อมูลที่ได้จาก DB เทใส่ฟอร์ม
          reset({
            title: blockData.title || "",
            type: blockData.type || "VIDEO",
            items: blockData.content_data || []
          });

          const firstLink = blockData.content_data?.[0]?.link || "";
          if (firstLink.includes("tiktok.com")) {
            setPlatformMode("TikTok");
        }
      }
      } catch (error) {
        console.error("ดึงข้อมูลวิดีโอไม่สำเร็จ:", error);
      }
    };

    if (linkId) {
      fetchVideoData();
    }
  }, [linkId, reset]);
 
  // ฟังก์ชันบันทึกข้อมูล
  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        type: data.type, // ส่งคำว่า YOUTUBE ไปบอกหลังบ้าน
        content_data: data.items 
      };

      

      let response;
      if (linkId) {
        response = await api.put(`/blocks/${linkId}`, payload);
      } else {
        response = await api.post(`/blocks`, payload);
      }

      if (response.status === 200 || response.status === 201) {
        window.dispatchEvent(new Event("db_updated")); // กระตุกให้ Preview รีเฟรช
        alert("บันทึกการเปลี่ยนแปลงสำเร็จ!");
        navigate('/dd'); 
      }
    } catch (error) {
      console.error("บันทึกไม่สำเร็จ:", error);
      alert("ไม่สามารถบันทึกได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleAddItem = () => {
    // ใช้ append ของ RHF แทน setItems
    append({ id: Date.now(), name: '', link: '', isVisible: true });
  };

  const handleToggleVisibility = (index) => {
    if (!watchedItems || !watchedItems[index]) return;
    const currentValue = watchedItems[index].isVisible;
    // สลับค่าการมองเห็นด้วย setValue
    setValue(`items.${index}.isVisible`, !currentValue);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    // ใช้คำสั่ง move ของ RHF ช่วยสลับที่
    move(result.source.index, result.destination.index);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-[#f8f9fa] font-sans pb-20 flex flex-col">
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
              {...register("title")}
            />
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="video-items-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-4">
                {fields.map((field, index) => {
                  const currentItem = watchedItems[index] || field;

                  return (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} style={{ ...provided.draggableProps.style }}>
                          <BlockVideo
                            item={currentItem} // ส่งข้อมูลปัจจุบันให้คอมโพเนนต์ลูก
                            index={index}
                            register={register} 
                            onRemove={() => remove(index)} 
                            onToggleVisibility={() => handleToggleVisibility(index)}
                            dragHandleProps={provided.dragHandleProps}
                            platform={platformMode}
                          />
                        </div>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="mt-8 flex flex-col items-center gap-6">
          <ButtonAdd onClick={handleAddItem} text="เพิ่มวิดีโอ" />
          <ButtonSave onClick={handleSubmit(onSubmit)} />
        </div>
      </main>
    </form>
  );
}