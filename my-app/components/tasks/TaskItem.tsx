import { Task } from "@/types/task";
import { useRouter } from "next/navigation";
import { AttachmentBox } from "./AttachmentBox";
import { StatusBadge } from "./StatusBadge";

export const TaskItem = ({
  task,
  teamId,
  memberId,
  isLeader,
  currentUserId,
}: {
  task: Task;
  teamId: string;
  memberId: string;
  isLeader: boolean;
  currentUserId: string;
}) => {
  const router = useRouter();

  const isOwnTask = memberId === currentUserId;

  // Leaders can open any task (including verified, to re-review/reject)
  // Members can open their own tasks (read-only when verified)
  const canOpen = isLeader || isOwnTask;

  const handleClick = () => {
    if (!canOpen) return;
    router.push(`/teams/${teamId}/${task.id}?member=${memberId}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`mb-3 ${canOpen ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-50"}`}
      title={
        !canOpen
          ? "Not your task"
          : undefined
      }
    >
      <div className="flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" stroke="#6b7280" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="text-[13px] font-medium text-gray-900">
          {task.title}
        </span>
      </div>

      <AttachmentBox hasAttachment={task.hasAttachment} attachmentUrl={task.attachmentUrl} />
      <StatusBadge status={task.status} />
    </div>
  );
};