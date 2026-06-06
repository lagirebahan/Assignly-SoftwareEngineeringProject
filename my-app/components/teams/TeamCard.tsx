"use client";

import Link from "next/link";
import { useState } from "react";
import { StatusDot } from "./StatusDot";
import { ProgressBar } from "./ProgressBar";
import { Team } from "@/types/team";
import { getTeamProgress } from "@/utils/team";
import { getMemberStatus } from "@/utils/GetMemberStatus";
import Image from "next/image";

export function TeamCard({ team, userId, onDelete }: { 
  team: Team; 
  userId: string;
  onDelete?:(teamId:string)=>void; 
}) {
  
  const hasAlert = team.members.some((m) => getMemberStatus(m) !== "verified") || (team.unassignedTasks && team.unassignedTasks.length > 0);
  const progress = getTeamProgress(team.members, team.unassignedTasks);
  const isCompleted = progress === 100;
  const isLeader = team.leaderId === userId;
  const [hovered, setHovered] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmStep, setConfirmStep] = useState<1|2>(1);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
    setConfirmStep(1);
  }

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(confirmStep === 1 && !isCompleted){
      setConfirmStep(2);
    } else {
      setShowConfirm(false);
      onDelete?.(team.id);
    }
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
    setConfirmStep(1); //reset balik ke 1
  }

  return (
    <>
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
          {isLeader && hovered && (
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
              padding: 2,
              lineHeight: 1,
            }}
            >
              <Image src="/icons/delete.png" alt="Delete" width={16} height={16}/>
            </button>
          )}
          {!isCompleted && hasAlert && !(isLeader && hovered) && (
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
          )}

          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
            {team.name}
          </h2>

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

                {member.userId === team.leaderId && (
                  <Image src="/icons/crown.png" alt="Leader" width={12} height={12} style={{marginLeft: 4}}/>
                )}
                <StatusDot status={getMemberStatus(member)} />
              </li>
            ))}
          </ol>
        </div>
      </Link>
      {showConfirm && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
          onClick={handleCancel}
        >
          <div
            style={{
              backgroundColor: "white", borderRadius: 16, padding: "28px 28px 24px",
              width: 360, boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
              border: "1.5px solid #fecaca",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                backgroundColor: "#fef2f2", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: 18 }}>⚠️</span>
              </div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>
                Delete "{team.name}"?
              </h3>
            </div>

            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.5 }}>
              {confirmStep === 1 && !isCompleted
                ? "This team has not finished all its tasks. Are you sure about this?"
                : "Are you sure? This action cannot be undone."}
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleCancel}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 10,
                  border: "1.5px solid #e5e7eb", backgroundColor: "white",
                  fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 10,
                  border: "none", backgroundColor: "#ef4444",
                  fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer",
                }}
              >
                {confirmStep === 1 && !isCompleted ? "Continue" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
    
  );
  
}