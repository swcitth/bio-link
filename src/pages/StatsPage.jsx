// ============================================================
// src/pages/StatsPage.jsx
// ============================================================

import React, { useState, useEffect } from "react";
import { FaEye, FaMousePointer, FaChartBar, FaStar } from "react-icons/fa"; // ✨ เปลี่ยนมาใช้ react-icons/fa ทั้งหมด
import axios from "axios";

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        
        // ดึง Token จาก LocalStorage (รองรับทั้งการเก็บแยกหรือเก็บรวมในก้อน user)
        const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user'))?.access_token;

        if (!token) {
          setError("ไม่พบรหัสยืนยันตัวตน กรุณาล็อกอินใหม่อีกครั้ง");
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/analytics`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

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

  // หาค่าสูงสุดของยอดวิวใน 7 วัน เพื่อนำมาคำนวณสัดส่วนความสูงของกราฟแท่ง
  const maxViewsInChart = stats?.chart_data?.length > 0 
    ? Math.max(...stats.chart_data.map(d => d.views)) 
    : 0;

  // รายการสีไล่เฉดสำหรับกราฟแต่ละแท่ง จ-อา ให้สวยงามตามดีไซน์
  const barGradients = [
    "from-yellow-400 to-pink-500",   // จ
    "from-pink-400 to-purple-500",   // อ
    "from-green-400 to-emerald-500", // พ
    "from-orange-400 to-amber-600",  // พฤ
    "from-sky-400 to-indigo-500",    // ศ
    "from-purple-500 to-indigo-600", // ส
    "from-orange-400 to-red-500"     // อา
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
      
      {/* ─── ส่วนที่ 1: การ์ดสรุปตัวเลข 4 กล่อง ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* การ์ด ยอดเข้าชม */}
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

        {/* การ์ด ยอดคลิก */}
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

        {/* การ์ด CTR */}
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

        {/* การ์ด ลิงก์ยอดนิยม */}
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

      </div>

      {/* ─── ส่วนที่ 2: กราฟแท่งยอดเข้าชม 7 วันล่าสุด ─── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
          <FaChartBar className="text-indigo-500" size={15} /> ยอดเข้าชม 7 วันล่าสุด
        </h3>

        {/* ตัวกราฟ */}
        <div className="flex items-end justify-between gap-2 h-48 pt-4 px-2 border-b border-slate-100">
          {stats?.chart_data?.map((day, index) => {
            // คำนวณเปอร์เซ็นต์ความสูง ถ้าไม่มีคนดูเลยให้สูง 5% เป็นฐานมินิไว้เพื่อความสวยงาม
            const barHeight = maxViewsInChart > 0 
              ? (day.views / maxViewsInChart) * 100 
              : 5;

            const finalHeight = barHeight < 5 ? 5 : barHeight;

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center group relative">
                
                {/* ยอดวิวที่จะเด้งขึ้นมาตอนเมาส์ชี้ (Tooltip) */}
                <div className="absolute -top-8 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                  {day.views} ครั้ง
                </div>

                {/* แท่งกราฟยืดหดตามสัดส่วนข้อมูลจริง */}
                <div 
                  className={`w-full bg-gradient-to-t ${barGradients[index % 7]} rounded-t-lg transition-all duration-500 shadow-sm group-hover:brightness-95`}
                  style={{ height: `${finalHeight}%` }}
                />

                {/* ชื่อย่อวันภาษาไทย จ, อ, พ จากหลังบ้าน */}
                <span className="text-xs font-bold text-slate-400 mt-2 block group-hover:text-slate-600 transition-colors">
                  {day.day_name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── ส่วนที่ 3: ตารางประสิทธิภาพลิงก์ ─── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          📈 ประสิทธิภาพลิงก์
        </h3>
        <div className="text-center py-6 text-xs text-slate-400 font-medium">
          ระบบกำลังรวบรวมพฤติกรรมการคลิกของแต่ละปุ่มลิงก์...
        </div>
      </div>

    </div>
  );
};

export default StatsPage;