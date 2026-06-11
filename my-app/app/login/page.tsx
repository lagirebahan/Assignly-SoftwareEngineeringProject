"use client";

import { useState} from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Login failed.");
      return;
    }

    

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  setSuccess(`Welcome back, ${data.user.name}! Redirecting...`);

  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
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
          <Image src="/icon.png" alt="Assignly Logo" width={54} height={54} priority unoptimized />
          <span
            className="text-sm font-medium px-6 py-2 rounded-full"
            style={{ background: "#1a1a1a", color: "#f9f8f6", letterSpacing: "0.1em" }}
          >
            Login
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

        <form onSubmit={handleLogin} noValidate className="flex flex-col gap-3">
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

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
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
            <button 
              type="button" 
              onClick={() => setShowPassword((prev)=> !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{color:"#aaa"}}
              aria-label={showPassword? "Hide password" : "Show password"}
              >
                {showPassword ? ( //ini bagian mata di silang
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : ( //ini bagian mata buka
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )
                }

            </button>

          </div>

          <div className="flex justify-end -mt-1">
            <Link href="/forgot-password" className="text-xs" style={{ color: "#888" }}>
              Forgot?
            </Link>
          </div>

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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-xs mt-5" style={{ color: "#888" }}>
          No Account?{" "}
          <Link
            href="/register"
            className="font-medium underline underline-offset-2"
            style={{ color: "#1a1a1a" }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
