import React, { useState, useEffect } from 'react';
import { Download, Calendar as CalendarIcon, Check, X, ChevronDown } from 'lucide-react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import { th } from 'date-fns/locale'; 
import { format } from 'date-fns';
import api from '../../../api/axios'; // ตรวจสอบ Path ให้ตรงกับโปรเจกต์คุณ

export default function DownloadModal({ onClose, initialTimeRange = '30days', mode = 'dashboard' }) {
  
  const [timeRange, setTimeRange] = useState(initialTimeRange);
  const [fileFormat, setFileFormat] = useState('excel');
  
  // ตั้งค่าตัวเลือกตามโหมด
  const [downloadOptions, setDownloadOptions] = useState({});

  useEffect(() => {
    if (mode === 'dashboard') {
      setDownloadOptions({ overview: false, topProfiles: false, inactiveAccounts: false });
    } else if (mode === 'users') {
      setDownloadOptions({ allUsers: false });
    }
  }, [mode]);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: 'selection' }
  ]);

  // อัปเดต DateRange เมื่อเปลี่ยนปุ่ม 7days, 30days
  useEffect(() => {
    const today = new Date();
    if (timeRange === 'today') {
      setDateRange([{ startDate: today, endDate: today, key: 'selection' }]);
    } else if (timeRange === '7days') {
      const d = new Date(); d.setDate(d.getDate() - 6);
      setDateRange([{ startDate: d, endDate: today, key: 'selection' }]);
    } else if (timeRange === '30days') {
      const d = new Date(); d.setDate(d.getDate() - 29);
      setDateRange([{ startDate: d, endDate: today, key: 'selection' }]);
    }
  }, [timeRange]);

  const toggleOption = (optionKey) => {
    setDownloadOptions(prev => ({ ...prev, [optionKey]: !prev[optionKey] }));
  };

  const handleDownload = async () => {
    try {
      // ✅ อัปเดต Payload ให้ส่งค่า Date ไปด้วยเสมอในทุกโหมด
      const payload = {
        timeRange: timeRange,
        customDate: timeRange === 'custom' ? { 
          start: format(dateRange[0].startDate, 'yyyy-MM-dd'), 
          end: format(dateRange[0].endDate, 'yyyy-MM-dd') 
        } : null,
        downloadOptions,
        fileFormat
      };
      
      const response = await api.post('/admin/export-report', payload, {
        responseType: 'blob' 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // ตั้งชื่อไฟล์ตามโหมด
      const fileName = mode === 'users' ? 'Users_Report.xlsx' : 'Dashboard_Report.xlsx';
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      onClose(); 

    } catch (error) {
      console.error("Download failed:", error);
      alert("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์");
    }
  };

  const isAnyOptionSelected = Object.values(downloadOptions).some(Boolean);

  const getButtonDateText = () => {
    const { startDate, endDate } = dateRange[0];
    const startStr = format(startDate, 'd MMM yyyy', { locale: th });
    const endStr = format(endDate, 'd MMM yyyy', { locale: th });
    if (startDate.getTime() === endDate.getTime()) return startStr;
    return `${startStr} - ${endStr}`;
  };

  // จัดการข้อมูลรายการที่จะให้เลือกว่าจะใช้ชุดไหน
  const optionsList = mode === 'dashboard' 
    ? {
        overview: { title: 'สถิติภาพรวมระบบ (Overview)', desc: 'ยอดสมัครใหม่, ยอดเข้าชม, ยอดคลิกรวม ฯลฯ' },
        topProfiles: { title: 'โปรไฟล์ที่มีผลงานดีที่สุด (Top Performers)', desc: 'ตารางจัดอันดับ URL, ยอดผู้ชม, CTR, ยอดนิยม' },
        inactiveAccounts: { title: 'บัญชีที่ไม่มีการอัพเดท (Inactive Accounts)', desc: 'รายการบัญชีที่ไม่มีความเคลื่อนไหว (เสี่ยงต่อการเลิกใช้งาน)' }
      }
    : {
        allUsers: { title: 'รายชื่อผู้ใช้งานทั้งหมด (All Users)', desc: 'ดาวน์โหลดข้อมูลบัญชีผู้ใช้งาน สถานะ และสิทธิ์ทั้งหมดในระบบ' }
      };

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm p-4 font-sans flex items-center justify-center">
        <div className="bg-[#F8F9FC] rounded-[2rem] w-full max-w-[480px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
          
          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>

          <div className="px-8 pt-8 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <Download className="text-[#6B46FF]" size={24} strokeWidth={2.5} />
              <h2 className="text-[22px] font-bold text-slate-800 tracking-tight">ดาวน์โหลดรายงาน</h2>
            </div>
            <p className="text-sm text-slate-500 font-medium ml-[36px]">เลือกข้อมูลที่คุณต้องการดาวน์โหลด</p>
          </div>

          <div className="px-8 pb-8 space-y-8 max-h-[75vh] overflow-y-auto">
            
            {/* ✅ Section 1: แสดงในทุกโหมดแล้ว */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-[15px] font-bold text-slate-800 mb-4">1. เลือกช่วงเวลา</h3>
              <div className="space-y-4">
                {['today', '7days', '30days'].map((type) => (
                  <label key={type} className="flex items-start gap-3 cursor-pointer group">
                    <div className={`mt-0.5 w-[18px] h-[18px] rounded-full border-[2px] flex items-center justify-center transition-colors ${timeRange === type ? 'border-[#6B46FF]' : 'border-slate-300 group-hover:border-slate-400'}`}>
                      {timeRange === type && <div className="w-2.5 h-2.5 bg-[#6B46FF] rounded-full" />}
                    </div>
                    <div>
                      <span className={`block text-[15px] font-medium transition-colors ${timeRange === type ? 'text-[#6B46FF] font-bold' : 'text-slate-700'}`}>
                        {type === 'today' ? 'วันนี้' : type === '7days' ? '7 วัน' : '30 วัน'}
                      </span>
                    </div>
                    <input type="radio" className="hidden" checked={timeRange === type} onChange={() => setTimeRange(type)} />
                  </label>
                ))}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className={`mt-0.5 w-[18px] h-[18px] rounded-full border-[2px] flex items-center justify-center transition-colors ${timeRange === 'custom' ? 'border-[#6B46FF]' : 'border-slate-300 group-hover:border-slate-400'}`}>
                    {timeRange === 'custom' && <div className="w-2.5 h-2.5 bg-[#6B46FF] rounded-full" />}
                  </div>
                  <div className="w-full">
                    <span className={`block text-[15px] font-medium transition-colors ${timeRange === 'custom' ? 'text-[#6B46FF] font-bold' : 'text-slate-700'}`}>กำหนดเอง</span>
                    {timeRange === 'custom' && (
                      <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <button type="button" onClick={() => setIsCalendarOpen(true)} className="w-full flex items-center justify-between bg-white border-2 border-slate-200 hover:border-[#6B46FF]/50 rounded-xl px-4 py-3 transition-colors group">
                          <div className="flex items-center gap-2 text-slate-700">
                            <CalendarIcon size={16} className="text-[#6B46FF]" />
                            <span className="text-sm font-medium">{getButtonDateText()}</span>
                          </div>
                          <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </button>
                      </div>
                    )}
                  </div>
                  <input type="radio" className="hidden" checked={timeRange === 'custom'} onChange={() => setTimeRange('custom')} />
                </label>
              </div>
            </section>

            {/* ✅ Section 2: เปลี่ยนหัวข้อให้เป็นเลข 2. เสมอ */}
            <section>
              <h3 className="text-[15px] font-bold text-slate-800 mb-4 px-2">
                2. เลือกข้อมูลที่ต้องการดาวน์โหลด
              </h3>
              <div className="space-y-3">
                {Object.entries(optionsList).map(([key, data]) => (
                  <label key={key} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${downloadOptions[key] ? 'border-[#6B46FF] bg-white' : 'border-slate-200 bg-white/50 hover:border-slate-300'}`}>
                    <div>
                      <span className="block text-[15px] font-bold text-slate-800">{data.title}</span>
                      <span className="block text-[13px] text-slate-500 mt-0.5">{data.desc}</span>
                    </div>
                    <div className={`flex items-center justify-center w-6 h-6 rounded border ${downloadOptions[key] ? 'bg-[#6B46FF] border-[#6B46FF]' : 'border-slate-300'}`}>
                       {downloadOptions[key] && <Check size={16} strokeWidth={3} className="text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={downloadOptions[key] || false} onChange={() => toggleOption(key)} />
                  </label>
                ))}
              </div>
            </section>

            {/* ✅ Section 3: เปลี่ยนหัวข้อให้เป็นเลข 3. เสมอ */}
            <section className="px-2">
              <h3 className="text-[15px] font-bold text-slate-800 mb-4">
                3. เลือกรูปแบบไฟล์
              </h3>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className={`mt-0.5 w-[18px] h-[18px] rounded-full border-[2px] flex items-center justify-center transition-colors ${fileFormat === 'excel' ? 'border-slate-400' : 'border-slate-300'}`}>
                  {fileFormat === 'excel' && <div className="w-2.5 h-2.5 bg-[#6B46FF] rounded-full" />}
                </div>
                <div>
                  <span className="block text-[15px] text-slate-700 font-bold">Excel (.xlsx)</span>
                  <span className="block text-[13px] text-slate-400">ไฟล์ Excel สำหรับการใช้งานทั่วไป</span>
                </div>
                <input type="radio" className="hidden" checked={fileFormat === 'excel'} onChange={() => setFileFormat('excel')} />
              </label>
            </section>
          </div>

          <div className="p-6 bg-white border-t border-slate-100 flex gap-4 rounded-b-[2rem]">
            <button onClick={onClose} className="flex-1 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors">ยกเลิก</button>
            <button onClick={handleDownload} disabled={!isAnyOptionSelected} className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-bold rounded-xl transition-all ${isAnyOptionSelected ? 'bg-[#6B46FF] hover:bg-[#5835E5] text-white shadow-md shadow-indigo-200 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
              <Download size={18} /> ดาวน์โหลด
            </button>
          </div>

        </div>
      </div>

      {/* Popup Calendar Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/30 backdrop-blur-sm">
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