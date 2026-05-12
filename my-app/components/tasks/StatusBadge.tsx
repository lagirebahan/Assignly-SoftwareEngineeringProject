import { TaskStatus } from "@/types/task";

const STATUS_CONFIG: Record<TaskStatus, { color: string; label: string }> = {
  pending:    { color: "#ef4444", label: "Status: Pending" },
  unverified: { color: "#f97316", label: "Status: Unverified" },
  verified:   { color: "#22c55e", label: "Status: Verified" },
};

export const StatusBadge = ({ status }: { status: TaskStatus }) => {
  const { color, label } = STATUS_CONFIG[status];
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-semibold mt-1" style={{ color }}>
      <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ backgroundColor: color }} />
      {label}
    </div>
  );
};