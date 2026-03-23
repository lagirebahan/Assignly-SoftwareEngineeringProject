// import MainNavbar from "@/components/layout/Navbar";
// import Link from "next/link";

// const teams = [
//   { id: "team1", name: "Team Alpha" },
//   { id: "team2", name: "Team Beta" },
//   { id: "team3", name: "Team Gamma" },
// ];


// export default function TeamPage() {
//   return (
//     <main className="h-full bg-gradient-to-b from-[#2e2e2e] to-[#b6a88b] p-12 overflow-hidden flex flex-col">

//       <div className="flex items-center justify-center gap-4 mb-10">
//         {/* ini untuk bagian search atas */}
//         <input type="text" placeholder="Search..." className="w-80 px-4 py-2 rounded-full bg-gray-200 border border-gray-300 focus:outline-none text-black text-sm"/>
//         <button className="p-2 rounded-lg border hover:bg-gray-100">🔎</button>
//         <button className="p-2 rounded-lg border hover:bg-gray-100">⇄</button>
//         <button className="p-2 rounded-lg border hover:bg-gray-100">☰</button>
//       </div>


//       {/* grid */}
//       <div className="grid grid-cols-3 gap-8">
//         <h1> tes section bawah</h1>
//       </div>
      
      
//       {/* sementara title pagenya gini dulu, blm ada navbar
//       <h1 className="text-white text-2xl mb-6">Team Page</h1>
      
//       <ul>
//         {teams.map((team) => (
//           <li key={team.id}>
//             <Link href={`/teams/${team.id}`}>
//               {team.name}
//             </Link>
//           </li>
//         ))}
//       </ul> */}
      

      
      
//     </main>
//   )
// }

"use client";

import { useState } from "react";
import Link from "next/link";

// --- Types ---
type TaskStatus = "unfinished" | "unverified" | "done";

interface TeamMember {
  name: string;
  taskStatus: TaskStatus;
}

interface Team {
  id: string;
  name: string;
  progress: number;
  members: TeamMember[];
}

// --- Mock Data ---
const MOCK_TEAMS: Team[] = [
  {
    id: "group1",
    name: "Group 1",
    progress: 85,
    members: [
      { name: "Alexio Clive Vandana", taskStatus: "done" },
      { name: "Bryant Evant Mulya", taskStatus: "unfinished" },
      { name: "Christian Jordan Dwisaputra", taskStatus: "unverified" },
      { name: "Joselyn Patricia Prasetyo", taskStatus: "done" },
      { name: "Nathan", taskStatus: "done" },
    ],
  },
  {
    id: "group2",
    name: "Group 2",
    progress: 50,
    members: [
      { name: "Alexio Clive Vandana", taskStatus: "done" },
      { name: "Bryant Evant Mulya", taskStatus: "unfinished" },
      { name: "Christian Jordan Dwisaputra", taskStatus: "unfinished" },
      { name: "Joselyn Patricia Prasetyo", taskStatus: "unverified" },
      { name: "Nathan", taskStatus: "done" },
    ],
  },
  {
    id: "group3",
    name: "Group 3",
    progress: 75,
    members: [
      { name: "Alexio Clive Vandana", taskStatus: "done" },
      { name: "Bryant Evant Mulya", taskStatus: "done" },
      { name: "Christian Jordan Dwisaputra", taskStatus: "unverified" },
      { name: "Joselyn Patricia Prasetyo", taskStatus: "done" },
      { name: "Nathan", taskStatus: "done" },
    ],
  },
  {
    id: "group4",
    name: "Group 4",
    progress: 80,
    members: [
      { name: "Alexio Clive Vandana", taskStatus: "done" },
      { name: "Bryant Evant Mulya", taskStatus: "done" },
      { name: "Christian Jordan Dwisaputra", taskStatus: "done" },
      { name: "Joselyn Patricia Prasetyo", taskStatus: "unfinished" },
      { name: "Nathan", taskStatus: "done" },
    ],
  },
  {
    id: "group5",
    name: "Group 5",
    progress: 20,
    members: [
      { name: "Alexio Clive Vandana", taskStatus: "unfinished" },
      { name: "Bryant Evant Mulya", taskStatus: "unfinished" },
      { name: "Christian Jordan Dwisaputra", taskStatus: "unfinished" },
      { name: "Joselyn Patricia Prasetyo", taskStatus: "unverified" },
      { name: "Nathan", taskStatus: "done" },
    ],
  },
];

