import React from 'react';

export default function ButtonBig({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type="submit"
      onClick={onClick}
      className={`w-full bg-[#5a4bfc] hover:bg-[#4f3df5] text-white font-medium py-2.5 rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5a4bfc] focus:ring-offset-2 active:scale-[0.98] ${className}`}
    >
      {children}
    </button>
  );
}