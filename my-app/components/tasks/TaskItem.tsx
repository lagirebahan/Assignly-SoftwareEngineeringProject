import { Task } from "@/types/task";
import { useRouter } from "next/navigation";
import { AttachmentBox } from "./AttachmentBox";
import { StatusBadge } from "./StatusBadge";

export const TaskItem = ({
  task,
  teamId,
  memberId,
  isLeader,
}: {
  task: Task;
  teamId: string;
  memberId: string;
  isLeader: boolean;
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() =>
        isLeader
          ? router.push(`/teams/${teamId}/${task.id}?member=${memberId}`)
          : undefined
      }
      style={{
        cursor: isLeader ? "pointer" : "default",
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* thumbs up icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" stroke="#6b7280" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
          {task.title}
        </span>
      </div>

      <AttachmentBox hasAttachment={task.hasAttachment} />
      <StatusBadge status={task.status} />
    </div>
  );
};