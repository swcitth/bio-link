import React from 'react';
import { Link2 } from 'lucide-react'; 

export default function Header({ onLogoClick }) {
  return (
    <header className="w-full bg-white border-b border-slate-200 h-[72px] flex items-center px-6 sm:px-12 fixed top-0 z-10">
      <div 
        className="flex items-center gap-2.5 cursor-pointer group" 
        onClick={onLogoClick}
      >
        
        <div className="bg-[#5a4bfc] p-2 rounded-[14px] flex items-center justify-center group-hover:bg-[#4f3df5] transition-colors">
          <Link2 className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        
        <span className="text-[22px] font-extrabold text-[#111827] tracking-tight">
          MyBioLink
        </span>
      </div>
    </header>
  );
}