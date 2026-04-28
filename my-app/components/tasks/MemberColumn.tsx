import { TeamMember } from "@/types/team";
import { TaskItem } from "./TaskItem";

export const MemberColumn = ({
  member,
  teamId,
  isLeader,
}: {
  member: TeamMember;
  teamId: string;
  isLeader: boolean;
}) => (
  <div
    style={{
      backgroundColor: "white",
      borderRadius: 14,
      padding: "14px 14px 8px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      display: "flex",
      flexDirection: "column",
      maxHeight: "calc(100vh - 220px)",
      overflow: "hidden",
    }}
  >
    {/* Header */}
    <div
      style={{
        fontWeight: 700,
        fontSize: 14,
        color: "#111827",
        marginBottom: 12,
        paddingBottom: 8,
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      {member.name}
    </div>

    {/* Scrollable tasks */}
    <div
      style={{ overflowY: "auto", flex: 1 }}
      className="[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
    >
      {member.tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          teamId={teamId}
          memberId={member.id}
          isLeader={isLeader}
        />
      ))}
    </div>

    {/* Upload row */}
    <div
      style={{
        borderTop: "1px solid #f3f4f6",
        paddingTop: 8,
        marginTop: 4,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#6b7280",
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 12,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
);