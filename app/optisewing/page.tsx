// Public informational product page for OptiSewing. This is MBNCON's public
// marketing home for OptiSewing — it does NOT host, duplicate, or migrate
// the actual OptiSewing application, which is a separate codebase. There is
// deliberately no signup/login/production-workspace CTA here, since no such
// functionality exists in this repository; enquiries route to MBNCON's
// existing /contact page.
import type { Metadata } from "next";
import Link from "next/link";

import ProductPlans from "@/components/software/ProductPlans";

export const metadata: Metadata = {
  title: "OptiSewing | Garment Manufacturing Productivity | MBNCON",
  description:
    "OptiSewing supports garment manufacturers with work measurement, line balancing, production analysis and continuous-improvement tools.",
};

type Capability = {
  title: string;
  titleBangla: string;
  description: string;
  descriptionBangla: string;
};

const capabilities: Capability[] = [
  {
    title: "Work Measurement",
    titleBangla: "ওয়ার্ক মেজারমেন্ট",
    description:
      "Standard time and method data supporting realistic line planning and target setting.",
    descriptionBangla:
      "Standard time ও method data যা realistic line planning এবং target setting-কে সহায়তা করে।",
  },
  {
    title: "Method Study",
    titleBangla: "মেথড স্টাডি",
    description:
      "Structured review of current working methods to help identify practical, evidence-based improvement opportunities.",
    descriptionBangla:
      "বর্তমান working method-এর structured review, যা practical ও evidence-based improvement opportunity চিহ্নিত করতে সহায়তা করে।",
  },
  {
    title: "Line Balancing",
    titleBangla: "লাইন ব্যালেন্সিং",
    description:
      "Operation allocation support to help reduce bottlenecks and improve production line flow.",
    descriptionBangla:
      "Bottleneck কমাতে এবং production line flow উন্নত করতে operation allocation-এ সহায়তা।",
  },
  {
    title: "Production Performance",
    titleBangla: "প্রোডাকশন পারফরম্যান্স",
    description:
      "Structured visibility into production performance to support informed operational decisions.",
    descriptionBangla:
      "Informed operational decision-এর জন্য production performance-এর structured visibility।",
  },
  {
    title: "Gemba",
    titleBangla: "গেম্বা",
    description:
      "Structured floor-level observation practices to support fact-based problem understanding.",
    descriptionBangla:
      "Fact-based problem understanding-কে সহায়তা করতে structured floor-level observation practice।",
  },
  {
    title: "Value Stream Mapping",
    titleBangla: "ভ্যালু স্ট্রিম ম্যাপিং",
    description:
      "Visual mapping of process flow to help identify waste and improvement opportunities.",
    descriptionBangla:
      "Waste ও improvement opportunity চিহ্নিত করতে সহায়তা করে এমন process flow-এর visual mapping।",
  },
  {
    title: "Root Cause Analysis",
    titleBangla: "রুট কজ অ্যানালাইসিস",
    description:
      "A structured investigation approach supporting identification of the underlying causes of operational issues.",
    descriptionBangla:
      "Operational issue-এর underlying cause চিহ্নিতকরণে সহায়ক structured investigation approach।",
  },
  {
    title: "Kaizen",
    titleBangla: "কাইজেন",
    description:
      "Continuous, incremental improvement practices supporting a structured improvement culture.",
    descriptionBangla:
      "Structured improvement culture-কে সহায়তাকারী continuous, incremental improvement practice।",
  },
  {
    title: "Leadership and Continuous Improvement",
    titleBangla: "লিডারশিপ ও কন্টিনিউয়াস ইমপ্রুভমেন্ট",
    description:
      "Practical support for building leadership capability alongside a sustained continuous-improvement mindset.",
    descriptionBangla:
      "Sustained continuous-improvement mindset-এর পাশাপাশি leadership capability গড়ে তোলার practical সহায়তা।",
  },
];

