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

export const MOCK_DAY_TASKS: Record<string, DayTask[]> = {
  "2026-4-29": [
    { teamId: "group1", teamName: "Group 1", taskId: "T-01", taskTitle: "Write report", status: "pending" },
    { teamId: "group2", teamName: "Group 2", taskId: "T-02", taskTitle: "Submit slides", status: "verified" },
  ],
  "2026-4-30": [
    { teamId: "group3", teamName: "Group 3", taskId: "T-03", taskTitle: "Review PR", status: "unverified" },
  ],
};

interface CalendarProps {
  selectedDay: string | null;
  onSelectDay: (key: string | null) => void;
}

export function Calendar({ selectedDay, onSelectDay }: CalendarProps) {
  const today = new Date();
  // Fix: snapshot these so they never drift
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

  // Build cells — only pad end row to complete the week, no 42-cell fill
  const cells: { day: number; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrevMonth - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  const tail = cells.length % 7;
  if (tail !== 0) {
    for (let d = 1; d <= 7 - tail; d++) cells.push({ day: d, current: false });
  }

  const rows: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  // The "active" day drives the blue dot — selected if set, otherwise today
  const activeDotKey = selectedDay ?? todayKey;

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
      <div className="flex flex-col">
        {rows.map((row, ri) => (
          <div key={ri} className="grid grid-cols-7 gap-y-0.5">
            {row.map((cell, ci) => {
              const key = `${year}-${month + 1}-${cell.day}`;
              const isToday = cell.current && key === todayKey;
              const isSelected = cell.current && selectedDay === key;
              const isActiveDot = cell.current && key === activeDotKey;

              // Today with no selection → bold blue number, no circle bg
              // Today when something else selected → bold blue number, no circle bg  
              // Selected (non-today) → filled blue circle
              const tasks = cell.current ? (MOCK_DAY_TASKS[key] ?? []) : [];
              const taskDotColor = tasks.length > 0
                ? STATUS_COLOR[tasks.reduce((best, t) =>
                    STATUS_PRIORITY[t.status] < STATUS_PRIORITY[best.status] ? t : best
                  ).status]
                : null;

              // Number styling
              let bgColor = "transparent";
              let textColor = cell.current ? "#1f2937" : "#d1d5db";
              let fontWeight: number | undefined = undefined;

              if (isSelected && !isToday) {
                // Another day selected → filled blue circle
                bgColor = "#0ea5e9";
                textColor = "white";
                fontWeight = 700;
              } else if (isToday) {
                // Today → always bold blue text, no fill
                textColor = "#0ea5e9";
                fontWeight = 700;
              }

              // Dot: blue for active (today or selected), task color otherwise
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
                      <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#0ea5e9", display: "inline-block" }} />
                    )}
                    {showTaskDot && (
                      <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: taskDotColor!, display: "inline-block" }} />
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