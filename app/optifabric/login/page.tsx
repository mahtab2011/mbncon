"use client";

// Sign-in for OptiFabric — every page that calls the new auth/subscription
// backend needs a Bearer token, so this is required for any of them to work.
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, setStoredToken } from "../../../lib/optifabric/apiClient";

interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

export default function OptiFabricLoginPage() {
  const router = useRouter();
  const [factoryId, setFactoryId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const result = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ factoryId, email, password }),
      });
      setStoredToken(result.accessToken);
      router.push("/optifabric/project");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-gradient-to-r from-emerald-950 via-slate-950 to-slate-950">
        <div className="mx-auto max-w-xl px-6 py-14">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Sign In</h1>
          <h2 className="mt-2 text-2xl font-bold text-emerald-300">সাইন ইন করুন</h2>
        </div>
      </section>

      <section className="mx-auto max-w-xl px-6 py-10">
        <form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-slate-300">Factory ID</span>
            <input
              value={factoryId}
              onChange={(e) => setFactoryId(e.target.value)}
              required
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-slate-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-slate-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />
          </label>

          <button
            type="submit"
            className="mt-2 rounded-2xl bg-red-600 px-6 py-4 text-center font-black text-white transition hover:bg-red-500"
          >
            Sign In
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-red-300">{error}</p>
        )}

        <p className="mt-6 text-slate-400">
          New factory?{" "}
          <Link href="/optifabric/signup" className="font-bold text-emerald-300 hover:underline">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
