"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Incorrect password. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-full bg-slate-text items-center justify-center mb-4">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-text">Admin Access</h1>
          <p className="text-muted text-sm mt-1">Ian Ocampo · Portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="admin-label">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-muted mt-6">
          <Link href="/" className="hover:text-navy transition-colors">← Back to site</Link>
        </p>
      </div>
    </div>
  );
}
