import { Team } from "@/types/team";

export const MOCK_TEAMS: Team[] = [
  {
    id: "group1",
    name: "Group 1",
    members: [
      { id: "m1", name: "Alexio Clive Vandana",        tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "verified"   }] },
      { id: "m2", name: "Bryant Evant Mulya",           tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "pending"    }] },
      { id: "m3", name: "Christian Jordan Dwisaputra",  tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "unverified" }] },
      { id: "m4", name: "Joselyn Patricia Prasetyo",    tasks: [{ id: "t1", title: "Task 1", hasAttachment: false, status: "verified"   }] },
      { id: "m5", name: "Nathan",                       tasks: [{ id: "t1", title: "Task 1", hasAttachment: false, status: "verified"   }] },
    ],
  },
  {
    id: "group2",
    name: "Group 2",
    members: [
      { id: "m1", name: "Alexio Clive Vandana",        tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "verified"   }] },
      { id: "m2", name: "Bryant Evant Mulya",           tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "pending"    }] },
      { id: "m3", name: "Christian Jordan Dwisaputra",  tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "pending"    }] },
      { id: "m4", name: "Joselyn Patricia Prasetyo",    tasks: [{ id: "t1", title: "Task 1", hasAttachment: false, status: "unverified" }] },
      { id: "m5", name: "Nathan",                       tasks: [{ id: "t1", title: "Task 1", hasAttachment: false, status: "verified"   }] },
    ],
  },
  {
    id: "group3",
    name: "Group 3",
    members: [
      { id: "m1", name: "Alexio Clive Vandana",        tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "verified"   }] },
      { id: "m2", name: "Bryant Evant Mulya",           tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "verified"   }] },
      { id: "m3", name: "Christian Jordan Dwisaputra",  tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "unverified" }] },
      { id: "m4", name: "Joselyn Patricia Prasetyo",    tasks: [{ id: "t1", title: "Task 1", hasAttachment: false, status: "verified"   }] },
      { id: "m5", name: "Nathan",                       tasks: [{ id: "t1", title: "Task 1", hasAttachment: false, status: "verified"   }] },
    ],
  },
  {
    id: "group4",
    name: "Group 4",
    members: [
      { id: "m1", name: "Alexio Clive Vandana",        tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "verified"   }] },
      { id: "m2", name: "Bryant Evant Mulya",           tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "verified"   }] },
      { id: "m3", name: "Christian Jordan Dwisaputra",  tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "verified"   }] },
      { id: "m4", name: "Joselyn Patricia Prasetyo",    tasks: [{ id: "t1", title: "Task 1", hasAttachment: false, status: "pending"    }] },
      { id: "m5", name: "Nathan",                       tasks: [{ id: "t1", title: "Task 1", hasAttachment: false, status: "verified"   }] },
    ],
  },
  {
    id: "group5",
    name: "Group 5",
    members: [
      { id: "m1", name: "Alexio Clive Vandana",        tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "pending"    }] },
      { id: "m2", name: "Bryant Evant Mulya",           tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "pending"    }] },
      { id: "m3", name: "Christian Jordan Dwisaputra",  tasks: [{ id: "t1", title: "Task 1", hasAttachment: true,  status: "pending"    }] },
      { id: "m4", name: "Joselyn Patricia Prasetyo",    tasks: [{ id: "t1", title: "Task 1", hasAttachment: false, status: "unverified" }] },
      { id: "m5", name: "Nathan",                       tasks: [{ id: "t1", title: "Task 1", hasAttachment: false, status: "verified"   }] },
    ],
  },
];