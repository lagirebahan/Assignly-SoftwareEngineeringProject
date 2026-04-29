"use client";

import { useState } from "react";
import { EmptyState } from "@/components/teams/EmptyState";
import { Legend } from "@/components/teams/Legend";
import { TeamCard } from "@/components/teams/TeamCard";
import { Modal } from "@/components/teams/Modal";
import { Team } from "@/types/team";

import { MOCK_TEAMS } from "@/data/mockTeam";
import { AddTeamCard } from "@/components/teams/AddTeamCard";
import { getMemberStatus } from "@/utils/GetMemberStatus";
import { MOCK_SESSION } from "@/data/mockSession";

export default function TeamPage() {
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    leading: false,
    waitingCompletion: false,
    waitingVerification: false,
    completed: false,
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasTeams = teams.length > 0;

  const filteredTeams = teams
  .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
  .filter((t) => {
    const anyActive = Object.values(filters).some(Boolean);
    if (!anyActive) return true; // no filter = show all

    if (filters.leading && t.leaderId === MOCK_SESSION.id) return true;
    if (filters.waitingCompletion && t.members.some((m) => getMemberStatus(m) === "pending")) return true;
    if (filters.waitingVerification && t.members.some((m) => getMemberStatus(m) === "unverified")) return true;
    if (filters.completed && t.members.every((m) => getMemberStatus(m) === "verified")) return true;

    return false;
  });

  const handleCreateTeam = async (name:string) => {
    try {
    const res = await fetch("/api/teams/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      throw new Error("Failed to create team");
    }

    const newTeam = await res.json();

    setTeams((prev) => [...prev, newTeam]);
    setShowModal(false)

  } catch (err) {
    console.error(err);
    alert("Failed to create team");
  }
  };

  const handleJoinTeam = async (joinCode:string) => {
    try {
    const res = await fetch("/api/teams/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ joinCode }),
    });

    if (!res.ok) {
      throw new Error("Invalid invite code");
    }

    const team:Team = await res.json();

    setTeams((prev) => [...prev, team]);
    setShowModal(false)

  } catch (err) {
    console.error(err);
    alert("Failed to join team");
  }
  };

  return (
    <div
      style={{
        height: "100%",
        background: "linear-gradient(to bottom, #2e2e2e, #b6a88b)",
        display: "flex",
        flexDirection: "column",
        padding: "48px",
        boxSizing: "border-box",
      }}
    >
      {/* Search bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 36 }}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: 320,
              padding: "10px 16px 10px 42px",
              borderRadius: 999,
              backgroundColor: "#f3f4f6",
              border: "1px solid #e5e7eb",
              fontSize: 14,
              color: "#111827",
              outline: "none",
            }}
          />
          <span 
            style={{ 
              position: "absolute", 
              left: 14, 
              top: "50%", 
              transform: "translateY(-50%)", 
              color: "#9ca3af", 
              fontSize: 16 
            }}
          >
            🔎
          </span>
        </div>
        
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowFilter((v) => !v)}
            style={{
              padding: "9px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.25)",
              backgroundColor: Object.values(filters).some(Boolean)
                ? "rgba(255,255,255,0.3)"  // lit up when active
                : "rgba(255,255,255,0.1)",
              cursor: "pointer",
              color: "white",
              fontSize: 16,
            }}
          >
            ⇄
          </button>

          {showFilter && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              backgroundColor: "white",
              borderRadius: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              padding: "8px 0",
              minWidth: 220,
              zIndex: 100,
            }}>
              {[
                { key: "leading",             label: "Teams you're leading", dot: null },
                { key: "waitingCompletion",   label: "Waiting for completion", dot: "#ef4444" },
                { key: "waitingVerification", label: "Waiting for verification", dot: "#f97316" },
                { key: "completed",           label: "Completed", dot: "#22c55e" },
              ].map(({ key, label, dot }) => (
                <div
                  key={key}
                  onClick={() => toggleFilter(key as keyof typeof filters)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 16px",
                    cursor: "pointer",
                    backgroundColor: filters[key as keyof typeof filters]
                      ? "rgba(0,0,0,0.05)"
                      : "transparent",
                  }}
                >
                  {/* Checkbox */}
                  <div style={{
                    width: 16, height: 16, borderRadius: 4,
                    border: "1.5px solid #d1d5db",
                    backgroundColor: filters[key as keyof typeof filters] ? "#111827" : "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {filters[key as keyof typeof filters] && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>

                  {/* Color dot */}
                  {dot && (
                    <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: dot, display: "inline-block", flexShrink: 0 }} />
                  )}

                  <span style={{ fontSize: 13, color: "#111827" }}>{label}</span>
                </div>
              ))}

              {/* Clear all */}
              {Object.values(filters).some(Boolean) && (
                <>
                  <div style={{ borderTop: "1px solid #f3f4f6", margin: "6px 0" }} />
                  <div
                    onClick={() => setFilters({ leading: false, waitingCompletion: false, waitingVerification: false, completed: false })}
                    style={{ padding: "8px 16px", cursor: "pointer", fontSize: 12, color: "#9ca3af" }}
                  >
                    Clear all
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className= "flex flex-col min-h-0">
        {!hasTeams ? (
          <EmptyState onClick={() => setShowModal(true)} />
        ) : (
          <>
            {/* red dot orange dot thingy */}
            <div className="flex-shrink-0">
              <Legend />
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-6
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-white
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-400/100"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 20,
                  alignItems: "start",
                }}
              >
                {/* Add Team card */}
                <AddTeamCard onClick={() => setShowModal(true)} />

                {/* Team cards */}
                {filteredTeams.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            </div>
            
          </>
        )}
      </div>
      
      

      {/* Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} onCreateTeam={handleCreateTeam} onJoinTeam={handleJoinTeam}/>
      )}
    </div>
  );
}