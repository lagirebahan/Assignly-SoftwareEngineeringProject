export const AttachmentBox = ({ hasAttachment }: { hasAttachment: boolean }) => (
  <div
    style={{
      width: "100%",
      height: 72,
      borderRadius: 8,
      border: "1.5px dashed #d1d5db",
      backgroundColor: "#f9fafb",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      color: "#6b7280",
      fontSize: 11,
      cursor: "pointer",
      marginTop: 6,
    }}
  >
    {hasAttachment ? (
      <>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="#9ca3af" strokeWidth="1.5"/>
          <path d="M3 16l5-5 4 4 3-3 6 6" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="#9ca3af"/>
        </svg>
      </>
    ) : (
      <>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Upload image</span>
      </>
    )}
  </div>
);