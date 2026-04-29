import { useState } from "react";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export type DayTask = {
  teamId :string;
  teamName : string;
  taskId :string;
  taskTitle : string;
  status : "pending"|"unverified"|"verified";
};

const STATUS_COLOR: Record<DayTask["status"], string> = {
  unverified:  "#f97316",
  pending:  "#ef4444",
  verified:  "#22c55e",
};

const STATUS_PRIORITY: Record<DayTask["status"], number> = {
  pending:  0,
  unverified:  1,
  verified:  2,
};

export const MOCK_DAY_TASKS: Record<string, DayTask[]> = {
  "2026-4-29": [
    { teamId: "group1", teamName: "Group 1", taskId: "T-01", taskTitle: "Write report", status: "pending" },
    { teamId: "group2", teamName: "Group 2", taskId: "T-02", taskTitle: "Submit slides", status: "verified" },
  ],
  "2026-4-30": [
    { teamId: "group3", teamName: "Group 3", taskId: "T-03", taskTitle: "Review PR", status: "unverified" },
  ],
};

interface CalendarProps{
  selectedDay:string|null;
  onSelectDay:(key:string|null)=>void;
}

export function Calendar({selectedDay, onSelectDay} : CalendarProps) {
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

  const cells: { day: number; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  const remaining = (7-(cells.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false });
  }

  const rows: typeof cells[] = [];
  for (let i = 0; i< cells.length; i+= 7) rows.push(cells.slice(i, i+7));

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
          const tasks = cell.current ? (MOCK_DAY_TASKS[key] ?? []) : [];
          const isSelected = cell.current && selectedDay === key; 
          const dotColor = tasks.length > 0
            ? STATUS_COLOR[tasks.reduce((best, t) =>
              STATUS_PRIORITY[t.status] <STATUS_PRIORITY[best.status] ? t :best
            ).status]
            :null;

          return (
            <div 
              key={i} 
              className="flex flex-col items-center py-0.5"
              onClick={()=> cell.current && onSelectDay(isSelected ? null : key)}>
              <div
                className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium"
                style={{
                  backgroundColor: isSelected ? "#0ea5e9" : isToday ? "#0ea5e9" : "transparent",
                  color: isSelected || isToday ? "white" : cell.current ? "#1f2937" : "#d1d5db",
                  fontWeight: isToday || isSelected ? 700 : undefined,
                }}
              >
                {cell.day}
              </div>
              {/* Dots */}
              <div className="flex gap-0.5 mt-0.5 min-h-[6px]">
                {dotColor && (
                  <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: dotColor, display: "inline-block" }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}