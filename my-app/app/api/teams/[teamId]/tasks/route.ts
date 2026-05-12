import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: any }
) {
  const { teamId } = await params;
  const user = await getAuthUser();
  if (!user) return Response.json({ message: "Unauthorized." }, { status: 401 });

  const { title, deadline, teamMemberId } = await req.json();

  if (!title || !teamMemberId)
    return Response.json({ message: "Title and member ID are required." }, { status: 400 });

  const task = await prisma.task.create({
    data: {
      title,
      hasAttachment: false,
      status: "pending",
      deadline: deadline ? new Date(deadline) : null,
      teamMemberId,
    },
  });

  return Response.json({
    id: task.id,
    title: task.title,
    hasAttachment: task.hasAttachment,
    status: task.status,
    deadline: task.deadline?.toISOString().split("T")[0] ?? null,
  }, { status: 201 });
}