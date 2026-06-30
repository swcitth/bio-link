import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus } from 'lucide-react';
// ⭐️ เปลี่ยนมาใช้ตัวเดียวกับ EditShop ชัวร์ 100%
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'; 
import api from '../api/axios';
import Navbar from '../components/Layout/NavbarDetail';
import BlockShop from '../components/Blocks/BlockShop'; 

const EditShopslide = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get('id');
    const [loading, setLoading] = useState(false);

    // 1. ตั้งค่า React Hook Form
    const { register, control, setValue, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            title: '',
            type: 'SLIDER', // ⭐️ สำหรับหน้านี้ยังคงล๊อคเป็นประเภท SLIDER เสมอ
            items: []
        }
    });

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "items"
    });

    const watchedItems = watch("items");

    // 2. โหลดข้อมูลเดิมจาก Database
    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const res = await api.get(`/blocks/${id}`);
                const data = res.data.data;
                
                reset({
                    title: data.title || '',
                    type: data.type || 'SLIDER',
                    items: (data.content_data || []).map(item => ({
                        image: item.image || '',
                        name: item.name || '',
                        description: item.description || '',
                        link: item.link || '',
                        price: item.price || '',
                        isVisible: item.isVisible !== undefined ? item.isVisible : true
                    }))
                });
            } catch (error) {
                console.error("❌ โหลดข้อมูลไม่สำเร็จ:", error);
            }
        };
        fetchData();
    }, [id, reset]);

    // ซ่อน/แสดง
    const handleToggleVisibility = (index) => {
        if (!watchedItems || !watchedItems[index]) return;
        const currentStatus = watchedItems[index]?.isVisible;
        setValue(`items.${index}.isVisible`, !currentStatus, { shouldDirty: true });
    };

    // ⭐️ ฟังก์ชันจัดลำดับเมื่อลากเสร็จ (แกะถอดด้ามมาจาก EditShop)
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        move(result.source.index, result.destination.index);
    };

    // 3. ฟังก์ชันบันทึกข้อมูล
    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            const payload = {
                type: 'SLIDER', 
                title: formData.title,
                content_data: formData.items
            };

            let response;
            if (id) {
                response = await api.put(`/blocks/${id}`, payload);
            } else {
                response = await api.post(`/blocks`, payload);
            }

            if (response.status === 200 || response.status === 201) {
                window.dispatchEvent(new Event("db_updated")); 
                alert("บันทึกการเปลี่ยนแปลงเรียบร้อย!");
                navigate('/dd'); 
            }
            
        } catch (error) {
            console.error("❌ บันทึกไม่สำเร็จ:", error);
            alert("บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] pb-24 font-sans">
            <Navbar />

            <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto px-4 mt-10">
                
                {/* ส่วนที่ 1: ช่องกรอกหัวข้อบล็อก */}
                <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-8">
                    <div className="bg-[#f4f5f7] w-48 shrink-0 p-5 border-r border-slate-200 flex flex-col justify-center">
                        <label className="font-bold text-slate-800 text-[15px] mb-1">หัวข้อบล็อก</label>
                        <span className="text-[13px] text-slate-400">โปรดระบุได้</span>
                    </div>
                    <input
                        type="text"
                        placeholder="หัวข้อ Slider"
                        className="flex-1 p-5 focus:outline-none text-slate-700 font-medium placeholder:text-slate-300"
                        {...register("title")}
                    />
                </div>

                {/* ⭐️ ส่วนที่ 2: รายการสินค้า ครอบด้วยระบบลากวางตามโมเดล EditShop */}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="slider-items-list">
                        {(provided) => (
                            <div 
                                {...provided.droppableProps} 
                                ref={provided.innerRef} 
                                className="flex flex-col gap-4 mb-10"
                            >
                                {fields.map((field, index) => {
                                    const currentItem = watchedItems?.[index] || field;

                                    return (
                                        <Draggable key={field.id} draggableId={field.id.toString()} index={index}>
                                            {(provided) => (
                                                <div 
                                                    ref={provided.innerRef} 
                                                    {...provided.draggableProps} 
                                                    // ⭐️ ตัวนี้ห้ามลืมเด็ดขาด! ช่วยเรื่องอนิเมชั่นตอนลากย้ายตำแหน่ง
                                                    style={{ ...provided.draggableProps.style }}
                                                    className="w-full"
                                                >
                                                    <BlockShop
                                                        item={currentItem}
                                                        index={index}
                                                        register={register}
                                                        setValue={setValue}
                                                        onRemove={() => remove(index)}
                                                        onToggleVisibility={() => handleToggleVisibility(index)}
                                                        // ⭐️ ส่ง props เข้าไปปลุก 6 จุดเลื่อนสไลด์ใน Component ลูก
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

                {/* ส่วนที่ 3: ปุ่มเพิ่มสินค้า และ ปุ่มบันทึก */}
                <div className="flex flex-col items-center gap-6">
                    <button 
                        type="button"
                        onClick={() => append({ image: '', name: '', description: '', link: '', price: '', isVisible: true })}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium rounded-full shadow-sm transition-all"
                    >
                        <Plus size={18} />
                        เพิ่มสไลเดอร์
                    </button>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="px-10 py-3 bg-[#5a4af4] hover:bg-[#4b3de0] text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default EditShopslide;