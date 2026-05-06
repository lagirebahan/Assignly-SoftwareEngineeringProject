import { findUserByEmail, updateUserPassword } from "../register/store";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return Response.json({ message: "Email and password are required." }, { status: 400 });

    const user = await findUserByEmail(email);
    if (!user)
      return Response.json({ message: "User not found." }, { status: 404 });

    await updateUserPassword(email, password);

    return Response.json({ message: "Password updated successfully." }, { status: 200 });
  } catch {
    return Response.json({ message: "Server error." }, { status: 500 });
  }
}