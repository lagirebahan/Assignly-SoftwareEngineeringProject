"use client";

import { useState, useEffect } from "react";
import { TeamMember } from "@/types/team";
import { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";

export const MemberColumn = ({
  member,
  teamId,
  isLeader,
  currentUserId,
}: {
  member: TeamMember;
  teamId: string;
  isLeader: boolean;
  currentUserId: string;
}) => {
  const [tasks, setTasks] = useState<Task[]>(member.tasks ?? []);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newIsLarge, setNewIsLarge] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTasks(member.tasks ?? []);
  }, [member.tasks]);

  const handleAddTask = async () => {
    if (!newTitle.trim()) { setError("Title is required."); return; }
    if (!newDeadline) { setError("Deadline is required."); return; }

    const res = await fetch(`/api/teams/${teamId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle.trim(),
        deadline: newDeadline,
        teamMemberId: member.id,
        isLarge: newIsLarge,
      }),
    });

    if (!res.ok) { setError("Failed to add task."); return; }

    const newTask = await res.json();
    setTasks((prev) => [...prev, newTask]);
    setNewTitle("");
    setNewDeadline("");
    setNewIsLarge(false);
    setError("");
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-[14px] pt-3.5 px-3.5 pb-2 shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex flex-col h-full overflow-hidden">

      <div className="font-bold text-sm text-gray-900 mb-3 pb-2 border-b border-gray-100">
        {member.name}
      </div>

      <div
        className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 px-2 gap-2 text-gray-400">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-xs text-center">No tasks yet</span>
            {isLeader && (
              <span className="text-[11px] text-gray-300 text-center">
                Use the + below to add one
              </span>
            )}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              teamId={teamId}
              memberId={member.userId}
              isLeader={isLeader}
              currentUserId={currentUserId}
            />
          ))
        )}

        {isLeader && showForm && (
          <div className="bg-gray-50 rounded-[10px] p-2.5 mt-2 flex flex-col gap-1.5">
            <input
              placeholder="Task title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="px-2.5 py-1.5 rounded-md text-xs border border-gray-200 outline-none text-gray-900"
            />
            <input
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="px-2.5 py-1.5 rounded-md text-xs border border-gray-200 outline-none text-gray-700"
            />
            <label className="flex items-center gap-1.5 text-[11px] text-gray-600 select-none cursor-pointer py-0.5">
              <input
                type="checkbox"
                checked={newIsLarge}
                onChange={(e) => setNewIsLarge(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span>Mark as Large Task</span>
            </label>
            {error && (
              <span className="text-[11px] text-red-500">{error}</span>
            )}
            <div className="flex gap-1.5">
              <button
                onClick={handleAddTask}
                className="flex-1 py-1 rounded-md border-none bg-gray-900 text-white text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
              <button
                onClick={() => { setShowForm(false); setError(""); setNewTitle(""); setNewDeadline(""); setNewIsLarge(false); }}
                className="flex-1 py-1 rounded-md border border-gray-200 bg-white text-xs text-gray-500 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 pt-2 mt-1 flex justify-center">
        {isLeader ? (
          <button
            onClick={() => setShowForm((v) => !v)}
            className={`bg-none border-none cursor-pointer flex items-center gap-1 text-xs ${showForm ? "text-red-500" : "text-gray-500"}`}
          >
            {showForm ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        ) : (
          <button className="bg-none border-none cursor-pointer text-gray-500 flex items-center gap-1 text-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};