"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
type TaskStatus = "verified" | "unverified" | "pending";

interface Task {
  id: string;
  title: string;
  hasAttachment: boolean;
  status: TaskStatus;
}

interface Member {
  id: string;
  name: string;
  tasks: Task[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_MEMBERS: Member[] = [
  {
    id: "m1",
    name: "Anggota 1",
    tasks: [
      { id: "t1", title: "Task 1", hasAttachment: true,  status: "verified"   },
      { id: "t2", title: "Task 2", hasAttachment: true,  status: "pending"    },
      { id: "t3", title: "Task 3", hasAttachment: false, status: "pending"    },
    ],
  },
  {
    id: "m2",
    name: "Anggota 2",
    tasks: [
      { id: "t1", title: "Task 1", hasAttachment: true,  status: "pending"    },
      { id: "t2", title: "Task 2", hasAttachment: true,  status: "unverified" },
      { id: "t3", title: "Task 3", hasAttachment: false, status: "pending"    },
    ],
  },
  {
    id: "m3",
    name: "Anggota 3",
    tasks: [
      { id: "t1", title: "Task 1", hasAttachment: true,  status: "verified"   },
      { id: "t2", title: "Task 2", hasAttachment: true,  status: "verified"   },
      { id: "t3", title: "Task 3", hasAttachment: false, status: "pending"    },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: TaskStatus }) => {
  if (status === "pending") return null;
  const isVerified = status === "verified";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: 600,
        color: isVerified ? "#16a34a" : "#dc2626",
        marginTop: 4,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: isVerified ? "#16a34a" : "#dc2626",
          flexShrink: 0,
        }}
      />
      {isVerified ? "Status: Verified" : "Status: Unverified"}
    </div>
  );
};

const AttachmentBox = ({ hasAttachment }: { hasAttachment: boolean }) => (
  <div
    style={{
      width: "100%",
      height: 72,
      borderRadius: 8,
      border: "1.5px dashed #d1d5db",
      backgroundColor: "#f9fafb",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      color: "#6b7280",
      fontSize: 11,
      cursor: "pointer",
      marginTop: 6,
    }}
  >
    {hasAttachment ? (
      <>
        {/* Image placeholder */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="#9ca3af" strokeWidth="1.5"/>
          <path d="M3 16l5-5 4 4 3-3 6 6" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="#9ca3af"/>
        </svg>
      </>
    ) : (
      <>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Upload image</span>
      </>
    )}
  </div>
);

const TaskItem = ({
  task,
  teamId,
  memberId,
  isLeader,
}: {
  task: Task;
  teamId: string;
  memberId: string;
  isLeader: boolean;
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() =>
        isLeader
          ? router.push(`/teams/${teamId}/${task.id}?member=${memberId}`)
          : undefined
      }
      style={{
        cursor: isLeader ? "pointer" : "default",
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* thumbs up icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" stroke="#6b7280" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
          {task.title}
        </span>
      </div>

      <AttachmentBox hasAttachment={task.hasAttachment} />
      <StatusBadge status={task.status} />
    </div>
  );
};

const MemberColumn = ({
  member,
  teamId,
  isLeader,
}: {
  member: Member;
  teamId: string;
  isLeader: boolean;
}) => (
  <div
    style={{
      backgroundColor: "white",
      borderRadius: 14,
      padding: "14px 14px 8px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      display: "flex",
      flexDirection: "column",
      maxHeight: "calc(100vh - 220px)",
      overflow: "hidden",
    }}
  >
    {/* Header */}
    <div
      style={{
        fontWeight: 700,
        fontSize: 14,
        color: "#111827",
        marginBottom: 12,
        paddingBottom: 8,
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      {member.name}
    </div>

    {/* Scrollable tasks */}
    <div
      style={{ overflowY: "auto", flex: 1 }}
      className="[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
    >
      {member.tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          teamId={teamId}
          memberId={member.id}
          isLeader={isLeader}
        />
      ))}
    </div>

    {/* Upload row */}
    <div
      style={{
        borderTop: "1px solid #f3f4f6",
        paddingTop: 8,
        marginTop: 4,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#6b7280",
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 12,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
);

// ─── Legend ───────────────────────────────────────────────────────────────────
const Legend = () => (
  <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
    {[
      { color: "#16a34a", label: "Verified" },
      { color: "#dc2626", label: "Unverified" },
    ].map(({ color, label }) => (
      <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: color, display: "inline-block" }} />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{label}</span>
      </div>
    ))}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GroupPage({
  params,
}: {
  params: { teamId: string };
}) {
  const router = useRouter();
  const teamId = params?.teamId ?? "team1";

  // In real app: derive from session/role
  const [isLeader] = useState(true);
  const [groupName, setGroupName] = useState("Group 1");
  const [editingName, setEditingName] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #2e2e2e, #b6a88b)",
        display: "flex",
        flexDirection: "column",
        padding: "36px 48px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "white",
            fontSize: 22,
            lineHeight: 1,
            padding: 0,
          }}
        >
          ←
        </button>

        {editingName ? (
          <input
            autoFocus
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            onBlur={() => setEditingName(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "white",
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderBottom: "2px solid white",
              outline: "none",
              borderRadius: 4,
              padding: "2px 8px",
            }}
          />
        ) : (
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "white" }}>
            {groupName}
          </h1>
        )}

        {isLeader && (
          <button
            onClick={() => setEditingName(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.7)",
              fontSize: 16,
              padding: 0,
            }}
          >
            ✏️
          </button>
        )}
      </div>

      <Legend />

      {/* Columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${MOCK_MEMBERS.length}, 1fr)`,
          gap: 16,
          flex: 1,
          minHeight: 0,
        }}
      >
        {MOCK_MEMBERS.map((member) => (
          <MemberColumn
            key={member.id}
            member={member}
            teamId={teamId}
            isLeader={isLeader}
          />
        ))}
      </div>
    </div>
  );
}