import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; 
import StatCards from '../../components/admin/dashboard/StatCards';
import TrafficChart from '../../components/admin/dashboard/TrafficChart';
import TopPages from '../../components/admin/dashboard/TopPages';
import InactiveUsersTable from '../../components/admin/dashboard/InactiveUsersTable';
import { chartData, topPages } from '../../data/mockData'; 
import api from '../../api/axios';

import DashboardHeader from '../../components/admin/dashboard/DashboardHeader';
import DownloadModal from '../../components/admin/dashboard/DownloadModal';

// React Date Range & date-fns
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import { th } from 'date-fns/locale'; 
import { format, differenceInDays } from 'date-fns'; 

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState('today');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [inactiveMinDays, setInactiveMinDays] = useState(7);

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
      last7Days.setDate(today.getDate() - 6); 
      setDateRange([{ startDate: last7Days, endDate: today, key: 'selection' }]);
    } 
    else if (type === '30days') {
      const last30Days = new Date(today);
      last30Days.setDate(today.getDate() - 29); 
      setDateRange([{ startDate: last30Days, endDate: today, key: 'selection' }]);
    }
    else if (type === 'custom') {
      setIsCalendarOpen(true);
    }
  };

  const fetchStats = async (startDate, endDate, minDays) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/admin/dashboard-stats?startDate=${startDate}&endDate=${endDate}&minDays=${minDays}`);
      if (response.data.status === 'success') {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const start = format(dateRange[0].startDate, 'yyyy-MM-dd');
    const end = format(dateRange[0].endDate, 'yyyy-MM-dd');
    
    
    fetchStats(start, end, inactiveMinDays);
  }, [dateRange, inactiveMinDays]); 

  const handleSendBulkEmail = async () => {
    if (!stats?.inactiveUsers || stats.inactiveUsers.length === 0) {
      alert('ไม่มีบัญชีที่เข้าข่ายให้ส่งอีเมล');
      return;
    }
    const userIds = stats.inactiveUsers.map(user => user.id);
    if (!window.confirm(`ยืนยันการสั่งคิวส่งอีเมลเตือนผู้ใช้ทั้งหมด ${userIds.length} บัญชี ใช่ไหม?`)) {
      return;
    }
    try {
      const response = await api.post('/admin/remind-bulk', { user_ids: userIds });
    } catch (error) {
      console.error("Failed to send bulk emails:", error);
      alert('เกิดข้อผิดพลาดในการสั่งรันระบบส่งอีเมลกลุ่ม');
    }
  };

  const handleSendEmail = async (userId) => {
    if (!window.confirm(`ยืนยันการส่งอีเมลเตือนไปยัง User ID: ${userId} ใช่ไหม?`)) {
      return;
    }
    try {
      const response = await api.post(`/admin/remind-single/${userId}`);
    } catch (error) {
      console.error("Failed to send email:", error);
      alert('เกิดข้อผิดพลาดในการส่งอีเมล');
    }
  };

  // 3. แก้ไขฟังก์ชัน handleDownload ให้สั่งเปิด Modal
  const handleDownload = () => {
    setIsDownloadModalOpen(true);
  };

  const calculateDays = (start, end) => {
    const startMs = start instanceof Date ? start.getTime() : new Date(start).getTime();
    const endMs = end instanceof Date ? end.getTime() : new Date(end).getTime();
    const diff = Math.round((endMs - startMs) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const selectedDaysCount = calculateDays(dateRange[0].startDate, dateRange[0].endDate);

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
      <DashboardHeader 
        title="ภาพรวมระบบ"
        activeFilter={activeFilter}
        onFilterChange={handleDateFilter}
        buttonDateText={getButtonDateText()} 
        subDateText={getSubDateText()}       
        onDownload={handleDownload} 
        downloadText="ดาวน์โหลดรายงาน"
      />

      <StatCards stats={stats} isLoading={isLoading} />

      <div className="mt-6 flex flex-col gap-6">
        <TrafficChart data={stats?.chartData || []} isLoading={isLoading} />
        <TopPages pages={stats?.topPages || []}  days={selectedDaysCount} />
      </div>

      <div className="mt-6">
        <InactiveUsersTable 
          users={stats?.inactiveUsers || []} 
          onFilterChange={(val) => setInactiveMinDays(Number(val))} 
          onSendBulkEmail={handleSendBulkEmail}
          onSendEmail={handleSendEmail}
        />
      </div>

      {/* Popup Calendar Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          {/* ... (โค้ด Calendar ของคุณเหมือนเดิม) ... */}
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

      {/* 4. Popup Download Modal */}
      {isDownloadModalOpen && (
        <DownloadModal 
          onClose={() => setIsDownloadModalOpen(false)} 
          initialTimeRange={activeFilter} 
        />
      )}
    </>
  );
}