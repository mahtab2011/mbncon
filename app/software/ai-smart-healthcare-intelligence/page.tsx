"use client";

import Image from "next/image";
import DashboardShell from "@/components/software/DashboardShell";

const healthcareBenefits = [
  {
    title: "Predictive Diagnostics",
    description:
      "AI can help identify disease risks earlier through predictive analytics, biomarker analysis, and intelligent screening systems.",
  },
  {
    title: "Telemedicine & Remote Healthcare",
    description:
      "AI-powered healthcare systems can connect remote patients with central healthcare intelligence and specialist consultation.",
  },
  {
    title: "Smart Hospital Intelligence",
    description:
      "AI can optimise patient flow, diagnostics, hospital operations, resource planning, and healthcare decision-making.",
  },
  {
    title: "Public Health Intelligence",
    description:
      "AI dashboards can support disease forecasting, outbreak monitoring, healthcare analytics, and national health planning.",
  },
];

const smartHospitalFeatures = [
  "AI-assisted diagnostics",
  "Predictive disease forecasting",
  "Remote patient monitoring",
  "Telemedicine integration",
  "Central AI healthcare dashboard",
  "Public health analytics",
  "Digital medical intelligence",
  "AI-supported clinical decision systems",
];

export default function AISmartHealthcareIntelligencePage() {
  return (
    <DashboardShell title="AI Smart Healthcare Intelligence Centre">
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-950/20 p-8">
            <p className="text-sm text-cyan-300">
              MBNCON AI Transformation Division
            </p>

            <h1 className="mt-3 text-5xl font-bold leading-tight">
              AI Smart Healthcare Intelligence Centre
            </h1>

            <p className="mt-6 max-w-5xl text-lg text-slate-300">
              AI-enabled smart healthcare systems can transform diagnostics,
              healthcare accessibility, predictive healthcare, telemedicine,
              public health analytics, and operational healthcare intelligence.
            </p>

            <p className="mt-4 max-w-5xl text-slate-400">
              A healthy nation is a productive nation. AI-driven healthcare
              transformation can improve healthcare quality, strengthen national
              productivity, reduce medical tourism dependency, and improve
              healthcare accessibility for remote populations.
            </p>
          </div>

          <section className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
              <h2 className="text-3xl font-bold text-cyan-300">
                Why AI Healthcare Matters
              </h2>

              <div className="mt-6 space-y-5 leading-8 text-slate-300">
                <p>
                  Many countries face increasing healthcare pressure due to
                  population growth, urbanisation, chronic disease, specialist
                  shortages, and rising healthcare costs.
                </p>

                <p>
                  AI can support faster diagnostics, predictive disease
                  intelligence, healthcare automation, telemedicine, and remote
                  healthcare delivery.
                </p>

                <p>
                  AI-assisted healthcare systems can help connect remote villages
                  and underserved populations to central healthcare intelligence
                  systems and specialist medical support.
                </p>

                <p>
                  Countries spending billions annually on outbound medical tourism
                  may strengthen domestic healthcare capability through AI-enabled
                  smart healthcare infrastructure.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-950/20 p-8">
              <h2 className="text-3xl font-bold text-emerald-200">
                Smart Hospital Ecosystem
              </h2>

              <div className="mt-6 space-y-3">
                {smartHospitalFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="rounded-xl border border-white/10 bg-slate-950 p-4 text-slate-300"
                  >
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-4xl font-bold">
              AI Healthcare Transformation Benefits
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {healthcareBenefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="rounded-3xl border border-white/10 bg-slate-900 p-6"
                >
                  <h3 className="text-2xl font-bold text-cyan-300">
                    {benefit.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-300">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14 rounded-3xl border border-amber-500/20 bg-amber-950/20 p-8">
            <h2 className="text-4xl font-bold text-amber-200">
              Village-to-Cloud Healthcare Vision
            </h2>

            <div className="mt-6 space-y-5 leading-8 text-slate-300">
              <p>
                AI-powered healthcare systems can connect remote villages,
                underserved communities, and local healthcare centres directly to
                central AI-enabled healthcare dashboards.
              </p>

              <p>
                Through AI diagnostics, telemedicine, predictive healthcare, and
                cloud-connected healthcare intelligence, patients may receive
                faster screening, earlier intervention, and specialist guidance
                without travelling long distances.
              </p>

              <p>Future AI healthcare ecosystems may support:</p>

              <ul className="list-disc space-y-2 pl-6">
                <li>Remote AI screening kiosks</li>
                <li>Real-time healthcare dashboards</li>
                <li>Predictive disease intelligence</li>
                <li>Public health forecasting</li>
                <li>Remote consultation systems</li>
                <li>Healthcare analytics & monitoring</li>
              </ul>
            </div>
          </section>

          <section className="mt-14 rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-4xl font-bold text-cyan-300">
              iSMART® AI Healthcare Kiosk Concept
            </h2>

            <p className="mt-4 max-w-5xl leading-8 text-slate-300">
              The iSMART® Smart Hospital Capabilities poster summarises how AI
              diagnostics, EHR analytics, IoT devices, telemedicine, digital
              health hubs, and connected dashboards can work together as a smart
              healthcare ecosystem.
            </p>

            <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-4">
              <Image
                src="/images/smart-hospital-capabilities.jpg"
                alt="iSMART AI Healthcare Kiosk and Smart Hospital Capabilities"
                width={1448}
                height={1086}
                className="h-auto w-full rounded-2xl"
                priority
              />
            </div>
          </section>
        </section>
      </main>
    </DashboardShell>
  );
}