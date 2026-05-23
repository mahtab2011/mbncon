"use client";

import Link from "next/link";

const blogPosts = [
  {
    title: "AI Transformation in Manufacturing",
    category: "Manufacturing",
    description:
      "How AI intelligence can reduce production loss, improve efficiency and strengthen executive decision-making.",
    href: "/software/executive-dashboard",
  },
  {
    title: "AI in Banking & Insurance",
    category: "Financial Services",
    description:
      "Using AI to reduce service delay, fraud risk and operational inefficiency in banks and insurance companies.",
    href: "/software/ai-banking-insurance-intelligence",
  },
  {
    title: "AI Retail Intelligence",
    category: "Retail",
    description:
      "How retail businesses can improve inventory visibility, customer experience and profitability using AI.",
    href: "/software/ai-retail-intelligence",
  },
  {
    title: "AI Restaurant Intelligence",
    category: "Restaurant",
    description:
      "Improving kitchen flow, table turnover, menu profitability and customer satisfaction through AI intelligence.",
    href: "/software/ai-restaurant-intelligence",
  },
  {
    title: "AI Residential Hotel Intelligence",
    category: "Hospitality",
    description:
      "How hotels can improve occupancy, housekeeping productivity and guest experience with AI systems.",
    href: "/software/ai-residential-hotel-intelligence",
  },
  {
    title: "AI Catering Company Intelligence",
    category: "Catering",
    description:
      "Improving catering operations, event planning, food costing and delivery management using AI intelligence.",
    href: "/software/ai-catering-company-intelligence",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            MBNCON Blog
          </p>

          <h1 className="mt-4 text-5xl font-bold leading-tight">
            AI Transformation Insights & Industry Intelligence
          </h1>

          <p className="mt-6 text-lg text-slate-300">
            Explore AI transformation strategies, operational intelligence,
            executive decision systems, Lean improvement and industry-focused
            AI intelligence modules developed by MBNCON.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {blogPosts.map((post) => (
            <Link
              key={post.title}
              href={post.href}
              className="group rounded-3xl border border-white/10 bg-slate-900 p-8 transition hover:border-cyan-400/40 hover:bg-slate-900/80"
            >
              <p className="text-sm font-semibold text-cyan-300">
                {post.category}
              </p>

              <h2 className="mt-3 text-2xl font-bold transition group-hover:text-cyan-300">
                {post.title}
              </h2>

              <p className="mt-4 text-slate-300">
                {post.description}
              </p>

              <div className="mt-6 inline-flex items-center text-sm font-semibold text-cyan-300">
                Read More →
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-16 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-10">
          <h2 className="text-3xl font-bold">
            MBNCON AI Transformation Division
          </h2>

          <p className="mt-4 max-w-4xl text-slate-200">
            We help organizations improve operational visibility, reduce losses,
            strengthen leadership decisions and accelerate digital transformation
            through AI-powered intelligence systems.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Contact MBNCON
            </Link>

            <Link
              href="/software"
              className="rounded-2xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Explore Software Modules
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}