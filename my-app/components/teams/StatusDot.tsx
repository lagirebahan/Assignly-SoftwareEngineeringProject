import { TaskStatus } from "@/types/team";

export function StatusDot({ status }: { status: TaskStatus }) {
  if (status === "done") return null;
  const color = status === "unfinished" ? "#ef4444" : "#f97316";
  const title = status === "unfinished" ? "Unfinished task" : "Awaiting leader verification";
  return (
    <span
      title={title}
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: color,
        marginLeft: 6,
        flexShrink: 0,
        boxShadow: `0 0 2px ${color}99`,
      }}
    />
  );
}