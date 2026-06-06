export const AttachmentBox = ({ hasAttachment, attachmentUrl }: { hasAttachment: boolean; attachmentUrl?: string }) => {
  const isImage = attachmentUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(attachmentUrl);

  return (
    <div className="w-full h-[72px] rounded-lg border-[1.5px] border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-1 text-gray-500 text-[11px] cursor-pointer mt-1.5 overflow-hidden">
      {hasAttachment && isImage ? (
        <img
          src={attachmentUrl}
          alt="Attachment"
          className="w-full h-full object-cover rounded-md"
        />
      ) : hasAttachment ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="#9ca3af" strokeWidth="1.5"/>
          <path d="M3 16l5-5 4 4 3-3 6 6" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="#9ca3af"/>
        </svg>
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