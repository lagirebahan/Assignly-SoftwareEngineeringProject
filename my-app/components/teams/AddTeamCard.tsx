export function AddTeamCard({ onClick }: { onClick: () => void }) {
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