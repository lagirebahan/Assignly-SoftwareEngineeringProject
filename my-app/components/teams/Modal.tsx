"use client";
import { useState } from "react";
import Image from "next/image";

type ModalStatus = "idle" | "loading" | "success" | "error";

export function Modal({ onClose, onCreateTeam, onJoinTeam }: {
  onClose: () => void;
  onCreateTeam: (teamName: string) => Promise<boolean>;
  onJoinTeam: (joinCode: string) => Promise<boolean>;
}) {
  const [tab, setTab] = useState<"create" | "join">("create");
  const [teamName, setTeamName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [status, setStatus] = useState<ModalStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: "12px 0", fontWeight: 700, fontSize: 14,
    cursor: "pointer", border: "none",
    borderBottom: active ? "3px solid #111827" : "3px solid transparent",
    backgroundColor: "transparent",
    color: active ? "#111827" : "#9ca3af",
    letterSpacing: "0.08em", textTransform: "uppercase" as const,
    transition: "color 0.2s, border-color 0.2s",
  });

  const handleCreate = async () => {
    if (!teamName.trim()) return;
    setStatus("loading");
    const ok = await onCreateTeam(teamName);
    if (ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg("Failed to create team. Please try again.");
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setStatus("loading");
    const ok = await onJoinTeam(joinCode);
    if (ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg("Invalid invite code or team not found.");
    }
  };

  const handleRetry = () => {
    setStatus("idle");
    setErrorMsg("");
  };

  if (status === "success") {
    return (
      <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
        <div style={{ backgroundColor: "#f3f4f6", borderRadius: 16, width: 480, maxWidth: "90vw", padding: "48px 28px", textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
          <Image src="/icons/check.png" alt="Success" width={64} height={64} style={{ marginBottom: 16, display: "block", margin: "0 auto 16px" }} />
          <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
            {tab === "create" ? "Team created successfully!" : "Joined team successfully!"}
          </p>
          <button onClick={onClose} style={{ marginTop: 24, padding: "10px 32px", borderRadius: 10, border: "none", backgroundColor: "#111827", color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            Done
          </button>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
        <div style={{ backgroundColor: "#f3f4f6", borderRadius: 16, width: 480, maxWidth: "90vw", padding: "48px 28px", textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
          <Image src="/icons/remove.png" alt="Failed" width={64} height={64} style={{ marginBottom: 16, display: "block", margin: "0 auto 16px"}} />
          <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
            {tab === "create" ? "Failed to create team." : "Failed to join team."}
          </p>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 8 }}>{errorMsg}</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24 }}>
            <button onClick={handleRetry} style={{ padding: "10px 24px", borderRadius: 10, border: "1.5px solid #e5e7eb", backgroundColor: "white", fontWeight: 600, fontSize: 14, cursor: "pointer", color: "#374151" }}>
              Try Again
            </button>
            <button onClick={onClose} style={{ padding: "10px 24px", borderRadius: 10, border: "none", backgroundColor: "#111827", color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={onClose}>
      <div style={{ backgroundColor: "#f3f4f6", borderRadius: 16, width: 480, maxWidth: "90vw", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", backgroundColor: "white" }}>
          <button style={tabStyle(tab === "create")} onClick={() => setTab("create")}>Create</button>
          <button style={tabStyle(tab === "join")} onClick={() => setTab("join")}>Join</button>
        </div>

        <div style={{ padding: "32px 28px" }}>
          {tab === "create" ? (
            <>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Create a New Team</h3>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>Start a team and invite your members.</p>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Team Name</label>
              <input
                type="text" placeholder="e.g. Group Alpha" value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #d1d5db", fontSize: 14, color: "#111827", backgroundColor: "white", outline: "none", boxSizing: "border-box", marginBottom: 20 }}
              />
              <button
                onClick={handleCreate} disabled={status === "loading"}
                style={{ width: "100%", padding: "12px 0", backgroundColor: "#111827", color: "white", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: status === "loading" ? 0.7 : 1 }}
              >
                {status === "loading" ? "Creating..." : "Create Team"}
              </button>
            </>
          ) : (
            <>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Join a Team</h3>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>Enter the invite code from your team leader.</p>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Invite Code</label>
              <input
                type="text" placeholder="e.g. ABC-12345" value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #d1d5db", fontSize: 14, color: "#111827", backgroundColor: "white", outline: "none", boxSizing: "border-box", marginBottom: 20 }}
              />
              <button
                onClick={handleJoin} disabled={status === "loading"}
                style={{ width: "100%", padding: "12px 0", backgroundColor: "#111827", color: "white", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: status === "loading" ? 0.7 : 1 }}
              >
                {status === "loading" ? "Joining..." : "Join Team"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}