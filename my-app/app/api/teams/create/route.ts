import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, userId } = await req.json(); 

  if (!name || !userId)
    return Response.json({ message: "Name and User ID are required." }, { status: 400 });

  const joinCode = generateJoinCode();

  const team = await prisma.team.create({
    data: {
      name,
      joinCode,
      leaderId: userId,
      members: {
        create: { userId },
      },
    },
    include: { members: true },
  });

  return Response.json(team, { status: 201 });
}

function generateJoinCode(): string {
  const letters = Array.from({ length: 3 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join("");
  const numbers = Math.floor(10000 + Math.random() * 90000).toString();
  return `${letters}-${numbers}`;
}