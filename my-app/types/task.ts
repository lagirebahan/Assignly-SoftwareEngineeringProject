export type TaskStatus = "pending" | "unverified" | "verified";

export interface Task {
  id: string;
  title: string;
  description?: string;
  hasAttachment: boolean;
  attachmentUrl?: string;
  status: TaskStatus;
  deadline?: string;
  comment?: string;
}