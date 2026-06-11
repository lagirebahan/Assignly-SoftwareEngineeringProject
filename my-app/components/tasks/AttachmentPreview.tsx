"use client";

const handleDownload = async (url: string) => {
  const res = await fetch(url);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = url.split("/").pop() || "attachment";
  a.click();
  URL.revokeObjectURL(blobUrl);
};

export const AttachmentPreview = ({ url, label = "Attachment" }: { url: string; label?: string }) => {
  const ext = url.split(".").pop()?.toLowerCase() ?? "";
  const fileName = url.split("/").pop() ?? "attachment";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  const isPdf = ext === "pdf";

  if (isImage) {
    return (
      <div style={{ borderRadius: 10, overflow: "hidden", backgroundColor: "#e5e7eb" }}>
        {label && (
          <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", padding: "8px 12px 4px" }}>{label}</div>
        )}
        <img
          src={url}
          alt="Attachment"
          style={{ width: "100%", maxHeight: 200, objectFit: "contain", display: "block" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "6px 10px" }}>
          <DownloadButton url={url} fileName={fileName} />
        </div>
      </div>
    );
  }

  if (isPdf) {
    return (
      <div style={{ borderRadius: 10, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.85)" }}>
        {label && (
          <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", padding: "8px 12px 4px" }}>{label}</div>
        )}
        <iframe
          src={url}
          style={{ width: "100%", height: 600, border: "none", display: "block" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "6px 10px", borderTop: "1px solid #e5e7eb" }}>
          <DownloadButton url={url} fileName={fileName} />
        </div>
      </div>
    );
  }

  // Generic file (zip, sql, docx, etc.)
  return (
    <div style={{ backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 10, padding: "10px 14px" }}>
      {label && (
        <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", marginBottom: 8 }}>{label}</div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2v6h6" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={{ flex: 1, fontSize: 13, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {fileName}
        </span>
        <DownloadButton url={url} fileName={fileName} />
      </div>
    </div>
  );
};

const DownloadButton = ({ url, fileName }: { url: string; fileName: string }) => (
  <button
    onClick={() => handleDownload(url)}
    style={{
      width: 32, height: 32, borderRadius: "50%",
      backgroundColor: "#e5e7eb", border: "none",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", flexShrink: 0,
    }}
  >
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v13M7 11l5 5 5-5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 20h14" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  </button>
);