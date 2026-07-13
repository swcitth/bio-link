import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Layout/Header";
import BlockShop from "../components/Blocks/BlockShop";
import ButtonAdd from "../components/UI/Button/ButtonAdd";
import ButtonSave from "../components/UI/Button/ButtonSave";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import { useForm, useFieldArray } from "react-hook-form";
import api from "../api/axios";

export default function EditGrid() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const linkId = parseInt(searchParams.get("id"));

  const { register, control, handleSubmit, setValue, watch, reset } = useForm({
        defaultValues: {
          title: "",
          type: "Grid2", // 🌟 ค่าเริ่มต้น (เผื่อกรณีสร้างใหม่)
          items: []
        }
  });

  // จัดการ array
  const { fields, append, remove, move } = useFieldArray({
        control,
        name: "items", 
  });

  const watchedItems = watch("items");
  const currentType = watch("type"); // 🌟 ดึงค่า type ออกมาเพื่อใช้แสดงผลบน UI (ถ้าต้องการ)

  useEffect(() => {
    const fetchGridData = async () => {
      try {
        const response = await api.get(`/blocks/${linkId}`);
        const blockData = response.data.data;
        
        if (blockData) {
          // นำข้อมูลเทใส่ฟอร์ม
          reset({
            title: blockData.title || "",
            type: blockData.type || "Grid2", // 🌟 ดึง Type (Grid2 หรือ Grid3) จาก DB มาใส่
            items: blockData.content_data || []
          });
        }
      } catch (error) {
        console.error("ดึงข้อมูลตารางไม่สำเร็จ:", error);
      }
    };

    if (linkId) {
      fetchGridData();
    }
  }, [linkId, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        type: data.type, // 🌟 ส่ง type กลับไปแบบไดนามิก (ไม่ล็อคค่าเหมือนหน้า Shop)
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
        alert("บันทึกข้อมูลตารางสำเร็จ!");
        navigate("/dd");
      }
    } catch (error) {
      console.error("บันทึกไม่สำเร็จ:", error);
      alert("ไม่สามารถบันทึกได้ โปรดลองอีกครั้ง");
    }
  };

  // เพิ่มสินค้า/ช่องตาราง
  const handleAddItem = () => {
    append({
      id: Date.now(),
      image: "",
      name: "",
      description: "",
      link: "",
      price: "",
      isVisible: true,
    });
  };

  // ซ่อน/แสดง
  const handleToggleVisibility = (index) => {
    if (!watchedItems || !watchedItems[index]) return;
    const currentValue = watchedItems[index].isVisible;
    setValue(`items.${index}.isVisible`, !currentValue);
  };

  // Drag & Drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-[#f8f9fa] font-sans pb-20 flex flex-col">
      <Header
        onLogoClick={() => navigate("/dd")}
        showBackButton={true}
      />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 pt-28 pb-20">

        {/* Header Block */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex overflow-hidden h-20 mb-8">
          <div className="bg-[#f1f5f9] w-48 px-4 flex flex-col justify-center border-r border-slate-200">
            <span className="font-bold text-slate-800 text-sm md:text-base">
                {/* 🌟 ปรับตรงนี้ให้ยืดหยุ่นขึ้น */}
                {String(currentType).toUpperCase() === "GRID3" ? "ตาราง 3 คอลัมน์" : "ตาราง 2 คอลัมน์"}
            </span>
            <span className="text-xs text-slate-500">
                ตั้งหัวข้อตาราง
            </span>
        </div>

          <div className="flex-1 px-4 flex items-center">
            <input
              type="text"
              placeholder="เช่น สินค้าแนะนำ"
              className="w-full text-slate-700 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300 text-lg font-medium"
              {...register("title")}
            />
          </div>
        </div>

        {/* Product/Grid List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="grid-items-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-4">
                {fields.map((field, index) => {
                  const currentItem = watchedItems[index] || field;

                  return (
                    <Draggable key={field.id} draggableId={field.id.toString()} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} style={{ ...provided.draggableProps.style }}>
                          <BlockShop
                            item={currentItem}
                            index={index}
                            register={register}
                            setValue={setValue} 
                            onRemove={() => remove(index)}
                            onToggleVisibility={() => handleToggleVisibility(index)}
                            dragHandleProps={provided.dragHandleProps}
                            showDescription={true} // 🌟 ถ้าในตารางไม่อยากให้มีคำอธิบาย ให้แก้ตรงนี้เป็น false ได้เลย
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

        {/* Buttons */}
        <div className="mt-8 flex flex-col items-center gap-6">
          <ButtonAdd
            onClick={handleAddItem}
            text="เพิ่มช่องตาราง"
          />

          <ButtonSave
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </main>
    </form>
  );
}