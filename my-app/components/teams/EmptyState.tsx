export function EmptyState({ onClick }: { onClick: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button
        onClick={onClick}
        style={{
          width: "100%",
          maxWidth: 900,
          padding: "120px 40px",
          borderRadius: 32,
          border: "2px dotted rgba(0,0,0,0.25)",
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
        {/* big plus icon pake svg */}
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