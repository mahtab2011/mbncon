"use client";

import Link from "next/link";

const demoStyles = [
  {
    icon: "👕",
    title: "Basic T-Shirt",
    description: "Knitwear pilot style for simple polygon nesting.",
  },
  {
    icon: "👔",
    title: "Formal Shirt",
    description: "Woven style with sleeves, collar, cuff and pocket.",
  },
  {
    icon: "👖",
    title: "Trouser",
    description: "Woven bottom style for larger marker pieces.",
  },
];

export default function OptiFabricDemoPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 shadow-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">
            Experience OptiFabric AI
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight">
            Can AI Reduce Your Fabric Consumption?
          </h1>

          <p className="mt-5 max-w-3xl text-xl text-slate-300">
            Watch the AI Digital Cutting Master compare a manual marker with an
            optimized polygon nesting layout and estimate real fabric savings.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/optifabric/demo/style"
              className="rounded-xl bg-cyan-400 px-7 py-4 text-lg font-black text-slate-950 hover:bg-cyan-300"
            >
              ▶ Start AI Demonstration
            </Link>

            <Link
              href="/optifabric/pilot-dashboard"
              className="rounded-xl border border-slate-500 px-7 py-4 text-lg font-bold text-white hover:bg-slate-800"
            >
              View Pilot Modules
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {demoStyles.map((style) => (
            <div
              key={style.title}
              className="rounded-2xl bg-slate-900 p-6 shadow"
            >
              <div className="text-5xl">{style.icon}</div>

              <h2 className="mt-4 text-2xl font-bold">{style.title}</h2>

              <p className="mt-3 text-slate-300">{style.description}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">What AI Will Demonstrate</h2>

            <ul className="mt-5 space-y-3 text-lg text-slate-300">
              <li>✔ Pattern piece recognition</li>
              <li>✔ Polygon nesting on solid fabric lay</li>
              <li>✔ Manual vs AI marker comparison</li>
              <li>✔ Marker efficiency improvement</li>
              <li>✔ Estimated fabric and cost savings</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-blue-950 p-6">
            <h2 className="text-2xl font-bold">2-Minute Factory Experience</h2>

            <p className="mt-4 text-lg text-blue-100">
              This demonstration is designed for factory owners, cutting
              masters, IE teams and production managers. No login is required.
              The customer sees the value before deciding to use the product.
            </p>

            <Link
              href="/optifabric/demo/style"
              className="mt-6 inline-block rounded-xl bg-white px-7 py-4 text-lg font-black text-blue-950"
            >
              Start Demonstration →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}