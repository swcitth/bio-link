// ============================================================
// src/hooks/useDragSort.js
// Custom Hook สำหรับจัดการ Drag & Drop เรียงลำดับรายการ
// ============================================================

import { useRef } from "react";

/**
 * useDragSort
 * @param {Array} items - รายการปัจจุบัน
 * @param {Function} setItems - setter ของ state
 * @returns {{ handleDragStart, handleDragEnter, handleDragEnd }}
 *
 * วิธีใช้:
 *   const { handleDragStart, handleDragEnter, handleDragEnd } = useDragSort(links, setLinks);
 *
 *   <div
 *     draggable
 *     onDragStart={(e) => handleDragStart(e, index)}
 *     onDragEnter={(e) => handleDragEnter(e, index)}
 *     onDragEnd={handleDragEnd}
 *     onDragOver={(e) => e.preventDefault()}
 *   />
 */
export const useDragSort = (items, setItems) => {
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    // ทำให้ ghost image โปร่งใสขึ้นเล็กน้อยขณะลาก
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    const newItems = [...items];
    const [moved] = newItems.splice(dragItem.current, 1);
    newItems.splice(dragOverItem.current, 0, moved);

    dragItem.current = null;
    dragOverItem.current = null;

    setItems(newItems);
  };

  return { handleDragStart, handleDragEnter, handleDragEnd };
};
