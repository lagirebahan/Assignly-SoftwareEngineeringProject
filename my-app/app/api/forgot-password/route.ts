// app/api/forgot/route.ts

import { findUserByEmail } from "../register/store";

const verificationCodes = new Map<string, string>(); // email -> code

export async function POST(req: Request) {
  const { email, code } = await req.json();

  // STEP 1: request code
  if (email && !code) {
    const user = findUserByEmail(email);

    if (!user) {
      return Response.json(
        { message: "Email not found." },
        { status: 404 }
      );
    }

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes.set(email, generatedCode);

    // ⚠️ Simulate email sending
    console.log(`Verification code for ${email}: ${generatedCode}`);

    return Response.json(
      { message: "Verification code sent to your email." },
      { status: 200 }
    );
  }

  // STEP 2: verify code
  if (email && code) {
    const storedCode = verificationCodes.get(email);

    if (!storedCode || storedCode !== code) {
      return Response.json(
        { message: "Invalid or expired code." },
        { status: 400 }
      );
    }

    verificationCodes.delete(email);

    return Response.json(
      { message: "Code verified successfully." },
      { status: 200 }
    );
  }

  return Response.json(
    { message: "Invalid request." },
    { status: 400 }
  );
}