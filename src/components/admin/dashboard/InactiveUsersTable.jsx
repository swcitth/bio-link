import React from 'react';
import { AlertCircle, Mail } from 'lucide-react';

export default function InactiveUsersTable({ 
  users = [], // ใส่ Default เป็น array ว่างกันแอปพังกรณีโหลดข้อมูลยังไม่เสร็จ
  onFilterChange, // ฟังก์ชันเมื่อเปลี่ยน Dropdown วันที่
  onSendBulkEmail, // ฟังก์ชันเมื่อกด "ส่งอีเมลกระตุ้นทั้งหมด"
  onSendEmail // ฟังก์ชันเมื่อกดรูปจดหมายรายคน
}) {

  // ฟังก์ชันช่วยเลือกสไตล์ Badge ตามข้อความสถานะ
  const getStatusBadgeClass = (status) => {
    const baseClass = "px-3 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center whitespace-nowrap";
    
    if (status?.includes('เสี่ยง')) {
      // สีส้ม สำหรับ "เสี่ยงต่อการเลิกใช้งาน"
      return `${baseClass} bg-orange-100 text-orange-700`; 
    }
    if (status?.includes('ยังไม่ตั้งค่า')) {
      // สีส้ม/เหลืองพาสเทล สำหรับ "สมัครแล้วยังไม่ตั้งค่า"
      return `${baseClass} bg-amber-100 text-amber-700`; 
    }
    if (status?.includes('ไม่มีความเคลื่อนไหว')) {
      // สีแดงเข้มพาสเทล สำหรับ "ไม่มีความเคลื่อนไหว"
      return `${baseClass} bg-rose-100 text-rose-700`;
    }
    if (status?.includes('ทำงาน')) {
      //  สีฟ้า สำหรับ "ลิงก์ยังทำงานอยู่"
      return `${baseClass} bg-blue-100 text-blue-700`;
    }
    
    // ค่าเริ่มต้นหากไม่ตรงกับเงื่อนไขใดเลย
    return `${baseClass} bg-slate-100 text-slate-600`;
  };

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
          <select 
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-4 py-2.5 outline-none focus:border-indigo-300"
            onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
            defaultValue="7" 
          >
            <option value="7">มากกว่า 7 วัน (สำหรับเทส)</option>
            <option value="14">มากกว่า 14 วัน (สำหรับเทส)</option>
            <option value="30">มากกว่า 30 วัน</option>
          </select>
          
          <button 
            onClick={onSendBulkEmail}
            className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap"
          >
            ส่งอีเมลกระตุ้นทั้งหมด
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-semibold text-slate-400 border-b border-slate-100">
              <th className="pb-4 font-semibold uppercase tracking-wider">ชื่อบัญชี / USERNAME</th>
              <th className="pb-4 font-semibold uppercase tracking-wider text-center">บล็อกใน BIO</th>
              <th className="pb-4 font-semibold uppercase tracking-wider">อัพเดทล่าสุด</th>
              {/* เพิ่มคอลัมน์ใหม่ */}
              <th className="pb-4 font-semibold uppercase tracking-wider">การใช้งานลิงค์ล่าสุด</th>
              <th className="pb-4 font-semibold uppercase tracking-wider">สถานะ</th>
              <th className="pb-4 font-semibold uppercase tracking-wider text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-500">
                  ไม่มีบัญชีที่เข้าข่ายเงื่อนไขนี้
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{user.name}</div>
                    <div className="text-slate-500 text-sm">{user.handle}</div>
                  </td>
                  <td className="py-4 text-center">
                    <span className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
                      {user.links} บล็อก
                    </span>
                  </td>
                  <td className="py-4">
                    <p className="font-medium text-sm text-slate-800">{user.date}</p>
                    <p className="text-xs font-medium text-red-500">{user.daysAgo}</p>
                  </td>

                  {/* ดึงข้อมูลการใช้งานลิงก์ล่าสุดมาแสดง */}
                  <td className="py-4">
                    <span className={`text-sm ${user.lastLinkActivity === 'ไม่มีข้อมูลการใช้งาน' ? 'text-slate-400' : 'font-medium text-slate-800'}`}>
                      {user.lastLinkActivity}
                    </span>
                  </td>
                  
                  <td className="py-4">
                    <span className={getStatusBadgeClass(user.status)}>
                      {user.status}
                    </span>
                  </td>
                  
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => onSendEmail && onSendEmail(user.id)}
                      className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 flex items-center justify-center ml-auto transition-colors" 
                      title="ส่งอีเมลแจ้งเตือน"
                    >
                      <Mail size={16} strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              ))
            )}
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