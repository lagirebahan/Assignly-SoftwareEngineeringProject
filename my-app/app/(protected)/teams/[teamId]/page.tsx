"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Legend } from "@/components/tasks/Legend";
import { MemberColumn } from "@/components/tasks/MemberColumn";
import { Team } from "@/types/team";
import { Task } from "@/types/task";

export default function GroupPage() {
  const [currentUserId, setCurrentUserId] = useState("");
  const [teamData, setTeamData] = useState<Team | null>(null);
  const [isLeader, setIsLeader] = useState(false);
  const [groupName, setGroupName] = useState("Unknown Group");
  const [editingName, setEditingName] = useState(false);

  const [unassignedTasks, setUnassignedTasks] = useState<Task[]>([]);
  const [pendingSuccessorId, setPendingSuccessorId] = useState<string | null>(null);

  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [leaveWarningMsg, setLeaveWarningMsg] = useState("");

  const [showNominateModal, setShowNominateModal] = useState(false);
  const [selectedSuccessor, setSelectedSuccessor] = useState("");

  const [showPoolModal, setShowPoolModal] = useState(false);

  const [showClaimConfirm, setShowClaimConfirm] = useState(false);
  const [taskToClaim, setTaskToClaim] = useState<Task | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const params = useParams();
  const teamId = (params?.teamId as string) ?? "group1";

  const members = teamData?.members ?? [];

  const fetchTeamData = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const parsed = JSON.parse(storedUser);

    fetch(`/api/teams/${teamId}`)
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("user");
          router.replace("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data || !data.members) {
          router.replace("/teams");
          return;
        }
        const isMember = data.members.some((m: any) => m.userId === parsed.id);
        if (!isMember) {
          router.replace("/teams");
          return;
        }
        setTeamData(data);
        setIsLeader(data.leaderId === parsed.id);
        setGroupName(data.name);
        setUnassignedTasks(data.unassignedTasks ?? []);
        setPendingSuccessorId(data.pendingSuccessorId ?? null);

        const cacheKey = `group_${teamId}`;
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.replace("/login");
      return;
    }
    const parsed = JSON.parse(storedUser);
    setCurrentUserId(parsed.id);

    const cacheKey = `group_${teamId}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      const data = JSON.parse(cached);
      if (data.members) {
        const isMember = data.members.some((m: any) => m.userId === parsed.id);
        if (isMember) {
          setTeamData(data);
          setIsLeader(data.leaderId === parsed.id);
          setGroupName(data.name);
          setUnassignedTasks(data.unassignedTasks ?? []);
          setPendingSuccessorId(data.pendingSuccessorId ?? null);
        }
      }
    }

    // Always re-fetch fresh data (stale-while-revalidate pattern)
    fetchTeamData();
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

  const handleSuccessionResponse = async (action: "accept" | "decline") => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/teams/${teamId}/successor`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        sessionStorage.removeItem(`group_${teamId}`);
        fetchTeamData();
      } else {
        const d = await res.json();
        alert(d.message || "Failed to process leadership succession.");
      }
    } catch {
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeaveTeamClick = () => {
    if (isLeader) {
      if (members.length === 1) {
        setLeaveWarningMsg("You are the only member of this team. Leaving will permanently delete the team and all its tasks. Do you want to proceed?");
        setShowLeaveConfirm(true);
      } else {
        setShowNominateModal(true);
      }
    } else {
      setLeaveWarningMsg("Are you sure you want to leave this team? Any tasks currently assigned to you will be unassigned and returned to the team's available tasks pool.");
      setShowLeaveConfirm(true);
    }
  };

  const handleConfirmLeave = async () => {
    setIsSubmitting(true);
    try {
      if (isLeader && members.length === 1) {
        const res = await fetch(`/api/teams/${teamId}`, { method: "DELETE" });
        if (res.ok) {
          sessionStorage.removeItem(`group_${teamId}`);
          router.replace("/teams");
        } else {
          alert("Failed to delete team.");
        }
      } else {
        const res = await fetch(`/api/teams/${teamId}/leave`, {
          method: "POST",
        });
        if (res.ok) {
          sessionStorage.removeItem(`group_${teamId}`);
          router.replace("/teams");
        } else {
          const d = await res.json();
          alert(d.message || "Failed to leave team.");
        }
      }
    } catch {
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
      setShowLeaveConfirm(false);
    }
  };

  const handleNominateSuccessor = async () => {
    if (!selectedSuccessor) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/teams/${teamId}/successor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ successorUserId: selectedSuccessor }),
      });
      if (res.ok) {
        sessionStorage.removeItem(`group_${teamId}`);
        setShowNominateModal(false);
        fetchTeamData();
      } else {
        const d = await res.json();
        alert(d.message || "Failed to nominate successor.");
      }
    } catch {
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimTask = (task: Task) => {
    const isLarge = task.isLarge ||
      task.title.toLowerCase().includes("code") ||
      task.title.toLowerCase().includes("figma") ||
      (task.description && task.description.length > 100);

    if (isLarge) {
      setTaskToClaim(task);
      setShowClaimConfirm(true);
    } else {
      executeClaim(task.id);
    }
  };

  const executeClaim = async (taskId: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/claim`, {
        method: "POST",
      });
      if (res.ok) {
        sessionStorage.removeItem(`group_${teamId}`);
        setShowPoolModal(false);
        setShowClaimConfirm(false);
        fetchTeamData();
      } else {
        const d = await res.json();
        alert(d.message || "Failed to claim task.");
      }
    } catch {
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        background: "linear-gradient(to bottom, #2e2e2e, #b6a88b)",
        display: "flex",
        flexDirection: "column",
        padding: "36px 48px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
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

        <button
          onClick={handleLeaveTeamClick}
          style={{
            padding: "8px 16px",
            borderRadius: 10,
            border: "1.5px solid #fca5a5",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            color: "#fecaca",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Leave Team
        </button>
      </div>

      {/* Succession Request Banner for Successor */}
      {pendingSuccessorId === currentUserId && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "rgba(245, 158, 11, 0.18)",
            backdropFilter: "blur(8px)",
            borderRadius: 14,
            padding: "16px 20px",
            border: "1.5px solid rgba(245, 158, 11, 0.35)",
            marginBottom: 20,
            color: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>👑</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Leadership Succession Request</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                The current leader has nominated you to succeed them. Accepting will make you the leader and allow them to leave.
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => handleSuccessionResponse("decline")}
              disabled={isSubmitting}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.3)",
                backgroundColor: "transparent",
                color: "white",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Decline
            </button>
            <button
              onClick={() => handleSuccessionResponse("accept")}
              disabled={isSubmitting}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#f59e0b",
                color: "#111827",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Accept
            </button>
          </div>
        </div>
      )}

      {/* Succession Pending Banner for Current Leader */}
      {isLeader && pendingSuccessorId && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
            borderRadius: 14,
            padding: "16px 20px",
            border: "1.5px solid rgba(255, 255, 255, 0.15)",
            marginBottom: 20,
            color: "white",
          }}
        >
          <span style={{ fontSize: 20 }}>⏳</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Pending Leadership Succession</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
              You have nominated a successor. You will leave the team once they accept the invitation.
            </div>
          </div>
        </div>
      )}

      {/* Available Pool Banner */}
      {unassignedTasks.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "rgba(59, 130, 246, 0.18)",
            backdropFilter: "blur(8px)",
            borderRadius: 14,
            padding: "16px 20px",
            border: "1.5px solid rgba(59, 130, 246, 0.35)",
            marginBottom: 20,
            color: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>📦</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Available Tasks Pool</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                There are {unassignedTasks.length} unclaimed tasks. You can view and claim them to add to your list.
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowPoolModal(true)}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              backgroundColor: "#3b82f6",
              color: "white",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
            }}
          >
            View Tasks
          </button>
        </div>
      )}

      <Legend />

      {/* Columns */}
      <div
        style={{
          display: "flex",
          gap: 20,
          flex: 1,
          overflowX: "auto",
          overflowY: "hidden",
          paddingBottom: 16,
          alignItems: "stretch",
          minHeight: 0,
        }}
        className="[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20"
      >
        {members.map((member) => (
          <div key={member.id} style={{ minWidth: 280, width: 320, flexShrink: 0, alignSelf: "stretch" }}>
            <MemberColumn
              member={member}
              teamId={teamId}
              isLeader={isLeader}
              currentUserId={currentUserId}
            />
          </div>
        ))}
      </div>

      {/* Leave Warning Modal */}
      {showLeaveConfirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.55)" }}>
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: "28px 28px 24px", width: 380, boxShadow: "0 24px 60px rgba(0,0,0,0.3)", border: "1.5px solid #fecaca" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>Leave Team?</h3>
            </div>
            <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 20, lineHeight: 1.5 }}>
              {leaveWarningMsg}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowLeaveConfirm(false)}
                disabled={isSubmitting}
                style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1.5px solid #e5e7eb", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLeave}
                disabled={isSubmitting}
                style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", backgroundColor: "#ef4444", fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer" }}
              >
                {isSubmitting ? "Leaving..." : "Leave"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nominate Successor Modal (Leader only) */}
      {showNominateModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.55)" }}>
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: "28px 28px 24px", width: 400, boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>👑</span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>Nominate Successor</h3>
            </div>
            <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 16, lineHeight: 1.5 }}>
              As the leader, you must choose a successor to transfer leadership to. They must accept before you can leave the team.
            </p>

            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              SELECT NEW LEADER
            </label>
            <select
              value={selectedSuccessor}
              onChange={(e) => setSelectedSuccessor(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #d1d5db", fontSize: 14, color: "#111827", backgroundColor: "white", outline: "none", marginBottom: 20 }}
            >
              <option value="">Choose a member...</option>
              {members
                .filter((m) => m.userId !== currentUserId)
                .map((m) => (
                  <option key={m.id} value={m.userId}>
                    {m.name}
                  </option>
                ))}
            </select>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowNominateModal(false)}
                disabled={isSubmitting}
                style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1.5px solid #e5e7eb", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleNominateSuccessor}
                disabled={!selectedSuccessor || isSubmitting}
                style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", backgroundColor: "#111827", color: "white", fontSize: 13, fontWeight: 600, cursor: selectedSuccessor ? "pointer" : "not-allowed", opacity: selectedSuccessor ? 1 : 0.5 }}
              >
                {isSubmitting ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Available Pool Tasks Modal */}
      {showPoolModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.55)" }} onClick={() => setShowPoolModal(false)}>
          <div style={{ backgroundColor: "#f3f4f6", borderRadius: 16, width: 500, maxWidth: "90vw", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb", backgroundColor: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>📦</span>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>Unassigned Tasks Pool</h3>
              </div>
              <button onClick={() => setShowPoolModal(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#9ca3af" }}>×</button>
            </div>

            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              {unassignedTasks.length === 0 ? (
                <p style={{ textAlign: "center", color: "#6b7280", fontSize: 14 }}>No unassigned tasks remaining.</p>
              ) : (
                unassignedTasks.map((task) => (
                  <div key={task.id} style={{ backgroundColor: "white", borderRadius: 12, padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1, paddingRight: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{task.title}</span>
                        {task.isLarge && (
                          <span style={{ backgroundColor: "#fee2e2", color: "#ef4444", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>
                            LARGE
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: "#6b7280", margin: "4px 0 8px 0" }}>
                        {task.description || "No description provided."}
                      </p>
                      {task.deadline && (
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>
                          📅 Due {new Date(task.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleClaimTask(task)}
                      disabled={isSubmitting}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "none",
                        backgroundColor: "#111827",
                        color: "white",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Claim
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Claim Confirmation Pop-up for Large Tasks */}
      {showClaimConfirm && taskToClaim && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: "28px 28px 24px", width: 380, boxShadow: "0 24px 60px rgba(0,0,0,0.35)", border: "1.5px solid #3b82f6" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>📢</span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>Claim Large Task?</h3>
            </div>
            <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 20, lineHeight: 1.5 }}>
              Are you sure you want to claim this task? It will be added to your personal To-Do list.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowClaimConfirm(false)}
                disabled={isSubmitting}
                style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1.5px solid #e5e7eb", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={() => executeClaim(taskToClaim.id)}
                disabled={isSubmitting}
                style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", backgroundColor: "#3b82f6", fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer" }}
              >
                {isSubmitting ? "Claiming..." : "Confirm Claim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}