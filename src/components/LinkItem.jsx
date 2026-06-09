// ============================================================
// src/components/LinkItem.jsx
// แสดงลิงก์ 1 รายการ พร้อม View / Edit / Drag mode
// ============================================================

import React, { useState } from "react";
import { Pencil, Eye, EyeOff, Trash2, GripVertical, Check, X } from "lucide-react";
import { ICON_MAP, ICON_EMOJI, ICON_OPTIONS } from "../constants/icons";

/**
 * Props:
 * - link              : { id, title, url, icon, visible, clicks }
 * - index             : ตำแหน่งใน array (ใช้กับ drag)
 * - onUpdate          : (updatedLink) => void
 * - onDelete          : (id) => void
 * - onToggleVisibility: (id) => void
 * - onDragStart       : (e, index) => void
 * - onDragEnter       : (e, index) => void
 * - onDragEnd         : () => void
 */
const LinkItem = ({
  link,
  index,
  onUpdate,
  onDelete,
  onToggleVisibility,
  onDragStart,
  onDragEnter,
  onDragEnd,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...link });
  const [isDragOver, setIsDragOver] = useState(false);

  const IconComponent = ICON_MAP[link.icon] || ICON_MAP["Link"];

  /** บันทึกการแก้ไข */
  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  /** ยกเลิกการแก้ไข — reset กลับ original */
  const handleCancel = () => {
    setEditData({ ...link });
    setIsEditing(false);
  };

  return (
    <div
      draggable={!isEditing}
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnter={(e) => { setIsDragOver(true); onDragEnter(e, index); }}
      onDragLeave={() => setIsDragOver(false)}
      onDragEnd={() => { setIsDragOver(false); onDragEnd(); }}
      onDragOver={(e) => e.preventDefault()}
      className={`
        rounded-2xl mb-3 overflow-hidden transition-all duration-200
        ${isDragOver
          ? "border-2 border-dashed border-indigo-400 bg-indigo-50"
          : isEditing
            ? "border border-indigo-300 bg-indigo-50/60 shadow-md"
            : "border border-white/80 bg-white/80 shadow-sm hover:shadow-md hover:border-indigo-100"
        }
        ${!link.visible && !isEditing ? "opacity-60 grayscale-[40%]" : ""}
      `}
    >

      {/* ════════════════════════════════
          VIEW MODE
      ════════════════════════════════ */}
      {!isEditing && (
        <div className="flex items-center gap-3 p-3">

          {/* Drag Handle */}
          <GripVertical
            size={16}
            className="text-slate-300 hover:text-slate-500 cursor-grab shrink-0 transition-colors"
          />

          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center shrink-0 text-slate-600">
            <IconComponent size={18} />
          </div>

          {/* Title + URL */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold text-slate-700 ${!link.visible ? "line-through" : ""}`}>
              {link.title}
            </p>
            {link.url && (
              <p className="text-xs text-slate-400 truncate">{link.url}</p>
            )}
          </div>

          {/* Click count badge */}
          <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium shrink-0">
            {(link.clicks || 0).toLocaleString()} คลิก
          </span>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Edit */}
            <button
              onClick={() => setIsEditing(true)}
              title="แก้ไข"
              className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors"
            >
              <Pencil size={14} />
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
              {link.visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete(link.id)}
              title="ลบ"
              className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════
          EDIT MODE
      ════════════════════════════════ */}
      {isEditing && (
        <div className="p-5">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-indigo-900">✏️ แก้ไขลิงก์</h4>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <X size={12} /> ยกเลิก
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Check size={12} /> บันทึก
              </button>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-3">

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                ชื่อที่แสดง
              </label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="w-full bg-white border border-slate-200 focus:border-indigo-400 outline-none rounded-xl px-3 py-2 text-sm text-slate-800 transition-colors"
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                URL ปลายทาง
              </label>
              <input
                type="url"
                value={editData.url}
                onChange={(e) => setEditData({ ...editData, url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-white border border-slate-200 focus:border-indigo-400 outline-none rounded-xl px-3 py-2 text-sm text-slate-800 transition-colors"
              />
            </div>

            {/* Icon Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                ไอคอน
              </label>
              <div className="flex gap-2 flex-wrap">
                {ICON_OPTIONS.map((iconName) => {
                  const IconComp = ICON_MAP[iconName];
                  const isSelected = editData.icon === iconName;
                  return (
                    <button
                      key={iconName}
                      title={iconName}
                      onClick={() => setEditData({ ...editData, icon: iconName })}
                      className={`
                        w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all
                        ${isSelected
                          ? "border-indigo-400 bg-indigo-100 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                        }
                      `}
                    >
                      <IconComp size={18} />
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default LinkItem;
