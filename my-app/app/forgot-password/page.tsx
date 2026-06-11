"use client";

import { useState } from "react";
import Image from "next/image";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "verify">("email");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message);
      return;
    }

    setSuccess("Code sent! Check console (for now).");
    setStep("verify");
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!code) {
      setError("Enter the verification code.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message);
      return;
    }

    window.location.href = `/reset-password?email=${email}`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background:
          "linear-gradient(145deg, #8a7d6b 0%, #6b6055 40%, #504840 100%)",
      }}
    >
        
      <div
        className="w-full max-w-sm rounded-2xl p-10 text-gray-800"
        style={{
          background: "#f9f8f6",
          boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div className="flex flex-col items-center gap-3 mb-8">
          <Image src="/assignlyicon.png" alt="Logo" width={54} height={54} />
          <span className="text-sm font-medium px-6 py-2 rounded-full bg-black text-white">
            Forgot Password
          </span>
        </div>


        {error && (
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-600 text-sm">{success}</div>
        )}

        {step === "email" && (
          <form onSubmit={sendCode} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="border p-3 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white py-3 rounded-lg"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        )}

        {step === "verify" && (
          <form onSubmit={verifyCode} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter verification code"
              className="border p-3 rounded-lg"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white py-3 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}