import React from 'react';
import { Plus } from 'lucide-react';

export default function ButtonAdd({ onClick, text = "เพิ่ม", className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-slate-200 rounded-full text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600/20 font-medium ${className}`}
    >
      <Plus size={18} strokeWidth={2.5} />
      {text}
    </button>
  );
}