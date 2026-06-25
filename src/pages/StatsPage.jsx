// ============================================================
// src/pages/StatsPage.jsx
// ============================================================

import React, { useState, useEffect } from "react";
import { FaEye, FaMousePointer, FaChartBar, FaStar, FaLink } from "react-icons/fa";
import { ICON_MAP } from "../constants/icons";
import api from "../api/axios";

// รับ links มาด้วยเพื่อเอาไว้ console.log เช็คข้อมูลเปรียบเทียบ
const StatsPage = ({ links }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);

        const response = await api.get(`/user/analytics`);

        if (response.data.success) {
          setStats(response.data.data);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("ไม่สามารถโหลดข้อมูลสถิติได้ในขณะนี้");
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="text-indigo-600 font-semibold animate-pulse text-sm">📊 กำลังคำนวณและดึงข้อมูลสถิติจริง...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-red-100 text-red-500 font-medium text-sm">
        ❌ {error}
      </div>
    );
  }

  const maxViewsInChart = stats?.chart_data?.length > 0 
    ? Math.max(...stats.chart_data.map(d => d.views)) 
    : 0;

  // ⭐️ ลองเปิด F12 Console ดูตรงนี้ จะเห็นความต่างของข้อมูลครับ
  console.log("ลิงก์ที่ได้รับมาจาก Props (ข้อมูลเก่า):", links);
  console.log("สถิติที่ได้รับมาจาก API (ข้อมูลจริง):", stats?.links);

  // ⭐️ เพิ่มโค้ดส่วนนี้: สั่งให้คัดกรองลิงก์ที่เป็น YouTube และ TikTok ทิ้งไป ไม่ต้องเอามาแสดง
  const displayLinks = stats?.links ? stats.links.filter(link => {
    // หาข้อมูลต้นฉบับเพื่อดูว่าเป็นบล็อกประเภทไหน
    const originalLink = links?.find((l) => l.id === link.id);
    
    // ตั้งเงื่อนไขว่าอะไรคือ YouTube / TikTok (ดูจาก Icon, Type หรือ URL)
    const isVideo = 
      originalLink?.icon === "Youtube" || 
      originalLink?.icon === "TikTok" || 
      originalLink?.type === "VIDEO" || 
      originalLink?.type === "TIKTOK" ||
      (link.url && (link.url.includes("youtu") || link.url.includes("youtube.com") || link.url.includes("tiktok.com")));
    
    return !isVideo; // 👈 ถ้าไม่ใช่ Video ให้เก็บไว้ (โชว์), ถ้าใช่ให้เตะออก (ไม่โชว์)
  }) : [];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
      
      {/* ─── ส่วนที่ 1: การ์ดสรุปตัวเลข 5 กล่อง ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <FaEye className="text-indigo-500" size={14} /> ยอดเข้าชม
            </span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">
              {stats?.total_views?.toLocaleString() || 0}
            </h2>
          </div>
          <span className="text-xs text-slate-400 mt-2 block">ทั้งหมด</span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <FaMousePointer className="text-violet-500" size={12} /> ยอดคลิก
            </span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">
              {stats?.total_clicks?.toLocaleString() || 0}
            </h2>
          </div>
          <span className="text-xs text-slate-400 mt-2 block">ทั้งหมด</span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <FaChartBar className="text-emerald-500" size={14} /> CTR
            </span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">
              {stats?.ctr || 0}%
            </h2>
          </div>
          <span className="text-xs text-slate-400 mt-2 block">อัตราคลิก</span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <FaStar className="text-amber-500" size={14} /> ลิงก์ยอดนิยม
            </span>
            <h2 className="text-lg font-bold text-slate-800 mt-2 truncate">
              Coming Soon
            </h2>
          </div>
          <span className="text-xs text-slate-400 mt-2 block">อันดับ 1</span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <FaStar className="text-pink-500" size={14} /> ยอดกด Save
            </span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">
              {stats?.total_saves || 0}
            </h2>
          </div>
          <span className="text-xs text-slate-400 mt-2 block">คนกดบันทึกข้อมูล</span>
        </div>
      </div>

      {/* ─── ส่วนที่ 2: กราฟเส้นแบบ Responsive (ยืดหยุ่นเต็มจอ) ─── */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-700 mb-2 sm:mb-6 flex items-center gap-2">
          <FaChartBar className="text-indigo-600" size={15} /> ยอดเข้าชม 7 วันล่าสุด
        </h3>

        <div className="relative w-full mt-6">
          {stats?.chart_data?.length > 0 && (
            <svg viewBox="0 0 500 220" className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* ระบายสีแรเงาใต้เส้นกราฟ */}
              <path
                d={`
                  M 30,170
                  ${stats.chart_data.map((day, index) => {
                    const x = 30 + index * 73.33; 
                    const y = 160 - (maxViewsInChart > 0 ? (day.views / maxViewsInChart) * 110 : 0);
                    return `L ${x},${y}`;
                  }).join(" ")}
                  L 470,170
                  Z
                `}
                fill="url(#areaGradient)"
                className="transition-all duration-500"
              />

              {/* เส้นกราฟหลัก */}
              <polyline
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={stats.chart_data.map((day, index) => {
                  const x = 30 + index * 73.33;
                  const y = 160 - (maxViewsInChart > 0 ? (day.views / maxViewsInChart) * 110 : 0);
                  return `${x},${y}`;
                }).join(" ")}
                className="transition-all duration-500"
              />

              {/* ตุ่มวงกลม, ตัวเลขยอดวิว, และ ชื่อวัน */}
              {stats.chart_data.map((day, index) => {
                const x = 30 + index * 73.33;
                const y = 160 - (maxViewsInChart > 0 ? (day.views / maxViewsInChart) * 110 : 0);
                
                return (
                  <g key={day.date} className="group/dot cursor-pointer">
                    {/* เส้นประแนวดิ่ง */}
                    <line 
                      x1={x} y1={y} x2={x} y2="170" 
                      className="stroke-slate-200 stroke-2 stroke-dashed opacity-0 group-hover/dot:opacity-100 transition-opacity" 
                    />

                    {/* ตุ่มวงกลม */}
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      className="fill-white stroke-indigo-600 stroke-[3px] group-hover/dot:scale-[1.4] transition-transform duration-150"
                      style={{ transformOrigin: `${x}px ${y}px` }}
                    />

                    {/* ตัวเลขบอกยอดวิว */}
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-slate-600" 
                    >
                      {day.views}
                    </text>

                    {/* ตัวอักษรชื่อย่อวัน */}
                    <text
                      x={x}
                      y="190"
                      textAnchor="middle"
                      className="text-[10px] font-semibold fill-slate-400 group-hover/dot:fill-slate-600 transition-colors"
                    >
                      {day.day_name}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>

      {/* ─── ส่วนที่ 3: ตารางประสิทธิภาพลิงก์ ─── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          📈 ประสิทธิภาพลิงก์
        </h3>
        
        {/* ⭐️ เปลี่ยนจาก stats.links เป็น displayLinks ที่เรากรองไว้ */}
        {displayLinks.length > 0 ? (
          <div className="space-y-3">
            {displayLinks.map((link) => {
              const originalLink = links?.find((l) => l.id === link.id);
              
              let IconComponent = FaLink; 
              
              if (originalLink) {
                if (originalLink.icon === "Image") {
                  IconComponent = ICON_MAP["Image"] || FaLink;
                } else if (originalLink.icon && ICON_MAP[originalLink.icon]) {
                   // สำหรับลิงก์โซเชียลอื่นๆ เช่น Facebook, Github
                  IconComponent = ICON_MAP[originalLink.icon];
                }
              } 
              
              // เดาจาก URL เผื่อหา Icon ไม่เจอ
              if (IconComponent === FaLink && link.url) {
                 if (link.url.includes("facebook.com")) IconComponent = ICON_MAP["Facebook"] || FaLink;
                 else if (link.url.includes("github.com")) IconComponent = ICON_MAP["Github"] || FaLink;
                 // ไม่ต้องเดา YouTube/TikTok แล้ว เพราะเรากรองออกไปแล้ว
              }

              return (
                <div 
                  key={link.id} 
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center min-w-0 mr-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0 mr-3 text-slate-600">
                      <IconComponent size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">
                        {link.title && link.title !== "ไม่มีชื่อลิงก์" ? link.title : "ลิงก์ของคุณ"}
                      </p>
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
          <div className="text-center py-6 text-xs text-slate-400 font-medium">
            ยังไม่มีข้อมูลการคลิกในขณะนี้
          </div>
        )}
      </div>
    </div> 
  );
};

export default StatsPage;