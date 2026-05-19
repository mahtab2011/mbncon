"use client";

import DashboardShell from "@/components/software/DashboardShell";
import { getBnTheory } from "@/lib/software/bnTheory";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const manualSections = [
  {
    id: "introduction",
    title: "1. Introduction | ভূমিকা",
    content: [
      "MBNCON Manufacturing Intelligence Platform is an integrated enterprise operational intelligence system for manufacturing, sourcing, logistics, compliance, profitability improvement, Lean operations and executive decision-making.",
      getBnTheory("platformPurpose"),
    ],
  },

  {
    id: "navigation",
    title: "2. Platform Navigation Guide | প্ল্যাটফর্ম নেভিগেশন গাইড",
    content: [
      "Use Executive Intelligence for director-level review, Factory Operations for daily entry, Quality/Lean for improvement work, Supply Chain for shipment and logistics, AI Risk for escalation and profitability, and Governance for evidence and access control.",
      getBnTheory("executiveVisibility"),
    ],
  },

  {
    id: "production",
    title: "3. Daily Production Procedure | দৈনিক প্রোডাকশন পদ্ধতি",
    moduleHref: "/software/production-entry",
    moduleLabel: "Open Production Module",
    content: [
      "Open Production Entry, enter production quantity, output value, line efficiency and comments, then submit the record and review the dashboard.",
      getBnTheory("productionGuidance"),
    ],
  },

  {
    id: "workforce",
    title: "4. Workforce Procedure | ওয়ার্কফোর্স পদ্ধতি",
    moduleHref: "/software/workforce-entry",
    moduleLabel: "Open Workforce Module",
    content: [
      "Record attendance, absenteeism, overtime and manpower allocation daily.",
      getBnTheory("workforceGuidance"),
    ],
  },

  {
    id: "maintenance",
    title: "5. Maintenance Procedure | মেইনটেন্যান্স পদ্ধতি",
    moduleHref: "/software/maintenance-entry",
    moduleLabel: "Open Maintenance Module",
    content: [
      "Record machine breakdowns, repair hours, spare usage, downtime and preventive actions.",
      getBnTheory("maintenanceGuidance"),
    ],
  },

  {
    id: "utilities",
    title: "6. Utilities & Energy Procedure | ইউটিলিটি ও এনার্জি পদ্ধতি",
    moduleHref: "/software/utilities-entry",
    moduleLabel: "Open Utilities Module",
    content: [
      "Track electricity cost, generator fuel consumption, abnormal utility usage and energy cost pressure.",
      getBnTheory("utilitiesGuidance"),
    ],
  },

  {
    id: "wastage",
    title: "7. Wastage & Rejection Procedure | ওয়েস্টেজ ও রিজেকশন পদ্ধতি",
    content: [
      "Record wastage, rejection and rework with reasons, department ownership and corrective actions.",
      getBnTheory("wastageGuidance"),
    ],
  },

  {
    id: "cashflow",
    title: "8. Cashflow Risk Procedure | ক্যাশফ্লো রিস্ক পদ্ধতি",
    moduleHref: "/software/ai-cashflow-risk-intelligence",
    moduleLabel: "Open Cashflow Risk Module",
    content: [
      "Review delayed payments, export delays, utility pressure, repair costs and wastage costs to understand working capital risk.",
      getBnTheory("cashflowGuidance"),
    ],
  },

  {
    id: "evidence",
    title: "9. Document & Evidence Control | ডকুমেন্ট ও এভিডেন্স কন্ট্রোল",
    moduleHref: "/software/ai-document-evidence-control-centre",
    moduleLabel: "Open Evidence Control Module",
    content: [
      "Maintain evidence for risks, defects, delays, breakdowns, corrective actions, buyer communication and audit readiness.",
      getBnTheory("evidenceGuidance"),
    ],
  },

  {
    id: "governance",
    title: "10. Governance Rules | গভর্ন্যান্স নিয়ম",
    content: [
      "Only authorised users should access modules. Audit evidence, shipment proof, corrective action owners and weekly risk reviews must be maintained.",
      getBnTheory("governanceGuidance"),
    ],
  },

  {
    id: "ai-escalation",
    title: "11. AI Escalation System | AI এস্কেলেশন সিস্টেম",
    moduleHref: "/software/ai-notification-escalation-centre",
    moduleLabel: "Open AI Escalation Module",
    content: [
      "Low means routine monitoring, Medium means department review, High means management escalation, and Critical means immediate director-level escalation.",
      "Low মানে routine monitoring, Medium মানে department review, High মানে management escalation, আর Critical মানে immediate director-level escalation.",
    ],
  },

  {
    id: "executive-review",
    title: "12. Executive Review Procedure | এক্সিকিউটিভ রিভিউ পদ্ধতি",
    content: [
      "Management should review production, shipment, quality, wastage, maintenance, utilities, cashflow, risk escalation and corrective actions every week.",
      "Management প্রতি সপ্তাহে production, shipment, quality, wastage, maintenance, utilities, cashflow, risk escalation এবং corrective actions review করবে।",
    ],
  },

  {
    id: "launch-readiness",
    title: "13. Launch Readiness Checklist | লঞ্চ রেডিনেস চেকলিস্ট",
    content: [
      "Before deployment, verify routes, imports, Firestore collections, role permissions, sidebar navigation, mobile responsiveness, bilingual support, Vercel deployment and environment variables.",
      "Deployment এর আগে routes, imports, Firestore collections, role permissions, sidebar navigation, mobile responsiveness, bilingual support, Vercel deployment এবং environment variables verify করুন।",
    ],
  },

  {
    id: "report-generator",
    title:
      "14. Operational Philosophy & Report Generator | অপারেশনাল দর্শন ও রিপোর্ট জেনারেটর",
    content: [
      "MBNCON is not only software. It is an operational excellence framework combining Lean, Kaizen, TQM, data-driven decision-making, AI-guided intelligence, executive governance and enterprise reporting.",
      "MBNCON শুধু software নয়। এটি Lean, Kaizen, TQM, data-driven decision-making, AI-guided intelligence, executive governance এবং enterprise reporting সমন্বিত operational excellence framework.",
    ],
  },
];

