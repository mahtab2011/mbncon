"use client";

// Self-service registration for OptiFabric — mirrors OptiSewing's signup flow.
// Creates a factory (if the Factory Code is new) or joins an existing one. The
// founding user of a new factory becomes its administrator automatically.
// Whether the factory ends up free (Bangladesh, 3 seats) or on the 90-day
// trial (everywhere else) is decided automatically from the Country field.
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, setStoredToken } from "../../../lib/optifabric/apiClient";

type SignUpResponse =
  | { status: "ACTIVE"; accessToken: string; tokenType: string; factoryId: string; isFoundingAdmin: boolean }
  | { status: "PENDING_APPROVAL"; factoryId: string; userId: string; isFoundingAdmin: false; message: string };

export default function OptiFabricSignUpPage() {
  const router = useRouter();
  const [factoryCode, setFactoryCode] = useState("");
  const [factoryName, setFactoryName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SignUpResponse | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const created = await apiFetch<SignUpResponse>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ factoryCode, factoryName, country, city, email, password }),
      });
      setResult(created);
      if (created.status === "ACTIVE") {
        setStoredToken(created.accessToken);
        setTimeout(() => router.push("/optifabric/project"), 1500);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-gradient-to-r from-emerald-950 via-slate-950 to-slate-950">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Sign Up</h1>
          <h2 className="mt-2 text-2xl font-bold text-emerald-300">সাইন আপ করুন</h2>

          <p className="mt-6 leading-7 text-slate-300">
            Every user of OptiFabric must have an account. If your factory hasn&apos;t signed up yet, this
            creates it and makes you its first administrator. If your factory already has an account, use
            the same Factory Code to join it.
          </p>
          <p className="mt-3 leading-7 text-slate-400">
            OptiFabric-এর প্রতিটি ব্যবহারকারীর একটি অ্যাকাউন্ট থাকতে হবে। আপনার কারখানা এখনো সাইন আপ না করে
            থাকলে, এটি সেই কারখানা তৈরি করবে এবং আপনাকে এর প্রথম প্রশাসক করবে। কারখানার অ্যাকাউন্ট আগে থেকেই
            থাকলে, একই Factory Code ব্যবহার করে যোগ দিন।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-10">
        <form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-slate-300">
              Factory Code (shared by everyone at your factory)
            </span>
            <input
              value={factoryCode}
              onChange={(e) => setFactoryCode(e.target.value)}
              required
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-slate-300">Factory Name (only needed the first time)</span>
            <input
              value={factoryName}
              onChange={(e) => setFactoryName(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-slate-300">
              Country (only needed the first time — determines free/paid pricing)
            </span>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Bangladesh"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-slate-300">City (only needed the first time)</span>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
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
            <span className="text-sm font-bold text-slate-300">Password (at least 8 characters)</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />
          </label>

          <button
            type="submit"
            className="mt-2 rounded-2xl bg-red-600 px-6 py-4 text-center font-black text-white transition hover:bg-red-500"
          >
            Sign Up
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-red-300">{error}</p>
        )}
        {result && result.status === "ACTIVE" && (
          <p className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 text-emerald-300">
            Signed up{result.isFoundingAdmin ? " as the factory's first administrator" : ""}. Redirecting…
          </p>
        )}
        {result && result.status === "PENDING_APPROVAL" && (
          <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-950/20 p-4 text-amber-300">
            <p className="font-bold">Account created — awaiting approval.</p>
            <p className="mt-2">{result.message}</p>
            <p className="mt-2 font-bold">অ্যাকাউন্ট তৈরি হয়েছে — অনুমোদনের অপেক্ষায়।</p>
            <p className="mt-1 text-amber-200/80">
              এই কারখানা তার ফ্রি/ট্রায়াল সিট সীমায় পৌঁছেছে। একজন OptiFabric প্রতিনিধি পর্যালোচনা করে
              পেমেন্ট নিশ্চিত করার পর আপনার অ্যাকাউন্ট সক্রিয় করবেন।
            </p>
          </div>
        )}

        <p className="mt-6 text-slate-400">
          Already have an account?{" "}
          <Link href="/optifabric/login" className="font-bold text-emerald-300 hover:underline">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
