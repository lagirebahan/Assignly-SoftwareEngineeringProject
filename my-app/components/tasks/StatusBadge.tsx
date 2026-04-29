import { TaskStatus } from "@/types/task";

const STATUS_CONFIG: Record<TaskStatus, { color: string; label: string }> = {
  pending:    { color: "#ef4444", label: "Status: Pending" },
  unverified: { color: "#f97316", label: "Status: Unverified" },
  verified:   { color: "#22c55e", label: "Status: Verified" },
};

export const StatusBadge = ({ status }: { status: TaskStatus }) => {
  const { color, label } = STATUS_CONFIG[status];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color, marginTop: 4 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
      {label}
    </div>
  );
};