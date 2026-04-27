import fs from "fs";
import path from "path";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

const DB_PATH = path.join(process.cwd(), "users.json");

function readUsers(): User[] {
  try {
    if (!fs.existsSync(DB_PATH)) return [];
    const raw = fs.readFileSync(DB_PATH, "utf-8").trim();
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: User[]): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), "utf-8");
}

export function findUserByEmail(email: string): User | undefined {
  return readUsers().find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
}

export function createUser(name: string, email: string, password: string): User {
  const users = readUsers();
  const user: User = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
  };
  users.push(user);
  writeUsers(users);
  return user;
}

export function updateUserPassword(email: string, newPassword: string): boolean {
  const users = readUsers();

  const index = users.findIndex(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (index === -1) return false;

  users[index].password = newPassword;

  writeUsers(users);
  return true;
}