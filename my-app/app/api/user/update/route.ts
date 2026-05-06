import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const { id, name, emailNotifications, twoFactorEnabled } = await req.json();

  if (!id || !name?.trim())
    return Response.json({ message: "Missing id or name." }, { status: 400 });

  const user = await prisma.user.update({
    where: { id },
    data: { name },
  });

  await prisma.user.update({
    where: { id },
    data: { 
      ...(name && { name }),
      ...(emailNotifications !== undefined && { emailNotifications }),
      ...(twoFactorEnabled !== undefined && { twoFactorEnabled }),
    },
  });

  return Response.json({ id: user.id, name: user.name }, { status: 200 });
}

