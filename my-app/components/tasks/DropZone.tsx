import { useRef, useState } from "react";

export const DropZone = ({ file, onFile }: { file: File | null; onFile: (f: File) => void }) => {
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