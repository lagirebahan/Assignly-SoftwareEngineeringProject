"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Legend } from "@/components/tasks/Legend";
import { MOCK_MEMBERS } from "@/data/mockMember";
import { MemberColumn } from "@/components/tasks/MemberColumn";

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