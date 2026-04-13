export function Legend() {
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