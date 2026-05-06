import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { code, userId } = await req.json();

  if (!code || !userId)
    return Response.json({ message: "Code and user ID are required." }, { status: 400 });

  const team = await prisma.team.findUnique({
    where: { joinCode: code },
    include: { members: true },
  });

  if (!team)
    return Response.json({ message: "Invalid code." }, { status: 404 });

  const alreadyMember = team.members.some((m) => m.userId === userId);
  if (alreadyMember)
    return Response.json({ message: "Already a member of this team." }, { status: 409 });

  await prisma.teamMember.create({
    data: { userId, teamId: team.id },
  });

  return Response.json(team, { status: 200 });
}