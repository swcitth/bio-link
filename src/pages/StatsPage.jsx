// ============================================================
// src/pages/StatsPage.jsx
// ============================================================

import React, { useState, useEffect } from "react";
import { FaEye, FaMousePointer, FaChartBar, FaStar, FaLink, FaCalendarAlt, FaTrophy, FaImage, FaDownload } from "react-icons/fa";
import { ICON_MAP } from "../constants/icons";
import api from "../api/axios";

// ⭐️ Import ไลบรารี Recharts
import { AreaChart, Area, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// ⭐️ Import สำหรับปฏิทิน Date Range (จาก CRM)
import { X } from "lucide-react";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import { th } from 'date-fns/locale'; 
import { format } from 'date-fns';

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

  const calculatedCtr = React.useMemo(() => {
    if (!stats) return 0;
    const views = getSafeNumber(stats.total_views);
    const clicks = getSafeNumber(stats.total_clicks);
    const saves = getSafeNumber(stats.total_saves);
    if (views === 0) return 0;
    return (((clicks + saves) / views) * 100).toFixed(2);
  }, [stats]);

  const [dateRange, setDateRange] = useState('7days'); 
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // ⭐️ State ปฏิทิน DateRange
  const [dateRangeSelection, setDateRangeSelection] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

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
      // console.error(err);
      setError("ไม่สามารถโหลดข้อมูลสถิติได้ในขณะนี้");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange === 'custom') return; 
    fetchAnalytics();
  }, [dateRange]);
