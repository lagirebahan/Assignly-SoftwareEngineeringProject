import { TeamMember } from "@/types/team";

export const MOCK_MEMBERS_BY_TEAM: Record<string, { groupName: string; members: TeamMember[] }> = {
  "group1": {
    groupName: "Group 1",
    members: [
      {
        id: "m1",
        name: "Budi Santoso",
        tasks: [
          { id: "t1", title: "Task 1", hasAttachment: true,  status: "verified",   deadline: "2025-05-05" },
          { id: "t2", title: "Task 2", hasAttachment: true,  status: "pending",    deadline: "2025-05-12" },
          { id: "t3", title: "Task 3", hasAttachment: false, status: "pending",    deadline: "2025-05-19" },
        ],
      },
      {
        id: "m2",
        name: "Siti Rahayu",
        tasks: [
          { id: "t1", title: "Task 1", hasAttachment: true,  status: "pending",    deadline: "2025-05-05" },
          { id: "t2", title: "Task 2", hasAttachment: true,  status: "unverified", deadline: "2025-05-12" },
          { id: "t3", title: "Task 3", hasAttachment: false, status: "pending",    deadline: "2025-05-19" },
        ],
      },
    ],
  },
  "group2": {
    groupName: "Group 2",
    members: [
      {
        id: "m1",
        name: "Andi Wijaya",
        tasks: [
          { id: "t1", title: "Task 1", hasAttachment: true,  status: "verified",   deadline: "2025-05-05" },
          { id: "t2", title: "Task 2", hasAttachment: false, status: "pending",    deadline: "2025-05-12" },
        ],
      },
      {
        id: "m2",
        name: "Dewi Kusuma",
        tasks: [
          { id: "t1", title: "Task 1", hasAttachment: true,  status: "unverified", deadline: "2025-05-05" },
          { id: "t2", title: "Task 2", hasAttachment: true,  status: "pending",    deadline: "2025-05-12" },
        ],
      },
    ],
  },
  
};