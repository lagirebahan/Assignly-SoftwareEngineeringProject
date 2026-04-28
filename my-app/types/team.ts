import { Task, TaskStatus } from "./task";

export interface Team {
  id: string;
  name: string;
  // progress: number;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  tasks: Task[];
}