// =========================================================
  // 📥 ฟังก์ชันสำหรับเรียกดาวน์โหลดไฟล์ Excel
  // =========================================================
  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true); // เปลี่ยนปุ่มเป็นสีเทาพร้อมวงกลมหมุน
      
      // ดึงเงื่อนไขวันที่ ที่เราใช้ดูในหน้าเว็บปัจจุบัน
      let url = `/analytics/export?range=${dateRange}`;
      if (dateRange === 'custom' && customStart && customEnd) {
        url += `&start=${customStart}&end=${customEnd}`;
      }

      // ยิง API ด้วย axios ปกติ (เพื่อส่ง Token)
      const response = await api.get(url, {
        responseType: 'blob', // สำคัญมาก! บอกเบราว์เซอร์ว่านี่คือไฟล์ ไม่ใช่ข้อความ
      });

      // ถ้าโหลดสำเร็จ ให้สร้างลิงก์จำลองและกดเซฟลงเครื่อง
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlBlob;
      
      // ตั้งชื่อไฟล์
      const fileName = `Analytics_Report_${dateRange}_${new Date().getTime()}.xlsx`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click(); // สั่งให้เบราว์เซอร์คลิกดาวน์โหลดอัตโนมัติ
      
      // ลบตัวแปรทิ้งหลังโหลดเสร็จ
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
      
    } catch (error) {
      // console.error("ดาวน์โหลดไฟล์ไม่สำเร็จ:", error);
      alert("❌ เกิดข้อผิดพลาดในการดาวน์โหลดรายงาน กรุณาลองใหม่อีกครั้ง");
    } finally {
      // 🌟 สำคัญสุด: ไม่ว่าจะโหลดสำเร็จหรือพัง ต้องคืนค่าปุ่มกลับมาเป็นสีม่วงเสมอ
      setIsDownloading(false);
    }
  };
  if (isLoading) return <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100"><div className="text-indigo-600 font-semibold animate-pulse text-sm">📊 กำลังคำนวณและดึงข้อมูลสถิติจริง...</div></div>;
  if (error) return <div className="text-center py-20 bg-white rounded-2xl border border-red-100 text-red-500 font-medium text-sm">❌ {error}</div>;

  // 🌟 ตัวช่วยทำความสะอาด URL เพื่อให้การค้นหาจับคู่กันได้แม่นยำ 100%
  const cleanUrl = (u) => {
    if (!u) return "";
    return String(u).replace(/^https?:\/\//, '').replace(/^www\./, '').trim().toLowerCase().replace(/\/$/, '');
  };

  // กรองลิงก์ YouTube/TikTok ออก
  // 🛠️ 1. อิงข้อมูลจาก stats.links เป็นหลัก
  const enrichedLinks = stats?.links?.map(statLink => {
    const targetUrl = cleanUrl(statLink.url);
    let foundIcon = null;
    let foundImage = null;
    let isMediaBlock = false; 
    
    links?.forEach(block => {
        const itemsArray = (block.items && Array.isArray(block.items)) ? block.items : [];
        const allItems = [block, ...itemsArray];
        
        const match = allItems.find(item => {
            const itemUrl = cleanUrl(item.url || item.link);
            const idMatch = statLink.id && (item.id === statLink.id || block.id === statLink.id);
            const urlMatch = itemUrl === targetUrl && targetUrl !== "";
            const titleMatch = statLink.title && (item.title === statLink.title || block.title === statLink.title || item.name === statLink.title);
            
            if (idMatch) return true;
            return urlMatch && (!statLink.title || titleMatch);
        });
        
        if (match) {
            const blockType = String(block.type || '').toLowerCase();
            
            if (blockType.includes('shop') || blockType.includes('slider')) {
                isMediaBlock = true;
            } else {
                // 🌟 จุดแก้ไข: ดึงไอคอนมาให้ครบ และป้องกันไม่ให้คำว่า 'Link' มาเขียนทับไอคอนจริง
                const rawIcon = match.iconId || match.icon_id || match.icon || block.iconId || block.icon_id || block.icon;
                
                // ถ้าเจอไอคอน และไอคอนนั้นไม่ใช่คำว่า "Link" แบบดั้งเดิม ให้เก็บค่าไว้
                if (rawIcon && String(rawIcon).toLowerCase() !== 'link') {
                    foundIcon = rawIcon;
                }

                if (match.image || match.imageUrl) {
                    foundImage = match.image || match.imageUrl;
                }
            }
        }
    });

    // 🌟 จัดลำดับความสำคัญ: เอาไอคอนที่หาเจอจากหน้าเว็บก่อน -> ถ้าไม่มีค่อยเอาจากหลังบ้าน -> ถ้าไม่มีจริงๆ ค่อยเป็นห่วงโซ่
    const finalIcon = foundIcon || statLink.icon_id || statLink.icon || 'Link';

    return {
      ...statLink,
      icon: finalIcon, 
      image: isMediaBlock ? null : (foundImage || statLink.image), 
      isMediaBlock, 
      clicks: getSafeNumber(statLink.clicks ?? statLink.clicks_count ?? statLink.total_clicks ?? 0)
    };
  }) || [];
 
  // 🛠️ 2. กรอง YouTube / TikTok ออก
  const displayLinks = enrichedLinks.filter(link => {
    return !(link.icon === "Youtube" || link.icon === "TikTok" || link.type === "VIDEO" || (link.url && (link.url.includes("youtu") || link.url.includes("tiktok.com"))));
  });

  // 🛠️ 3. เรียงลำดับคลิกเยอะสุดขึ้นก่อน
  displayLinks.sort((a, b) => b.clicks - a.clicks);
  
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
              <button type="button" onClick={() => setIsCalendarOpen(true)} className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs sm:text-sm text-slate-700 font-bold hover:bg-slate-100 transition-all shadow-sm w-full md:w-auto">
                <div className="flex items-center gap-2"><FaCalendarAlt className="text-indigo-600" size={13} /><span>{customStart && customEnd ? `${formatShortThaiDate(customStart)} - ${formatShortThaiDate(customEnd)} (${customDaysCount} วัน)` : "เลือกช่วงเวลา..."}</span></div>
                <span className="text-[10px] text-slate-400">▼</span>
              </button>
            </div>
          )}
          {/* 🌟 ปุ่มดาวน์โหลดรายงาน */}
          <button 
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-[9px] text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto"
>
            {isDownloading ? (
              <><div className="w-3.5 h-3.5 border-[2.5px] border-white border-t-transparent rounded-full animate-spin"></div> โหลด...</>
            ) : (
              <><FaDownload size={13} /> โหลดรายงาน</>
            )}
          </button>
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
            {/* 🌟 ใช้ calculatedCtr ที่คำนวณใหม่เสมอ */}
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">{calculatedCtr}%</h2>
          </div>
          <div className="flex items-center justify-between gap-2 mt-3">
            <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded w-fit">อัตราคลิก{rangeText}</span>
            {renderTrendBadge(stats?.trend?.ctr)}
          </div>
        </div>

        {/* การ์ด 4: ลิงก์ยอดนิยม (ปรับให้สมมาตร) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 col-span-2 md:col-span-2 lg:col-span-1 flex flex-col gap-2 order-5 lg:order-4">
          {/* 1. เอา justify-between ออก เปลี่ยนเป็น flex-col gap-2 */}
          
          <div>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <FaTrophy className="text-amber-500" size={14} /> ลิงก์ยอดนิยม
            </span>
            
            {/* 2. ลด mt-3 ลงเหลือ mt-1 เพื่อไม่ให้มันหย่อนลงมาต่ำเกินไป */}
            <h2 className="text-3xl font-extrabold text-slate-800 mt-1 truncate" title={topLink ? topLink.title : ""}>
              {topLink ? (topLink.title !== "ไม่มีชื่อ" ? topLink.title : "ไม่มีชื่อ") : "ไม่มีข้อมูล"}
            </h2>

            {topLink && (
              <p className="text-[10px] text-slate-400 truncate" title={topLink.url}>
                {topLink.url}
              </p>
            )}
          </div>

          {/* 3. ส่วนของตัวเลขคลิก จะถูกดันลงมาโดยธรรมชาติด้วย gap-2 ของ div แม่ */}
          <div className="mt-auto">
            <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded w-fit inline-block">
              {topLink ? `${topLink.clicks.toLocaleString()} คลิก (${rangeText})` : `ยอด${rangeText}`}
            </span>
          </div>
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
            {displayLinks.map((link, idx) => {
              // 🌟 แยกแยะไอคอนตามประเภท (MediaBlock หรือ Link ปกติ)
              // 1. นำโค้ดนี้ไปวางแทนที่บรรทัดเดิมที่มี const IconComponent = ...
              const getIconComponent = (iconKey) => {
                if (!iconKey) return FaLink;
                // เช็คว่ามีไอคอนนี้ใน ICON_MAP ไหม
                return ICON_MAP[iconKey] || FaLink;
              };

              // 2. ในส่วนของ .map((link, idx) => { ... }) ให้แก้การเรียก IconComponent เป็น:
              const IconComponent = link.isMediaBlock 
                ? FaImage 
                : getIconComponent(link.icon);

              return (
                <div key={`${link.id || 'link'}-${idx}`} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center min-w-0 mr-4">
                    
                    {/* กล่องไอคอน/รูปภาพ */}
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0 mr-3 text-slate-500 overflow-hidden">
                      {link.image ? (
                        <img src={link.image} alt={link.title} className="w-full h-full object-cover" />
                      ) : (
                        <IconComponent size={17} className={link.isMediaBlock ? "text-indigo-500" : ""} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {/* 🌟 แสดงชื่อ Item (หรือชื่อบล็อก) */}
                        <p className="text-sm font-semibold text-slate-700 truncate">{link.title}</p>
                      </div>
                      {/* 🌟 แสดง URL เพื่อให้แยกแยะรายการที่อยู่ในกรุ๊ปเดียวกันได้ */}
                      <p className="text-[10px] text-slate-400 truncate mt-0.5" title={link.url}>
                        {link.url || "ไม่มีลิงก์"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold text-indigo-600">
                      {getSafeNumber(link.clicks)}
                    </p>
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
      {/* ─── Popup Calendar Modal (จาก CRM) ─── */}
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
                onChange={item => setDateRangeSelection([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dateRangeSelection}
                locale={th} 
                rangeColors={['#4f46e5']} 
                direction="horizontal"
                maxDate={new Date()}
              />
            </div>
            
            <div className="mt-6">
              <button 
                onClick={() => {
                  const start = format(dateRangeSelection[0].startDate, 'yyyy-MM-dd');
                  const end = format(dateRangeSelection[0].endDate, 'yyyy-MM-dd');
                  setCustomStart(start);
                  setCustomEnd(end);
                  setIsCalendarOpen(false);
                  
                  // ดึงข้อมูลใหม่หลังจากกดเสร็จสิ้น
                  setIsLoading(true);
                  api.get(`/user/analytics?range=custom&start=${start}&end=${end}`)
                    .then(response => {
                      if (response.data.success) setStats(response.data.data);
                      setIsLoading(false);
                    })
                    .catch(err => {
                      // console.error(err);
                      setError("ไม่สามารถโหลดข้อมูลสถิติได้ในขณะนี้");
                      setIsLoading(false);
                    });
                }}
                className="w-full py-3 bg-[#F4F5F7] hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
              >
                เสร็จสิ้น
              </button>
            </div>
          </div>
        </div>
      )}
    </div> 
  );
};

export default StatsPage;