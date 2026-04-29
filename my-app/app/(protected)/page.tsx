"use client";

import { StatusRow } from "@/components/ui/StatusRow";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar,MOCK_DAY_TASKS, DayTask } from "@/components/ui/Calendar";

const MOCK_UPCOMING_TASKS = [
  { teamId: "group1", teamName: "Group 1", taskId: "T-01", taskTitle: "Write report", deadline: "2026-05-02", status: "pending" as const },
  { teamId: "group2", teamName: "Group 2", taskId: "T-02", taskTitle: "Submit slides", deadline: "2026-04-30", status: "verified" as const },
  { teamId: "group3", teamName: "Group 3", taskId: "T-03", taskTitle: "Review PR", deadline: "2026-05-05", status: "unverified" as const },
  { teamId: "group1", teamName: "Group 1", taskId: "T-04", taskTitle: "Update README", deadline: "2026-05-01", status: "pending" as const },
];

const STATUS_DOTS: Record<string, string> = {
  pending: "#f97316",
  unverified: "#ef4444",
  verified: "#22c55e",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  unverified: "Needs Review",
  verified: "Verified",
};

const STATUS_DOT: Record<DayTask["status"], string> ={
  unverified:  "#f97316",
  pending:  "#ef4444",
  verified:  "#22c55e",
}

export default function HomePage() {

const [name, setName] = useState("user");
const [selectedDay, setSelectedDay] = useState<string | null>(null);

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    window.location.href = "/login";
    return;
  }
  const parsed = JSON.parse(storedUser);
  setName(parsed.name);
}, []);

const dayTasks = selectedDay ? (MOCK_DAY_TASKS[selectedDay]??[]) : []; 

  return (
    <div className="h-full bg-gradient-to-b from-[#2e2e2e] to-[#b6a88b] p-12 overflow-hidden flex flex-col">

      <div className="grid grid-cols-[1fr_1.4fr] gap-8 flex-1 min-h-0">

        {/* Upcoming Tasks */}
        <div className= "flex flex-col min-h-0">
          <h2 className="text-white text-2xl font-semibold mb-4 text-center flex-shrink-0">Upcoming Task</h2>
          {/* blm buat script untuk scrolling and flexible group amount*/}
          <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-6
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-white
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-400/100"
          
          >
            {MOCK_UPCOMING_TASKS.map((task,i) => (
              <Link key={i} href={`/teams/${task.teamId}`} className="block">
                <div className="bg-gray-200 hover:bg-gray-300 transition-colors rounded-2xl px-5 py-4 shadow-md cursor-pointer">
          {/* Top row: team name + status dot */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{task.teamName} · {task.taskId}</span>
            <div className="flex items-center gap-1.5">
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: STATUS_DOTS[task.status], display: "inline-block" }} />
              <span className="text-xs" style={{ color: STATUS_DOT[task.status] }}>{STATUS_LABEL[task.status]}</span>
            </div>
          </div>
          {/* Task title */}
          <p className="text-gray-800 font-semibold text-sm mb-2">{task.taskTitle}</p>
          {/* Deadline */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>📅</span>
            <span>Due {new Date(task.deadline).toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col min-h-0 gap-8 pt-8">
          <div className="flex-1 overflow-y-auto min-h-0
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-400/100"
          
          >
            <div className="bg-gray-200 rounded-2xl p-6 shadow-md">
              <Calendar selectedDay={selectedDay} onSelectDay={setSelectedDay} />
              <div className="border-t border-gray-300 my-5"/>

              {selectedDay ? (
                <>
                  <h2 className="text-center font-semibold text-sm text-black uppercase tracking-widest mb-4 ">{selectedDay}</h2>
                {dayTasks.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm">No tasks due today</p>
                ) : (
                  <div className="space-y-2">
                    {dayTasks.map((task) => (
                      <Link key = {task.taskId} href={`/teams/${task.teamId}`}>
                        <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer">
                          <span className="text-sm text-gray-700">
                            <span className="font-medium">{task.teamName}</span>
                            {" . "}{task.taskId}{" . "}{task.taskTitle}
                          </span>
                          <span style={{width: 8, height:8, borderRadius:"50%",backgroundColor: STATUS_DOT[task.status], display:"inline-block", flexShrink:0}}/>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                </>
              ) : (
                <>
                  <h2 className="text-center font-semibold text-sm text-black uppercase tracking-widest mb-4 ">Status</h2>

                  <div className="space-y-3">
                    <StatusRow label="On Progress" count={3} color="#ef4444" />
                    <StatusRow label="Waiting for Validation" count={1} color="#f97316"/> 
                    <StatusRow label="Waiting for Verification" count={1} color="#a855f7"/>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