export default function OptiSewingHomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-gradient-to-r from-violet-950 via-slate-950 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-violet-300">
              MBNCON Manufacturing Solutions
            </span>

            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
              Garment Production Intelligence
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            OptiSewing
          </h1>

          <h2 className="mt-3 text-2xl font-black text-violet-300 sm:text-3xl">
            Garment Manufacturing Productivity &amp; Continuous Improvement
          </h2>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300 sm:text-xl">
            MBNCON&apos;s garment-manufacturing productivity and
            continuous-improvement solution — supporting work measurement,
            line balancing, production analysis and structured improvement
            for sewing floors and production lines.
          </p>

          <p className="mt-3 max-w-4xl leading-8 text-slate-400">
            গার্মেন্টস প্রস্তুতকারকদের জন্য MBNCON-এর manufacturing productivity ও
            continuous-improvement সমাধান — sewing floor ও production line-এর
            জন্য work measurement, line balancing, production analysis এবং
            structured improvement-কে সহায়তা করে।
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Link
              href="/contact"
              className="rounded-2xl bg-violet-600 px-6 py-4 text-center font-black text-white transition hover:bg-violet-500"
            >
              Contact MBNCON About OptiSewing
            </Link>

            <Link
              href="#plans"
              className="rounded-2xl border border-slate-600 bg-slate-900 px-6 py-4 text-center font-bold text-white transition hover:border-violet-400 hover:text-violet-300"
            >
              View Plans
            </Link>

            <Link
              href="/optifabric"
              className="rounded-2xl border border-slate-600 bg-slate-900 px-6 py-4 text-center font-bold text-white transition hover:border-emerald-400 hover:text-emerald-300"
            >
              Explore OptiFabric
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <section>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400">
              Capabilities
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              What OptiSewing Supports
            </h2>

            <p className="mt-2 text-xl font-bold text-cyan-300">
              OptiSewing যা সহায়তা করে
            </p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <article
                key={capability.title}
                className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/10"
              >
                <h3 className="text-xl font-black text-white">
                  {capability.title}
                </h3>

                <p className="mt-2 font-bold text-cyan-300">
                  {capability.titleBangla}
                </p>

                <p className="mt-5 leading-7 text-slate-300">
                  {capability.description}
                </p>

                <p className="mt-3 leading-7 text-slate-400">
                  {capability.descriptionBangla}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div id="plans">
          <ProductPlans />
        </div>

        <section className="mt-14 rounded-3xl border border-amber-400/30 bg-amber-950/20 p-7">
          <h2 className="text-2xl font-black text-amber-300">
            Informational Overview
          </h2>

          <h3 className="mt-2 text-xl font-bold text-white">
            তথ্যগত ওভারভিউ
          </h3>

          <p className="mt-5 leading-8 text-slate-300">
            This page describes OptiSewing&apos;s capabilities at a general
            level for prospective factories and partners. It does not
            represent guaranteed productivity improvements, cost savings or
            return on investment — actual outcomes depend on each factory&apos;s
            own operations and implementation.
          </p>

          <p className="mt-4 leading-8 text-slate-400">
            এই পৃষ্ঠাটি সম্ভাব্য কারখানা ও পার্টনারদের জন্য OptiSewing-এর সক্ষমতা
            সাধারণভাবে বর্ণনা করে। এটি কোনো নিশ্চিত productivity improvement, cost
            saving বা return on investment প্রতিনিধিত্ব করে না — actual outcome
            প্রতিটি কারখানার নিজস্ব operation ও implementation-এর উপর নির্ভর করে।
          </p>
        </section>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black text-white">OptiSewing</p>

            <p className="mt-1">
              Garment Manufacturing Productivity &amp; Continuous Improvement
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            <Link href="/optifabric" className="transition hover:text-cyan-300">
              OptiFabric
            </Link>

            <Link href="/contact" className="transition hover:text-cyan-300">
              Contact
            </Link>
          </div>

          <p>© 2026 MBNCON</p>
        </div>
      </footer>
    </main>
  );
}
