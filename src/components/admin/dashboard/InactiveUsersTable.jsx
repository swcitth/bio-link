import React, { useState } from "react";
import { AlertCircle, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

export default function InactiveUsersTable({ 
  users = [], // ใส่ Default เป็น array ว่างกันแอปพังกรณีโหลดข้อมูลยังไม่เสร็จ
  onFilterChange, // ฟังก์ชันเมื่อเปลี่ยน Dropdown วันที่
  onSendBulkEmail, // ฟังก์ชันเมื่อกด "ส่งอีเมลกระตุ้นทั้งหมด"
  onSendEmail // ฟังก์ชันเมื่อกดรูปจดหมายรายคน
}) {

  // เพิ่ม State สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // คำนวณข้อมูลสำหรับการแบ่งหน้า
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // ฟังก์ชันช่วยเลือกสไตล์ Badge ตามข้อความสถานะ
  // ฟังก์ชันช่วยเลือกสไตล์ Badge ตามข้อความสถานะ
  const getStatusBadgeClass = (status) => {
    const baseClass = "px-3 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center whitespace-nowrap";
    
    if (!status) return `${baseClass} bg-slate-100 text-slate-600`;
    
    // ดักจับสถานะ "สมัครแล้วยังไม่ตั้งค่า" -> สีเหลือง/ส้ม
    if (status.includes('ยังไม่ตั้งค่า')) {
      return `${baseClass} bg-amber-100 text-amber-700`; 
    }
    
    // ดักจับสถานะ "ไม่มีผู้เข้าชม และ ไม่มีการอัพเดทบัญชี" -> สีแดง (เพิ่มคำใหม่เข้าไป)
    if (status.includes('ไม่มีผู้เข้าชม') || status.includes('ไม่มีความเคลื่อนไหว')) {
      return `${baseClass} bg-rose-100 text-rose-700`;
    }
    
    // ดักจับสถานะ "มีผู้เข้าชม (ไม่มีการอัพเดทบล็อก)" -> สีฟ้า (เพิ่มคำใหม่เข้าไป)
    if (status.includes('มีผู้เข้าชม') || status.includes('ทำงาน')) {
      return `${baseClass} bg-blue-100 text-blue-700`;
    }
    
    // ค่าเริ่มต้น สีเทา
    return `${baseClass} bg-slate-100 text-slate-600`;
  };

  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-50 flex flex-col h-full">
      
      {/* ส่วนหัวแสดงหัวข้อและปุ่มควบคุม */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 text-orange-500 bg-orange-50 p-1.5 rounded-full shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">บัญชีที่ไม่มีการอัพเดท</h2>
            {/* 💡 แนะนำเพิ่มเติม: ถ้าอยากให้เลข 30 วัน เปลี่ยนตาม Dropdown ต้องใช้ตัวแปร State มาแสดงตรงนี้นะครับ */}
            <p className="text-sm text-slate-500">บัญชีที่ไม่มีการล็อกอินหรือแก้ไขลิงก์เกินระยะเวลาที่กำหนด</p>
          </div>
        </div>
        
        {/* 🛠️ แก้ไขส่วนนี้: เปลี่ยน flex เป็น flex-wrap หรือเรียงแนวตั้งบนมือถือ (w-full sm:w-auto) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          <select 
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-4 py-2.5 outline-none focus:border-indigo-300"
            onChange={(e) => {
              if (onFilterChange) onFilterChange(e.target.value);
              setCurrentPage(1);
            }}
            defaultValue="7" 
          >
            <option value="7">มากกว่า 7 วัน (สำหรับเทส)</option>
            <option value="14">มากกว่า 14 วัน (สำหรับเทส)</option>
            <option value="30">มากกว่า 30 วัน</option>
          </select>
          
          <button 
            onClick={onSendBulkEmail}
            className="w-full sm:w-auto bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap text-center"
          >
            ส่งอีเมลกระตุ้นทั้งหมด
          </button>
        </div>
      </div>

      {/* ปรับปรุงโครงสร้างตาราง HTML แบบเดียวกับ TopPages มี overflow-x-auto และ whitespace-nowrap เพื่อให้สไลด์ดูบนมือถือได้สวยงาม */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="text-[11px] font-bold text-slate-400 border-b border-slate-100 uppercase tracking-widest">
              <th className="pb-4 pl-2">ชื่อบัญชี</th>
              <th className="pb-4 text-center">จำนวนบล็อก</th>
              <th className="pb-4 px-4">แก้ไขบล็อกล่าสุด</th>
              <th className="pb-4 px-4">ผู้เข้าชมล่าสุด</th>
              <th className="pb-4 px-4">สถานะ</th>
              <th className="pb-4 pr-2 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-sm text-slate-400">
                  ไม่มีบัญชีที่เข้าข่ายเงื่อนไขนี้
                </td>
              </tr>
            ) : (
              currentItems.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  
                  {/* คอลัมน์ที่ 1: ชื่อบัญชี / USERNAME */}
                  <td className="py-4 pl-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-[15px]">{user.name}</span>
                      <span className="text-[13px] text-slate-500">{user.handle}</span>
                    </div>
                  </td>
                  
                  {/* คอลัมน์ที่ 2: บล็อกใน BIO */}
                  <td className="py-4 text-center">
                    <span className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
                      {user.links} บล็อก
                    </span>
                  </td>
                  
                  {/* คอลัมน์ที่ 3: อัพเดทล่าสุด */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-slate-800">{user.date}</span>
                      <span className="text-xs font-medium text-red-500">{user.daysAgo}</span>
                    </div>
                  </td>

                  {/* คอลัมน์ที่ 4: การใช้งานลิงค์ล่าสุด */}
                  <td className="py-4 px-4">
                    <span className={`text-sm ${user.lastLinkActivity === 'ไม่มีข้อมูลการใช้งาน' ? 'text-slate-400' : 'font-medium text-slate-800'}`}>
                      {user.lastLinkActivity}
                    </span>
                  </td>
                  
                  {/* คอลัมน์ที่ 5: สถานะ */}
                  <td className="py-4 px-4">
                    <span className={getStatusBadgeClass(user.status)}>
                      {user.status}
                    </span>
                  </td>
                  
                  {/* คอลัมน์ที่ 6: ปุ่มจัดการรายคน */}
                  <td className="py-4 pr-2 text-right">
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
      
      {/* ส่วน Footer แสดง Pagination */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
        <span className="text-sm text-slate-500 font-medium">
          แสดงผล {users.length === 0 ? 0 : indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, users.length)} จากทั้งหมด {users.length} รายการ
        </span>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button 
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                currentPage === 1 
                  ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50/50' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 cursor-pointer'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            
            <span className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
              หน้า {currentPage} / {totalPages}
            </span>

            <button 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                currentPage === totalPages 
                  ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50/50' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 cursor-pointer'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}