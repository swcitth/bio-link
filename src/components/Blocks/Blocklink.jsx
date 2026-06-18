import React from 'react';
import { GripVertical, Eye, EyeOff, Trash2, Plus } from 'lucide-react';

export default function Blocklink({ 
  item, 
  index, 
  register, // รับ register จาก react-hook-form
  IconComponent, 
  onOpenPopup, 
  onToggleVisibility, 
  onRemove, 
  dragHandleProps 
}) {
  return (
    <div 
      className={`bg-white border ${item.isVisible ? 'border-slate-200' : 'border-slate-200 bg-slate-50 opacity-75'} rounded-2xl p-4 flex items-start sm:items-center gap-3 sm:gap-4 shadow-sm relative group transition-all`}
    >
      {/* Drag Handle */}
      <div 
        {...dragHandleProps} 
        className="text-slate-300 cursor-grab active:cursor-grabbing mt-3 sm:mt-0 flex flex-col justify-center h-full hover:text-slate-500"
      >
        <GripVertical size={20} />
      </div>

      {/* Icon Selector Button */}
      <button
        type="button" // ป้องกันการ submit form เมื่อกดปุ่ม
        onClick={onOpenPopup}
        className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
      >
        {IconComponent ? (
          <IconComponent size={28} strokeWidth={1.5} />
        ) : (
          <div className="w-8 h-8 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
            <Plus size={16} className="text-slate-300" />
          </div>
        )}
      </button>

      {/* Inputs Area (ใช้ register แทน onChange ปกติ) */}
      <div className="flex-1 flex flex-col gap-2.5 w-full">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600 w-8 shrink-0">ชื่อ</span>
          <input 
            type="text" 
            placeholder="เช่น Facebook"
            {...register(`items.${index}.title`)} 
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all" 
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600 w-8 shrink-0">ลิงก์</span>
          <input 
            type="text" 
            placeholder="https://"
            {...register(`items.${index}.url`)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all" 
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1 sm:gap-2 sm:border-l sm:border-slate-100 sm:pl-3 ml-auto sm:ml-0 mt-2 sm:mt-0 items-center justify-center">
        <button 
          type="button"
          onClick={onToggleVisibility}
          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors focus:outline-none" 
          title={item.isVisible ? "ซ่อนลิงก์นี้" : "แสดงลิงก์นี้"}
        >
          {item.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
        <button 
          type="button"
          onClick={onRemove}
          className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors focus:outline-none" 
          title="ลบลิงก์"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

// import React from 'react';
// import { GripVertical, Eye, EyeOff, Trash2, Plus } from 'lucide-react';

// export default function Blocklink({ link, IconComponent, onOpenPopup, onToggleVisibility, onRemove ,dragHandleProps ,onChange}) {
//   return (
//     <div 
//       className={`bg-white border ${link.isVisible ? 'border-slate-200' : 'border-slate-200 bg-slate-50 opacity-75'} rounded-2xl p-4 flex items-start sm:items-center gap-3 sm:gap-4 shadow-sm relative group transition-all`}
//     >
//       {/* Drag Handle */}
//       <div 
//         {...dragHandleProps} 
//         className="text-slate-300 cursor-grab active:cursor-grabbing mt-3 sm:mt-0 flex flex-col justify-center h-full hover:text-slate-500"
//       >
//         <GripVertical size={20} />
//       </div>

//       {/* Icon Selector Button (รูปสี่เหลี่ยม) */}
//       <button
//         onClick={() => onOpenPopup(link.id)}
//         className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
//       >
//         {IconComponent ? (
//           <IconComponent size={28} strokeWidth={1.5} />
//         ) : (
//           <div className="w-8 h-8 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
//             <Plus size={16} className="text-slate-300" />
//           </div>
//         )}
//       </button>

//       {/* Inputs Area */}
//       <div className="flex-1 flex flex-col gap-2.5 w-full">
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-medium text-slate-600 w-8 shrink-0">ชื่อ</span>
//           <input 
//             type="text" 
//             placeholder="เช่น Facebook"
//             value={link.title || ""}
//             onChange={(e) => onChange("title", e.target.value)}
//             className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all" 
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-medium text-slate-600 w-8 shrink-0">ลิงก์</span>
//           <input 
//             type="text" 
//             placeholder="https://"
//             value={link.url || ""}
//             onChange={(e) => onChange("url", e.target.value)}
//             className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all" 
//           />
//         </div>
//       </div>

//       {/* Actions (แก้ไข/ซ่อน, ลบ) */}
//       <div className="flex flex-col gap-1 sm:gap-2 sm:border-l sm:border-slate-100 sm:pl-3 ml-auto sm:ml-0 mt-2 sm:mt-0 items-center justify-center">
        
//         <button 
//           onClick={() => onToggleVisibility(link.id)}
//           className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors focus:outline-none" 
//           title={link.isVisible ? "ซ่อนลิงก์นี้" : "แสดงลิงก์นี้"}
//         >
//           {link.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
//         </button>
//         <button 
//           onClick={() => onRemove(link.id)}
//           className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors focus:outline-none" 
//           title="ลบลิงก์"
//         >
//           <Trash2 size={18} />
//         </button>
//       </div>
//     </div>
//   );
// }
