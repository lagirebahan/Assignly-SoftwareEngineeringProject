import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId)
    return Response.json({ message: "User ID is required." }, { status: 400 });

  // Find all teams where this user is the leader
  const ledTeams = await prisma.team.findMany({
    where: { leaderId: userId },
    include: {
      members: {
        where: { userId: { not: userId } }, // exclude leader's own tasks
        include: { tasks: true },
      },
    },
  });

  let pendingCount = 0;
  let unverifiedCount = 0;

  for (const team of ledTeams) {
    for (const member of team.members) {
      for (const task of member.tasks) {
        if (task.status === "pending") pendingCount++;
        if (task.status === "unverified") unverifiedCount++;
      }
    }
  }

  return Response.json({ pendingCount, unverifiedCount }, { status: 200 });
}