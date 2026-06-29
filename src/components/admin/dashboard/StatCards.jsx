import React from 'react';
import { UserPlus, Users, LayoutList, MousePointerClick, Bookmark ,Eye } from 'lucide-react';

export default function StatCards({ stats, isLoading }) {
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-50 h-[120px] animate-pulse">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="h-4 w-20 bg-slate-200 rounded"></div>
                <div className="h-8 w-16 bg-slate-300 rounded"></div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-slate-100"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="w-full bg-red-50 border border-red-200 text-red-500 p-6 rounded-[1.5rem] flex items-center justify-center font-bold text-sm">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        ไม่สามารถเชื่อมต่อข้อมูลสถิติจาก Backend ได้
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      
      {/* Card 1: ยอดผู้สมัครใหม่ (ปรับดีไซน์เพิ่มยอดที่ยืนยันแล้ว) */}
      <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1">ยอดผู้สมัครใหม่</p>
            <div className="flex items-center gap-2">
              <h3 className="text-4xl font-extrabold text-slate-800">{formatNumber(stats.dailySignups?.count || 0)}</h3>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                ยืนยันแล้ว {formatNumber(stats.dailySignups?.verified_count || 0)}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
            <UserPlus size={24} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold">
          <span className={`${stats.dailySignups?.trend >= 0 ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'} flex items-center px-2 py-1 rounded-md`}>
            {stats.dailySignups?.trend >= 0 ? '+' : ''}{stats.dailySignups?.trend || 0}%
          </span>
          <span className="text-slate-400">เทียบกับช่วงก่อนหน้า</span>
        </div>
      </div>

      {/* Card 2: สมาชิกทั้งหมด (ปรับดีไซน์เพิ่มยอดที่ยืนยันแล้ว) */}
      <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1">สมาชิกทั้งหมด</p>
            <div className="flex items-center gap-2">
              <h3 className="text-4xl font-extrabold text-slate-800">{formatNumber(stats.totalUsers?.count || 0)}</h3>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                ยืนยันแล้ว {formatNumber(stats.totalUsers?.verified_count || 0)}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
            <Users size={24} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold">
          <span className={`${stats.totalUsers?.trend >= 0 ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'} flex items-center px-2 py-1 rounded-md`}>
            {stats.totalUsers?.trend >= 0 ? '+' : ''}{stats.totalUsers?.trend || 0}%
          </span>
          <span className="text-slate-400">การเติบโต</span>
        </div>
      </div>

      {/* 3. ยอดเข้าชม (New) */}
      <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-slate-400 mb-1">ยอดเข้าชม</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{formatNumber(stats.totalViews?.count || 0)}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-500 shrink-0">
            <Eye size={20} />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px] font-bold">
          <span className={`${stats.totalViews?.trend >= 0 ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'} flex items-center px-1.5 py-0.5 rounded`}>
            {stats.totalViews?.trend >= 0 ? '+' : ''}{stats.totalViews?.trend || 0}%
          </span>
          <span className="text-slate-400">เทียบกับรอบก่อน</span>
        </div>
      </div>

      {/* Card 4: บล็อกทั้งหมด */}
      <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1">บล็อกที่ถูกสร้างทั้งหมด</p>
            <h3 className="text-4xl font-extrabold text-slate-800">{formatNumber(stats.totalBlocks?.count || 0)}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
            <LayoutList size={24} /> 
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold">
          <span className={`${stats.totalBlocks?.trend >= 0 ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'} flex items-center px-2 py-1 rounded-md`}>
            {stats.totalBlocks?.trend >= 0 ? '+' : ''}{stats.totalBlocks?.trend || 0}%
          </span>
          <span className="text-slate-400">การเติบโต</span>
        </div>
      </div>

      {/* Card 5: ยอดคลิกรวมทั้งหมด */}
      <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-slate-400 mb-1">ยอดคลิกรวม</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{formatNumber(stats.totalClicks?.count || 0)}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
            <MousePointerClick size={20} />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px] font-bold">
          <span className={`${stats.totalClicks?.trend >= 0 ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'} flex items-center px-1.5 py-0.5 rounded`}>
            {stats.totalClicks?.trend >= 0 ? '+' : ''}{stats.totalClicks?.trend || 0}%
          </span>
          <span className="text-slate-400">เทียบกับรอบก่อน</span>
        </div>
      </div>

      {/* Card 6: ยอดกด Save Contact */}
      <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-slate-400 mb-1">ยอดกด Save</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{formatNumber(stats.totalSaves?.count || 0)}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
            <Bookmark size={20} fill="currentColor" className="text-pink-200" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px] font-bold">
          <span className={`${stats.totalSaves?.trend >= 0 ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'} flex items-center px-1.5 py-0.5 rounded`}>
            {stats.totalSaves?.trend >= 0 ? '+' : ''}{stats.totalSaves?.trend || 0}%
          </span>
          <span className="text-slate-400">เทียบกับรอบก่อน</span>
        </div>
      </div>

    </div>
  );
}