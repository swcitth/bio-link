import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; 
import StatCards from '../../components/admin/dashboard/StatCards';
import TrafficChart from '../../components/admin/dashboard/TrafficChart';
import TopPages from '../../components/admin/dashboard/TopPages';
import InactiveUsersTable from '../../components/admin/dashboard/InactiveUsersTable';
import { chartData, topPages, inactiveUsers } from '../../data/mockData';
import api from '../../api/axios';

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

  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // ฟังก์ชันดึงข้อมูลจาก Backend
  const fetchStats = async (startDate, endDate) => {
    setIsLoading(true);
    try {
      // ส่ง query params ตามรูปแบบที่กำหนด
      const response = await api.get(`/admin/dashboard-stats?startDate=${startDate}&endDate=${endDate}`);
      if (response.data.status === 'success') {
        setStats(response.data.data); // เอา data ไปเก็บใน state
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // ใช้ format จาก date-fns
    const start = format(dateRange[0].startDate, 'yyyy-MM-dd');
    const end = format(dateRange[0].endDate, 'yyyy-MM-dd');
    
    console.log(`[เตรียมยิง API] ช่วงเวลา: เริ่ม ${start} ถึง ${end}`);
    
    fetchStats(start, end);

  }, [dateRange]);

  const getButtonClass = (filterType) => {
    return activeFilter === filterType
      ? "px-4 py-1 text-xs font-bold bg-[#6B46FF] text-white rounded-full transition-colors"
      : "px-4 py-1 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors";
  };

  // ฟังก์ชันสำหรับแปลงรูปแบบวันที่เพื่อแสดงบนปุ่ม "กำหนดเอง"
  const getCustomDateText = () => {
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

  // ฟังก์ชันคำนวณระยะห่างของวัน
  const calculateDays = (start, end) => {
    const startMs = start instanceof Date ? start.getTime() : new Date(start).getTime();
    const endMs = end instanceof Date ? end.getTime() : new Date(end).getTime();
    
    const diff = Math.round((endMs - startMs) / (1000 * 60 * 60 * 24));
    return diff + 1; // +1 เพราะให้นับวันเริ่มต้นด้วย
  };

  const { startDate, endDate } = dateRange[0];
  const selectedDaysCount = calculateDays(startDate, endDate);

  // ฟังก์ชันสำหรับสร้างข้อความในปุ่ม (เช่น "1 มิ.ย. - 22 มิ.ย. (22 วัน)")
  const getButtonDateText = () => {
    const { startDate, endDate } = dateRange[0];
    const startStr = format(startDate, 'd MMM', { locale: th });
    const endStr = format(endDate, 'd MMM', { locale: th });
    const days = differenceInDays(endDate, startDate) + 1;
    
    if (startDate.getTime() === endDate.getTime()) {
      return `${startStr} (1 วัน)`;
    }
    return `${startStr} - ${endStr} (${days} วัน)`;
  };

  // ฟังก์ชันสำหรับสร้างข้อความด้านล่าง (เช่น "30 มิ.ย. 2026 (GMT+7)")
  const getSubDateText = () => {
    const { startDate, endDate } = dateRange[0];
    const startStr = format(startDate, 'd MMM yyyy', { locale: th });
    const endStr = format(endDate, 'd MMM yyyy', { locale: th });
    
    if (startDate.getTime() === endDate.getTime()) {
      return `${startStr} (GMT+7)`;
    }
    return `${startStr} - ${endStr} (GMT+7)`;
  };


  return (
    <>
      {/* ─── เรียกใช้งาน DashboardHeader แบบ Component ─── */}
      <DashboardHeader 
        title="ภาพรวมระบบ"
        activeFilter={activeFilter}
        onFilterChange={handleDateFilter}
        buttonDateText={getButtonDateText()} // ส่งข้อความปุ่ม
        subDateText={getSubDateText()}       // ส่งข้อความด้านล่าง
        onDownload={handleDownload}
        downloadText="ดาวน์โหลดรายงาน"
      />

      {/* ส่ง Data ลงไปยัง StatCards */}
      <StatCards stats={stats} isLoading={isLoading} />

      <div className="mt-6 flex flex-col gap-6">
        
        <TrafficChart data={stats?.chartData || []} isLoading={isLoading} />
        <TopPages pages={stats?.topPages || []}  days={selectedDaysCount} />
        
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