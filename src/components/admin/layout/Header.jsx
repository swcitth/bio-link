import React from 'react';
import { Menu, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Header({ isSidebarOpen, setIsSidebarOpen }) {

    // ใช้เพื่อเอาไว้ดูว่าอยู่ path ไหน
    const location = useLocation();

    // สร้างฟังก์ชันเช็ค path และคืนค่าเป็นชื่อหน้า
    const getPageTitle = (pathname) => {
        switch (pathname) {
        case '/admin':
            return 'Dashboard';
        case '/admin/users':
            return 'User Management';
        case '/admin/crm':
            return 'CRM Dashboard';
        // ถ้าอนาคตมีหน้าใหม่ ให้มาเพิ่ม case ตรงนี้ได้เลย เช่น
        // case '/admin/settings': return 'ตั้งค่าระบบ (Settings)';
        default:
            return 'Admin Control Panel';
        }
    };

    const pageTitle = getPageTitle(location.pathname);

    // หาวันที่ปัจจุบัน (เอาไปแทนที่วันที่แบบ Fix ไว้)
    const today = new Date().toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });


  return (
    <header className="h-[80px] bg-white px-6 sm:px-8 flex items-center justify-between border-b border-slate-100 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-500 hover:text-indigo-600 transition-colors p-2 -ml-2 rounded-lg hover:bg-slate-50"
          >
            <Menu size={24} />
          </button>
        )}
        
        <h1 className="text-2xl font-extrabold text-slate-800 hidden sm:block tracking-tight">
          {pageTitle}
        </h1>
      </div>
      
      <div className="text-sm font-medium text-slate-600">
        วันนี้, {today}
      </div>
    </header>
  );
}