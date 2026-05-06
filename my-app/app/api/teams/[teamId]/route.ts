import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  const { teamId } = await params;

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: {
        include: {
          user: true,
          tasks: true,
        },
      },
    },
  });

  if (!team)
    return Response.json({ message: "Team not found." }, { status: 404 });

  return Response.json({
    id: team.id,
    name: team.name,
    joinCode: team.joinCode,
    leaderId: team.leaderId,
    members: team.members.map((m) => ({
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
  }, { status: 200 });
}

export async function DELETE(
    req: Request,
    {params}:{params:{teamId:string}}
){
    const {teamId} = await params;

    if (!teamId) {
        return Response.json({ message: "Team ID is required." }, { status: 400 });
    }

    console.log("Deleting teamId:", teamId);

    await prisma.task.deleteMany({
        where: {teamMember:{teamId}},
    });
    await prisma.teamMember.deleteMany({where:{teamId}});
    await prisma.team.delete({where:{id:teamId}});

    return Response.json({message:"Team deleted."}, {status: 200})
}

export async function PATCH(
  req: Request,
  { params }: { params: any }
) {
  const { teamId } = await params;
  const { name } = await req.json();

  const team = await prisma.team.update({
    where: { id: teamId },
    data: { name },
  });

  return Response.json({ id: team.id, name: team.name }, { status: 200 });
}