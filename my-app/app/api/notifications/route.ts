import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId)
    return Response.json({ message: "User ID is required." }, { status: 400 });

  await prisma.notification.deleteMany({
    where: {
      userId,
      read: true,
      createdAt: { lt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) }, //kl dah 2 weeks + udh dibaca = didelete
    },
  });

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  return Response.json(notifications, { status: 200 });
}

export async function PATCH(req: Request) {
  const { notificationId } = await req.json();

  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });

  return Response.json({ message: "Marked as read." }, { status: 200 });
}