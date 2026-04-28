"use client";

import Link from "next/link";
import { useState } from "react";
import { StatusDot } from "./StatusDot";
import { ProgressBar } from "./ProgressBar";
import { Team } from "@/types/team";
import { getTeamProgress } from "@/utils/team";
import { getMemberStatus } from "@/utils/GetMemberStatus";
import { button } from "@heroui/theme";
import { span } from "framer-motion/client";

export function TeamCard({ team, onDelete }: { team: Team; onDelete?:(teamId:string)=>void }) {
  const hasAlert = team.members.some((m) => getMemberStatus(m) !== "verified");
  const progress = getTeamProgress(team.members)
  const isCompleted = progress === 100

  const [hovered, setHovered] = useState(false);
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(window.confirm(`Delete "${team.name}"? This can't be undone.`)){
      onDelete?.(team.id);
    }
  }

  return (
    <Link href={`/teams/${team.id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          padding: "20px 22px",
          cursor: "pointer",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.14)" : "0 2px 12px rgba(0,0,0,0.08)",
          transform: hovered?"translateY(-3px)" :  "translateY(0)",
          height: "100%",
          position: "relative",
        }}
        onMouseEnter={()=> setHovered(true)}
        onMouseLeave={()=> setHovered(false)}
      >
        {isCompleted && hovered ? (
          <button
          onClick={handleDeleteClick}
          title="Delete this team"
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#ef4444",
            padding: 2,
            lineHeight: 1,
            fontSize: 18,
          }}
          >
            🗑️
          </button>
        ): !isCompleted && hasAlert ? (
          <span
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: team.members.some((m) => getMemberStatus(m) === "pending")
                ? "#ef4444"
                : "#f97316",
              boxShadow: team.members.some((m) => getMemberStatus(m) === "pending")
                ? "0 0 6px #ef4444aa"
                : "0 0 6px #f97316aa",
            }}
          />
        ) : null}

        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
          {team.name}
        </h2>

        {/*joincode */}
        <p
          style={{
            fontSize: 11,
            color: "#9ca3af",
            marginBottom: 10,
            fontFamily: "monospace",
            letterSpacing: "0.1em",
          }}>
            Code:{team.joinCode}
          </p>

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

              {member.id === team.leaderId && (
                <span 
                  title="Leader" 
                  style={{
                    marginLeft:4, 
                    fontSize:11
                  }}
                >
                  👑
                </span>
              )}
              <StatusDot status={getMemberStatus(member)} />
            </li>
          ))}
        </ol>
      </div>
    </Link>
  );
}