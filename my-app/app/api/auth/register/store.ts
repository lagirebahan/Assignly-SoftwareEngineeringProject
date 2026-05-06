import { prisma } from "@/lib/prisma";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Buffer.from(hash).toString("hex");
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return (await hashPassword(password)) === hash;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
}

export async function createUser(name: string, email: string, password: string) {
  const hashed = await hashPassword(password);
  return prisma.user.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
    },
  });
}

export async function updateUserPassword(email: string, newPassword: string): Promise<boolean> {
  const hashed = await hashPassword(newPassword);
  const updated = await prisma.user.update({
    where: { email: email.trim().toLowerCase() },
    data: { password: hashed },
  });
  return !!updated;
}