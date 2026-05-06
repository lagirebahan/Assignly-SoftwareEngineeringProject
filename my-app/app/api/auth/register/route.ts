import { findUserByEmail, createUser } from "./store";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password)
    return Response.json({ message: "All fields are required." }, { status: 400 });
  if (!email.includes("@"))
    return Response.json({ message: "Invalid email address." }, { status: 400 });
  if (password.length < 6)
    return Response.json({ message: "Password must be at least 6 characters." }, { status: 400 });
  if (await findUserByEmail(email))
    return Response.json({ message: "An account with this email already exists." }, { status: 409 });

  const user = await createUser(name, email, password);

  return Response.json(
    { message: "Account created successfully.", userId: user.id, name: user.name },
    { status: 201 }
  );
}