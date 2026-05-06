import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";

export async function GET(
  req: Request,
  { params }: { params: any }
) {
  const { taskId } = await params;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      teamMember: {
        include: {
          user: true,
          team: true,
        },
      },
    },
  });

  if (!task)
    return Response.json({ message: "Task not found." }, { status: 404 });

  return Response.json({
    id: task.id,
    title: task.title,
    description: task.description,
    hasAttachment: task.hasAttachment,
    attachmentUrl: task.attachmentUrl,
    status: task.status,
    deadline: task.deadline?.toISOString().split("T")[0] ?? null,
    comment: task.comment,
    teamMemberId: task.teamMemberId,
    memberName: task.teamMember.user.name,
    memberId: task.teamMember.userId,
    teamId: task.teamMember.teamId,
    teamName: task.teamMember.team.name,
  }, { status: 200 });
}

export async function PATCH(
  req: Request,
  { params }: { params: any }
) {
  const { taskId } = await params;
  const body = await req.json();
  const { action, description, attachmentUrl, comment, leaderId } = body;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      teamMember: {
        include: { user: true, team: true },
      },
    },
  });

  if (!task)
    return Response.json({ message: "Task not found." }, { status: 404 });

  if (action === "submit") {
    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        description,
        attachmentUrl,
        hasAttachment: !!attachmentUrl,
        status: "unverified",
      },
    });
    return Response.json(updated, { status: 200 });
  }

  if (action === "verify") {
    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { status: "verified", comment },
    });

    await prisma.notification.create({
      data: {
        userId: task.teamMember.userId,
        message: `Your work -${task.title}- in -${task.teamMember.team.name}- has been verified by the leader.${comment ? ` Comments: ${comment}` : ""}`,
      },
    });

    if (task.teamMember.user.emailNotifications) {
      await transporter.sendMail({
        from: `"Assignly" <${process.env.GMAIL_USER}>`,
        to: task.teamMember.user.email,
        subject: "Your task has been verified!",
        html: `<p>Your task <strong>${task.title}</strong> in <strong>${task.teamMember.team.name}</strong> has been verified.${comment ? ` Comment: ${comment}` : ""}</p>`,
      });
    }

    return Response.json(updated, { status: 200 });
  }

  if (action === "reject") {
    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { status: "pending", comment },
    });

    await prisma.notification.create({
      data: {
        userId: task.teamMember.userId,
        message: `Your work -${task.title}- in -${task.teamMember.team.name}- has been rejected by the leader.${comment ? ` Comments: ${comment}` : ""}`,
      },
    });

    if (task.teamMember.user.emailNotifications) {
      await transporter.sendMail({
        from: `"Assignly" <${process.env.GMAIL_USER}>`,
        to: task.teamMember.user.email,
        subject: "Your task needs revision",
        html: `<p>Your task <strong>${task.title}</strong> in <strong>${task.teamMember.team.name}</strong> has been rejected.${comment ? ` Comment: ${comment}` : ""}</p>`,
      });
    }

    return Response.json(updated, { status: 200 });
  }

  return Response.json({ message: "Invalid action." }, { status: 400 });
}