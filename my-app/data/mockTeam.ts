import { Team } from "@/types/team";

// Each team has a unique 8-char join code and a designated leaderId (first member = m1 by convention).
// Tasks now include a deadline for display in the home page calendar/task list.
export const MOCK_TEAMS: Team[] = [
  {
    id: "group1",
    name: "Group 1",
    joinCode: "AB12CD34",
    leaderId: "m1",
    members: [
      { id: "m1", name: "Alexio Clive Vandana",        tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "verified",   deadline: "2025-05-10" }] },
      { id: "m2", name: "Bryant Evant Mulya",           tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "pending",    deadline: "2025-05-10" }] },
      { id: "m3", name: "Christian Jordan Dwisaputra",  tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "unverified", deadline: "2025-05-10" }] },
      { id: "m4", name: "Joselyn Patricia Prasetyo",    tasks: [{ id: "t1", title: "Task 1", hasAttachment: false, status: "verified",   deadline: "2025-05-10" }] },
      { id: "m5", name: "Nathan",                       tasks: [{ id: "t1", title: "Task 1", hasAttachment: false, status: "verified",   deadline: "2025-05-10" }] },
    ],
  },
  {
    id: "group2",
    name: "Group 2",
    joinCode: "EF56GH78",
    leaderId: "m1",
    members: [
      { id: "m1", name: "Alexio Clive Vandana",        tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "verified",   deadline: "2025-05-15" }] },
      { id: "m2", name: "Bryant Evant Mulya",           tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "pending",    deadline: "2025-05-15" }] },
      { id: "m3", name: "Christian Jordan Dwisaputra",  tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "pending",    deadline: "2025-05-15" }] },
      { id: "m4", name: "Joselyn Patricia Prasetyo",    tasks: [{ id: "t1", title: "Task 1", hasAttachment: false, status: "unverified", deadline: "2025-05-15" }] },
      { id: "m5", name: "Nathan",                       tasks: [{ id: "t1", title: "Task 1", hasAttachment: false, status: "verified",   deadline: "2025-05-15" }] },
    ],
  },
  {
    id: "group3",
    name: "Group 3",
    joinCode: "IJ90KL12",
    leaderId: "m1",
    members: [
      { id: "m1", name: "Alexio Clive Vandana",        tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "verified",   deadline: "2025-05-20" }] },
      { id: "m2", name: "Bryant Evant Mulya",           tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "verified",   deadline: "2025-05-20" }] },
      { id: "m3", name: "Christian Jordan Dwisaputra",  tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "unverified", deadline: "2025-05-20" }] },
      { id: "m4", name: "Joselyn Patricia Prasetyo",    tasks: [{ id: "t1", title: "Task 1", hasAttachment: false, status: "verified",   deadline: "2025-05-20" }] },
      
    ],
  },
  {
    id: "group4",
    name: "Group 4",
    joinCode: "MN34OP56",
    leaderId: "m1",
    members: [
      { id: "m1", name: "Alexio Clive Vandana",        },
      { id: "m2", name: "Bryant Evant Mulya",           tasks: [{ id: "t1", title: "Make Figma", hasAttachment: true,  status: "verified",   deadline: "2025-05-25" }] },
      { id: "m3", name: "Christian Jordan Dwisaputra",  tasks: [{ id: "t1", title: "Code Frontend", hasAttachment: true,  status: "verified",   deadline: "2025-05-25" },{ id: "t2", title: "Code Backend", hasAttachment: true,  status: "verified",   deadline: "2025-05-25" }] },
      { id: "m4", name: "Joselyn Patricia Prasetyo",    tasks: [{ id: "t1", title: "Dokumentasi", hasAttachment: false, status: "pending",    deadline: "2025-05-25" }] },
      { id: "m5", name: "Nathan",                       tasks: [{ id: "t1", title: "Make Questionnaire", hasAttachment: true, status: "verified",   deadline: "2025-05-25" }] },
    ],
  },
  {
    // group5 is fully verified = 100% progress, used to test delete-on-hover behavior
    id: "group5",
    name: "Group 5",
    joinCode: "QR78ST90",
    leaderId: "m1",
    members: [
      { id: "m1", name: "Alexio Clive Vandana",        tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "verified",   deadline: "2025-04-30" }] },
      { id: "m2", name: "Bryant Evant Mulya",           tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "verified",   deadline: "2025-04-30" }] },
      { id: "m3", name: "Christian Jordan Dwisaputra",  tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "verified",   deadline: "2025-04-30" }] },
      { id: "m4", name: "Joselyn Patricia Prasetyo",    tasks: [{ id: "t1", title: "Task 1", hasAttachment: false, status: "verified",   deadline: "2025-04-30" }] },
      { id: "m5", name: "Nathan",                       tasks: [{ id: "t1", title: "Task 1", hasAttachment: false, status: "verified",   deadline: "2025-04-30" }] },
    ],
  },
];