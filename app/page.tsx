import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/software/Navbar";
import InternalSearch from "@/components/software/InternalSearch";

export const metadata: Metadata = {
  title:
    "MBNCON | Enterprise Intelligence, Productivity & AI Business Systems",
  description:
    "MBNCON provides enterprise intelligence, manufacturing productivity systems, executive dashboards, operational excellence, leadership development, Industry 4.0 readiness, AI-assisted analytics, Lean, Kaizen, TQM, supply chain intelligence, risk visibility, and business transformation consultancy.",
  keywords: [
    "enterprise intelligence",
    "manufacturing intelligence",
    "AI manufacturing software",
    "executive dashboard",
    "business excellence",
    "operational excellence",
    "factory productivity",
    "lean manufacturing",
    "kaizen system",
    "TQM manufacturing",
    "leadership development",
    "skill matrix",
    "value added productivity",
    "root cause analysis",
    "value stream mapping",
    "supply chain intelligence",
    "production planning software",
    "manufacturing KPI dashboard",
    "industrial engineering",
    "risk management intelligence",
    "enterprise productivity",
    "Industry 4.0",
    "MBNCON",
  ],
  openGraph: {
    title:
      "MBNCON | Enterprise Intelligence, Productivity & AI Business Systems",
    description:
      "Enterprise intelligence platform for productivity, leadership, manufacturing excellence, operational control, Lean, Kaizen, TQM, analytics, and transformation readiness.",
    url: "https://www.mbncon.com",
    siteName: "MBNCON",
    locale: "en_GB",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type GatewayCard = {
  title: string;
  description: string;
  href: string;
  style: string;
};

const gatewayCards: GatewayCard[] = [
  {
    title: "Executive Intelligence & Enterprise Control",
    description:
      "Executive dashboards, reports, factory health, command centres, management review and strategic control.",
    href: "/software#executive-intelligence-and-enterprise-control",
    style: "border-blue-300 bg-blue-100 text-blue-950",
  },
  {
    title: "Leadership, Human Performance & Skill Development",
    description:
      "Leadership, Inner Game of Tennis, Inner Game of Management, skill matrix, adaptive leadership and empowerment intelligence.",
    href: "/software#leadership-human-performance-and-skill-development",
    style: "border-emerald-300 bg-emerald-100 text-emerald-950",
  },
  {
    title: "Productivity Improvement & Operational Excellence",
    description:
      "Root cause analysis, value stream mapping, bottleneck identification, OEE, Kaizen, Lean and value-added productivity.",
    href: "/software#productivity-improvement-and-operational-excellence",
    style: "border-yellow-300 bg-yellow-100 text-yellow-950",
  },
  {
    title: "Production, Maintenance & Factory Operations",
    description:
      "Production planning, forecasting, machine utilisation, downtime, maintenance and factory loss intelligence.",
    href: "/software#production-maintenance-and-factory-operations",
    style: "border-red-300 bg-red-100 text-red-950",
  },
  {
    title: "Quality, TQM, Compliance & Business Excellence",
    description:
      "Quality control, TQM, compliance, rework reduction, raw material quality and business excellence maturity.",
    href: "/software#quality-tqm-compliance-and-business-excellence",
    style: "border-purple-300 bg-purple-100 text-purple-950",
  },
  {
    title: "Supply Chain, Logistics, Inventory & Materials",
    description:
      "Supplier performance, shipment, warehouse, transport, inventory, components and material visibility.",
    href: "/software#supply-chain-logistics-inventory-and-materials",
    style: "border-orange-300 bg-orange-100 text-orange-950",
  },
  {
    title: "Buyer, Commercial & Profitability Intelligence",
    description:
      "Buyer risk, order profitability, profit leakage, cashflow, merchandising and commercial decision visibility.",
    href: "/software#buyer-commercial-and-profitability-intelligence",
    style: "border-pink-300 bg-pink-100 text-pink-950",
  },
  {
    title: "Risk, Recovery, Alerts & Transformation",
    description:
      "Risk escalation, shipment recovery, cashflow risk, change management and digital transformation readiness.",
    href: "/software#risk-recovery-alerts-and-transformation",
    style: "border-slate-300 bg-slate-100 text-slate-950",
  },
  {
    title: "Energy, Sustainability, Governance & Security",
    description:
      "ESG, utilities, energy optimisation, cost reduction, evidence control, access control and governance.",
    href: "/software#energy-sustainability-governance-and-security",
    style: "border-teal-300 bg-teal-100 text-teal-950",
  },
];

const highlights = [
  "Industry 4.0 readiness",
  "AI-assisted enterprise intelligence",
  "Leadership and skill development",
  "Operational excellence systems",
  "Productivity and cost control",
  "Risk, quality and supply chain visibility",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <Navbar />
      <div id="top" />

      <section className="bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white sm:text-base">
        <section className="bg-slate-950 px-4 py-10">
  <div className="mx-auto max-w-6xl">
    <InternalSearch />
  </div>
</section>
        We aim to deliver a minimum{" "}
        <span className="text-lg font-extrabold text-yellow-300">20%</span>{" "}
        efficiency improvement within three to six months, subject to agreed
        scope and measurable baseline.
      </section>

      <section className="bg-blue-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            MBNCON Enterprise Intelligence Platform
          </p>

          <h1 className="mt-5 max-w-6xl text-4xl font-extrabold leading-tight text-blue-100 sm:text-5xl lg:text-6xl">
            Enterprise Intelligence for Productivity, Leadership, Operational
            Excellence and AI-Era Transformation
          </h1>

          <p className="mt-6 max-w-5xl text-lg leading-9 text-white/90 sm:text-xl">
            MBNCON helps organisations improve visibility, productivity,
            leadership capability, operational control, quality, profitability,
            supply chain coordination, risk recovery and enterprise
            transformation in the Fourth Industrial Revolution and AI evolution
            era.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/software"
              className="rounded-2xl bg-white px-6 py-4 font-semibold text-blue-950 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              Explore Enterprise Platform
            </Link>

            <Link
              href="/software#module-explorer"
              className="rounded-2xl border border-white px-6 py-4 font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl"
            >
              View Module Groups
            </Link>

            <Link
              href="#contact"
              className="rounded-2xl border border-cyan-300 px-6 py-4 font-semibold text-cyan-100 transition duration-300 hover:-translate-y-1 hover:bg-cyan-300/10 hover:shadow-xl"
            >
              Contact MBN Consulting
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <section
                key={item}
                className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-md transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-xl"
              >
                <p className="font-semibold text-cyan-100">{item}</p>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Why We Built This Platform
          </p>

          <h2 className="mt-4 max-w-5xl text-4xl font-extrabold leading-tight text-slate-950">
            Enterprise Readiness for the Fourth Industrial Revolution and AI
            Evolution
          </h2>

          <div className="mt-6 max-w-6xl space-y-5 text-lg leading-8 text-slate-700">
            <p>
              Modern organisations face increasing pressure from cost,
              productivity, quality, speed, supply chain disruption, workforce
              capability, sustainability, compliance and decision visibility.
              Traditional reporting is often too slow, too fragmented and too
              dependent on isolated departmental judgement.
            </p>

            <p>
              MBNCON Enterprise Intelligence Platform was built to connect
              leadership, productivity improvement, operational excellence,
              workforce development, manufacturing control, quality, logistics,
              finance, governance and sustainability into one structured
              intelligence ecosystem.
            </p>

            <p>
              The platform supports earlier decisions, clearer accountability,
              stronger learning culture, better operational discipline and
              continuous improvement through practical enterprise systems
              designed for real business environments.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Enterprise Module Gateway
              </p>

              <h2 className="mt-4 text-4xl font-extrabold text-white">
                Explore MBNCON by Business Outcome
              </h2>

              <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
                The full platform contains 100+ grouped modules. The homepage
                shows simple business outcome groups, while the full enterprise
                control centre provides detailed access to nested modules.
              </p>
            </div>

            <Link
              href="/software"
              className="rounded-2xl bg-cyan-300 px-6 py-4 font-bold text-slate-950 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              Open Full Control Centre →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {gatewayCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className={`min-h-63 rounded-3xl border p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${card.style}`}
              >
                <h3 className="text-2xl font-extrabold leading-snug">
                  {card.title}
                </h3>

                <p className="mt-4 text-base leading-7">
                  {card.description}
                </p>

                <p className="mt-6 text-sm font-bold opacity-80">
                  Explore group →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-300 bg-slate-100 p-8 shadow-sm transition duration-300 hover:shadow-xl sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-violet-700">
            Practical Business Transformation
          </p>

          <h2 className="mt-4 max-w-5xl text-4xl font-black text-slate-950">
            From Data Visibility to Management Discipline and Measurable
            Improvement
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Link
              href="/software#productivity-improvement-and-operational-excellence"
              className="rounded-2xl border border-red-300 bg-red-100 p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-red-950">
                Productivity Improvement
              </h3>

              <p className="mt-4 leading-7 text-red-950">
                Value-added work, bottleneck control, root cause analysis, Lean,
                Kaizen, OEE and operational flow improvement.
              </p>

              <p className="mt-5 text-sm font-bold text-red-900">
                Explore productivity modules →
              </p>
            </Link>

            <Link
              href="/software#leadership-human-performance-and-skill-development"
              className="rounded-2xl border border-emerald-300 bg-emerald-100 p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-emerald-950">
                Leadership & Skills
              </h3>

              <p className="mt-4 leading-7 text-emerald-950">
                Adaptive leadership, Inner Game thinking, skill matrix,
                empowerment, coaching and management capability.
              </p>

              <p className="mt-5 text-sm font-bold text-emerald-900">
                Explore leadership modules →
              </p>
            </Link>
<Link
  href="/software/organisational-resilience-intelligence"
  className="rounded-2xl border border-cyan-300 bg-cyan-100 p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
>
  <h3 className="text-2xl font-bold text-cyan-950">
    Organisational Resilience
  </h3>

  <p className="mt-4 leading-7 text-cyan-950">
    Organisational resilience, adaptive leadership, crisis readiness,
    workforce recovery capability, emotional intelligence, learning culture
    and sustainable transformation readiness.
  </p>

  <p className="mt-5 text-sm font-bold text-cyan-900">
    Explore resilience intelligence →
  </p>
</Link>
            <Link
              href="/software#executive-intelligence-and-enterprise-control"
              className="rounded-2xl border border-blue-300 bg-blue-100 p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-blue-950">
                Executive Intelligence
              </h3>

              <p className="mt-4 leading-7 text-blue-950">
                Dashboards, reports, control centres, factory health, risk
                visibility and enterprise decision support.
              </p>

              <p className="mt-5 text-sm font-bold text-blue-900">
                Explore executive modules →
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="mx-auto mb-16 mt-4 scroll-mt-28 max-w-7xl rounded-3xl border border-slate-300 bg-white p-8 shadow-sm transition duration-300 hover:shadow-xl sm:p-10"
      >
        <p className="text-sm font-bold uppercase tracking-widest text-cyan-700">
          Contact MBN Consulting
        </p>

        <h2 className="mt-4 text-4xl font-black text-slate-950">
          Let’s Improve Operational Performance Together
        </h2>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-700">
          MBN Consulting supports manufacturing, logistics, hospitality, retail,
          corporate and operational businesses with productivity systems,
          business analytics, workflow optimisation, enterprise intelligence and
          practical improvement consultancy.
        </p>
<div className="mt-8 grid gap-4 md:grid-cols-3">
  <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
    <h3 className="text-lg font-bold text-slate-900">
      Follow MBNCON
    </h3>

    <p className="mt-2 text-sm leading-6 text-slate-700">
      Follow our AI transformation journey, enterprise intelligence
      expansion, manufacturing innovation, leadership systems,
      operational excellence insights, and future technology initiatives.
    </p>

    <button className="mt-5 rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600">
      Follow Updates
    </button>
  </div>

  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
    <h3 className="text-lg font-bold text-slate-900">
      Enterprise Consultation
    </h3>

    <p className="mt-2 text-sm leading-6 text-slate-700">
      Manufacturing groups, hospitality businesses, retailers,
      logistics providers, restaurants, and operational enterprises
      can contact MBNCON for AI transformation and productivity support.
    </p>

    <button className="mt-5 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">
      Request Consultation
    </button>
  </div>

  <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
    <h3 className="text-lg font-bold text-slate-900">
      AI Transformation Network
    </h3>

    <p className="mt-2 text-sm leading-6 text-slate-700">
      Join our growing AI transformation ecosystem covering
      manufacturing, retail, agriculture, hospitality,
      supply chain, and operational intelligence systems.
    </p>

    <button className="mt-5 rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600">
      Join Network
    </button>
  </div>
</div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-300 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-xl font-bold text-slate-950">
              United Kingdom
            </h3>

            <p className="mt-4 leading-8 text-slate-700">
              MBN Consulting
              <br />
              85 Halley Road
              <br />
              London E7 8DS
              <br />
              United Kingdom
            </p>
          </section>

          <section className="rounded-2xl border border-slate-300 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-xl font-bold text-slate-950">
              Contact Details
            </h3>

            <p className="mt-4 leading-8 text-slate-700">
              Email:
              <br />
              mahtab@mbncon.com
              <br />
              mahtab@mahtabsiddiqui.com
            </p>

            <p className="mt-6 leading-8 text-slate-700">
              Telephone & WhatsApp:
              <br />
              +44 7454 586658
              <br />
              +880 1743 0055423
            </p>
          </section>
        </div>

        <div className="mt-8">
          <a
            href="#top"
            className="text-sm font-semibold text-cyan-700 transition duration-300 hover:text-cyan-900"
          >
            Back to top ↑
          </a>
        </div>
      </section>
    </main>
  );
}