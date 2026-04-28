export type TaskStatus = "pending" | "unverified" | "verified";

export interface Task {
  id: string;
  title: string;
  hasAttachment: boolean;
  status: TaskStatus;
}