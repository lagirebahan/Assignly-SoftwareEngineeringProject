"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirm) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!email) {
      setError("Invalid request. Missing email.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message);
        return;
      }

      // success
      setSuccess("Password reset successful! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch {
      setLoading(false);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-200">
      <div className="bg-white p-10 rounded-2xl w-full max-w-sm shadow-lg text-gray-800">
        
        <h2 className="text-xl font-semibold mb-6 text-center">
          Reset Password
        </h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-600 mb-4">{success}</div>}

        {!success && (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New password"
              className="border p-3 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm password"
              className="border p-3 rounded-lg"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white py-3 rounded-lg"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        {success && (
          <button
            onClick={() => router.push("/login")}
            className="w-full mt-4 border py-3 rounded-lg"
          >
            Go to Login
          </button>
        )}

      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-6 bg-gray-200 text-gray-800">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}