import Link from "next/link";

const sections = [
  {
    title: "Enterprise Command",
    description: "Executive dashboards, CEO cockpit and enterprise intelligence.",
    items: [
      {
        title: "Enterprise Command Hub",
        href: "/manufacturing/enterprise-command-hub",
        description: "Main GPA executive command centre.",
      },
      {
        title: "Global Executive Dashboard",
        href: "/manufacturing/global-executive-dashboard",
        description: "Board-level enterprise KPI dashboard.",
      },
      {
        title: "Executive Command Centre",
        href: "/manufacturing/executive-command-centre",
        description: "Production, quality, maintenance and shipment intelligence.",
      },
      {
        title: "Executive Decision Centre",
        href: "/manufacturing/executive-decision-centre",
        description: "AI-supported executive decisions.",
      },
    ],
  },
  {
    title: "Productivity Tools",
    description: "IE, bottleneck, line balancing and productivity improvement tools.",
    items: [
      {
        title: "Bottleneck Prediction",
        href: "/manufacturing/bottleneck-prediction",
        description: "Detect and predict factory bottlenecks.",
      },
      {
        title: "Line Balancing",
        href: "/manufacturing/line-balancing",
        description: "Balance sewing lines and improve output.",
      },
      {
        title: "Operator Productivity",
        href: "/manufacturing/operator-productivity",
        description: "Track operator performance and productivity.",
      },
      {
        title: "Skill Gap Engine",
        href: "/manufacturing/skill-gap-engine",
        description: "Identify skill gaps and training needs.",
      },
    ],
  },
  {
    title: "Cutting & Fabric Intelligence",
    description: "Fabric consumption, marker efficiency, cutting and fabric control.",
    items: [
      {
        title: "Cutting Command Centre",
        href: "/manufacturing/cutting-command-centre",
        description: "Cutting room intelligence and control.",
      },
      {
        title: "Fabric Consumption",
        href: "/manufacturing/fabric-consumption",
        description: "Fabric dimension, pattern dimension and consumption analysis.",
      },
      {
        title: "Fabric Optimizer",
        href: "/manufacturing/fabric-optimizer",
        description: "Optimize fabric usage, marker efficiency and cutting cost.",
      },
      {
        title: "Fabric Inspection",
        href: "/manufacturing/fabric-inspection",
        description: "4-point fabric inspection and defect intelligence.",
      },
      {
        title: "Fabric Shade Management",
        href: "/manufacturing/fabric-shade-management",
        description: "Shade grouping, lay control and bundle integrity.",
      },
      {
        title: "Fabric Cutting Knowledge",
        href: "/manufacturing/fabric-cutting-knowledge",
        description: "Cutting knowledge, fabric behavior and layout guidance.",
      },
    ],
  },
  {
    title: "Factory Operations",
    description: "Factory master data, live factory twin and operational control.",
    items: [
      {
        title: "Factory Master",
        href: "/manufacturing/factory-master",
        description: "Factory profile and master data.",
      },
      {
        title: "Department Master",
        href: "/manufacturing/department-master",
        description: "Department structure and operational ownership.",
      },
      {
        title: "Digital Factory Twin",
        href: "/manufacturing/digital-factory-twin",
        description: "Digital representation of factory operations.",
      },
      {
        title: "Digital Factory Twin Live",
        href: "/manufacturing/digital-factory-twin-live",
        description: "Live monitoring of factory operations.",
      },
      {
        title: "Command Wall",
        href: "/manufacturing/command-wall",
        description: "Operational command wall for factory visibility.",
      },
      {
        title: "Attendance Centre",
        href: "/manufacturing/attendance-centre",
        description: "Workforce attendance and presence tracking.",
      },
    ],
  },
];

export default function GpaLandingPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-7xl px-8 py-16">
        <div className="rounded-3xl bg-blue-700 p-10 text-white shadow">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-100">
            MBNCON Flagship Manufacturing Platform
          </p>

          <h1 className="mt-4 text-5xl font-extrabold">
            GPA
          </h1>

          <p className="mt-4 text-2xl font-semibold">
            Garments Performance Analytics
          </p>

          <p className="mt-6 max-w-5xl text-lg text-blue-50">
            AI-powered Manufacturing Operating System for garment factories,
            covering enterprise command, productivity improvement, cutting,
            fabric, IE, factory operations and executive intelligence.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/manufacturing/enterprise-command-hub"
              className="rounded-xl bg-white px-6 py-3 font-bold text-blue-700 shadow hover:bg-blue-50"
            >
              Open Enterprise Command Hub
            </Link>

            <Link
              href="/manufacturing/cutting-command-centre"
              className="rounded-xl bg-blue-900 px-6 py-3 font-bold text-white shadow hover:bg-blue-950"
            >
              Open Cutting Tools
            </Link>

            <Link
              href="/manufacturing/fabric-consumption"
              className="rounded-xl bg-blue-900 px-6 py-3 font-bold text-white shadow hover:bg-blue-950"
            >
              Fabric Consumption
            </Link>
          </div>
        </div>

        <div className="mt-12 space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900">
                  {section.title}
                </h2>

                <p className="mt-2 text-slate-600">
                  {section.description}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <h3 className="text-xl font-bold text-blue-700">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm text-slate-600">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-slate-900 p-8 text-white">
          <h2 className="text-3xl font-bold">
            BGMEA Pilot Release Candidate 1
          </h2>

          <p className="mt-4 text-lg text-slate-200">
            Multi-factory enterprise intelligence platform including Executive
            Score, Factory Ranking, Heat Map, Predictive Analytics, CEO Morning
            Brief, AI Decision Centre, cutting intelligence, fabric intelligence
            and live enterprise monitoring.
          </p>
        </div>
      </section>
    </main>
  );
}