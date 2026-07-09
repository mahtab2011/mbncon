"use client";

import Link from "next/link";

const styles = [
  {
    icon: "👕",
    name: "Basic T-Shirt",
    type: "Knitwear",
    efficiency: "82% → 86%",
    href: "/optifabric/demo/pattern?style=tshirt",
  },
  {
    icon: "👔",
    name: "Formal Shirt",
    type: "Woven",
    efficiency: "81% → 86.5%",
    href: "/optifabric/demo/pattern?style=shirt",
  },
  {
    icon: "👖",
    name: "Trouser",
    type: "Woven Bottom",
    efficiency: "80% → 85%",
    href: "/optifabric/demo/pattern?style=trouser",
  },
];

export default function DemoStylePage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/optifabric/demo" className="text-cyan-300">
          ← Back
        </Link>

        <h1 className="mt-6 text-4xl font-black">
          Choose a Demo Style
        </h1>

        <p className="mt-3 max-w-3xl text-slate-300">
          Select one sample garment. OptiFabric AI will demonstrate manual
          marker layout, AI polygon nesting, and estimated savings.
        </p>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {styles.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-3xl bg-slate-900 p-6 shadow hover:bg-slate-800"
            >
              <div className="text-6xl">{item.icon}</div>

              <h2 className="mt-5 text-2xl font-bold">{item.name}</h2>

              <p className="mt-2 text-slate-400">{item.type}</p>

              <div className="mt-6 rounded-xl bg-blue-950 p-4">
                <p className="text-sm text-blue-300">
                  Expected Marker Efficiency
                </p>
                <p className="mt-1 text-2xl font-black">
                  {item.efficiency}
                </p>
              </div>

              <p className="mt-6 font-bold text-cyan-300">
                Start this demo →
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}