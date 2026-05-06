import { TaskStatus } from "@/types/task";
import { TeamMember } from "@/types/team";

export function getMemberStatus(member: TeamMember): TaskStatus {
  if (!member.tasks?.length) return "verified";
  if (member.tasks.every((t) => t.status === "verified")) return "verified";
  if (member.tasks.some((t) => t.status === "unverified")) return "unverified";
  return "pending";
}