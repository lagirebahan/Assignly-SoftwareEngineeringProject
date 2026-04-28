import { TeamMember } from "@/types/team";

// Mock members for the [teamId] detail page — each has 3 tasks with deadlines.
export const MOCK_MEMBERS: TeamMember[] = [
  {
    id: "m1",
    name: "Anggota 1",
    tasks: [
      { id: "t1", title: "Task 1", hasAttachment: true,  status: "verified",   deadline: "2025-05-05" },
      { id: "t2", title: "Task 2", hasAttachment: true,  status: "pending",    deadline: "2025-05-12" },
      { id: "t3", title: "Task 3", hasAttachment: false, status: "pending",    deadline: "2025-05-19" },
    ],
  },
  {
    id: "m2",
    name: "Anggota 2",
    tasks: [
      { id: "t1", title: "Task 1", hasAttachment: true,  status: "pending",    deadline: "2025-05-05" },
      { id: "t2", title: "Task 2", hasAttachment: true,  status: "unverified", deadline: "2025-05-12" },
      { id: "t3", title: "Task 3", hasAttachment: false, status: "pending",    deadline: "2025-05-19" },
    ],
  },
  {
    id: "m3",
    name: "Anggota 3",
    tasks: [
      { id: "t1", title: "Task 1", hasAttachment: true,  status: "verified",   deadline: "2025-05-05" },
      { id: "t2", title: "Task 2", hasAttachment: true,  status: "verified",   deadline: "2025-05-12" },
      { id: "t3", title: "Task 3", hasAttachment: false, status: "pending",    deadline: "2025-05-19" },
    ],
  },
];