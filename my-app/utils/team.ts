import { TeamMember } from "@/types/team";

export function getTeamProgress(members: TeamMember[]): number {
  const allTasks = members.flatMap(m => m.tasks ?? []);
  if (allTasks.length === 0) return 0;

  const done = allTasks.filter(t => t.status === "verified").length;
  return Math.round((done / allTasks.length) * 100);
}