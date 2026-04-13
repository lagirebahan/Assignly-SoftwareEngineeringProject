export type TaskStatus = "unfinished" | "unverified" | "done";

export interface TeamMember {
  name: string;
  taskStatus: TaskStatus;
}

export interface Team {
  id: string;
  name: string;
  progress: number;
  members: TeamMember[];
}
