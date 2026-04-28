import { TaskStatus } from "@/types/task";

export const StatusBadge = ({ status }: { status: TaskStatus }) => {
  if (status === "pending") return null;
  const isVerified = status === "verified";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: 600,
        color: isVerified ? "#16a34a" : "#dc2626",
        marginTop: 4,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: isVerified ? "#16a34a" : "#dc2626",
          flexShrink: 0,
        }}
      />
      {isVerified ? "Status: Verified" : "Status: Unverified"}
    </div>
  );
};