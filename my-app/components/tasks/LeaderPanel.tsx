export const LeaderPanel = ({
  comment, setComment, onVerify, onReject, status,
}: {
  comment: string;
  setComment: (v: string) => void;
  onVerify: () => void;
  onReject: () => void;
  status: "idle" | "verified" | "pending";
}) => (
  <div className="flex flex-col gap-3 w-[200px] shrink-0">
    <textarea
      placeholder="Comment"
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      className="w-full h-[120px] rounded-[10px] border-[1.5px] border-gray-200 px-3 py-2.5 text-[13px] text-gray-700 resize-none font-inherit outline-none bg-white box-border"
    />
    <button
      onClick={onVerify}
      className="py-2.5 rounded-[10px] border-none font-semibold text-sm cursor-pointer transition-all duration-200 shadow-[0_1px_4px_rgba(0,0,0,0.1)]"
      style={{
        backgroundColor: status === "verified" ? "#16a34a" : "rgba(255,255,255,0.85)",
        color: status === "verified" ? "white" : "#111827",
      }}
    >
      {status === "verified" ? "✓ Verified" : "Verify"}
    </button>
    <button
      onClick={onReject}
      className="py-2.5 rounded-[10px] border-none font-semibold text-[13px] cursor-pointer transition-all duration-200"
      style={{
        backgroundColor: status === "pending" ? "#dc2626" : "rgba(255,255,255,0.5)",
        color: status === "pending" ? "white" : "#6b7280",
      }}
    >
      {status === "pending" ? "✗ Rejected" : "Reject"}
    </button>
  </div>
);