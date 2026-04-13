import { Team } from "@/types/team";

export const MOCK_TEAMS: Team[] = [
  {
    id: "group1",
    name: "Group 1",
    progress: 85,
    members: [
      { name: "Alexio Clive Vandana", taskStatus: "done" },
      { name: "Bryant Evant Mulya", taskStatus: "unfinished" },
      { name: "Christian Jordan Dwisaputra", taskStatus: "unverified" },
      { name: "Joselyn Patricia Prasetyo", taskStatus: "done" },
      { name: "Nathan", taskStatus: "done" },
    ],
  },
  {
    id: "group2",
    name: "Group 2",
    progress: 50,
    members: [
      { name: "Alexio Clive Vandana", taskStatus: "done" },
      { name: "Bryant Evant Mulya", taskStatus: "unfinished" },
      { name: "Christian Jordan Dwisaputra", taskStatus: "unfinished" },
      { name: "Joselyn Patricia Prasetyo", taskStatus: "unverified" },
      { name: "Nathan", taskStatus: "done" },
    ],
  },
  {
    id: "group3",
    name: "Group 3",
    progress: 75,
    members: [
      { name: "Alexio Clive Vandana", taskStatus: "done" },
      { name: "Bryant Evant Mulya", taskStatus: "done" },
      { name: "Christian Jordan Dwisaputra", taskStatus: "unverified" },
      { name: "Joselyn Patricia Prasetyo", taskStatus: "done" },
      { name: "Nathan", taskStatus: "done" },
    ],
  },
  {
    id: "group4",
    name: "Group 4",
    progress: 80,
    members: [
      { name: "Alexio Clive Vandana", taskStatus: "done" },
      { name: "Bryant Evant Mulya", taskStatus: "done" },
      { name: "Christian Jordan Dwisaputra", taskStatus: "done" },
      { name: "Joselyn Patricia Prasetyo", taskStatus: "unfinished" },
      { name: "Nathan", taskStatus: "done" },
    ],
  },
  {
    id: "group5",
    name: "Group 5",
    progress: 20,
    members: [
      { name: "Alexio Clive Vandana", taskStatus: "unfinished" },
      { name: "Bryant Evant Mulya", taskStatus: "unfinished" },
      { name: "Christian Jordan Dwisaputra", taskStatus: "unfinished" },
      { name: "Joselyn Patricia Prasetyo", taskStatus: "unverified" },
      { name: "Nathan", taskStatus: "done" },
    ],
  },
];