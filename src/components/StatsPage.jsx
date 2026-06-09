// ============================================================
// src/components/StatsPage.jsx
// แท็บ "สถิติ" — แสดงยอดเข้าชม คลิก และประสิทธิภาพลิงก์
// ============================================================

import React from "react";
import { ICON_MAP } from "../constants/icons";

/**
 * Props:
 * - links : array of link objects (ต้องมี field clicks)
 * - stats : MOCK_STATS object
 *           { totalViews, totalClicks, ctRate, topLink, weeklyViews }
 */
const StatsPage = ({ links, stats }) => {
  const maxClicks = Math.max(...links.map((l) => l.clicks || 0), 1);
  const DAY_LABELS = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];
  const BAR_COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];
  const maxWeekly  = Math.max(...(stats.weeklyViews || [1]));

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-400">

      {/* ─── Summary Cards ─── */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { emoji: "👁️",  label: "ยอดเข้าชม",    value: stats.totalViews.toLocaleString(), sub: "ทั้งหมด"   },
          { emoji: "🖱️",  label: "ยอดคลิก",      value: stats.totalClicks.toLocaleString(), sub: "ทั้งหมด" },
          { emoji: "📊",  label: "CTR",           value: stats.ctRate,                      sub: "อัตราคลิก" },
          { emoji: "⭐",  label: "ลิงก์ยอดนิยม",  value: stats.topLink, sub: "อันดับ 1", small: true      },
        ].map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* ─── Weekly Bar Chart ─── */}
      <div className={section}>
        <SectionTitle>📅 ยอดเข้าชม 7 วันล่าสุด</SectionTitle>
        <div className="flex items-end gap-1.5 h-24">
          {(stats.weeklyViews || []).map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              {/* Bar */}
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${(v / maxWeekly) * 80}px`,
                  background: `linear-gradient(to top, ${BAR_COLORS[i % BAR_COLORS.length]}, ${BAR_COLORS[(i + 1) % BAR_COLORS.length]}80)`,
                }}
              />
              {/* Day label */}
              <span className="text-[10px] text-slate-400 font-medium">
                {DAY_LABELS[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Link Performance ─── */}
      <div className={section}>
        <SectionTitle>📈 ประสิทธิภาพลิงก์</SectionTitle>
        <div className="flex flex-col gap-4">
          {[...links]
            .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
            .map((link, i) => {
              const IconComp = ICON_MAP[link.icon] || ICON_MAP["Link"];
              const pct = ((link.clicks || 0) / maxClicks) * 100;
              const color = BAR_COLORS[i % BAR_COLORS.length];

              return (
                <div key={link.id}>
                  {/* Label row */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${color}20`, color }}
                      >
                        <IconComp size={14} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 truncate">
                        {link.title}
                      </span>
                      {!link.visible && (
                        <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md shrink-0">
                          ซ่อน
                        </span>
                      )}
                    </div>
                    <span
                      className="text-sm font-bold shrink-0 ml-2"
                      style={{ color }}
                    >
                      {(link.clicks || 0).toLocaleString()}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${color}, ${BAR_COLORS[(i + 1) % BAR_COLORS.length]})`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

    </div>
  );
};

// ────────────────────────────────────────────────────────────
// Helper Components
// ────────────────────────────────────────────────────────────

const section =
  "bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-sm";

const SectionTitle = ({ children }) => (
  <h3 className="font-bold text-slate-800 text-sm mb-4">{children}</h3>
);

const StatCard = ({ emoji, label, value, sub, small }) => (
  <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-4 shadow-sm">
    <p className="text-xs font-semibold text-slate-400 mb-1">
      {emoji} {label}
    </p>
    <p
      className={`font-bold text-slate-800 leading-tight ${
        small ? "text-sm" : "text-2xl"
      }`}
    >
      {value}
    </p>
    <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
  </div>
);

export default StatsPage;
