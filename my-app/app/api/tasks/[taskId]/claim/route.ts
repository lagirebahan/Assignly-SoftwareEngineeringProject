import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: any }
) {
  const { taskId } = await params;
  const user = await getAuthUser();
  if (!user) return Response.json({ message: "Unauthorized." }, { status: 401 });

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    return Response.json({ message: "Task not found." }, { status: 404 });
  }

  if (task.teamMemberId !== null) {
    return Response.json({ message: "This task has already been claimed." }, { status: 400 });
  }

  // Find the claiming user's team member record in this team
  const member = await prisma.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId: user.id,
        teamId: task.teamId,
      },
    },
  });

  if (!member) {
    return Response.json({ message: "You are not a member of this team." }, { status: 403 });
  }

  // Assign task to member
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      teamMemberId: member.id,
    },
  });

  return Response.json(updatedTask, { status: 200 });
}
