import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({ adapter });

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Buffer.from(hash).toString("hex");
}

async function main() {
  const hashed = await hashPassword("test123");

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "alexio@test.com" },
      update: {},
      create: { name: "Alexio Clive Vandana", email: "alexio@test.com", password: hashed },
    }),
    prisma.user.upsert({
      where: { email: "bryant@test.com" },
      update: {},
      create: { name: "Bryant Evant Mulya", email: "bryant@test.com", password: hashed },
    }),
    prisma.user.upsert({
      where: { email: "christian@test.com" },
      update: {},
      create: { name: "Christian Jordan Dwisaputra", email: "christian@test.com", password: hashed },
    }),
    prisma.user.upsert({
      where: { email: "joselyn@test.com" },
      update: {},
      create: { name: "Joselyn Patricia Prasetyo", email: "joselyn@test.com", password: hashed },
    }),
    prisma.user.upsert({
      where: { email: "nathan@test.com" },
      update: {},
      create: { name: "Nathan", email: "nathan@test.com", password: hashed },
    }),
  ]);

  const [alexio, bryant, christian, joselyn, nathan] = users;

  const teamsData = [
    {
      id: "group1", name: "Group 1", joinCode: "AB12CD34", leader: alexio,
      members: [
        { user: alexio, tasks: [{ title: "Task 1", hasAttachment: true, status: "verified", deadline: "2026-05-10", isLarge: false }] },
        { user: bryant, tasks: [{ title: "Task 1", hasAttachment: true, status: "pending", deadline: "2026-05-10", isLarge: false }] },
        { user: christian, tasks: [{ title: "Task 1", hasAttachment: true, status: "unverified", deadline: "2026-05-10", isLarge: false }] },
        { user: joselyn, tasks: [{ title: "Task 1", hasAttachment: false, status: "verified", deadline: "2026-05-10", isLarge: false }] },
        { user: nathan, tasks: [{ title: "Task 1", hasAttachment: false, status: "verified", deadline: "2026-05-10", isLarge: false }] },
      ],
    },
    {
      id: "group2", name: "Group 2", joinCode: "EF56GH78", leader: alexio,
      members: [
        { user: alexio, tasks: [{ title: "Task 1", hasAttachment: true, status: "verified", deadline: "2026-05-15", isLarge: false }] },
        { user: bryant, tasks: [{ title: "Task 1", hasAttachment: true, status: "pending", deadline: "2026-05-15", isLarge: false }] },
        { user: christian, tasks: [{ title: "Task 1", hasAttachment: true, status: "pending", deadline: "2026-05-15", isLarge: false }] },
        { user: joselyn, tasks: [{ title: "Task 1", hasAttachment: false, status: "unverified", deadline: "2026-05-15", isLarge: false }] },
        { user: nathan, tasks: [{ title: "Task 1", hasAttachment: false, status: "verified", deadline: "2026-05-15", isLarge: false }] },
      ],
    },
    {
      id: "group3", name: "Group 3", joinCode: "IJ90KL12", leader: alexio,
      members: [
        { user: alexio, tasks: [{ title: "Task 1", hasAttachment: true, status: "verified", deadline: "2026-05-20", isLarge: false }] },
        { user: bryant, tasks: [{ title: "Task 1", hasAttachment: true, status: "verified", deadline: "2026-05-20", isLarge: false }] },
        { user: christian, tasks: [{ title: "Task 1", hasAttachment: true, status: "unverified", deadline: "2026-05-20", isLarge: false }] },
        { user: joselyn, tasks: [{ title: "Task 1", hasAttachment: false, status: "verified", deadline: "2026-05-20", isLarge: false }] },
      ],
    },
    {
      id: "group4", name: "Group 4", joinCode: "MN34OP56", leader: alexio,
      members: [
        { user: alexio, tasks: [] },
        { user: bryant, tasks: [{ title: "Make Figma", hasAttachment: true, status: "verified", deadline: "2026-05-25", isLarge: true }] },
        { user: christian, tasks: [
          { title: "Code Frontend", hasAttachment: true, status: "verified", deadline: "2026-05-25", isLarge: true },
          { title: "Code Backend", hasAttachment: true, status: "verified", deadline: "2026-05-25", isLarge: true },
        ]},
        { user: joselyn, tasks: [{ title: "Dokumentasi", hasAttachment: false, status: "pending", deadline: "2026-05-25", isLarge: false }] },
        { user: nathan, tasks: [{ title: "Make Questionnaire", hasAttachment: true, status: "verified", deadline: "2026-05-25", isLarge: false }] },
      ],
    },
    {
      id: "group5", name: "Group 5", joinCode: "QR78ST90", leader: alexio,
      members: [
        { user: alexio, tasks: [{ title: "Task 1", hasAttachment: true, status: "verified", deadline: "2026-04-30", isLarge: false }] },
        { user: bryant, tasks: [{ title: "Task 1", hasAttachment: true, status: "verified", deadline: "2026-04-30", isLarge: false }] },
        { user: christian, tasks: [{ title: "Task 1", hasAttachment: true, status: "verified", deadline: "2026-04-30", isLarge: false }] },
        { user: joselyn, tasks: [{ title: "Task 1", hasAttachment: false, status: "verified", deadline: "2026-04-30", isLarge: false }] },
        { user: nathan, tasks: [{ title: "Task 1", hasAttachment: false, status: "verified", deadline: "2026-04-30", isLarge: false }] },
      ],
    },
  ];

  for (const teamData of teamsData) {
    const team = await prisma.team.upsert({
      where: { id: teamData.id },
      update: {},
      create: {
        id: teamData.id,
        name: teamData.name,
        joinCode: teamData.joinCode,
        leaderId: teamData.leader.id,
      },
    });

    for (const memberData of teamData.members) {
      const member = await prisma.teamMember.upsert({
        where: {
            userId_teamId: {
                userId: memberData.user.id,
                teamId: team.id,
            },
        },
        update: {},
        create: {
            userId: memberData.user.id,
            teamId: team.id,
        },
      });

      for (const taskData of memberData.tasks) {
        await prisma.task.create({
          data: {
            title: taskData.title,
            hasAttachment: taskData.hasAttachment,
            status: taskData.status as any,
            deadline: new Date(taskData.deadline),
            teamMemberId: member.id,
            teamId: team.id,
            isLarge: taskData.isLarge,
          },
        });
      }
    }
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());