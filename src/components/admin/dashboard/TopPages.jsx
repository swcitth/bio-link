import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TopPages({ pages, days }) {

  // 1. เรียงลำดับข้อมูลด้วยคะแนน score (คำนวณมาจากหลังบ้านแล้ว)
  const sortedTopPages = (pages || []).map(page => {
    const views = page?.views || 0;
    const clicks = page?.clicks || 0;
    const saves = page?.saves || 0; 
    const growth = page?.growth || 0;
    
    // รับข้อมูลลิงก์ยอดนิยมที่ผ่านการเจาะลึกมาจาก Backend แล้วโดยตรง
    const popularLink = page?.popular_link || { title: 'ยังไม่มีข้อมูลคลิก', clicks: 0 };
    
    return { ...page, views, clicks, saves, growth, popularLink };
  }).sort((a, b) => (b.score || 0) - (a.score || 0)); // เรียงตามคะแนนที่ส่งมาจาก DB

  // 2. เพิ่ม State สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // 3. คำนวณข้อมูลสำหรับการแบ่งหน้า 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTopPages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedTopPages.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-50 flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-slate-800">โปรไฟล์ที่มีผลงานดีที่สุด</h2>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-md tracking-wider uppercase border border-slate-100">
          Ranked by Performance Score
        </span>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="text-[11px] font-bold text-slate-400 border-b border-slate-100 uppercase tracking-widest">
              <th className="pb-4 pl-2 w-16">อันดับ</th>
              <th className="pb-4 pl-2">URL / ผู้ใช้</th>
              <th className="pb-4 px-4 text-right">ยอดผู้เข้าชม</th>
              <th className="pb-4 px-4 text-right">คลิก</th>
              <th className="pb-4 px-4 text-right">SAVES</th>
              <th className="pb-4 px-4 text-right">CTR</th>
              <th className="pb-4 px-4 text-center">การเติบโต</th>
              <th className="pb-4 pr-2 text-left pl-6">ลิงก์ยอดนิยม</th> 
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedTopPages.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-sm text-slate-400">
                  ยังไม่มีข้อมูลการเข้าชมในช่วงเวลานี้
                </td>
              </tr>
            ) : (
              // 🌟 4. แมปจาก currentItems เพื่อแสดงเฉพาะ 5 แถวในหน้านั้นๆ 🌟
              currentItems.map((page, index) => {
                const isPositive = page.growth > 0;
                
                // คำนวณอันดับ (Rank) ที่ถูกต้อง แม้จะอยู่หน้า 2, 3...
                const rankIndex = indexOfFirstItem + index + 1;
                
                return (
                  <tr key={page.id || index} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 pl-2">
                      <span className="font-bold text-slate-800 text-base">{rankIndex}</span>
                    </td>
                    
                    <td className="py-4 pl-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-[15px]">{page.name || 'Unknown'}</span>
                        <a href={`https://${page.link || '#'}`} target="_blank" rel="noopener noreferrer" className="text-[13px] text-indigo-600 hover:underline">
                          https://{page.link || 'unknown'}
                        </a>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4 text-right font-medium text-slate-600 text-sm">
                      {page.views.toLocaleString()}
                    </td>
                    
                    <td className="py-4 px-4 text-right font-medium text-slate-600 text-sm">
                      {page.clicks.toLocaleString()}
                    </td>

                    <td className="py-4 px-4 text-right font-medium text-slate-600 text-sm">
                      <span className="inline-flex items-center gap-1 text-slate-600 font-semibold">
                        {page.saves.toLocaleString()}
                      </span>
                    </td>
                    
                    <td className="py-4 px-4 text-right font-medium text-slate-600 text-sm">
                      {page.ctr}%
                    </td>
                    
                    <td className="py-4 px-4 text-center font-medium text-slate-600 text-sm">
                      <div className="flex items-center justify-center gap-1.5">
                        {isPositive ? (
                          <TrendingUp size={16} className="text-emerald-500" strokeWidth={2.5} />
                        ) : (
                          <TrendingDown size={16} className="text-slate-400" strokeWidth={2.5} />
                        )}
                        <span className={`text-sm font-bold ${isPositive ? 'text-emerald-500' : 'text-slate-500'}`}>
                          {isPositive ? '+' : ''}{page.growth}%
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-left font-medium text-slate-600 text-sm">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-[15px]">
                          {page.popularLink.title}
                        </span>
                        <span className="text-[13px] text-slate-500">
                          {page.popularLink.clicks} คลิก {days === 1 ? '(วันนี้)' : `(${days || 30} วันล่าสุด)`}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* 🌟 5. ส่วน Footer แสดง Pagination แบบเดียวกับหน้า User Management 🌟 */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
        <span className="text-sm text-slate-500 font-medium">
          แสดงผล {sortedTopPages.length === 0 ? 0 : indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, sortedTopPages.length)} จากทั้งหมด {sortedTopPages.length} รายการ
        </span>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button 
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                currentPage === 1 
                  ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50/50' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 cursor-pointer'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            
            <span className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
              หน้า {currentPage} / {totalPages}
            </span>

            <button 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                currentPage === totalPages 
                  ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50/50' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 cursor-pointer'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}