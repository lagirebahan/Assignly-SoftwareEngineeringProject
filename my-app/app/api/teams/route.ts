import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId)
    return Response.json({ message: "User ID is required." }, { status: 400 });

  const teamMembers = await prisma.teamMember.findMany({
    where: { userId },
    include: {
      team: {
        include: {
          members: {
            include: {
              user: true,
              tasks: true,
            },
          },
        },
      },
    },
  });

  const teams = teamMembers.map((tm) => ({
    id: tm.team.id,
    name: tm.team.name,
    joinCode: tm.team.joinCode,
    leaderId: tm.team.leaderId,
    members: tm.team.members.map((m) => ({
      id: m.id,
      userId: m.userId,
      name: m.user.name,
      tasks: m.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        hasAttachment: t.hasAttachment,
        status: t.status,
        deadline: t.deadline?.toISOString().split("T")[0] ?? null,
      })),
    })),
  }));

  return Response.json(teams, { status: 200 });
}