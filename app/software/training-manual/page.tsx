"use client";

import DashboardShell from "@/components/software/DashboardShell";
import { getBnTheory } from "@/lib/software/bnTheory";

const manualSections = [
  {
    title: "1. Introduction | ভূমিকা",
    content: [
      "MBNCON Manufacturing Intelligence Platform is an integrated enterprise operational intelligence system for manufacturing, sourcing, logistics, compliance, profitability improvement, Lean operations and executive decision-making.",
      getBnTheory("platformPurpose"),
    ],
  },
  {
    title: "2. Platform Navigation Guide | প্ল্যাটফর্ম নেভিগেশন গাইড",
    content: [
      "Use Executive Intelligence for director-level review, Factory Operations for daily entry, Quality/Lean for improvement work, Supply Chain for shipment and logistics, AI Risk for escalation and profitability, and Governance for evidence and access control.",
      getBnTheory("executiveVisibility"),
    ],
  },
  {
    title: "3. Daily Production Procedure | দৈনিক প্রোডাকশন পদ্ধতি",
    content: [
      "Open Production Entry, enter production quantity, output value, line efficiency and comments, then submit the record and review the dashboard.",
      getBnTheory("productionGuidance"),
    ],
  },
  {
    title: "4. Workforce Procedure | ওয়ার্কফোর্স পদ্ধতি",
    content: [
      "Record attendance, absenteeism, overtime and manpower allocation daily.",
      getBnTheory("workforceGuidance"),
    ],
  },
  {
    title: "5. Maintenance Procedure | মেইনটেন্যান্স পদ্ধতি",
    content: [
      "Record machine breakdowns, repair hours, spare usage, downtime and preventive actions.",
      getBnTheory("maintenanceGuidance"),
    ],
  },
  {
    title: "6. Utilities & Energy Procedure | ইউটিলিটি ও এনার্জি পদ্ধতি",
    content: [
      "Track electricity cost, generator fuel consumption, abnormal utility usage and energy cost pressure.",
      getBnTheory("utilitiesGuidance"),
    ],
  },
  {
    title: "7. Wastage & Rejection Procedure | ওয়েস্টেজ ও রিজেকশন পদ্ধতি",
    content: [
      "Record wastage, rejection and rework with reasons, department ownership and corrective actions.",
      getBnTheory("wastageGuidance"),
    ],
  },
  {
    title: "8. Cashflow Risk Procedure | ক্যাশফ্লো রিস্ক পদ্ধতি",
    content: [
      "Review delayed payments, export delays, utility pressure, repair costs and wastage costs to understand working capital risk.",
      getBnTheory("cashflowGuidance"),
    ],
  },
  {
    title: "9. Document & Evidence Control | ডকুমেন্ট ও এভিডেন্স কন্ট্রোল",
    content: [
      "Maintain evidence for risks, defects, delays, breakdowns, corrective actions, buyer communication and audit readiness.",
      getBnTheory("evidenceGuidance"),
    ],
  },
  {
    title: "10. Governance Rules | গভর্ন্যান্স নিয়ম",
    content: [
      "Only authorised users should access modules. Audit evidence, shipment proof, corrective action owners and weekly risk reviews must be maintained.",
      getBnTheory("governanceGuidance"),
    ],
  },
  {
    title: "11. AI Escalation System | AI এস্কেলেশন সিস্টেম",
    content: [
      "Low means routine monitoring, Medium means department review, High means management escalation, and Critical means immediate director-level escalation.",
      "Low মানে routine monitoring, Medium মানে department review, High মানে management escalation, আর Critical মানে immediate director-level escalation.",
    ],
  },
  {
    title: "12. Executive Review Procedure | এক্সিকিউটিভ রিভিউ পদ্ধতি",
    content: [
      "Management should review production, shipment, quality, wastage, maintenance, utilities, cashflow, risk escalation and corrective actions every week.",
      "Management প্রতি সপ্তাহে production, shipment, quality, wastage, maintenance, utilities, cashflow, risk escalation এবং corrective actions review করবে।",
    ],
  },
  {
    title: "13. Launch Readiness Checklist | লঞ্চ রেডিনেস চেকলিস্ট",
    content: [
      "Before deployment, verify routes, imports, Firestore collections, role permissions, sidebar navigation, mobile responsiveness, bilingual support, Vercel deployment and environment variables.",
      "Deployment এর আগে routes, imports, Firestore collections, role permissions, sidebar navigation, mobile responsiveness, bilingual support, Vercel deployment এবং environment variables verify করুন।",
    ],
  },
  {
    title: "14. Operational Philosophy | অপারেশনাল দর্শন",
    content: [
      "MBNCON is not only software. It is an operational excellence framework combining Lean, Kaizen, TQM, data-driven decision-making, AI-guided intelligence and executive governance.",
      "MBNCON শুধু software নয়। এটি Lean, Kaizen, TQM, data-driven decision-making, AI-guided intelligence এবং executive governance সমন্বিত operational excellence framework.",
    ],
  },
];

const guidanceLinks = [
  ["Production Entry Guide", "/software/training-manual"],
  ["Workforce Entry Guide", "/software/training-manual"],
  ["Maintenance Guide", "/software/training-manual"],
  ["Utilities Guide", "/software/training-manual"],
  ["Wastage & Rejection Guide", "/software/training-manual"],
  ["Cashflow Risk Guide", "/software/training-manual"],
  ["Evidence Control Guide", "/software/training-manual"],
  ["Governance Guide", "/software/training-manual"],
  ["AI Escalation Guide", "/software/training-manual"],
  ["Report Generator Guide", "/software/training-manual"],
];

export default function TrainingManualPage() {
  return (
    <DashboardShell
      title="How to Use This Productivity Model | এই প্রোডাক্টিভিটি মডেল কীভাবে ব্যবহার করবেন"
      subtitle="Step-by-step English & Bangla operational guide for 110+ enterprise intelligence modules."
    >
      <main className="space-y-8">
        <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-8">
          <h1 className="text-4xl font-bold text-cyan-950">
            How to Use This Productivity Model
          </h1>

          <p className="mt-4 text-lg text-cyan-900">
            A practical step-by-step guide so a novice user, supervisor,
            manager or director can understand and operate the MBNCON
            Manufacturing Intelligence Platform.
          </p>

          <p className="mt-6 text-lg text-cyan-900">
            {getBnTheory("platformPurpose")}
          </p>
        </section>

        <section className="grid gap-6">
          {manualSections.map((section) => (
            <div
              key={section.title}
              className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm"
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
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
          <h2 className="text-3xl font-bold text-emerald-950">
            Module-by-Module Guides | মডিউলভিত্তিক গাইড
          </h2>

          <p className="mt-4 text-neutral-700">
            These cards will later open dedicated guide pages for each module.
            For now they safely return to this main training manual.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {guidanceLinks.map(([item, href]) => (
              <a
                key={item}
                href={href}
                className="rounded-2xl border border-emerald-200 bg-white p-4 text-sm font-medium text-neutral-800 transition hover:border-emerald-500 hover:bg-emerald-100"
              >
                {item} →
              </a>
            ))}
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}