import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: any }
) {
  const { teamId } = await params;
  const user = await getAuthUser();
  if (!user) return Response.json({ message: "Unauthorized." }, { status: 401 });

  const userId = user.id;

  // Find the team member
  const member = await prisma.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId,
        teamId,
      },
    },
  });

  if (!member) {
    return Response.json({ message: "You are not a member of this team." }, { status: 404 });
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: true,
    },
  });

  if (!team) {
    return Response.json({ message: "Team not found." }, { status: 404 });
  }

  const isLeader = team.leaderId === userId;

  if (isLeader) {
    // If there are other members, leader cannot leave without nominating a successor
    if (team.members.length > 1) {
      return Response.json(
        { message: "As the leader, you must nominate a successor before leaving." },
        { status: 400 }
      );
    }

    // If the leader is the only member, delete the team entirely
    await prisma.$transaction([
      prisma.task.deleteMany({ where: { teamId } }),
      prisma.teamMember.deleteMany({ where: { teamId } }),
      prisma.team.delete({ where: { id: teamId } }),
    ]);

    return Response.json({ success: true, deleted: true });
  }

  // Normal member leaving flow
  // Unassign their tasks and set status to pending (unfinished)
  await prisma.$transaction([
    prisma.task.updateMany({
      where: {
        teamId,
        teamMemberId: member.id,
      },
      data: {
        teamMemberId: null,
        status: "pending",
      },
    }),
    prisma.teamMember.delete({
      where: { id: member.id },
    }),
  ]);

  return Response.json({ success: true });
}
