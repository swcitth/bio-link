import React from 'react';
import { UserPlus, Users, Link2, Clock } from 'lucide-react';

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1">สมัครสมาชิกวันนี้</p>
            <h3 className="text-4xl font-extrabold text-slate-800">142</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
            <UserPlus size={24} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold">
          <span className="text-emerald-500 flex items-center bg-emerald-50 px-2 py-1 rounded-md">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            12.5%
          </span>
          <span className="text-slate-400">เทียบกับเมื่อวาน</span>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1">สมาชิกทั้งหมด</p>
            <h3 className="text-4xl font-extrabold text-slate-800">12,543</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
            <Users size={24} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold">
          <span className="text-emerald-500 flex items-center bg-emerald-50 px-2 py-1 rounded-md">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            2.1%
          </span>
          <span className="text-slate-400">เดือนนี้</span>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1">ลิงก์ที่ถูกสร้างทั้งหมด</p>
            <h3 className="text-4xl font-extrabold text-slate-800">45.2k</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
            <Link2 size={24} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold">
          <span className="text-emerald-500 flex items-center bg-emerald-50 px-2 py-1 rounded-md">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            5.4%
          </span>
          <span className="text-slate-400">เดือนนี้</span>
        </div>
      </div>

      <div className="bg-red-50/50 rounded-[1.5rem] p-6 shadow-sm border border-red-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-bold text-red-500 mb-1">บัญชีที่ไม่มีการอัพเดท (&gt;30 วัน)</p>
            <h3 className="text-4xl font-extrabold text-red-600">845</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-500">
            <Clock size={24} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold">
          <span className="text-red-500 flex items-center bg-red-100 px-2 py-1 rounded-md">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
            1.2%
          </span>
          <span className="text-red-400">ต้องการความสนใจ</span>
        </div>
      </div>
    </div>
  );
}