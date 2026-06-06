import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: any }
) {
  const { teamId } = await params;
  const user = await getAuthUser();
  if (!user) return Response.json({ message: "Unauthorized." }, { status: 401 });

  const { successorUserId } = await req.json();

  if (!successorUserId) {
    return Response.json({ message: "Successor User ID is required." }, { status: 400 });
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

  // Ensure current user is the leader
  if (team.leaderId !== user.id) {
    return Response.json({ message: "Only the leader can nominate a successor." }, { status: 403 });
  }

  // Ensure successor is a member of the team
  const isMember = team.members.some((m) => m.userId === successorUserId);
  if (!isMember) {
    return Response.json({ message: "Successor must be a member of the team." }, { status: 400 });
  }

  // Set pending successor
  await prisma.team.update({
    where: { id: teamId },
    data: { pendingSuccessorId: successorUserId },
  });

  // Create notification for successor
  await prisma.notification.create({
    data: {
      userId: successorUserId,
      message: `👑 Nomination: You have been nominated as the successor leader of team -${team.name}- by -${user.name}-.`,
    },
  });

  return Response.json({ success: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: any }
) {
  const { teamId } = await params;
  const user = await getAuthUser();
  if (!user) return Response.json({ message: "Unauthorized." }, { status: 401 });

  const { action } = await req.json();

  if (action !== "accept" && action !== "decline") {
    return Response.json({ message: "Invalid action. Must be 'accept' or 'decline'." }, { status: 400 });
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    return Response.json({ message: "Team not found." }, { status: 404 });
  }

  // Ensure current user is the pending successor
  if (team.pendingSuccessorId !== user.id) {
    return Response.json({ message: "You are not the nominated successor for this team." }, { status: 403 });
  }

  if (action === "decline") {
    // Clear pending successor
    await prisma.team.update({
      where: { id: teamId },
      data: { pendingSuccessorId: null },
    });

    // Notify the leader
    await prisma.notification.create({
      data: {
        userId: team.leaderId,
        message: `❌ Refusal: -${user.name}- has declined your nomination as successor leader for team -${team.name}-.`,
      },
    });

    return Response.json({ success: true });
  }

  // Action is accept
  const oldLeaderId = team.leaderId;

  // Find the old leader's member record in this team
  const oldLeaderMember = await prisma.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId: oldLeaderId,
        teamId,
      },
    },
  });

  await prisma.$transaction(async (tx) => {
    // 1. Update team leader and clear pending successor
    await tx.team.update({
      where: { id: teamId },
      data: {
        leaderId: user.id,
        pendingSuccessorId: null,
      },
    });

    if (oldLeaderMember) {
      // 2. Unassign all tasks of the old leader
      await tx.task.updateMany({
        where: {
          teamId,
          teamMemberId: oldLeaderMember.id,
        },
        data: {
          teamMemberId: null,
          status: "pending",
        },
      });

      // 3. Remove old leader from the team
      await tx.teamMember.delete({
        where: { id: oldLeaderMember.id },
      });
    }

    // 4. Create notification for old leader
    await tx.notification.create({
      data: {
        userId: oldLeaderId,
        message: `✅ Transfer Complete: -${user.name}- has accepted your nomination. You have successfully left the team -${team.name}-.`,
      },
    });
  });

  return Response.json({ success: true });
}
