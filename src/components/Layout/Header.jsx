import React from 'react';
import { Link2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ onLogoClick, children, showBackButton = false } ) {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white border-b border-slate-200 h-[72px] flex items-center justify-between px-6 sm:px-12 fixed top-0 z-50">
      
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

      <div className="flex items-center gap-4">
        {children}

        {showBackButton && (
          <button 
            type="button"
            onClick={() => navigate(-1)} 
            className="text-sm font-medium text-slate-600 hover:text-[#5a4bfc] underline underline-offset-4 decoration-slate-300 hover:decoration-[#5a4bfc] transition-colors focus:outline-none cursor-pointer"
          >
            ย้อนกลับ
          </button>
        )}
      </div>

    </header>
  );
}