export const LeaderPanel = ({
  comment, setComment, onVerify, onReject, status,
}: {
  comment: string;
  setComment: (v: string) => void;
  onVerify: () => void;
  onReject: () => void;
  status: "idle" | "verified" | "pending";
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
      backgroundColor: status === "pending" ? "#dc2626" : "rgba(255,255,255,0.5)",
      color: status === "pending" ? "white" : "#6b7280",
      fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
    }}>
      {status === "pending" ? "✗ Rejected" : "Reject"}
    </button>
  </div>
);