const guidanceLinks = [
  ["Production Entry Guide", "#production"],
  ["Workforce Entry Guide", "#workforce"],
  ["Maintenance Guide", "#maintenance"],
  ["Utilities Guide", "#utilities"],
  ["Wastage & Rejection Guide", "#wastage"],
  ["Cashflow Risk Guide", "#cashflow"],
  ["Evidence Control Guide", "#evidence"],
  ["Governance Guide", "#governance"],
  ["AI Escalation Guide", "#ai-escalation"],
  ["Report Generator Guide", "#report-generator"],
];

const kpiCards = [
  {
    title: "Manual Coverage",
    value: "14",
    description:
      "Covers platform navigation, daily entries, governance, AI escalation, and launch readiness.",
    target: "manual-sections",
    className: "border-cyan-200 bg-cyan-50 text-cyan-950",
  },
  {
    title: "Guides Ready",
    value: "10",
    description:
      "Clickable guidance cards help users jump quickly to operational procedures.",
    target: "module-guides",
    className: "border-emerald-200 bg-emerald-50 text-emerald-950",
  },
  {
    title: "Bilingual Support",
    value: "EN + BN",
    description:
      "English and Bangla guidance supports supervisors, managers, directors, and novice users.",
    target: "intelligence-layer",
    className: "border-blue-200 bg-blue-50 text-blue-950",
  },
  {
    title: "Launch Readiness",
    value: "Checklist",
    description:
      "Deployment, route, Firestore, role, mobile, bilingual, and Vercel checks are included.",
    target: "launch-readiness",
    className: "border-orange-200 bg-orange-50 text-orange-950",
  },
];

