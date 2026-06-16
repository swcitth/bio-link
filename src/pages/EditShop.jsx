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

export default function EditShop() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const linkId = parseInt(searchParams.get("id"));

  const [headerText, setHeaderText] = useState("");
  const [items, setItems] = useState([]);

  // โหลดข้อมูลเดิม
  useEffect(() => {
    const savedLinks = JSON.parse(
      localStorage.getItem("bio_links") || "[]"
    );

    const currentLink = savedLinks.find(
      (l) => l.id === linkId
    );

    if (currentLink) {
      setHeaderText(currentLink.title || "");
      setItems(currentLink.items || []);
    }
  }, [linkId]);

  // เพิ่มสินค้า
  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      image: "",
      name: "",
      description: "",
      link: "",
      price: "",
      isVisible: true,
    };

    setItems((prev) => [...prev, newItem]);
  };

  // ลบสินค้า
  const handleRemoveItem = (id) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // ซ่อน/แสดง
  const handleToggleVisibility = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isVisible: !item.isVisible,
            }
          : item
      )
    );
  };

  // แก้ไขข้อมูล
  const handleItemChange = (
    id,
    field,
    value
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  // อัปโหลดรูป
  const handleImageUpload = (id, file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      handleItemChange(
        id,
        "image",
        reader.result
      );
    };

    reader.readAsDataURL(file);
  };

  // Drag & Drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);

    const [movedItem] =
      reorderedItems.splice(
        result.source.index,
        1
      );

    reorderedItems.splice(
      result.destination.index,
      0,
      movedItem
    );

    setItems(reorderedItems);
  };

  // Save
  const handleSave = () => {
    const savedLinks = JSON.parse(
      localStorage.getItem("bio_links") || "[]"
    );

    const updatedLinks = savedLinks.map((link) =>
      link.id === linkId
        ? {
            ...link,
            title: headerText,
            items: items,
          }
        : link
    );

    localStorage.setItem(
      "bio_links",
      JSON.stringify(updatedLinks)
    );

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
              placeholder="Shop"
              className="w-full text-slate-700 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300 text-lg font-medium"
              value={headerText}
              onChange={(e) =>
                setHeaderText(e.target.value)
              }
            />
          </div>
        </div>

        {/* Product List */}
        <DragDropContext
          onDragEnd={handleDragEnd}
        >
          <Droppable droppableId="shop-items-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-4"
              >
                {items.map(
                  (item, index) => (
                    <Draggable
                      key={item.id.toString()}
                      draggableId={item.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={
                            provided.innerRef
                          }
                          {...provided.draggableProps}
                          style={{
                            ...provided
                              .draggableProps
                              .style,
                          }}
                        >
                          <BlockShop
                            item={item}
                            onRemove={() =>
                              handleRemoveItem(
                                item.id
                              )
                            }
                            onToggleVisibility={() =>
                              handleToggleVisibility(
                                item.id
                              )
                            }
                            onChange={(
                              field,
                              value
                            ) =>
                              handleItemChange(
                                item.id,
                                field,
                                value
                              )
                            }
                            onImageUpload={(
                              file
                            ) =>
                              handleImageUpload(
                                item.id,
                                file
                              )
                            }
                            dragHandleProps={
                              provided.dragHandleProps
                            }
                          />
                        </div>
                      )}
                    </Draggable>
                  )
                )}

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
            onClick={handleSave}
          />
        </div>
      </main>
    </div>
  );
}