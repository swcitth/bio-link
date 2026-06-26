import React, { useState, useEffect } from 'react';
import { Download, Menu, X, Calendar as CalendarIcon, ChevronDown } from 'lucide-react'; 
import StatCards from '../../components/admin/dashboard/StatCards';
import TrafficChart from '../../components/admin/dashboard/TrafficChart';
import TopPages from '../../components/admin/dashboard/TopPages';
import InactiveUsersTable from '../../components/admin/dashboard/InactiveUsersTable';
import { chartData, topPages, inactiveUsers } from '../../data/mockData';

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

  const getButtonClass = (filterType) => {
    return activeFilter === filterType
      ? "px-4 py-1 text-xs font-bold bg-[#6B46FF] text-white rounded-full transition-colors"
      : "px-4 py-1 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors";
  };

  // 🌟 ฟังก์ชันสำหรับแปลงรูปแบบวันที่เพื่อแสดงบนปุ่ม "กำหนดเอง"
  const getCustomDateText = () => {
    const { startDate, endDate } = dateRange[0];
    
    // แปลงเป็น ดดด. (เช่น 1 มิ.ย.)
    const startStr = format(startDate, 'd MMM', { locale: th });
    const endStr = format(endDate, 'd MMM', { locale: th });
    
    // คำนวณจำนวนวัน (+1 เพราะนับรวมวันแรกด้วย เช่น 1 ถึง 25 คือ 25 วัน)
    const days = differenceInDays(endDate, startDate) + 1;

    // ถ้าเลือกวันเดียวกัน
    if (startDate.getTime() === endDate.getTime()) {
      return `${startStr} (1 วัน)`;
    }
    
    // ถ้าเลือกเป็นช่วง
    return `${startStr} - ${endStr} (${days} วัน)`;
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">ภาพรวมระบบ</h1>
          
          <div className="flex items-center mt-3">
            {/* 🌟 นำทุกอย่างมารวมไว้ใน Container สีขาวกรอบเดียว */}
            <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-slate-100 transition-all duration-300">
              
              <button className={getButtonClass('today')} onClick={() => handleDateFilter('today')}>วันนี้</button>
              <button className={getButtonClass('7days')} onClick={() => handleDateFilter('7days')}>7 วัน</button>
              <button className={getButtonClass('30days')} onClick={() => handleDateFilter('30days')}>30 วัน</button>
              <button className={getButtonClass('custom')} onClick={() => handleDateFilter('custom')}>กำหนดเอง</button>

              {/* 🌟 วันที่ที่เลือก จะโผล่มาต่อท้ายในกล่องเดียวกัน */}
              {activeFilter === 'custom' && (
                <div className="flex items-center animate-in fade-in slide-in-from-left-4 duration-300">
                  
                  {/* เส้นคั่นบางๆ */}
                  <div className="w-px h-5 bg-slate-200 mx-1.5"></div>
                  
                  <button 
                    onClick={() => setIsCalendarOpen(true)}
                    className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-slate-50 transition-colors group"
                  >
                    <CalendarIcon size={14} className="text-[#6B46FF]" strokeWidth={2.5} />
                    <span className="text-sm font-bold text-slate-700 whitespace-nowrap">
                      {getCustomDateText()}
                    </span>
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </button>
                  
                </div>
              )}

            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2 ml-1">26 มิ.ย. 2026 (GMT+7)</p>
        </div>
        
        <button className="bg-[#6B46FF] hover:bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-colors shadow-sm shadow-indigo-200">
          <Download size={16} />
          ดาวน์โหลดรายงาน
        </button>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TrafficChart data={chartData} />
        <TopPages pages={topPages} />
      </div>

      <InactiveUsersTable users={inactiveUsers} />

      {/* Popup Calendar Modal */}
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