export default function TrainingManualPage() {
  return (
    <DashboardShell
      title="How to Use This Productivity Model | এই প্রোডাক্টিভিটি মডেল কীভাবে ব্যবহার করবেন"
      subtitle="Step-by-step English & Bangla operational guide for 110+ enterprise intelligence modules."
    >
      <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
        <div className="mx-auto max-w-7xl space-y-8">
          <section
            id="top"
            className="scroll-mt-32 rounded-3xl bg-slate-950 p-8 text-white shadow-2xl sm:p-10"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              MBNCON Enterprise Training Manual
            </p>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">
              How to Use This Productivity Model
            </h1>

            <p className="mt-5 max-w-5xl text-base leading-8 text-slate-300 sm:text-lg">
              A practical step-by-step guide so a novice user, supervisor,
              manager or director can understand and operate the MBNCON
              Manufacturing Intelligence Platform.
            </p>

            <p className="mt-6 max-w-5xl text-base leading-8 text-cyan-100 sm:text-lg">
              {getBnTheory("platformPurpose")}
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {kpiCards.map((card) => {
              const targetId = slugify(card.target);

              return (
                <a
                  key={card.title}
                  href={`#${targetId}`}
                  className={`rounded-3xl border p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${card.className}`}
                >
                  <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
                    {card.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-extrabold">
                    {card.value}
                  </h2>

                  <p className="mt-4 leading-7">{card.description}</p>

                  <p className="mt-5 text-sm font-bold opacity-70">
                    View section →
                  </p>
                </a>
              );
            })}
          </section>

          <section
            id="manual-sections"
            className="scroll-mt-28 grid gap-6"
          >
            {manualSections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-32 rounded-3xl border border-neutral-200 bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8"
              >
                <h2 className="text-2xl font-bold text-neutral-950">
                  {section.title}
                </h2>

                <div className="mt-5 space-y-4">
                  {section.content.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-base leading-relaxed text-neutral-700"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {"moduleHref" in section ? (
                    <a
                      href={section.moduleHref}
                      className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition duration-300 hover:bg-cyan-100 hover:shadow-md"
                    >
                      {section.moduleLabel || "Open Related Module"} →
                    </a>
                  ) : null}

                  <a
                    href="#top"
                    className="text-sm font-semibold text-cyan-700 transition duration-300 hover:text-cyan-900"
                  >
                    Back to top ↑
                  </a>
                </div>
              </section>
            ))}
          </section>

          <section
            id="module-guides"
            className="scroll-mt-28 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-md transition duration-300 hover:shadow-xl sm:p-8"
          >
            <h2 className="text-2xl font-bold text-emerald-950 sm:text-3xl">
              Module-by-Module Guides | মডিউলভিত্তিক গাইড
            </h2>

            <p className="mt-4 text-neutral-700">
              Click a guide card to jump to the relevant section inside this
              training manual.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {guidanceLinks.map(([item, href]) => (
                <a
                  key={item}
                  href={href}
                  className="rounded-2xl border border-emerald-200 bg-white p-4 text-sm font-medium text-neutral-800 transition duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:bg-emerald-100 hover:shadow-lg"
                >
                  {item} →
                </a>
              ))}
            </div>
          </section>

          <section
            id="intelligence-layer"
            className="scroll-mt-28 rounded-3xl bg-slate-950 p-8 text-white shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Enterprise Training Intelligence Layer
            </p>

            <h2 className="mt-3 text-3xl font-extrabold">
              Bilingual Operational Guidance for Factory Teams
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This manual supports directors, managers, supervisors, quality
              teams, maintenance teams, production teams, finance users,
              commercial teams, and novice users with practical English and
              Bangla guidance for operating the MBNCON enterprise manufacturing
              intelligence platform.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Novice-user operational guidance",
                "Director-level review structure",
                "Launch-readiness checklist support",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Enterprise-safe guidance prepared for training,
                    onboarding, consultancy delivery, and platform adoption.
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}