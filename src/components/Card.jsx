import React from 'react';


export default function Card({ children }) {
  return (
    <div className="bg-white w-full max-w-[440px] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 sm:p-10 border border-slate-100 transition-all duration-300">
      {children}
    </div>
  );
}