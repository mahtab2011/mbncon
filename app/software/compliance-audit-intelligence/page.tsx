"use client";

import Link from "next/link";

const complianceAreas = [
  "Fire safety compliance",
  "Electrical safety compliance",
  "Worker health and safety",
  "Social compliance",
  "Wages and working hours",
  "Child labour / forced labour prevention",
  "Building safety",
  "Machine safety",
  "Chemical storage safety",
  "Buyer audit findings",
  "CAP follow-up status",
  "Certification validity",
];

const complianceRisks = [
  "Buyer audit failure",
  "Shipment hold risk",
  "Legal penalty risk",
  "Worker accident risk",
  "Factory reputation damage",
  "Certification expiry",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ComplianceAuditIntelligencePage() {
  const kpiCards = [
    {
      label: "Audit Risk",
      value: "Monitored",
      href: "#executive-compliance-assessment",
    },
    {
      label: "CAP Status",
      value: "Tracked",
      href: "#compliance-areas",
    },
    {
      label: "Certification",
      value: "Visible",
      href: "#compliance-risks",
    },
    {
      label: "Legal Risk",
      value: "Controlled",
      href: "#consultancy-application",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-red-300">
            MBNCON Compliance Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Compliance & Audit Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Track factory compliance, buyer audits, fire safety, electrical
            safety, worker safety, social compliance, CAP follow-up,
            certification validity, and legal risk exposure.
          </p>
        </div>

        <section
          id="enterprise-kpis"
          className="mt-10 grid scroll-mt-28 gap-6 md:grid-cols-4"
        >
          {kpiCards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-red-400/70 hover:shadow-xl"
            >
              <p className="text-sm text-slate-400">{card.label}</p>

              <p className="mt-3 text-2xl font-bold text-red-300">
                {card.value}
              </p>

              <p className="mt-3 text-xs text-slate-500">
                Click to review compliance intelligence
              </p>
            </a>
          ))}
        </section>

        <section
          id="executive-compliance-assessment"
          className="mt-10 scroll-mt-28 rounded-3xl border border-red-400/30 bg-red-400/10 p-8"
        >
          <p className="text-sm uppercase tracking-widest text-red-300">
            Executive Compliance Assessment
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-100">
            Compliance Risk Controlled But Requires Evidence Discipline
          </h2>

          <p className="mt-4 text-slate-200">
            AI assessment recommends tracking audit findings, CAP closure,
            safety exposure, certification validity, responsible ownership,
            evidence records, buyer requirements, and legal risk before buyer
            audit or shipment approval.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div
            id="compliance-areas"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
          >
            <h2 className="text-2xl font-bold text-red-200">
              Compliance Areas
            </h2>

            <div className="mt-6 space-y-3">
              {complianceAreas.map((item, index) => {
                const sectionId = slugify(item);

                return (
                  <a
                    key={item}
                    id={sectionId}
                    href="#consultancy-application"
                    className="scroll-mt-28 flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:-translate-y-1 hover:border-red-400/70 hover:shadow-xl"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-400 text-sm font-bold text-slate-950">
                      {index + 1}
                    </span>

                    <span className="text-sm text-slate-200">{item}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div
            id="compliance-risks"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
          >
            <h2 className="text-2xl font-bold text-red-200">
              Compliance Risks
            </h2>

            <div className="mt-6 space-y-4">
              {complianceRisks.map((item, index) => {
                const sectionId = slugify(item);

                return (
                  <a
                    key={item}
                    id={sectionId}
                    href="#consultancy-application"
                    className="scroll-mt-28 block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-red-400/70 hover:shadow-xl"
                  >
                    <p className="font-semibold text-white">
                      {index + 1}. {item}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      Track severity, responsible owner, deadline, evidence,
                      corrective action, verification, and closure.
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="consultancy-application"
          className="mt-10 scroll-mt-28 rounded-3xl border border-red-400/30 bg-red-400/10 p-8"
        >
          <h2 className="text-2xl font-bold text-red-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps factories prepare for buyer audits, manage CAP
            follow-up, reduce safety and legal risks, protect certifications,
            and maintain export readiness for garments and footwear buyers.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-widest text-red-300">
              AI Recommendation
            </p>

            <p className="mt-3 text-slate-200">
              Management should maintain live compliance evidence, assign
              departmental owners, monitor CAP deadlines, verify closure
              quality, track certification expiry, and review high-risk safety
              issues before buyer visits or shipment approval.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}