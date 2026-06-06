import { Task, TaskStatus } from "./task";

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  joinCode: string;
  leaderId: string;
  pendingSuccessorId?: string | null;
  unassignedTasks?: Task[];
}

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  tasks?: Task[];
}