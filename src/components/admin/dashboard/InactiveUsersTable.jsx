import React from 'react';
import { AlertCircle, Mail } from 'lucide-react';

export default function InactiveUsersTable({ users }) {
  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 text-orange-500 bg-orange-50 p-1.5 rounded-full">
            <AlertCircle size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">บัญชีที่ไม่มีการอัพเดท</h2>
            <p className="text-sm text-slate-500">บัญชีที่ไม่มีการล็อกอินหรือแก้ไขลิงก์เกิน 30 วัน</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-4 py-2.5 outline-none focus:border-indigo-300">
            <option>มากกว่า 30 วัน</option>
            <option>มากกว่า 60 วัน</option>
            <option>มากกว่า 90 วัน</option>
          </select>
          <button className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap">
            ส่งอีเมลกระตุ้นทั้งหมด
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-bold text-slate-400 border-b border-slate-100">
              <th className="pb-4 font-bold uppercase tracking-wider">ชื่อบัญชี / USERNAME</th>
              <th className="pb-4 font-bold uppercase tracking-wider text-center">ลิงก์ใน BIO</th>
              <th className="pb-4 font-bold uppercase tracking-wider">อัพเดทล่าสุดเมื่อ</th>
              <th className="pb-4 font-bold uppercase tracking-wider">สถานะ</th>
              <th className="pb-4 font-bold uppercase tracking-wider text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${user.iconColor} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                      {user.initial}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.handle}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-center">
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                    {user.links}
                  </span>
                </td>
                <td className="py-4">
                  <p className="font-bold text-sm text-slate-800">{user.date}</p>
                  <p className="text-xs font-bold text-red-500">{user.daysAgo}</p>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.statusColor}`}></div>
                    <span className="text-sm text-slate-600 font-medium">{user.status}</span>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <button className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 flex items-center justify-center ml-auto transition-colors" title="ส่งอีเมลแจ้งเตือน">
                    <Mail size={16} strokeWidth={2.5} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
        <button className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
          ดูรายการทั้งหมด
        </button>
      </div>
    </div>
  );
}