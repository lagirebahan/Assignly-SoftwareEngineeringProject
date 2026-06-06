import { TeamMember } from "@/types/team";
import { Task } from "@/types/task";

export function getTeamProgress(members: TeamMember[], unassignedTasks?: Task[]): number {
  const memberTasks = members.flatMap(m => m.tasks ?? []);
  const allTasks = [...memberTasks, ...(unassignedTasks ?? [])];
  if (allTasks.length === 0) return 0;

  const done = allTasks.filter(t => t.status === "verified").length;
  return Math.round((done / allTasks.length) * 100);
}