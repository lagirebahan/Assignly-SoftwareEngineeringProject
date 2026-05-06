import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId)
    return Response.json({ message: "User ID is required." }, { status: 400 });

  const teamMembers = await prisma.teamMember.findMany({
    where: { userId },
    include: {
      team: true,
      tasks: true,
    },
  });

  const tasks = teamMembers.flatMap((member) =>
    member.tasks.map((task) => ({
      teamId: member.teamId,
      teamName: member.team.name,
      taskId: task.id,
      taskTitle: task.title,
      deadline: task.deadline?.toISOString().split("T")[0] ?? null,
      status: task.status,
    }))
  );

  return Response.json(tasks, { status: 200 });
}