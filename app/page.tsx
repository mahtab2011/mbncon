import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "MBNCON | Manufacturing Intelligence, Productivity & AI Business Systems",

  description:
    "MBNCON provides AI-assisted manufacturing intelligence, executive dashboards, operational excellence systems, productivity improvement, Lean manufacturing support, KPI visibility, business analytics, risk analysis, and enterprise transformation consultancy for manufacturing, logistics, retail, hospitality, supply chain, and business operations worldwide.",

  keywords: [
    "manufacturing intelligence",
    "AI manufacturing software",
    "executive dashboard",
    "business excellence",
    "operational excellence",
    "factory productivity",
    "lean manufacturing",
    "kaizen system",
    "TQM manufacturing",
    "business analytics",
    "manufacturing consultancy",
    "factory efficiency improvement",
    "AI business systems",
    "supply chain intelligence",
    "production planning software",
    "manufacturing KPI dashboard",
    "industrial engineering",
    "risk management intelligence",
    "enterprise productivity",
    "MBNCON",
  ],

  openGraph: {
    title:
      "MBNCON | Manufacturing Intelligence, Productivity & AI Business Systems",

    description:
      "AI-assisted manufacturing intelligence, executive dashboards, productivity systems, operational excellence, Lean, Kaizen, TQM, analytics, and enterprise transformation consultancy.",

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

type SoftwareCard = {
  title: string;
  href: string;
  style: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const softwareCards: SoftwareCard[] = [
  {
    title: "Manufacturing Productivity System",
    href: "/software",
    style: "border-red-300 bg-red-100 text-red-950",
  },
  {
    title: "Warehouse Productivity System",
    href: "/software",
    style: "border-orange-300 bg-orange-100 text-orange-950",
  },
  {
    title: "Supply Chain Visibility System",
    href: "/software",
    style: "border-blue-300 bg-blue-100 text-blue-950",
  },
  {
    title: "Value-Added Productivity System",
    href: "/software",
    style: "border-emerald-300 bg-emerald-100 text-emerald-950",
  },
  {
    title: "Retail Productivity & Teamwork System",
    href: "/software",
    style: "border-pink-300 bg-pink-100 text-pink-950",
  },
  {
    title: "Restaurant Kitchen Operations System",
    href: "/software",
    style: "border-amber-300 bg-amber-100 text-amber-950",
  },
  {
    title: "Staff Planning & Deployment System",
    href: "/software",
    style: "border-violet-300 bg-violet-100 text-violet-950",
  },
  {
    title: "Banking & Insurance Productivity System",
    href: "/software",
    style: "border-teal-300 bg-teal-100 text-teal-950",
  },
  {
    title: "Corporate Office Productivity System",
    href: "/software",
    style: "border-sky-300 bg-sky-100 text-sky-950",
  },
  {
    title: "Store Management & Shelf Productivity System",
    href: "/software",
    style: "border-lime-300 bg-lime-100 text-lime-950",
  },
  {
    title: "Small Business Accounting & Cash Point System",
    href: "/software",
    style: "border-green-300 bg-green-100 text-green-950",
  },
  {
    title: "AI Sales Productivity System",
    href: "/software",
    style: "border-rose-300 bg-rose-100 text-rose-950",
  },
  {
    title: "Marketing Productivity & Campaign System",
    href: "/software",
    style: "border-fuchsia-300 bg-fuchsia-100 text-fuchsia-950",
  },
  {
    title: "Butcher Shop Operations & Cost Control System",
    href: "/software",
    style: "border-stone-300 bg-stone-100 text-stone-950",
  },
  {
    title: "Excel, Tableau & AI Dashboard System",
    href: "/software",
    style: "border-indigo-300 bg-indigo-100 text-indigo-950",
  },
];

const platformHighlights = [
  {
    title: "AI Manufacturing Intelligence",
    description:
      "Executive dashboards, productivity intelligence, risk analysis, forecasting, and operational visibility.",
    className:
      "border-yellow-300/30 bg-yellow-300/10 text-yellow-200",
  },
  {
    title: "Consultancy & Transformation",
    description:
      "Lean systems, Kaizen, TQM, operational excellence, cost reduction, and workflow improvement support.",
    className:
      "border-cyan-300/30 bg-cyan-300/10 text-cyan-200",
  },
  {
    title: "Enterprise Productivity Systems",
    description:
      "Practical software environments for manufacturing, logistics, hospitality, retail, and office operations.",
    className:
      "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div id="top" />

      <section className="bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white sm:text-base">
        We aim to deliver a minimum{" "}
        <span className="text-lg font-extrabold text-yellow-300">
          20%
        </span>{" "}
        efficiency improvement within three to six months, subject to agreed
        scope and measurable baseline.
      </section>

      <section className="bg-blue-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            MBNCON Enterprise Intelligence
          </p>

          <h1 className="mt-4 text-5xl font-extrabold leading-tight text-blue-100">
            MBN Consulting
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-9 text-white/90">
            Operational Excellence, Business Systems, Productivity
            Improvement, and AI-Guided Transformation for Manufacturing,
            Hospitality, Logistics, Retail, Banking, Insurance, Corporate
            Offices, and Supply Chain Operations.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/software"
              className="rounded-2xl bg-white px-6 py-4 font-semibold text-blue-900 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              Request Consultation
            </Link>

            <Link
              href="/software"
              className="rounded-2xl border border-white px-6 py-4 font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl"
            >
              Explore Services
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {platformHighlights.map((item) => (
              <section
                key={item.title}
                className={`rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${item.className}`}
              >
                <h3 className="text-xl font-bold">{item.title}</h3>

                <p className="mt-3 text-sm leading-7 text-white/90">
                  {item.description}
                </p>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section
        id={slugify("Practical Business Transformation")}
        className="scroll-mt-28 px-6 py-16"
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
            Business Transformation
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-violet-900">
            Practical Business Transformation
          </h2>

          <p className="mt-6 max-w-4xl text-lg font-medium leading-8 text-violet-800">
            We help businesses improve operational efficiency,
            productivity, workflow, reporting visibility, and business
            performance through practical systems, analytics, and AI-guided
            operational improvements.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Link
              href="/software/executive-dashboard"
              className="rounded-2xl border border-red-300 bg-red-200 p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-red-950">
                Manufacturing Excellence
              </h3>

              <p className="mt-4 leading-7 text-red-950">
                Productivity improvement, bottleneck reduction, workflow
                optimization, reporting systems, and operational efficiency.
              </p>

              <p className="mt-5 text-sm font-bold text-red-900">
                Open Manufacturing Dashboard →
              </p>
            </Link>

            <Link
              href="/software/executive-analytics-dashboard"
              className="rounded-2xl border border-slate-300 bg-slate-200 p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-slate-950">
                Business Analytics
              </h3>

              <p className="mt-4 leading-7 text-slate-900">
                Data analysis using Excel, Tableau, operational dashboards,
                KPI systems, and business reporting.
              </p>

              <p className="mt-5 text-sm font-bold text-slate-950">
                Open Analytics Dashboard →
              </p>
            </Link>

            <Link
              href="/software"
              className="rounded-2xl border border-purple-300 bg-purple-100 p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-purple-950">
                AI-Guided Systems
              </h3>

              <p className="mt-4 leading-7 text-purple-950">
                Practical AI-assisted operational systems for SMEs,
                logistics, hospitality, retail, and office environments.
              </p>

              <p className="mt-5 text-sm font-bold text-purple-900">
                Open Enterprise Platform →
              </p>
            </Link>
          </div>

          <p className="mt-12 max-w-5xl text-lg font-medium leading-8 text-violet-800">
            We design practical productivity software and business systems
            for international customers who want measurable improvement in
            efficiency, teamwork, visibility, service quality, cost
            control, revenue growth, stock control, kitchen operations,
            cash point reporting, and value-added performance.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {softwareCards.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`min-h-[240px] rounded-2xl border p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${item.style}`}
              >
                <h3 className="text-xl font-extrabold leading-snug">
                  {item.title}
                </h3>

                <p className="mt-4 text-base leading-7">
                  Click to explore our enterprise software environment and
                  guided productivity systems.
                </p>

                <p className="mt-6 text-sm font-bold opacity-80">
                  Explore platform →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id={slugify("Contact MBN Consulting")}
        className="mx-auto mt-20 scroll-mt-28 max-w-7xl rounded-3xl border border-slate-300 bg-slate-100 p-10 shadow-sm transition duration-300 hover:shadow-xl"
      >
        <p className="text-sm font-bold uppercase tracking-widest text-cyan-700">
          Contact MBN Consulting
        </p>

        <h2 className="mt-4 text-4xl font-black text-slate-950">
          Let’s Improve Operational Performance Together
        </h2>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-700">
          MBN Consulting supports manufacturing, logistics, hospitality,
          retail, and operational businesses with productivity systems,
          business analytics, workflow optimization, AI-guided operational
          intelligence, and practical improvement consultancy.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-300 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
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

          <section className="rounded-2xl border border-slate-300 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
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
              +880 1743 0055423 (Bangladesh)
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