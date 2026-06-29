import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; 
import StatCards from '../../components/admin/dashboard/StatCards';
import TrafficChart from '../../components/admin/dashboard/TrafficChart';
import TopPages from '../../components/admin/dashboard/TopPages';
import InactiveUsersTable from '../../components/admin/dashboard/InactiveUsersTable';
import { chartData, topPages, inactiveUsers } from '../../data/mockData';

// ⭐️ Import DashboardHeader ที่เราแยก Component ไว้
import DashboardHeader from '../../components/admin/dashboard/DashboardHeader';

// React Date Range & date-fns
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import { th } from 'date-fns/locale'; 
import { format, differenceInDays } from 'date-fns'; // ฟังก์ชันจัดรูปแบบวันที่และคำนวณวัน

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState('today');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const handleDateFilter = (type) => {
    setActiveFilter(type);
    const today = new Date();
    
    if (type === 'today') {
      setDateRange([{ startDate: today, endDate: today, key: 'selection' }]);
    } 
    else if (type === '7days') {
      const last7Days = new Date(today);
      last7Days.setDate(today.getDate() - 6); // รวมวันนี้เป็น 7 วัน
      setDateRange([{ startDate: last7Days, endDate: today, key: 'selection' }]);
    } 
    else if (type === '30days') {
      const last30Days = new Date(today);
      last30Days.setDate(today.getDate() - 29); // รวมวันนี้เป็น 30 วัน
      setDateRange([{ startDate: last30Days, endDate: today, key: 'selection' }]);
    }
    else if (type === 'custom') {
      setIsCalendarOpen(true);
    }
  };

  useEffect(() => {
    // ใช้ format จาก date-fns
    const start = format(dateRange[0].startDate, 'yyyy-MM-dd');
    const end = format(dateRange[0].endDate, 'yyyy-MM-dd');
    
    console.log(`[เตรียมยิง API] ช่วงเวลา: เริ่ม ${start} ถึง ${end}`);
    
    // ตรงนี้คุณสามารถนำ start และ end ไปใส่ใน state หรือเรียก API ได้เลยครับ
  }, [dateRange]);

  // 🌟 ฟังก์ชันสำหรับแปลงรูปแบบวันที่เพื่อแสดงบน Component Header
  const getSmallDateText = () => {
    const { startDate, endDate } = dateRange[0];
    const startStr = format(startDate, 'd MMM yyyy', { locale: th });
    const endStr = format(endDate, 'd MMM yyyy', { locale: th });
    
    if (startDate.getTime() === endDate.getTime()) {
      return `${startStr} (GMT+7)`;
    }
    return `${startStr} - ${endStr} (GMT+7)`;
  };

  const handleDownload = () => {
    console.log("Downloading Dashboard Report...");
    // ใส่ Logic ดาวน์โหลดที่นี่
  };

  return (
    <>
      {/* ─── เรียกใช้งาน DashboardHeader แบบ Component ─── */}
      <DashboardHeader 
        title="ภาพรวมระบบ"
        activeFilter={activeFilter}
        onFilterChange={handleDateFilter}
        dateText={getSmallDateText()}
        onDownload={handleDownload}
        downloadText="ดาวน์โหลดรายงาน"
      />

      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <TrafficChart data={chartData} />
        <TopPages pages={topPages} />
      </div>

      <div className="mt-6">
        <InactiveUsersTable users={inactiveUsers} />
      </div>

      {/* Popup Calendar Modal (คงเดิม 100%) */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-[24px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="text-lg font-bold text-slate-800">เลือกช่วงวันที่</h3>
              <button 
                onClick={() => setIsCalendarOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <DateRange
                editableDateInputs={true}
                onChange={item => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                locale={th} 
                rangeColors={['#6B46FF']} 
                direction="horizontal"
                maxDate={new Date()}
              />
            </div>
            
            <div className="mt-6">
              <button 
                onClick={() => setIsCalendarOpen(false)}
                className="w-full py-3 bg-[#F4F5F7] hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
              >
                เสร็จสิ้น
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}