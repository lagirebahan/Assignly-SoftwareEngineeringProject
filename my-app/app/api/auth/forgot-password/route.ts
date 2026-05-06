import { findUserByEmail } from "../register/store";
import { transporter } from "@/lib/mailer";

const verificationCodes = new Map<string, string>();

export async function POST(req: Request) {
  const { email, code } = await req.json();

  if (email && !code) {
    const user = await findUserByEmail(email);
    if (!user)
      return Response.json({ message: "Email not found." }, { status: 404 });

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes.set(email, generatedCode);

    await transporter.sendMail({
      from: `"Assignly" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your verification code",
      html: `
        <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:32px;background:#f9f8f6;border-radius:12px">
          <h2 style="margin-top:0">Password Reset</h2>
          <p>Your verification code is:</p>
          <div style="font-size:32px;font-weight:700;letter-spacing:8px;margin:24px 0">${generatedCode}</div>
          <p style="color:#888;font-size:13px">This code expires when the server restarts. If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    return Response.json({ message: "Verification code sent to your email." }, { status: 200 });
  }

  // Step 2: verify code
  if (email && code) {
    const storedCode = verificationCodes.get(email);
    if (!storedCode || storedCode !== code)
      return Response.json({ message: "Invalid or expired code." }, { status: 400 });

    verificationCodes.delete(email);
    return Response.json({ message: "Code verified successfully." }, { status: 200 });
  }

  return Response.json({ message: "Invalid request." }, { status: 400 });
}