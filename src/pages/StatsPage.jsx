// ============================================================
// src/pages/StatsPage.jsx
// ============================================================

import React, { useState, useEffect } from "react";
import { FaEye, FaMousePointer, FaChartBar, FaStar, FaLink, FaCalendarAlt, FaTrophy } from "react-icons/fa";
import { ICON_MAP } from "../constants/icons";
import api from "../api/axios";

// ⭐️ Import ไลบรารี Recharts
import { AreaChart, Area, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const getSafeNumber = (val) => {
  if (!val) return 0;
  const num = Number(String(val).replace(/,/g, ''));
  return isNaN(num) ? 0 : num;
};

const formatThaiDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${parseInt(d)} ${monthNames[parseInt(m) - 1]} ${parseInt(y) + 543}`;
};

const formatShortThaiDate = (dateStr) => {
  if (!dateStr) return "";
  const [, m, d] = dateStr.split("-");
  const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${parseInt(d)} ${monthNames[parseInt(m) - 1]}`;
};

const getDaysCount = (start, end) => {
  if (!start || !end) return 0;
  const diffTime = Math.abs(new Date(end) - new Date(start));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

// ⭐️ ฟังก์ชันสำหรับเรนเดอร์ Tag แสดงแนวโน้มเปอร์เซ็นต์ (% Growth Trend)
const renderTrendBadge = (value) => {
  if (value === undefined || value === null) return null;
  const num = Number(value);
  if (num > 0) {
    return <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">▲ +{num}%</span>;
  }
  if (num < 0) {
    return <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">▼ {num}%</span>;
  }
  return <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-md">0%</span>;
};

// 💬 Custom Tooltip สำหรับ Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const views = payload.find(p => p.dataKey === 'views')?.value || 0;
    const clicks = payload.find(p => p.dataKey === 'clicks')?.value || 0;
    
    return (
      <div className="bg-white border border-slate-200/60 rounded-xl shadow-xl p-3 text-xs min-w-[135px]">
        <div className="font-extrabold text-slate-700 text-center tracking-wide">
          {formatThaiDate(label)}
        </div>
        <div className="w-full border-t border-slate-100 my-1.5"></div>
        <div className="space-y-1">
          <div className="flex justify-between gap-4 text-slate-500 font-semibold">
            <span>👀 เข้าชม:</span>
            <span className="font-extrabold text-indigo-600">{views.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4 text-slate-500 font-semibold">
            <span>🖱️ คลิก:</span>
            <span className="font-extrabold text-violet-500">{clicks.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const StatsPage = ({ links }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dateRange, setDateRange] = useState('7days'); 
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarView, setCalendarView] = useState(new Date());

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      let url = `/user/analytics?range=${dateRange}`;
      if (dateRange === 'custom' && customStart && customEnd) {
        url += `&start=${customStart}&end=${customEnd}`;
      }
      const response = await api.get(url);
      if (response.data.success) setStats(response.data.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError("ไม่สามารถโหลดข้อมูลสถิติได้ในขณะนี้");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange === 'custom') return; 
    fetchAnalytics();
  }, [dateRange]);

  const handleDayClick = (dateStr) => {
    if (new Date(dateStr) > new Date().setHours(0,0,0,0)) return; 
    if (!customStart || (customStart && customEnd)) {
      setCustomStart(dateStr);
      setCustomEnd('');
    } else {
      dateStr < customStart ? setCustomStart(dateStr) : setCustomEnd(dateStr);
    }
  };

  const renderCalendarDropdown = () => {
    const today = new Date();
    const year = calendarView.getFullYear();
    const month = calendarView.getMonth();
    const fullMonthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    const totalDays = new Date(year, month + 1, 0).getDate();
    let firstDayIdx = new Date(year, month, 1).getDay();
    firstDayIdx = firstDayIdx === 0 ? 6 : firstDayIdx - 1; 
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    const cells = [];
    
    for (let i = firstDayIdx - 1; i >= 0; i--) {
      cells.push({ day: prevMonthTotalDays - i, month: month === 0 ? 11 : month - 1, year: month === 0 ? year - 1 : year, isCurrentMonth: false });
    }
    for (let d = 1; d <= totalDays; d++) {
      cells.push({ day: d, month, year, isCurrentMonth: true });
    }
    const nextPadding = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= nextPadding; d++) {
      cells.push({ day: d, month: month === 11 ? 0 : month + 1, year: month === 11 ? year + 1 : year, isCurrentMonth: false });
    }

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const yearsRange = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i);
    const customDaysCount = getDaysCount(customStart, customEnd);

    return (
      <div className="absolute right-0 mt-2 w-[310px] bg-white p-4 rounded-2xl border border-slate-200 shadow-2xl z-50 text-slate-800">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <button type="button" onClick={() => setCalendarView(new Date(year, month - 1, 1))} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">&larr;</button>
          <div className="flex items-center gap-1.5">
            <select value={month} onChange={(e) => setCalendarView(new Date(year, parseInt(e.target.value), 1))} className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none">
              {fullMonthNames.map((name, idx) => (year === currentYear && idx > currentMonth ? null : <option key={idx} value={idx}>{name}</option>))}
            </select>
            <select value={year} onChange={(e) => setCalendarView(new Date(parseInt(e.target.value), (parseInt(e.target.value) === currentYear && month > currentMonth) ? currentMonth : month, 1))} className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none">
              {yearsRange.map((y) => <option key={y} value={y}>พ.ศ. {y + 543}</option>)}
            </select>
          </div>
          <button type="button" onClick={() => setCalendarView(new Date(year, month + 1, 1))} disabled={year >= currentYear && month >= currentMonth} className="p-1.5 disabled:text-slate-200 hover:bg-slate-100 rounded-lg text-slate-500">&rarr;</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
          {['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
          {cells.map((cell, idx) => {
            const dateStr = `${cell.year}-${String(cell.month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
            const isFuture = new Date(cell.year, cell.month, cell.day) > today.setHours(0,0,0,0);
            const isSelectedStart = customStart === dateStr;
            const isSelectedEnd = customEnd === dateStr;
            const isInRange = customStart && customEnd && dateStr > customStart && dateStr < customEnd;

            if (!cell.isCurrentMonth) return <div key={idx} className="w-8 h-8 flex items-center justify-center text-slate-200 text-[11px] mx-auto">{cell.day}</div>;
            if (isFuture) return <div key={idx} className="w-8 h-8 flex items-center justify-center text-slate-300 bg-slate-50/50 rounded-lg line-through cursor-not-allowed mx-auto text-[11px]">{cell.day}</div>;

            let wrapperClass = "w-9 h-9 mx-auto flex items-center justify-center relative ";
            let btnClass = "w-8 h-8 flex items-center justify-center font-bold text-[11px] rounded-full transition-all z-10 ";

            if (isSelectedStart || isSelectedEnd) {
              wrapperClass += isSelectedStart && customEnd ? "bg-indigo-50 rounded-l-full" : isSelectedEnd && customStart ? "bg-indigo-50 rounded-r-full" : "";
              btnClass += "bg-indigo-600 text-white shadow-md";
            } else if (isInRange) {
              wrapperClass += "bg-indigo-50 w-full rounded-none";
              btnClass += "text-indigo-600";
            } else {
              btnClass += "text-slate-600 hover:bg-slate-100";
            }

            return (
              <div key={idx} className={wrapperClass}>
                <button type="button" onClick={() => handleDayClick(dateStr)} className={btnClass}>{cell.day}</button>
              </div>
            );
          })}
        </div>
        {customStart && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="text-[11px] text-center font-bold text-indigo-600 bg-indigo-50/60 py-2 rounded-xl px-1">
              {customStart && customEnd ? `ช่วงเวลา: ${formatShortThaiDate(customStart)} - ${formatShortThaiDate(customEnd)} (${customDaysCount} วัน)` : `วันเริ่มต้น: ${formatShortThaiDate(customStart)} (เลือกวันสิ้นสุด)`}
            </div>
            {customStart && customEnd && (
              <button type="button" onClick={() => { setIsCalendarOpen(false); fetchAnalytics(); }} className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 shadow-md">เสร็จสิ้น</button>
            )}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) return <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100"><div className="text-indigo-600 font-semibold animate-pulse text-sm">📊 กำลังคำนวณและดึงข้อมูลสถิติจริง...</div></div>;
  if (error) return <div className="text-center py-20 bg-white rounded-2xl border border-red-100 text-red-500 font-medium text-sm">❌ {error}</div>;

  // กรองลิงก์ YouTube/TikTok ออก
  const displayLinks = stats?.links ? stats.links.filter(link => {
    const originalLink = links?.find((l) => l.id === link.id);
    return !(originalLink?.icon === "Youtube" || originalLink?.icon === "TikTok" || originalLink?.type === "VIDEO" || (link.url && (link.url.includes("youtu") || link.url.includes("tiktok.com"))));
  }) : [];
  
  const customDaysCount = getDaysCount(customStart, customEnd);

  // เตรียมข้อมูลกราฟ
  const chartData = stats?.chart_data?.map(d => ({
    date: d.date,
    views: getSafeNumber(d.views),
    clicks: getSafeNumber(d.clicks)
  })) || [];

  // ⭐️ ข้อความระบุช่วงเวลาด้านล่างการ์ด
  const getRangeText = () => {
    if (dateRange === 'today') return 'วันนี้';
    if (dateRange === '7days') return '7 วันล่าสุด';
    if (dateRange === '30days') return '30 วันล่าสุด';
    if (dateRange === 'custom') return customStart && customEnd ? 'ช่วงเวลาที่เลือก' : 'กำหนดเอง';
    return '';
  };
  const rangeText = getRangeText();

  // ⭐️ หาลิงก์ที่ถูกคลิกเยอะที่สุด (อันดับ 1)
  const topLink = displayLinks.length > 0 && displayLinks[0].clicks > 0 ? displayLinks[0] : null;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* ส่วนหัว และ ตัวกรองวันที่ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">สถิติการใช้งาน</h1>
          <p className="text-sm text-slate-500 mt-1">ติดตามประสิทธิภาพของหน้า BioLink ของคุณ</p>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
            {['today', '7days', '30days', 'custom'].map((range) => (
              <button key={range} onClick={() => { setDateRange(range); if (range !== 'custom') setIsCalendarOpen(false); }} className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all ${dateRange === range ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>{range === 'today' ? 'วันนี้' : range === '7days' ? '7 วันล่าสุด' : range === '30days' ? '30 วัน' : 'กำหนดเอง'}</button>
            ))}
          </div>
          {dateRange === 'custom' && (
            <div className="relative w-full md:w-auto">
              <button type="button" onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs sm:text-sm text-slate-700 font-bold hover:bg-slate-100 transition-all shadow-sm w-full md:w-auto">
                <div className="flex items-center gap-2"><FaCalendarAlt className="text-indigo-600" size={13} /><span>{customStart && customEnd ? `${formatShortThaiDate(customStart)} - ${formatShortThaiDate(customEnd)} (${customDaysCount} วัน)` : "เลือกช่วงเวลา..."}</span></div>
                <span className="text-[10px] text-slate-400">▼</span>
              </button>
              {isCalendarOpen && renderCalendarDropdown()}
            </div>
          )}
        </div>
      </div>

      {/* ⭐️ การ์ดสถิติ 5 กล่อง (พร้อมระบบ Trend Indicator) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* การ์ด 1: ยอดเข้าชม */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between order-1">
          <div>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><FaEye className="text-indigo-500" size={14} /> ยอดเข้าชม</span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">{stats?.total_views?.toLocaleString() || 0}</h2>
          </div>
          <div className="flex items-center justify-between gap-2 mt-3">
            <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded w-fit">ยอด{rangeText}</span>
            {renderTrendBadge(stats?.trend?.views)}
          </div>
        </div>

        {/* การ์ด 2: ยอดคลิก */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between order-2">
          <div>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><FaMousePointer className="text-violet-500" size={12} /> ยอดคลิก</span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">{stats?.total_clicks?.toLocaleString() || 0}</h2>
          </div>
          <div className="flex items-center justify-between gap-2 mt-3">
            <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded w-fit">ยอด{rangeText}</span>
            {renderTrendBadge(stats?.trend?.clicks)}
          </div>
        </div>

        {/* การ์ด 3: CTR */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between order-3">
          <div>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><FaChartBar className="text-emerald-500" size={14} /> CTR</span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">{stats?.ctr || 0}%</h2>
          </div>
          <div className="flex items-center justify-between gap-2 mt-3">
            <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded w-fit">อัตราคลิก{rangeText}</span>
            {renderTrendBadge(stats?.trend?.ctr)}
          </div>
        </div>

        {/* การ์ด 4: ลิงก์ยอดนิยม */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 col-span-2 md:col-span-2 lg:col-span-1 flex flex-col justify-between order-5 lg:order-4">
          <div>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><FaTrophy className="text-amber-500" size={14} /> ลิงก์ยอดนิยม</span>
            <h2 className="text-sm font-bold text-slate-800 mt-3 truncate" title={topLink ? topLink.title : ""}>
              {topLink ? (topLink.title !== "ไม่มีชื่อลิงก์" ? topLink.title : "ลิงก์ของคุณ") : "ยังไม่มีข้อมูลคลิก"}
            </h2>
          </div>
          <span className="text-[10px] text-amber-600 mt-3 font-semibold bg-amber-50 px-2 py-1 rounded w-fit">
            {topLink ? `${topLink.clicks} คลิก (${rangeText})` : `ยอด${rangeText}`}
          </span>
        </div>

        {/* การ์ด 5: ยอดกด Save */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between order-4 lg:order-5">
          <div>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><FaStar className="text-pink-500" size={14} /> ยอดกด Save</span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">{stats?.total_saves || 0}</h2>
          </div>
          <div className="flex items-center justify-between gap-2 mt-3">
            <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded w-fit">ยอด{rangeText}</span>
            {renderTrendBadge(stats?.trend?.saves)}
          </div>
        </div>

      </div>

      {/* ─── ส่วนแสดงผลกราฟโดยใช้ Recharts ─── */}
      {dateRange !== 'today' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FaChartBar className="text-indigo-600" size={15} /> แนวโน้มเข้าชมและคลิก ({rangeText})
            </h3>
            <div className="flex items-center gap-4 text-[11px] font-semibold">
              <div className="flex items-center gap-1.5 text-indigo-600">
                <span className="w-5 border-t-[3px] border-solid border-indigo-600 inline-block rounded-full"></span> เข้าชม
              </div>
              <div className="flex items-center gap-1.5 text-violet-500">
                <span className="w-5 border-t-[3px] border-dashed border-violet-500 inline-block"></span> คลิก
              </div>
            </div>
          </div>

          <div className="w-full h-[280px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatShortThaiDate} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                    dy={10}
                    minTickGap={20}
                  />
                  
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorViews)" 
                    activeDot={{ r: 5, strokeWidth: 2, stroke: '#4f46e5', fill: '#ffffff' }}
                    dot={{ r: 3, strokeWidth: 2, stroke: '#4f46e5', fill: '#ffffff' }}
                  />
                  
                  <Area 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#8b5cf6" 
                    strokeWidth={2.5} 
                    strokeDasharray="4 4"
                    fillOpacity={1} 
                    fill="url(#colorClicks)" 
                    activeDot={{ r: 5, strokeWidth: 2, stroke: '#8b5cf6', fill: '#ffffff' }}
                    dot={{ r: 3, strokeWidth: 2, stroke: '#8b5cf6', fill: '#ffffff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-slate-400 text-sm">ไม่มีข้อมูลในช่วงเวลาที่เลือก</div>
            )}
          </div>
        </div>
      )}

      {/* ตารางประสิทธิภาพลิงก์ */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">📈 ประสิทธิภาพลิงก์ ({rangeText})</h3>
        {displayLinks.length > 0 ? (
          <div className="space-y-3">
            {displayLinks.map((link) => {
              const originalLink = links?.find((l) => l.id === link.id);
              const IconComponent = originalLink?.icon && ICON_MAP[originalLink.icon] ? ICON_MAP[originalLink.icon] : FaLink;
              return (
                <div key={link.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center min-w-0 mr-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0 mr-3 text-slate-600"><IconComponent size={17} /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{link.title && link.title !== "ไม่มีชื่อลิงก์" ? link.title : "ลิงก์ของคุณ"}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{link.url || "ไม่มีลิงก์"}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold text-indigo-600">{link.clicks || 0}</p>
                    <p className="text-[10px] text-slate-400 uppercase">คลิก</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400 font-medium">ยังไม่มีข้อมูลการคลิกในขณะนี้</div>
        )}
      </div>
    </div> 
  );
};

export default StatsPage;