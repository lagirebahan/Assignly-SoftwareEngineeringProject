"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Registration failed.");
      return;
    }

    setSuccess("Account created! Redirecting to login...");
    setTimeout(() => router.push("/login"), 1200);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(145deg, #8a7d6b 0%, #6b6055 40%, #504840 100%)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-10"
        style={{ background: "#f9f8f6", boxShadow: "0 30px 60px rgba(0,0,0,0.25)" }}
      >
        <div className="flex flex-col items-center gap-3 mb-8">
          <Image src="/assignlyicon.png" alt="Assignly Logo" width={54} height={54} priority />
          <span
            className="text-sm font-medium px-6 py-2 rounded-full"
            style={{ background: "#1a1a1a", color: "#f9f8f6", letterSpacing: "0.1em" }}
          >
            Sign up
          </span>
        </div>

        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{ background: "#fdecea", color: "#c0392b", border: "1px solid #f5c6c2" }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{ background: "#eafaf1", color: "#1e8449", border: "1px solid #a9dfbf" }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} noValidate className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: "#f0ede8",
              border: "1px solid #d8d4cc",
              color: "#1a1a1a",
              fontFamily: "var(--font-poppins), sans-serif",
            }}
          />

          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: "#f0ede8",
              border: "1px solid #d8d4cc",
              color: "#1a1a1a",
              fontFamily: "var(--font-poppins), sans-serif",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: "#f0ede8",
              border: "1px solid #d8d4cc",
              color: "#1a1a1a",
              fontFamily: "var(--font-poppins), sans-serif",
            }}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: "#f0ede8",
              border: "1px solid #d8d4cc",
              color: "#1a1a1a",
              fontFamily: "var(--font-poppins), sans-serif",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-sm font-medium mt-1 disabled:opacity-60 cursor-pointer hover:opacity-80 transition-opacity"
            style={{
              background: "#1a1a1a",
              color: "#f9f8f6",
              fontFamily: "var(--font-poppins), sans-serif",
              letterSpacing: "0.06em",
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-xs mt-5" style={{ color: "#888" }}>
          Have an account?{" "}
          <Link
            href="/login"
            className="font-medium underline underline-offset-2"
            style={{ color: "#1a1a1a" }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
