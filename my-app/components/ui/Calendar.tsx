import { useState } from "react";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export type DayTask = {
  teamId: string;
  teamName: string;
  taskId: string;
  taskTitle: string;
  status: "pending" | "unverified" | "verified";
};

const STATUS_COLOR: Record<DayTask["status"], string> = {
  pending: "#ef4444",
  unverified: "#f97316",
  verified: "#22c55e",
};

const STATUS_PRIORITY: Record<DayTask["status"], number> = {
  pending: 0,
  unverified: 1,
  verified: 2,
};

interface CalendarProps {
  selectedDay: string | null;
  onSelectDay: (key: string | null) => void;
  dayTasks?: Record<string, DayTask[]>;
}

export function Calendar({ selectedDay, onSelectDay, dayTasks = {} }: CalendarProps) {
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  const todayKey = `${todayYear}-${todayMonth + 1}-${todayDate}`;

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [year, setYear] = useState(todayYear);
  const [month, setMonth] = useState(todayMonth);

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
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrevMonth - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  const tail = cells.length % 7;
  if (tail !== 0) {
    for (let d = 1; d <= 7 - tail; d++) cells.push({ day: d, current: false });
  }

  const rows: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const activeDotKey = selectedDay ?? todayKey;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="text-gray-500 hover:text-gray-800 px-1 text-lg leading-none">‹</button>
        <span className="text-sm font-semibold text-gray-700">{monthName} {year}</span>
        <button onClick={nextMonth} className="text-gray-500 hover:text-gray-800 px-1 text-lg leading-none">›</button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d, i) => (
          <div key={i} className="text-center text-xs font-semibold text-gray-400">{d}</div>
        ))}
      </div>

      <div className="flex flex-col">
        {rows.map((row, ri) => (
          <div key={ri} className="grid grid-cols-7 gap-y-0.5">
            {row.map((cell, ci) => {
              const key = `${year}-${month + 1}-${cell.day}`;
              const isToday = cell.current && key === todayKey;
              const isSelected = cell.current && selectedDay === key;
              const isActiveDot = cell.current && key === activeDotKey;

              const tasks = cell.current ? (dayTasks[key] ?? []) : [];
              const taskDotColor = tasks.length > 0
                ? STATUS_COLOR[tasks.reduce((best, t) =>
                    STATUS_PRIORITY[t.status] < STATUS_PRIORITY[best.status] ? t : best
                  ).status]
                : null;

              let bgColor = "transparent";
              let textColor = cell.current ? "#1f2937" : "#d1d5db";
              let fontWeight: number | undefined = undefined;

              if (isSelected && !isToday) {
                bgColor = "#0ea5e9";
                textColor = "white";
                fontWeight = 700;
              } else if (isToday) {
                textColor = "#0ea5e9";
                fontWeight = 700;
              }

              const showBlueDot = isActiveDot;
              const showTaskDot = !showBlueDot && !!taskDotColor;

              return (
                <div
                  key={ci}
                  className="flex flex-col items-center py-0.5"
                  onClick={() => cell.current && onSelectDay(isSelected ? null : key)}
                  onMouseEnter={() => cell.current && setHoveredKey(key)}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full text-xs ${cell.current ? "cursor-pointer" : ""}`}
                    style={{ 
                      backgroundColor: bgColor !== "transparent" 
                        ? bgColor : hoveredKey === key && cell.current 
                        ? "#acaab3" : "transparent", 
                      color: textColor, 
                      fontWeight 
                    }}
                  >
                    {cell.day}
                  </div>
                  <div className="flex gap-0.5 mt-0.5 min-h-[6px]">
                    {showBlueDot && (
                      <span className="w-[5px] h-[5px] rounded-full bg-sky-500 inline-block" />
                    )}
                    {showTaskDot && (
                      <span className="w-[5px] h-[5px] rounded-full inline-block" style={{backgroundColor: taskDotColor!}} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}