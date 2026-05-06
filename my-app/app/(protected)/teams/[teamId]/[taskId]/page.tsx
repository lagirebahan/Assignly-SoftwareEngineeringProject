"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LeaderPanel } from "@/components/tasks/LeaderPanel";
import { DropZone } from "@/components/tasks/DropZone";

export default function TaskDetailPage() {
  const [currentUserId, setCurrentUserId] = useState("");
  const [isLeader, setIsLeader] = useState(false);
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [description, setDescription] = useState("");
  const [progressFile, setProgressFile] = useState<File | null>(null);
  const [uploadDone, setUploadDone] = useState(false);
  const [comment, setComment] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "verified" | "pending">("idle");
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [viewingAttachment, setViewingAttachment] = useState(false);

  const router = useRouter();
  const params = useParams();
  const teamId = params?.teamId as string;
  const taskId = params?.taskId as string;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) { router.replace("/login"); return; }
    const parsed = JSON.parse(storedUser);
    setCurrentUserId(parsed.id);

    const cacheKey = `task_${taskId}_team_${teamId}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      const { taskData, teamData } = JSON.parse(cached);
      const leader = teamData.leaderId === parsed.id;
      const ownTask = taskData.memberId === parsed.id;
      const allowed = ownTask || (leader && taskData.status !== "verified");

      if (!allowed) { setAccessDenied(true); setLoading(false); return; }

      setTask(taskData);
      setIsLeader(leader);
      setDescription(taskData.description ?? "");
      setComment(taskData.comment ?? "");
      if (taskData.status === "verified") setVerifyStatus("verified");
      if (taskData.status === "pending") setVerifyStatus("pending");
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`/api/tasks/${taskId}`).then(r => r.json()),
      fetch(`/api/teams/${teamId}`).then(r => r.json()),
    ]).then(([taskData, teamData]) => {
      const leader = teamData.leaderId === parsed.id;
      const ownTask = taskData.memberId === parsed.id;
      const allowed = ownTask || (leader && taskData.status !== "verified");

      if (!allowed) { setAccessDenied(true); setLoading(false); return; }

      sessionStorage.setItem(cacheKey, JSON.stringify({ taskData, teamData }));

      setTask(taskData);
      setIsLeader(leader);
      setDescription(taskData.description ?? "");
      setComment(taskData.comment ?? "");
      if (taskData.status === "verified") setVerifyStatus("verified");
      if (taskData.status === "pending") setVerifyStatus("pending");
      setLoading(false);
    });
  }, [taskId, teamId, router]);

  const isOwnTask = task?.memberId === currentUserId;
  const showLeaderView = isLeader && !isOwnTask;
  const isVerified = task?.status === "verified";

  const handleSubmit = async () => {
    if (!progressFile && !description) return;

    let attachmentUrl = null;

    if (progressFile) {
      const ext = progressFile.name.split(".").pop()?.toLowerCase();
      const path = `${taskId}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("attachments")
        .upload(path, progressFile, { upsert: true });

      if (error) { console.error(error); return; }

      const { data } = supabase.storage.from("attachments").getPublicUrl(path);
      attachmentUrl = data.publicUrl;
    }

    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "submit",
        description,
        attachmentUrl,
      }),
    });
    
    if (res.ok){
      sessionStorage.removeItem(`task_${taskId}_team_${teamId}`);
      setUploadDone(true);
    } 
  };

  const handleVerify = async () => {
    if (verifyStatus === "verified") return;
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify", comment }),
    });
    if (res.ok) {
      sessionStorage.removeItem(`task_${taskId}_team_${teamId}`);
      setVerifyStatus("verified");
    }
  };

  const handleReject = async () => {
    if (verifyStatus === "verified") {
      setShowRejectConfirm(true);
      return;
    }
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", comment }),
    });
    if (res.ok) {
      sessionStorage.removeItem(`task_${taskId}_team_${teamId}`);
      setVerifyStatus("pending");
      setTask((prev: any) => ({ ...prev, status: "pending" }));
    }
  };

  const handleConfirmReject = async () => {
    setShowRejectConfirm(false);
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", comment }),
    });
    if (res.ok) {
      sessionStorage.removeItem(`task_${taskId}_team_${teamId}`);
      setVerifyStatus("pending");
      setTask((prev: any) => ({ ...prev, status: "pending" }));
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #2e2e2e, #b6a88b)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "white", fontSize: 16 }}>Loading...</span>
    </div>
  );

  if (accessDenied) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #2e2e2e, #b6a88b)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <span style={{ fontSize: 40 }}>🚫</span>
      <p style={{ color: "white", fontSize: 16, fontWeight: 600, margin: 0 }}>Access Denied</p>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: 0 }}>
        You don't have permission to view this task.
      </p>
      <button
        onClick={() => router.back()}
        style={{ marginTop: 8, padding: "10px 24px", borderRadius: 10, border: "none", backgroundColor: "rgba(255,255,255,0.2)", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
      >
        Go Back
      </button>
    </div>
  );

  const pageTitle = showLeaderView
    ? `${task.teamName} – ${task.memberName} – ${task.title}`
    : `${task.teamName} – ${task.title}`;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #2e2e2e, #b6a88b)",
      display: "flex", flexDirection: "column",
      padding: "36px 48px", boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "white", fontSize: 22, lineHeight: 1, padding: 0 }}>←</button>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "white" }}>{pageTitle}</h1>
        </div>
        <div style={{
          padding: "5px 14px", borderRadius: 999,
          backgroundColor: "rgba(0,0,0,0.25)",
          color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600,
        }}>
          {showLeaderView ? "👑 Verifying as Leader" : "📝 Submitting as Member"}
        </div>
      </div>

      {showLeaderView && (
        <div style={{
          display: "flex", gap: 20,
          backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
          borderRadius: 16, padding: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: "10px 14px", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.85)", fontSize: 15, fontWeight: 600, color: "#111827" }}>
              {task.title}
            </div>
            <div style={{
              flex: 1, minHeight: 120, padding: "10px 14px", borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.85)", fontSize: 13,
              color: "#374151", fontFamily: "inherit", overflowY: "auto",
            }}>
              {task.description || <span style={{ color: "#9ca3af" }}>No description submitted yet.</span>}
            </div>
            {task.attachmentUrl && (() => {
              const ext = task.attachmentUrl.split(".").pop()?.toLowerCase();
              const viewable = ["jpg","jpeg","png","gif","webp","pdf","doc","docx","ppt","pptx","xls","xlsx"];
              const isViewable = viewable.includes(ext);
              return (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 10, padding: "10px 14px",
                }}>
                  <span style={{ fontSize: 13, color: "#374151" }}>
                    📎 {task.attachmentUrl.split("/").pop()}
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    {isViewable && (
                      <button
                        onClick={() => setViewingAttachment(true)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", fontSize: 13 }}
                      >
                        👁 View
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        const res = await fetch(task.attachmentUrl);
                        const blob = await res.blob();
                        const blobUrl = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = blobUrl;
                        a.download = task.attachmentUrl.split("/").pop() || "attachment";
                        a.click();
                        URL.revokeObjectURL(blobUrl);
                      }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 13 }}
                    >
                      ↓ Download
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

          <LeaderPanel
            comment={comment} setComment={setComment}
            onVerify={handleVerify} onReject={handleReject}
            status={verifyStatus}
          />
        </div>
      )}

      {!showLeaderView && (
        <div className="[&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-transparent"
          style={{
          backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
          borderRadius: 16, padding: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
          display: "flex", flexDirection: "column", gap: 16,
          overflowY: "auto",
          maxHeight: "70vh",
        }}>
          <div style={{ backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 6 }}>
              {task.title}
              {isOwnTask && isLeader && (
                <span style={{ marginLeft: 8, fontSize: 11, color: "#6b7280", fontWeight: 400 }}>
                  (you are the leader — submit your own work here)
                </span>
              )}
            </div>
            {task.deadline && (
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                📅 Due {new Date(task.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            )}
          </div>

          {task.comment && task.status === "pending" && (
            <div style={{ backgroundColor: "rgba(239,68,68,0.15)", borderRadius: 10, padding: "10px 14px", border: "1px solid rgba(239,68,68,0.3)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fca5a5", marginBottom: 4 }}>Leader's feedback:</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{task.comment}</div>
            </div>
          )}

          {isVerified ? (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "20px", borderRadius: 12, backgroundColor: "rgba(22,163,74,0.2)",
              border: "1px solid rgba(22,163,74,0.4)",
            }}>
              <span style={{ color: "#4ade80", fontWeight: 700, fontSize: 15 }}>✓ This task has been verified!</span>
            </div>
          ) : (
            <>
              <textarea
                placeholder="Describe your work..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  padding: "10px 14px", borderRadius: 10, border: "none",
                  backgroundColor: "rgba(255,255,255,0.85)", fontSize: 13,
                  color: "#374151", resize: "none", fontFamily: "inherit",
                  outline: "none", minHeight: 100,
                }}
              />

              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 8 }}>
                  Upload your progress
                </div>
                <DropZone file={progressFile} onFile={setProgressFile} />
              </div>

              <button
                onClick={handleSubmit}
                disabled={(!progressFile && !description) || uploadDone}
                style={{
                  padding: "12px 0", borderRadius: 10, border: "none",
                  backgroundColor: uploadDone ? "#16a34a" : (progressFile || description) ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
                  color: uploadDone ? "white" : (progressFile || description) ? "#111827" : "rgba(255,255,255,0.4)",
                  fontWeight: 700, fontSize: 14,
                  cursor: (!progressFile && !description) || uploadDone ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                {uploadDone ? "✓ Submitted!" : "Submit Progress"}
              </button>
            </>
          )}
        </div>
      )}

      {showRejectConfirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setShowRejectConfirm(false)}>
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: "28px 28px 24px", width: 360, boxShadow: "0 24px 60px rgba(0,0,0,0.25)", border: "1.5px solid #fecaca" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>Change verification?</h3>
            </div>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
              This task is already verified. Are you sure you want to reject it?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowRejectConfirm(false)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1.5px solid #e5e7eb", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleConfirmReject} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", backgroundColor: "#ef4444", fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer" }}>
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
      {viewingAttachment && task.attachmentUrl && (() => {
        const url = task.attachmentUrl;
        const ext = url.split(".").pop()?.toLowerCase();
        const isImage = ["jpg","jpeg","png","gif","webp"].includes(ext);
        const isPdf = ext === "pdf";
        const isOffice = ["doc","docx","ppt","pptx","xls","xlsx"].includes(ext);
        const viewerUrl = isOffice ? `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true` : url;

        return (
          <div
            style={{ position: "fixed", inset: 0, zIndex: 300, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={() => setViewingAttachment(false)}
          >
            <div
              style={{ backgroundColor: "white", borderRadius: 16, overflow: "hidden", width: "90vw", maxWidth: 900, maxHeight: "85vh", display: "flex", flexDirection: "column" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{url.split("/").pop()}</span>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={async () => {
                      const res = await fetch(task.attachmentUrl);
                      const blob = await res.blob();
                      const blobUrl = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = blobUrl;
                      a.download = task.attachmentUrl.split("/").pop() || "attachment";
                      a.click();
                      URL.revokeObjectURL(blobUrl);
                    }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 13 }}
                  >
                    ↓ Download
                  </button>
                  <button onClick={() => setViewingAttachment(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6b7280" }}>×</button>
                </div>
              </div>
              <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                {isImage && <img src={url} style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain" }} />}
                {(isPdf || isOffice) && <iframe src={viewerUrl} style={{ width: "100%", height: "70vh", border: "none" }} />}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}