export const Legend = () => (
  <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
    {[
      { color: "#16a34a", label: "Verified" },
      { color: "#dc2626", label: "Unverified" },
    ].map(({ color, label }) => (
      <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: color, display: "inline-block" }} />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{label}</span>
      </div>
    ))}
  </div>
);