export function ProgressBar({ value }: { value: number }) {
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