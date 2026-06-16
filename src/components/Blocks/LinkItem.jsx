// ============================================================
// src/components/LinkItem.jsx
// ============================================================

import React, { useState } from "react";
import { FiEdit2, FiEye, FiEyeOff, FiTrash2 } from "react-icons/fi";
import { FaGripVertical } from "react-icons/fa";
import { ICON_MAP } from "../../constants/icons";


const LinkItem = ({
  link,
  index,
  onDelete,
  onToggleVisibility,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onEdit,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const IconComponent = ICON_MAP[link.icon] || ICON_MAP["Link"];

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnter={(e) => { setIsDragOver(true); onDragEnter(e, index); }}
      onDragLeave={() => setIsDragOver(false)}
      onDragEnd={() => { setIsDragOver(false); onDragEnd(); }}
      onDragOver={(e) => e.preventDefault()}
      className={`
        rounded-2xl mb-3 overflow-hidden transition-all duration-200
        ${isDragOver
          ? "border-2 border-dashed border-indigo-400 bg-indigo-50"
          : "border border-white/80 bg-white/80 shadow-sm hover:shadow-md hover:border-indigo-100"
        }
        ${!link.visible ? "opacity-60 grayscale-[40%]" : ""}
      `}
    >
      <div className="flex items-center gap-3 p-3">

        {/* Drag Handle */}
        <FaGripVertical
          size={16}
          className="text-slate-300 hover:text-slate-500 cursor-grab shrink-0 transition-colors"
        />

        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center shrink-0 text-slate-600">
          <IconComponent size={18} />
        </div>

        {/* Title + URL */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold text-slate-700 ${!link.visible ? "opacity-50" : ""}`}>
            {link.title}
          </p>
          {link.url && (
            <p className="text-xs text-slate-400 truncate">{link.url}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Edit */}
          <button 
            onClick={() => onEdit(link)}
            title="แก้ไข"
            className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors"
          >
            <FiEdit2 size={14} />
          </button>

          {/* Toggle Visibility */}
          <button
            onClick={() => onToggleVisibility(link.id)}
            title={link.visible ? "ซ่อน" : "แสดง"}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              link.visible
                ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
            }`}
          >
            {link.visible ? <FiEye size={14} /> : <FiEyeOff size={14} />}
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(link.id)}
            title="ลบ"
            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
          >
            <FiTrash2 size={14} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default LinkItem;