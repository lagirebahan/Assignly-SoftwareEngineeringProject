import { findUserByEmail } from "../register/store";``

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json({ message: "All fields are required." }, { status: 400 });
  }

  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return Response.json({ message: "Incorrect email or password." }, { status: 401 });
  }

  return Response.json(
  {
    message: "Login successful.",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  },
  { status: 200 }
);
}