// --- Status Dot ---
function StatusDot({ status }: { status: TaskStatus }) {
  if (status === "done") return null;
  const color = status === "unfinished" ? "#ef4444" : "#f97316";
  const title = status === "unfinished" ? "Unfinished task" : "Awaiting leader verification";
  return (
    <span
      title={title}
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: color,
        marginLeft: 6,
        flexShrink: 0,
        boxShadow: `0 0 4px ${color}99`,
      }}
    />
  );
}

// --- Progress Bar ---
function ProgressBar({ value }: { value: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          backgroundColor: "#e5e7eb",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            backgroundColor: "#374151",
            borderRadius: 999,
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", minWidth: 32 }}>
        {value}%
      </span>
    </div>
  );
}

// --- Team Card ---
function TeamCard({ team }: { team: Team }) {
  const hasAlert = team.members.some((m) => m.taskStatus !== "done");
  return (
    <Link href={`/teams/${team.id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          padding: "20px 22px",
          cursor: "pointer",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          height: "100%",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.14)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
        }}
      >
        {/* Alert indicator on card level */}
        {hasAlert && (
          <span
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: team.members.some((m) => m.taskStatus === "unfinished")
                ? "#ef4444"
                : "#f97316",
              boxShadow: team.members.some((m) => m.taskStatus === "unfinished")
                ? "0 0 6px #ef4444aa"
                : "0 0 6px #f97316aa",
            }}
          />
        )}

        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 10 }}>
          {team.name}
        </h2>

        <ProgressBar value={team.progress} />

        <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Members:
        </p>
        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {team.members.map((member, i) => (
            <li
              key={i}
              style={{
                fontSize: 12,
                color: "#374151",
                marginBottom: 3,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#9ca3af", marginRight: 5 }}>{i + 1}.</span>
              {member.name}
              <StatusDot status={member.taskStatus} />
            </li>
          ))}
        </ol>
      </div>
    </Link>
  );
}

// --- Add Team Card ---
function AddTeamCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "white",
        borderRadius: 16,
        padding: "20px 22px",
        cursor: "pointer",
        border: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        minHeight: 160,
        width: "100%",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.14)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "2px solid #9ca3af",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
          fontSize: 24,
          fontWeight: 300,
        }}
      >
        +
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Add Team</span>
    </button>
  );
}

// --- Modal ---
function Modal({ onClose, onCreateTeam }: { onClose: () => void; onCreateTeam: () => void }) {
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

// --- Empty State ---
function EmptyState({ onClick }: { onClick: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button
        onClick={onClick}
        style={{
          width: "100%",
          maxWidth: 900,
          padding: "80px 40px",
          borderRadius: 32,
          border: "2px solid rgba(0,0,0,0.25)",
          backgroundColor: "transparent",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(0,0,0,0.05)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
        }}
      >
        {/* Plus icon in circle */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: "2.5px solid #1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="6" width="8" height="36" rx="2" fill="#1a1a1a" />
            <rect x="6" y="20" width="36" height="8" rx="2" fill="#1a1a1a" />
          </svg>
        </div>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>
          Create Team / Join Team
        </span>
      </button>
    </div>
  );
}

// --- Legend ---
function Legend() {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, justifyContent: "flex-end" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ef4444", display: "inline-block", boxShadow: "0 0 4px #ef4444aa" }} />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Unfinished task</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f97316", display: "inline-block", boxShadow: "0 0 4px #f97316aa" }} />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Awaiting verification</span>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function TeamPage() {
  // Toggle this to preview both states:
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const hasTeams = teams.length > 0;

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddTeam = () => {
    // In real app, this would make an API call
    // For demo, we just close the modal
  };

  return (
    <main
      style={{
        minHeight: "100vh",
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
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 16 }}>
            🔎
          </span>
        </div>
        <button style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.25)", backgroundColor: "rgba(255,255,255,0.1)", cursor: "pointer", color: "white", fontSize: 16 }}>
          ⇄
        </button>
        <button style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.25)", backgroundColor: "rgba(255,255,255,0.1)", cursor: "pointer", color: "white", fontSize: 16 }}>
          ☰
        </button>
      </div>

      {/* Body */}
      {!hasTeams ? (
        <EmptyState onClick={() => setShowModal(true)} />
      ) : (
        <>
          <Legend />
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
        </>
      )}

      {/* Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} onCreateTeam={handleAddTeam} />
      )}
    </main>
  );
}