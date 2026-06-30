import React from 'react';
import { TrendingUp, TrendingDown, Bookmark } from 'lucide-react';

export default function TopPages({ pages, day }) {
  // ทำความสะอาดและเตรียมข้อมูลจากสถานะ Props ที่ส่งมาจากหลังบ้าน
  const sortedTopPages = (pages || []).map(page => {
    const views = page?.views || 0;
    const clicks = page?.clicks || 0;
    const saves = page?.saves || 0; 
    const growth = page?.growth || 0;
    
    // ดึงข้อมูลลิงก์ยอดนิยม หากไม่มีให้ตั้งค่าเริ่มต้นป้องกันระบบแครช
    const popularLink = page?.popular_link || { title: 'ยังไม่มีข้อมูลคลิก', clicks: 0 };
    
    // ป้องกัน Error การหารด้วย 0
    const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : "0.0";
    
    // คำนวณคะแนนประสิทธิภาพเพื่อใช้จัดอันดับ
    const score = (views * 0.001) + (parseFloat(ctr) * 5) + (growth * 2);
    
    return { ...page, views, clicks, saves, growth, ctr, score, popularLink };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-50 flex flex-col h-full">
      
      {/* ส่วนหัวแสดงหัวข้อคอมโพเนนต์ */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-slate-800">โปรไฟล์ที่มีผลงานดีที่สุด</h2>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-md tracking-wider uppercase border border-slate-100">
          Ranked by Performance Score
        </span>
      </div>
      
      {/* ตารางแสดงสถิติเชิงลึกรายบุคคล */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="text-[11px] font-bold text-slate-400 border-b border-slate-100 uppercase tracking-widest">
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
                <td colSpan="7" className="py-12 text-center text-sm text-slate-400">
                  ยังไม่มีข้อมูลการเข้าชมในช่วงเวลานี้
                </td>
              </tr>
            ) : (
              sortedTopPages.map((page, index) => {
                const isPositive = page.growth > 0;
                const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
                
                return (
                  <tr key={page.id || index} className="hover:bg-slate-50/50 transition-colors group">
                    
                    {/* ข้อมูลผู้ใช้และลิงก์โปรไฟล์ */}
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl w-6 text-center drop-shadow-sm">{rankIcon}</span>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-[15px]">{page.name || 'Unknown'}</span>
                          <a href={`https://${page.link || '#'}`} target="_blank" rel="noopener noreferrer" className="text-[13px] text-indigo-600 hover:underline">
                            https://{page.link || 'unknown'}
                          </a>
                        </div>
                      </div>
                    </td>
                    
                    {/* ยอดเข้าชมโปรไฟล์ */}
                    <td className="py-4 px-4 text-right font-medium text-slate-600 text-sm">
                      {page.views.toLocaleString()}
                    </td>
                    
                    {/* ยอดคลิกลิงก์รวม */}
                    <td className="py-4 px-4 text-right font-medium text-slate-600 text-sm">
                      {page.clicks.toLocaleString()}
                    </td>

                    {/*  ยอดกด Save Contact (แสดงผลข้อมูลใหม่) */}
                    <td className="py-4 px-4 text-right font-medium text-slate-600 text-sm">
                      <span className="inline-flex items-center gap-1 text-slate-600 font-semibold">
                        {page.saves.toLocaleString()}
                      </span>
                    </td>
                    
                    {/* เปอร์เซ็นต์ CTR */}
                    <td className="py-4 px-4 text-right font-medium text-slate-600 text-sm">
                      {page.ctr}%
                    </td>
                    
                    {/* อัตราการเติบโต */}
                    <td className="py-4 px-4 text-center font-medium text-slate-600 text-sm">
                      <div className="flex items-center justify-center gap-1.5">
                        {isPositive ? (
                          <TrendingUp size={16} className="text-emerald-500" strokeWidth={2.5} />
                        ) : (
                          <TrendingDown size={16} className="text-slate-400" strokeWidth={2.5} />
                        )}
                        {/* แก้ไข className ที่เขียนซ้อนกันให้ถูกต้อง */}
                        <span className={`text-sm font-bold ${isPositive ? 'text-emerald-500' : 'text-slate-500'}`}>
                          {isPositive ? '+' : ''}{page.growth}%
                        </span>
                      </div>
                    </td>

                    {/*  กล่องสไตล์ ลิงก์ยอดนิยม (Popular Link UI) */}
                    <td className="py-4 px-4 text-left font-medium text-slate-600 text-sm">
                      <div className="flex flex-col">
                        {/* แสดงชื่อลิงก์เป็นตัวหนา */}
                        <span className="font-bold text-slate-800 text-[15px]">{page.popularLink.title}</span>
                        {/* แสดงจำนวนคลิกด้านล่างในบรรทัดใหม่ */}
                        <span className="text-[13px] text-slate-500">
                          {page.popularLink.clicks} คลิก (30 วันล่าสุด)
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
      
      {/* ปุ่มกดดูรายงานฉบับเต็มด้านล่าง */}
      <button className="w-full mt-6 py-3 text-[#6B46FF] hover:bg-[#6B46FF]/5 font-bold text-sm rounded-xl transition-colors">
        View Complete Report
      </button>
      
    </div>
  );
}