import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#F4F5F7] font-sans text-slate-800 overflow-hidden">
      
      {/* Sidebar คงที่สำหรับทุกหน้า */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Header คงที่สำหรับทุกหน้า */}
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* พื้นที่สำหรับแสดงเนื้อหาของแต่ละหน้า (Pages) ที่จะถูกสลับเปลี่ยนไปมา */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-[1400px] mx-auto space-y-6">
            {children}
          </div>
        </div>

      </main>
    </div>
  );
}