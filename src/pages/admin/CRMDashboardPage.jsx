import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; 
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import { th } from 'date-fns/locale'; 
import { format } from 'date-fns';

// ⭐️ Import DashboardHeader ที่เราเพิ่งสร้าง
import DashboardHeader from '../../components/admin/dashboard/DashboardHeader';

// ⭐️ Imports สำหรับ Recharts
import { 
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, ReferenceLine, 
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';

// ==========================================
// ⭐️ Mock Data สำหรับกราฟต่างๆ
// ==========================================
const sparklineData = [{v:2},{v:3},{v:2.5},{v:4},{v:3},{v:5},{v:2.5},{v:6},{v:4.5},{v:7},{v:5}];

const trafficData = [
  { name: 'จ.', value: 20 }, { name: 'อ.', value: 35 }, { name: 'พ.', value: 25 },
  { name: 'พฤ.', value: 50 }, { name: 'ศ.', value: 45 }, { name: 'ส.', value: 65 }, { name: 'อา.', value: 60 }
];

const topPagesData = [
  { name: '@sarahstyle', value: 90 }, { name: 'Tech Reviews', value: 75 },
  { name: 'Daily News', value: 65 }, { name: 'My Store', value: 50 },
  { name: '@janedoe', value: 40 }, { name: '@john_c', value: 30 },
  { name: '@bakeme', value: 25 }, { name: 'Music Hub', value: 20 },
  { name: 'Travel', value: 15 }, { name: 'Foodie', value: 10 }
];

const pieData = [
  { name: 'Active', value: 93.3, color: '#3b82f6' },
  { name: 'Inactive', value: 6.7, color: '#fb7185' }
];

// ==========================================
// ⭐️ Component: การ์ดสถิติใบเล็ก (Stat Card)
// ==========================================
const StatCard = ({ title, value, share, trendVal, isUp, trendColor, isRedValue }) => {
  const trendBg = trendColor === 'green' ? 'bg-[#10B981]' : 'bg-[#EF4444]';
  return (
    <div className="bg-white px-5 py-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-[140px]">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[12px] font-bold text-slate-600 tracking-wide">{title}</p>
          <h3 className={`text-3xl font-normal mt-1 tracking-tight ${isRedValue ? 'text-[#EF4444]' : 'text-slate-700'}`}>
            {value}
          </h3>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-[12px] font-bold text-[#4A90E2]">{share}</p>
          <div className={`mt-1.5 text-[10px] font-bold text-white px-1.5 py-0.5 rounded flex items-center gap-0.5 ${trendBg}`}>
             <span className="text-[8px]">{isUp ? '▲' : '▼'}</span> {trendVal}
          </div>
        </div>
      </div>
      
      <div className="h-[35px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData}>
            <Area type="monotone" dataKey="v" stroke="#60A5FA" strokeWidth={2} fill="#EFF6FF" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function CRMDashboardPage() {
  const [activeFilter, setActiveFilter] = useState('7days');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState([{ 
    startDate: new Date(new Date().setDate(new Date().getDate() - 6)), 
    endDate: new Date(), 
    key: 'selection' 
  }]);

  const handleDateFilter = (type) => {
    setActiveFilter(type);
    const today = new Date();
    
    if (type === 'today') {
      setDateRange([{ startDate: today, endDate: today, key: 'selection' }]);
    } else if (type === '7days') {
      setDateRange([{ startDate: new Date(today.setDate(today.getDate() - 6)), endDate: new Date(), key: 'selection' }]);
    } else if (type === '30days') {
      setDateRange([{ startDate: new Date(today.setDate(today.getDate() - 29)), endDate: new Date(), key: 'selection' }]);
    }
    
    if (type === 'custom') {
      setIsCalendarOpen(true);
    }
  };

  useEffect(() => {
    const start = format(dateRange[0].startDate, 'yyyy-MM-dd');
    const end = format(dateRange[0].endDate, 'yyyy-MM-dd');
    console.log(`[CRM API] ดึงข้อมูลช่วงเวลา: เริ่ม ${start} ถึง ${end}`);
  }, [dateRange]);

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
    console.log("Downloading CRM Report...");
    // ใส่ Logic การดาวน์โหลดไฟล์ของ CRM ที่นี่
  };

  return (
    <div className="pb-10 font-sans bg-slate-50/50 min-h-screen">
      
      {/* ─── เรียกใช้งาน DashboardHeader แบบ Component ─── */}
      <DashboardHeader 
        title="ภาพรวมระบบ (CRM)"
        activeFilter={activeFilter}
        onFilterChange={handleDateFilter}
        dateText={getSmallDateText()}
        onDownload={handleDownload}
        downloadText="ดาวน์โหลดรายงาน"
      />

      {/* ─── โครงสร้างหลัก (แยกซ้าย-ขวา) ─── */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* ฝั่งซ้าย: การ์ด 8 ใบ */}
        <div className="w-full xl:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-4">
           <StatCard title="สมาชิกทั้งหมด" value="12,543" share="100%" trendVal="2.1%" isUp={true} trendColor="green" />
           <StatCard title="สมัครสมาชิกวันนี้" value="142" share="1.1%" trendVal="12.5%" isUp={true} trendColor="green" />
           <StatCard title="ลิงก์ที่ถูกสร้างทั้งหมด" value={<span>45.2<span className="text-xl">k</span></span>} share="100%" trendVal="5.4%" isUp={true} trendColor="green" />
           <StatCard title="ไม่มีการอัพเดท (>30 วัน)" value="845" share="6.7%" trendVal="1.2%" isUp={true} trendColor="red" isRedValue={true} />
           <StatCard title="Profile Views รวม" value={<span>128<span className="text-xl">k</span></span>} share="100%" trendVal="8.4%" isUp={true} trendColor="green" />
           <StatCard title="เสี่ยงต่อการเลิกใช้งาน" value="44" share="5.2%" trendVal="-5.2%" isUp={false} trendColor="green" />
           <StatCard title="ไม่มีความเคลื่อนไหว" value="87" share="10.2%" trendVal="2.1%" isUp={true} trendColor="red" />
           <StatCard title="สมัครแล้วยังไม่ตั้งค่า" value="36" share="4.2%" trendVal="-4.5%" isUp={false} trendColor="green" />
        </div>

        {/* ฝั่งขวา: กระดานสถิติใหญ่ */}
        <div className="w-full xl:w-[40%] bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
          
          {/* ส่วนบน: Traffic Overview */}
          <div className="mb-6">
            <h3 className="text-[15px] font-bold text-slate-800">Traffic Overview (ยอดเข้าชมโปรไฟล์)</h3>
            
            <div className="flex justify-between items-end mt-4 mb-4">
              <div>
                <p className="text-xs font-bold text-slate-600 mb-2">เปรียบเทียบการเข้าชม</p>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-2"><span className="w-0.5 h-3 bg-[#60A5FA]"></span> สัปดาห์ที่แล้ว <span className="text-slate-400">|</span> 112k</div>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-700 mt-2">
                  <div className="flex items-center gap-2"><span className="w-5 h-2 bg-[#3B82F6]"></span> สัปดาห์นี้ <span className="font-medium ml-1">128k</span></div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-600">อัตราการเติบโต <span className="text-[#10B981]">+8.4%</span></p>
                <p className="text-[10px] text-slate-400 mt-1">เทียบกับ 7 วันก่อนหน้า</p>
              </div>
            </div>

            {/* กราฟ Area ใหญ่ */}
            <div className="w-full h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={5} />
                  <ReferenceLine y={25} stroke="#cbd5e1" strokeDasharray="3 3" />
                  <ReferenceLine y={25} label={{ position: 'insideLeft', value: 'Median: 18k', fill: 'white', fontSize: 10, fontWeight: 'bold', offset: 5, className: "bg-slate-700 px-1 py-0.5 rounded" }} stroke="none" />
                  <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fill="#60A5FA" fillOpacity={0.9} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <hr className="border-slate-100 my-2" />

          {/* ส่วนล่าง: แยกสองฝั่ง */}
          <div className="grid grid-cols-2 gap-6 mt-4 flex-1">
            
            {/* Top Performing Pages */}
            <div>
              <h3 className="text-[13px] font-bold text-slate-800 mb-4">Top Performing Pages</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-3">
                <span className="w-2 h-2 bg-[#3B82F6]"></span> ยอดเข้าชมสูงสุด
              </div>
              <div className="w-full h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topPagesData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} width={75} />
                    <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Account Status (Donut) */}
            <div className="flex flex-col">
              <h3 className="text-[13px] font-bold text-slate-800 mb-4">สถานะบัญชี (Account Status)</h3>
              <div className="flex flex-col gap-2 text-[10px] font-semibold text-slate-500 mb-2">
                <div className="flex items-center gap-2"><span className="w-2 h-2 bg-[#3B82F6]"></span> Active (อัปเดตล่าสุด &lt; 30 วัน)</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 bg-[#FB7185]"></span> Inactive (ไม่มีความเคลื่อนไหว)</div>
              </div>
              
              <div className="flex-1 relative flex items-center justify-center mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Labels รอบๆ โดนัท */}
                <span className="absolute left-[5%] top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-700">6.7%</span>
                <span className="absolute right-[0%] bottom-[10%] text-[11px] font-bold text-slate-700">93.3%</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── Popup Calendar Modal ─── */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-[24px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="text-lg font-bold text-slate-800">เลือกช่วงวันที่</h3>
              <button onClick={() => setIsCalendarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
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
              />
            </div>
            <div className="mt-6">
              <button onClick={() => setIsCalendarOpen(false)} className="w-full py-3 bg-[#F4F5F7] hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors">
                เสร็จสิ้น
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}