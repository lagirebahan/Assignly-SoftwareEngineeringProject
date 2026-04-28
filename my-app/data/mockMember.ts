import { TeamMember } from "@/types/team";

export const MOCK_MEMBERS: TeamMember[] = [
  {
    id: "m1",
    name: "Anggota 1",
    tasks: [
      { id: "t1", title: "Task 1", hasAttachment: true,  status: "verified"   },
      { id: "t2", title: "Task 2", hasAttachment: true,  status: "pending"    },
      { id: "t3", title: "Task 3", hasAttachment: false, status: "pending"    },
    ],
  },
  {
    id: "m2",
    name: "Anggota 2",
    tasks: [
      { id: "t1", title: "Task 1", hasAttachment: true,  status: "pending"    },
      { id: "t2", title: "Task 2", hasAttachment: true,  status: "unverified" },
      { id: "t3", title: "Task 3", hasAttachment: false, status: "pending"    },
    ],
  },
  {
    id: "m3",
    name: "Anggota 3",
    tasks: [
      { id: "t1", title: "Task 1", hasAttachment: true,  status: "verified"   },
      { id: "t2", title: "Task 2", hasAttachment: true,  status: "verified"   },
      { id: "t3", title: "Task 3", hasAttachment: false, status: "pending"    },
    ],
  },
];