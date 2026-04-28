import { useState } from "react";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const MOCK_DOTS: Record<string, string[]> = {
  "2025-4-1":  ["#6b7280"],
  "2025-4-8":  ["#a855f7"],
  "2025-4-9":  ["#6b7280"],
  "2025-4-11": ["#6b7280"],
  "2025-4-16": ["#ef4444"],
  "2025-4-17": ["#ef4444"],
  "2025-4-20": ["#ef4444"],
  "2025-4-24": ["#ef4444"],
  "2025-4-27": ["#22c55e"],
  "2025-4-28": ["#6b7280"],
  "2025-4-29": ["#22c55e"],
  "2025-4-30": ["#6b7280"],
};

export function Calendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthName = new Date(year, month).toLocaleString("default", { month: "long" });

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Build grid cells
  const cells: { day: number; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false });
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="text-gray-500 hover:text-gray-800 px-1 text-lg leading-none">‹</button>
        <span className="text-sm font-semibold text-gray-700">{monthName} {year}</span>
        <button onClick={nextMonth} className="text-gray-500 hover:text-gray-800 px-1 text-lg leading-none">›</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d, i) => (
          <div key={i} className="text-center text-xs font-semibold text-gray-400">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((cell, i) => {
          const isToday = cell.current && cell.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const key = `${year}-${month + 1}-${cell.day}`;
          const dots = cell.current ? (MOCK_DOTS[key] ?? []) : [];

          return (
            <div key={i} className="flex flex-col items-center py-0.5">
              <div
                className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium"
                style={{
                  backgroundColor: isToday ? "#0ea5e9" : "transparent",
                  color: isToday ? "white" : cell.current ? "#1f2937" : "#d1d5db",
                  fontWeight: isToday ? 700 : undefined,
                }}
              >
                {cell.day}
              </div>
              {/* Dots */}
              <div className="flex gap-0.5 mt-0.5 min-h-[6px]">
                {dots.map((color, di) => (
                  <span key={di} style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: color, display: "inline-block" }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}