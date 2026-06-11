export const AttachmentBox = ({ hasAttachment, attachmentUrl }: { hasAttachment: boolean; attachmentUrl?: string }) => {
  const isImage = attachmentUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(attachmentUrl);
  const fileName = attachmentUrl ? attachmentUrl.split("/").pop() ?? "Attachment" : "Attachment";

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!attachmentUrl) return;
    const res = await fetch(attachmentUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-[72px] rounded-lg border-[1.5px] border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-1 text-gray-500 text-[11px] cursor-pointer mt-1.5 overflow-hidden">
      {hasAttachment && isImage ? (
        <img
          src={attachmentUrl}
          alt="Attachment"
          className="w-full h-auto max-h-[160px] object-contain rounded-md block"
        />
      ) : hasAttachment ? (
        <div className="w-full flex items-center gap-3 px-3 py-3">
          <div className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2v6h6" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <span className="flex-1 text-xs font-medium text-gray-700 truncate">{fileName}</span>

        <button
          onClick={handleDownload}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 hover:bg-gray-300 transition-colors"
        >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v13M7 11l5 5 5-5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 20h14" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
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
};