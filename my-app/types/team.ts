import { Task, TaskStatus } from "./task";

export interface Team {
  id: string;
  name: string;
  // progress: number;
  members: TeamMember[];
  joinCode: string;
  leaderId: string;
}

export interface TeamMember {
  id: string;
  name: string;
  tasks: Task[];
}