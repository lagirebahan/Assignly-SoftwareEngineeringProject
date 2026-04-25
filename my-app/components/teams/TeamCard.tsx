
import Link from "next/link";
import { StatusDot } from "./StatusDot";
import { ProgressBar } from "./ProgressBar";
import { Team } from "@/types/team";
import { getTeamProgress } from "@/utils/team";

export function TeamCard({ team }: { team: Team }) {
  const hasAlert = team.members.some((m) => m.taskStatus !== "done");
  const progress = getTeamProgress(team.members)
  return (
    <Link href={`/teams/${team.id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          padding: "20px 22px",
          cursor: "pointer",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          height: "100%",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.14)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
        }}
      >
        {/* Alert indicator on card level */}
        {hasAlert && (
          <span
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: team.members.some((m) => m.taskStatus === "unfinished")
                ? "#ef4444"
                : "#f97316",
              boxShadow: team.members.some((m) => m.taskStatus === "unfinished")
                ? "0 0 6px #ef4444aa"
                : "0 0 6px #f97316aa",
            }}
          />
        )}

        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 10 }}>
          {team.name}
        </h2>

        <ProgressBar value={progress} />

        <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Members:
        </p>
        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {team.members.map((member, i) => (
            <li
              key={i}
              style={{
                fontSize: 12,
                color: "#374151",
                marginBottom: 3,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#9ca3af", marginRight: 5 }}>{i + 1}.</span>
              {member.name}
              <StatusDot status={member.taskStatus} />
            </li>
          ))}
        </ol>
      </div>
    </Link>
  );
}