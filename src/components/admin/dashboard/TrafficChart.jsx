import React, { useState, useRef, useEffect } from 'react';
import { Activity, ChevronDown, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// กำหนดข้อมูลของกราฟแต่ละเส้น (จับคู่ Key ให้ตรงกับ Backend พร้อมกำหนดสี)
const CHART_METRICS = [
  { key: 'signups', label: 'ยอดผู้สมัครใหม่', color: '#6366f1' },      // Indigo
  { key: 'total_users', label: 'สมาชิกทั้งหมด', color: '#3b82f6' },    // Blue
  { key: 'views', label: 'ยอดเข้าชม', color: '#14b8a6' },            // Teal
  { key: 'blocks', label: 'บล็อกทั้งหมด', color: '#f97316' },          // Orange
  { key: 'clicks', label: 'ยอดคลิกรวม', color: '#a855f7' },          // Purple
  { key: 'saves', label: 'ยอดกด Save', color: '#ec4899' }            // Pink
];

export default function TrafficChart({ data, isLoading }) {
  // ค่าเริ่มต้นให้แสดงแค่ 2 เส้นนี้ก่อน
  const [selectedMetrics, setSelectedMetrics] = useState(['views', 'clicks']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ปิด Dropdown เมื่อคลิกที่อื่นบนหน้าจอ
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ฟังก์ชันสลับการเลือกเส้นกราฟ (ติ๊กถูก / เอาติ๊กออก)
  const toggleMetric = (key) => {
    setSelectedMetrics(prev => {
      if (prev.includes(key)) {
        // บังคับว่าต้องมีกราฟอย่างน้อย 1 เส้นเสมอ (ถ้าเหลือ 1 เส้นแล้วไม่ให้กดออก)
        if (prev.length === 1) return prev; 
        return prev.filter(m => m !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-[1.5rem] p-6 shadow-sm lg:col-span-2 border border-slate-50 h-[380px] animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <div className="h-5 w-32 bg-slate-200 rounded"></div>
            <div className="h-3 w-48 bg-slate-100 rounded"></div>
          </div>
          <div className="h-8 w-24 bg-slate-100 rounded-lg"></div>
        </div>
        <div className="h-[250px] w-full bg-slate-50 rounded-xl flex items-center justify-center">
           <Activity className="text-slate-200 animate-bounce" size={40} />
        </div>
      </div>
    );
  }

  const formatYAxis = (value) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value;
  };

  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm lg:col-span-2 border border-slate-50">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">ประสิทธิภาพและการเติบโต</h2>
          <p className="text-sm text-slate-400">เปรียบเทียบสถิติต่างๆ ภายในระบบ</p>
        </div>
        
        {/* Dropdown สำหรับเลือกกราฟ */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 transition-colors"
          >
            เลือกสถิติเปรียบเทียบ
            <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-10 py-2 animate-in fade-in slide-in-from-top-2">
              <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">แสดงผลบนกราฟ</p>
              {CHART_METRICS.map(metric => {
                const isSelected = selectedMetrics.includes(metric.key);
                return (
                  // 🌟 แก้ไขตรงนี้: เปลี่ยนจาก <label> เป็น <div> และเพิ่ม onClick
                  <div 
                    key={metric.key} 
                    onClick={() => toggleMetric(metric.key)} // 👈 เพิ่ม onClick ตรงนี้เพื่อให้กดเปิดปิดได้!
                    className="flex items-center px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center mr-3 transition-colors ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                      {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                    </div>
                    {/* จุดสีเล็กๆ เพื่อบอกว่ากราฟเส้นนี้สีอะไร */}
                    <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: metric.color }}></div>
                    <span className={`text-sm font-bold ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>
                      {metric.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <div className="h-[280px] w-full">
        {(!data || data.length === 0) ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
             <Activity size={32} className="mb-2 opacity-50" />
             <p className="text-sm">ไม่มีข้อมูลในช่วงเวลานี้</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
                dy={10} 
                minTickGap={20}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
                tickFormatter={formatYAxis} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                labelStyle={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}
              />
              
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />

              {/* วนลูป Render เส้นกราฟเฉพาะตัวที่ถูกติ๊กเลือกเท่านั้น */}
              {CHART_METRICS.map(metric => (
                selectedMetrics.includes(metric.key) && (
                  <Line 
                    key={metric.key}
                    type="monotone" 
                    name={metric.label} 
                    dataKey={metric.key} 
                    stroke={metric.color} 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2, fill: 'white', stroke: metric.color }} 
                    activeDot={{ r: 6, fill: metric.color, stroke: 'white', strokeWidth: 2 }}
                    animationDuration={500}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}