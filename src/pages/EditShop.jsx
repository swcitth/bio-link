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

import { useForm , useFieldArray } from "react-hook-form";
import axios from "axios";

export default function EditShop() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const linkId = parseInt(searchParams.get("id"));

  const { register, control, handleSubmit, setValue, watch, reset } = useForm({
        defaultValues: {
          title: "",
          type: "IMAGE",
          items: []
        }
  });

  // จัดการ array
  const { fields, append, remove, move } = useFieldArray({
        control,
        name: "items", 
  });

  const watchedItems = watch("items");

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/blocks/${linkId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const blockData = response.data.data;
        if (blockData) {
          // นำข้อมูลเทใส่ฟอร์ม
          reset({
            title: blockData.title || "",
            type: blockData.type || "IMAGE",
            items: blockData.content_data || []
          });
        }
      } catch (error) {
        console.error("ดึงข้อมูลร้านค้าไม่สำเร็จ:", error);
      }
    };

    if (linkId) {
      fetchShopData();
    }
  }, [linkId, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        type: "IMAGE", // ยืนยันว่าเป็นประเภท IMAGE
        content_data: data.items 
      };

      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
      };

      let response;
      if (linkId) {
        response = await axios.put(`${import.meta.env.VITE_API_URL}/blocks/${linkId}`, payload, config);
      } else {
        response = await axios.post(`${import.meta.env.VITE_API_URL}/blocks`, payload, config);
      }

      if (response.status === 200 || response.status === 201) {
        window.dispatchEvent(new Event("db_updated")); // กระตุกให้ Preview รีเฟรช
        alert("บันทึกข้อมูลสำเร็จ!");
        navigate("/dd");
      }
    } catch (error) {
      console.error("บันทึกไม่สำเร็จ:", error);
      alert("ไม่สามารถบันทึกได้ โปรดลองอีกครั้ง");
    }
  };


  // เพิ่มสินค้า
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

  // ลบสินค้า
  const handleRemoveItem = (id) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
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
              หัวข้อบล็อก
            </span>
            <span className="text-xs text-slate-500">
              โปรดระบุได้
            </span>
          </div>

          <div className="flex-1 px-4 flex items-center">
            <input
              type="text"
              placeholder="Shop"
              className="w-full text-slate-700 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300 text-lg font-medium"
              {...register("title")}
            />
          </div>
        </div>

        {/* Product List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="shop-items-list">
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
                            setValue={setValue} // ส่ง setValue ไปให้ลูกเพื่อใช้อัปเดตรูป
                            onRemove={() => remove(index)}
                            onToggleVisibility={() => handleToggleVisibility(index)}
                            dragHandleProps={provided.dragHandleProps}
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
            text="เพิ่มสินค้า"
          />

          <ButtonSave
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </main>
    </form>
  );
}