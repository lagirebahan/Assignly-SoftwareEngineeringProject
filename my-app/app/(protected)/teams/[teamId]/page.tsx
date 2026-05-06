"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Legend } from "@/components/tasks/Legend";
import { MemberColumn } from "@/components/tasks/MemberColumn";
import { Team } from "@/types/team";

export default function GroupPage() {
  const [currentUserId, setCurrentUserId] = useState("");
  const [teamData, setTeamData] = useState<Team | null>(null);
  const [isLeader, setIsLeader] = useState(false);
  const router = useRouter();
  const params = useParams();
  const teamId = (params?.teamId as string) ?? "group1";


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const parsed = JSON.parse(storedUser);
    setCurrentUserId(parsed.id);

    const cacheKey = `group_${teamId}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      const data = JSON.parse(cached);
      setTeamData(data);
      setIsLeader(data.leaderId === parsed.id);
      setGroupName(data.name);
      return;
    }

    fetch(`/api/teams/${teamId}`)
      .then((res) => res.json())
      .then((data) => {
        setTeamData(data);
        setIsLeader(data.leaderId === parsed.id);
        setGroupName(data.name);
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      });
  }, [teamId]);

  const handleSaveName = async () => {
    setEditingName(false);
    if (groupName === teamData?.name) return;
    await fetch(`/api/teams/${teamId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: groupName }),
    });
    sessionStorage.removeItem(`group_${teamId}`); 
  };

  const members = teamData?.members ?? [];
  const [groupName, setGroupName] = useState(teamData?.name ?? "Unknown Group");
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
            onBlur={ handleSaveName}
            onKeyDown={(e) => e.key === "Enter" && { handleSaveName}}
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
          gridTemplateColumns: `repeat(${members.length}, 1fr)`,
          gap: 16,
          flex: 1,
          minHeight: 0,
        }}
      >
        {members.map((member) => (
          <MemberColumn
            key={member.id}
            member={member}
            teamId={teamId}
            isLeader={isLeader}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
}