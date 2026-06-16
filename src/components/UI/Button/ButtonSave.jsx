import React from 'react';

export default function ButtonSave({ onClick, text = "บันทึกการเปลี่ยนแปลง", type = "button", className = "" }) {
  return (
    <div className={`w-full sm:w-auto min-w-[200px] ${className}`}>
      <button
        type={type}
        onClick={onClick}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-xl transition-colors shadow-md shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:scale-[0.98]"
      >
        {text}
      </button>
    </div>
  );
}