"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MOCK_SESSION } from "@/data/mockSession";

type ViewMode = "leader" | "member";

const LeaderPanel = ({
  comment, setComment, onVerify, onReject, status,
}: {
  comment: string;
  setComment: (v: string) => void;
  onVerify: () => void;
  onReject: () => void;
  status: "idle" | "verified" | "rejected";
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 200, flexShrink: 0 }}>
    <textarea
      placeholder="Comment"
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      style={{
        width: "100%", height: 120, borderRadius: 10, border: "1.5px solid #e5e7eb",
        padding: "10px 12px", fontSize: 13, color: "#374151", resize: "none",
        fontFamily: "inherit", outline: "none", backgroundColor: "white", boxSizing: "border-box",
      }}
    />
    <button onClick={onVerify} style={{
      padding: "10px 0", borderRadius: 10, border: "none",
      backgroundColor: status === "verified" ? "#16a34a" : "rgba(255,255,255,0.85)",
      color: status === "verified" ? "white" : "#111827",
      fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    }}>
      {status === "verified" ? "✓ Verified" : "Verify"}
    </button>
    <button onClick={onReject} style={{
      padding: "10px 0", borderRadius: 10, border: "none",
      backgroundColor: status === "rejected" ? "#dc2626" : "rgba(255,255,255,0.5)",
      color: status === "rejected" ? "white" : "#6b7280",
      fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
    }}>
      {status === "rejected" ? "✗ Rejected" : "Reject"}
    </button>
  </div>
);

const DropZone = ({ file, onFile }: { file: File | null; onFile: (f: File) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      style={{
        width: "100%", height: 120, borderRadius: 12,
        border: `2px dashed ${dragging ? "#6b7280" : "#d1d5db"}`,
        backgroundColor: dragging ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 8, cursor: "pointer", transition: "all 0.15s", color: "rgba(255,255,255,0.7)", fontSize: 13,
      }}
    >
      <input ref={inputRef} type="file" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      {file ? (
        <>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ color: "#4ade80", fontWeight: 600 }}>{file.name}</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Click to replace</span>
        </>
      ) : (
        <>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Drop file or click to upload</span>
        </>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TaskDetailPage({
  params,
}: {
  params: { teamId: string; taskId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const teamId = params?.teamId ?? "team1";
  const taskId = params?.taskId ?? "t1";
  const memberId = searchParams.get("member") ?? "m1"; // whose task we're viewing

  // ── Derive view mode from role + ownership ──────────────────────────────────
  // Leader viewing someone else's task → leader view (can verify/edit)
  // Leader viewing their own task      → member view (submit own work)
  // Member viewing any task            → member view
  const isLeader = MOCK_SESSION.role === "leader";
  const isOwnTask = MOCK_SESSION.id === memberId;
  const showLeaderView = isLeader && !isOwnTask; // ✅ key logic

  // Shared state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const existingAttachmentName = "Attachment.pdf";

  // Leader state
  const [comment, setComment] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "verified" | "rejected">("idle");

  // Member state
  const [progressFile, setProgressFile] = useState<File | null>(null);
  const [uploadDone, setUploadDone] = useState(false);

  const handleVerify = () => setVerifyStatus("verified");
  const handleReject = () => setVerifyStatus("rejected");
  const handleMemberUpload = () => { if (progressFile) setUploadDone(true); };
  const handleLeaderSave = () => router.back();

  // ── Label for header ────────────────────────────────────────────────────────
  const pageTitle = isOwnTask
    ? `My Task – ${taskId.replace("t", "Task ")}`
    : `${memberId.replace("m", "Member ")} – ${taskId.replace("t", "Task ")}`;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #2e2e2e, #b6a88b)",
      display: "flex", flexDirection: "column",
      padding: "36px 48px", boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => router.back()}
            style={{ background: "none", border: "none", cursor: "pointer", color: "white", fontSize: 22, lineHeight: 1, padding: 0 }}
          >
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "white" }}>
            {pageTitle}
          </h1>
        </div>

        {/* Role badge — read-only indicator, no toggle */}
        <div style={{
          padding: "5px 14px", borderRadius: 999,
          backgroundColor: "rgba(0,0,0,0.25)",
          color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600,
          textTransform: "capitalize",
        }}>
          {isLeader && !isOwnTask ? "👑 Verifying as Leader" : "📝 Submitting as Member"}
        </div>
      </div>

      {/* ── LEADER VIEW (leader viewing someone else's task) ── */}
      {showLeaderView && (
        <div style={{
          display: "flex", gap: 20,
          backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
          borderRadius: 16, padding: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="text" placeholder="Title" value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                padding: "10px 14px", borderRadius: 10, border: "none",
                backgroundColor: "rgba(255,255,255,0.85)",
                fontSize: 15, fontWeight: 600, color: "#111827", outline: "none",
              }}
            />
            <textarea
              placeholder="Description" value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                flex: 1, minHeight: 120, padding: "10px 14px", borderRadius: 10, border: "none",
                backgroundColor: "rgba(255,255,255,0.85)", fontSize: 13,
                color: "#374151", resize: "none", fontFamily: "inherit", outline: "none",
              }}
            />
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 10, padding: "10px 14px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#374151", fontSize: 13 }}>
                📎 {attachment ? attachment.name : existingAttachmentName}
              </div>
              <button onClick={() => document.getElementById("leader-file-input")?.click()}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
                ↑
              </button>
              <input id="leader-file-input" type="file" style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && setAttachment(e.target.files[0])} />
            </div>
            <button onClick={handleLeaderSave} style={{
              padding: "10px 0", borderRadius: 10, border: "none",
              backgroundColor: "rgba(255,255,255,0.9)",
              fontWeight: 700, fontSize: 14, cursor: "pointer", color: "#111827",
            }}>
              Save Task
            </button>
          </div>

          <LeaderPanel
            comment={comment} setComment={setComment}
            onVerify={handleVerify} onReject={handleReject}
            status={verifyStatus}
          />
        </div>
      )}

      {/* ── MEMBER VIEW (everyone else, including leader viewing own task) ── */}
      {!showLeaderView && (
        <div style={{
          backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
          borderRadius: 16, padding: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
          display: "flex", flexDirection: "column", gap: 16,
        }}>
          <div style={{ backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 6 }}>
              {taskId.replace("t", "Task ")}
              {isOwnTask && isLeader && (
                <span style={{ marginLeft: 8, fontSize: 11, color: "#6b7280", fontWeight: 400 }}>
                  (you are the leader — submit your own work here)
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              Complete and upload your progress below. The leader will review your submission.
            </div>
          </div>

          {/* Download task file */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 10, padding: "10px 14px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#374151", fontSize: 13 }}>
              📎 {existingAttachmentName}
            </div>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 13 }}>
              ↓ Download
            </button>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 8 }}>
              Upload your progress
            </div>
            <DropZone file={progressFile} onFile={setProgressFile} />
          </div>

          <button
            onClick={handleMemberUpload}
            disabled={!progressFile || uploadDone}
            style={{
              padding: "12px 0", borderRadius: 10, border: "none",
              backgroundColor: uploadDone ? "#16a34a" : progressFile ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
              color: uploadDone ? "white" : progressFile ? "#111827" : "rgba(255,255,255,0.4)",
              fontWeight: 700, fontSize: 14,
              cursor: progressFile && !uploadDone ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            {uploadDone ? "✓ Submitted!" : "Submit Progress"}
          </button>
        </div>
      )}
    </div>
  );
}