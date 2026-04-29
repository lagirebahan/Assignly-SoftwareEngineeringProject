import { TeamMember } from "@/types/team";

export function getTeamProgress(members: TeamMember[]): number {
  if (members.length === 0) return 0;

  const done = members.filter(m => 
    m.tasks?.length && m.tasks?.every((t)=>t.status === "verified")).length;
  return Math.round((done / members.length) * 100);
}