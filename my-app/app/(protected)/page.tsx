"use client";

import { StatusRow } from "@/components/ui/StatusRow";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar, DayTask } from "@/components/ui/Calendar";
import Image from "next/image";
import { StatusBadge } from "@/components/tasks/StatusBadge";

type UpcomingTask = {
  teamId: string;
  teamName: string;
  taskId: string;
  taskTitle: string;
  deadline: string;
  status:"pending"|"unverified"|"verified";
}

export default function HomePage() {
  const [unverifiedCount, setUnverifiedCount] = useState(0);
  const [name, setName] = useState("user");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/login";
      return;
    }
    const parsed = JSON.parse(storedUser);
    setName(parsed.name);

    fetch(`/api/tasks?userId=${parsed.id}`)
      .then((res) => res.json())
      .then((data) => setUpcomingTasks(data));
    fetch(`/api/tasks/leader?userId=${parsed.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUnverifiedCount(data.unverifiedCount);
      });
  }, []);

  const realDayTasks = upcomingTasks.reduce<Record<string, DayTask[]>>((acc, task) => {
    if (!task.deadline) return acc;
    const [year, month, day] = task.deadline.split("-").map(Number);
    const key = `${year}-${month}-${day}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push({
      teamId: task.teamId,
      teamName: task.teamName,
      taskId: task.taskId,
      taskTitle: task.taskTitle,
      status: task.status,
    });
    return acc;
  }, {});

  const dayTasks = selectedDay ? (realDayTasks[selectedDay] ?? []) : [];
  const pendingCount = upcomingTasks.filter(t => t.status === "pending").length;
  const waitingVerification = upcomingTasks.filter(t => t.status === "unverified").length;

  return (
    <div className="h-full bg-gradient-to-b from-[#2e2e2e] to-[#b6a88b] p-12 overflow-hidden flex flex-col">

      <div className="grid grid-cols-[1fr_1.4fr] gap-8 flex-1 min-h-0">

        <div className= "flex flex-col min-h-0">
          <h2 className="text-white text-2xl font-semibold mb-4 text-center flex-shrink-0">Upcoming Task</h2>
          <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-6
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-white
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-400/100"
          
          >
            {upcomingTasks.filter(t => t.status === "pending" || t.status === "unverified").length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-200 rounded-2xl p-8">
                <Image src="/icons/good_man.png" alt="Nice job dude" width={256} height={256} style={{ marginBottom: 16, display: "block", margin: "0 auto 16px"}} />
                <p className="text-gray-500 text-lg font-medium text-center">Great Job! You've finished all your tasks.</p>
              </div>
            ) : (
              [...upcomingTasks.filter(t => t.status === "pending" || t.status ==="unverified")]
              .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
              .map((task, i) => (
                <Link key={i} href={`/teams/${task.teamId}`} className="block">
                  <div className="bg-gray-200 hover:bg-gray-300 transition-colors rounded-2xl px-5 py-4 shadow-md cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{task.teamName}</span>
                      <StatusBadge status={task.status} />
                    </div>

                    <p className="text-gray-800 font-semibold text-sm mb-2">{task.taskTitle}</p>

                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>📅</span>
                      <span>Due {new Date(task.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
            
          </div>
        </div>

        {/* right*/}
        <div className="flex flex-col min-h-0 gap-8 pt-8">
          <div className="flex-1 overflow-y-auto min-h-0
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-400/100"
          
          >
            <div className="bg-gray-200 rounded-2xl p-6 shadow-md">
              <Calendar selectedDay={selectedDay} onSelectDay={setSelectedDay} dayTasks={realDayTasks}/>
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
                              {" . "}{task.taskTitle}
                            </span>
                            <span style={{
                              width: 8, height: 8, borderRadius: "50%",
                              backgroundColor: task.status === "pending" ? "#ef4444" : task.status === "unverified" ? "#f97316" : "#22c55e",
                              display: "inline-block", flexShrink: 0
                            }}/>
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
                    <StatusRow label="On Progress" count={pendingCount} color="#ef4444" />
                    <StatusRow label="Waiting for Leader's Verification" count={waitingVerification} color="#f97316"/>
                    <StatusRow label="Waiting for Your Validation" count={unverifiedCount} color="#a855f7"/> 
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
