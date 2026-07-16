import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'; 
import api from '../api/axios';

// นำเข้า Component โครงสร้างและปุ่มแบบเดียวกับ EditShop
import Header from "../components/Layout/Header";
import BlockShop from '../components/Blocks/BlockShop'; 
import ButtonAdd from "../components/UI/Button/ButtonAdd";
import ButtonSave from "../components/UI/Button/ButtonSave";

const EditShopslide = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get('id');
    const [loading, setLoading] = useState(false);

    // 1. ตั้งค่า React Hook Form
    const { register, control, setValue, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            title: '',
            type: 'SLIDER', // ล๊อคเป็นประเภท SLIDER เสมอ
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
                // console.error("❌ โหลดข้อมูลไม่สำเร็จ:", error);
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

    // ฟังก์ชันจัดลำดับเมื่อลากเสร็จ
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
                // alert("บันทึกการเปลี่ยนแปลงเรียบร้อย!");
                navigate('/dd'); 
            }
            
        } catch (error) {
            // console.error("❌ บันทึกไม่สำเร็จ:", error);
            alert("บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-[#f8f9fa] font-sans pb-20 flex flex-col">
            
            <Header
                onLogoClick={() => navigate("/dd")}
                showBackButton={true}
            />

            <main className="flex-1 w-full max-w-3xl mx-auto px-4 pt-28 pb-20">
                
                {/* ส่วนที่ 1: ช่องกรอกหัวข้อบล็อก */}
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
                            placeholder="หัวข้อ Slider"
                            className="w-full text-slate-700 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300 text-lg font-medium"
                            {...register("title")}
                        />
                    </div>
                </div>

                {/* ส่วนที่ 2: รายการสินค้า */}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="slider-items-list">
                        {(provided) => (
                            <div 
                                {...provided.droppableProps} 
                                ref={provided.innerRef} 
                                className="flex flex-col gap-4"
                            >
                                {fields.map((field, index) => {
                                    const currentItem = watchedItems?.[index] || field;

                                    return (
                                        <Draggable key={field.id} draggableId={field.id.toString()} index={index}>
                                            {(provided) => (
                                                <div 
                                                    ref={provided.innerRef} 
                                                    {...provided.draggableProps} 
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
                                                        dragHandleProps={provided.dragHandleProps}
                                                        showDescription={false}
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

                {/* ส่วนที่ 3: ปุ่มดำเนินการ */}
                <div className="mt-8 flex flex-col items-center gap-6">
                    <ButtonAdd
                        onClick={() => append({ id: Date.now(), image: '', name: '', description: '', link: '', price: '', isVisible: true })}
                        text="เพิ่มสไลเดอร์"
                    />

                    <ButtonSave
                        onClick={handleSubmit(onSubmit)}
                    />
                </div>

            </main>
        </form>
    );
};

export default EditShopslide;