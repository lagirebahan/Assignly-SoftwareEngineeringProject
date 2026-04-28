"use client";

import { useState } from "react";
import { EmptyState } from "@/components/teams/EmptyState";
import { Legend } from "@/components/teams/Legend";
import { TeamCard } from "@/components/teams/TeamCard";
import { Modal } from "@/components/teams/Modal";
import { Team } from "@/types/team";

import { MOCK_TEAMS } from "@/data/mockTeam";
import { AddTeamCard } from "@/components/teams/AddTeamCard";


export default function TeamPage() {
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const hasTeams = teams.length > 0;

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

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
        <button 
          style={{ 
            padding: "9px 12px", 
            borderRadius: 10, 
            border: "1px solid rgba(255,255,255,0.25)", 
            backgroundColor: "rgba(255,255,255,0.1)", 
            cursor: "pointer", 
            color: "white", 
            fontSize: 16 
          }}
        >
          ⇄
        </button>
        <button 
          style={{ 
            padding: "9px 12px", 
            borderRadius: 10, 
            border: "1px solid rgba(255,255,255,0.25)", 
            backgroundColor: "rgba(255,255,255,0.1)", 
            cursor: "pointer", 
            color: "white", 
            fontSize: 16 
          }}
        >
          ☰
        </button>
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