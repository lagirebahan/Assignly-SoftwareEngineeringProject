"use client";

import { useState } from "react";
import { TeamMember } from "@/types/team";
import { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";

export const MemberColumn = ({
  member,
  teamId,
  isLeader,
}: {
  member: TeamMember;
  teamId: string;
  isLeader: boolean;
}) => {
  const [tasks, setTasks] = useState<Task[]>(member.tasks ?? []);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [error, setError] = useState("");

  const handleAddTask = () => {
    if (!newTitle.trim()) { setError("Title is required."); return; }
    if (!newDeadline) { setError("Deadline is required."); return; }

    const newTask: Task = {
      id: `t${tasks.length + 1}-${Date.now()}`,
      title: newTitle.trim(),
      hasAttachment: false,
      status: "pending",
      deadline: newDeadline,
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTitle("");
    setNewDeadline("");
    setError("");
    setShowForm(false);
  };

  return (
    <div style={{
      backgroundColor: "white",
      borderRadius: 14,
      padding: "14px 14px 8px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      display: "flex",
      flexDirection: "column",
      maxHeight: "calc(100vh - 220px)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        fontWeight: 700, fontSize: 14, color: "#111827",
        marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #f3f4f6",
      }}>
        {member.name}
      </div>

      {/* Scrollable task list */}
      <div
        style={{ overflowY: "auto", flex: 1 }}
        className="[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        {tasks.length === 0 ? (
          // ── Empty state ──
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: "24px 8px", gap: 8, color: "#9ca3af",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 12, textAlign: "center" }}>No tasks yet</span>
            {isLeader && (
              <span style={{ fontSize: 11, color: "#d1d5db", textAlign: "center" }}>
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
              memberId={member.id}
              isLeader={isLeader}
            />
          ))
        )}

        {/* Inline add task form — leader only */}
        {isLeader && showForm && (
          <div style={{
            backgroundColor: "#f9fafb", borderRadius: 10,
            padding: "10px 10px", marginTop: 8,
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            <input
              placeholder="Task title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                padding: "6px 10px", borderRadius: 6, fontSize: 12,
                border: "1px solid #e5e7eb", outline: "none", color: "#111827",
              }}
            />
            <input
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              style={{
                padding: "6px 10px", borderRadius: 6, fontSize: 12,
                border: "1px solid #e5e7eb", outline: "none", color: "#374151",
              }}
            />
            {error && (
              <span style={{ fontSize: 11, color: "#ef4444" }}>{error}</span>
            )}
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={handleAddTask}
                style={{
                  flex: 1, padding: "5px 0", borderRadius: 6, border: "none",
                  backgroundColor: "#111827", color: "white",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}
              >
                Add
              </button>
              <button
                onClick={() => { setShowForm(false); setError(""); setNewTitle(""); setNewDeadline(""); }}
                style={{
                  flex: 1, padding: "5px 0", borderRadius: 6,
                  border: "1px solid #e5e7eb", backgroundColor: "white",
                  fontSize: 12, color: "#6b7280", cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer — + button for leader only */}
      <div style={{
        borderTop: "1px solid #f3f4f6", paddingTop: 8, marginTop: 4,
        display: "flex", justifyContent: "center",
      }}>
        {isLeader ? (
          <button
            onClick={() => setShowForm((v) => !v)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: showForm ? "#ef4444" : "#6b7280",
              display: "flex", alignItems: "center", gap: 4, fontSize: 12,
            }}
          >
            {showForm ? (
              // X icon when form is open
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              // + icon when form is closed
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        ) : (
          // Upload icon for members
          <button style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#6b7280", display: "flex", alignItems: "center", gap: 4, fontSize: 12,
          }}>
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