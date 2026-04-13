"use client"
import { useState } from "react";

export function Modal({ onClose, onCreateTeam }: { onClose: () => void; onCreateTeam: () => void }) {
  const [tab, setTab] = useState<"create" | "join">("create");
  const [teamName, setTeamName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "12px 0",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    border: "none",
    borderBottom: active ? "3px solid #111827" : "3px solid transparent",
    backgroundColor: "transparent",
    color: active ? "#111827" : "#9ca3af",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    transition: "color 0.2s, border-color 0.2s",
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#f3f4f6",
          borderRadius: 16,
          width: 480,
          maxWidth: "90vw",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", backgroundColor: "white" }}>
          <button style={tabStyle(tab === "create")} onClick={() => setTab("create")}>
            Create
          </button>
          <button style={tabStyle(tab === "join")} onClick={() => setTab("join")}>
            Join
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "32px 28px" }}>
          {tab === "create" ? (
            <>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
                Create a New Team
              </h3>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>
                Start a team and invite your members.
              </p>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Team Name
              </label>
              <input
                type="text"
                placeholder="e.g. Group Alpha"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #d1d5db",
                  fontSize: 14,
                  color: "#111827",
                  backgroundColor: "white",
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: 20,
                }}
              />
              <button
                onClick={() => { onCreateTeam(); onClose(); }}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  backgroundColor: "#111827",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                }}
              >
                Create Team
              </button>
            </>
          ) : (
            <>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
                Join a Team
              </h3>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>
                Enter the invite code from your team leader.
              </p>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Invite Code
              </label>
              <input
                type="text"
                placeholder="e.g. ABC-12345"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #d1d5db",
                  fontSize: 14,
                  color: "#111827",
                  backgroundColor: "white",
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: 20,
                }}
              />
              <button
                onClick={() => { onCreateTeam(); onClose(); }}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  backgroundColor: "#111827",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                }}
              >
                Join Team
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}