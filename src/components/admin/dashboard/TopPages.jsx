import React from 'react';
import { LayoutTemplate } from 'lucide-react';

export default function TopPages({ pages }) {
  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-50 flex flex-col">
      <h2 className="text-lg font-bold text-slate-800 mb-6">Top Performing Pages</h2>
      <div className="flex-1 flex flex-col gap-5">
        {pages.map((page) => (
          <div key={page.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${page.color} flex items-center justify-center text-slate-600`}>
                {page.id === 4 ? <LayoutTemplate size={18} /> : <div className="w-5 h-5 bg-white/50 rounded-md"></div>}
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">{page.name}</p>
                <p className="text-xs text-slate-400">{page.link}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm text-slate-800">{page.views}</p>
              <p className={`text-xs font-bold ${page.growth.startsWith('+') ? 'text-emerald-500' : 'text-slate-400'}`}>
                {page.growth}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm rounded-xl transition-colors">
        View Complete Report
      </button>
    </div>
  );
}