import { findUserByEmail, verifyPassword } from "../register/store";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password)
    return Response.json({ message: "All fields are required." }, { status: 400 });

  const user = await findUserByEmail(email);

  if (!user || !(await verifyPassword(password, user.password)))
    return Response.json({ message: "Incorrect email or password." }, { status: 401 });

  const token = await new SignJWT({id:user.id, name: user.name, email: user.email})
    .setProtectedHeader({alg:"HS256"})
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  return new Response(JSON.stringify({
    message: "Login successful.",
    token,
    user: { id: user.id, name: user.name, email: user.email },
  }), { 
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie":`token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    }});
}