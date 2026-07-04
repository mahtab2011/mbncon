import Link from "next/link";

const sections = [
  {
    title: "Enterprise Command",
    description: "Executive dashboards, CEO cockpit and enterprise intelligence.",
    items: [
      { title: "Enterprise Command Hub", href: "/manufacturing/enterprise-command-hub", description: "Main GPA executive command centre." },
      { title: "Global Executive Dashboard", href: "/manufacturing/global-executive-dashboard", description: "Board-level enterprise KPI dashboard." },
      { title: "Executive Command Centre", href: "/manufacturing/executive-command-centre", description: "Production, quality, maintenance and shipment intelligence." },
      { title: "Executive Decision Centre", href: "/manufacturing/executive-decision-centre", description: "AI-supported executive decisions." },
      { title: "Executive Command Wall", href: "/manufacturing/executive-command-wall", description: "Enterprise-wide command wall." },
      { title: "Enterprise Risk Centre", href: "/manufacturing/enterprise-risk-centre", description: "Enterprise risk monitoring and escalation." },
    ],
  },
  {
    title: "Cutting & Fabric",
    description: "Cutting room, fabric consumption, marker, shade and layout tools.",
    items: [
      { title: "Cutting Command Centre", href: "/manufacturing/cutting-command-centre", description: "Cutting KPIs, bundles, fabric usage and AI alerts." },
      { title: "Fabric Consumption", href: "/manufacturing/fabric-consumption", description: "Fabric dimension, pattern dimension and consumption analysis." },
      { title: "Fabric Optimizer", href: "/manufacturing/fabric-optimizer", description: "Optimize marker efficiency and cutting cost." },
      { title: "Fabric Inspection", href: "/manufacturing/fabric-inspection", description: "4-point inspection, defects, GSM and width control." },
      { title: "Fabric Shade Management", href: "/manufacturing/fabric-shade-management", description: "Shade grouping, lay allocation and shade control." },
      { title: "Fabric Cutting Knowledge", href: "/manufacturing/fabric-cutting-knowledge", description: "Cutting procedures, fabric behaviour and layout guidance." },
      { title: "Marker Intelligence", href: "/manufacturing/marker-intelligence", description: "Marker efficiency, layout and utilization intelligence." },
    ],
  },
  {
    title: "Sewing & Production",
    description: "Production control, operation bulletin, line planning, machine allocation and live output.",
    items: [
      { title: "Operation Bulletin", href: "/manufacturing/operation-bulletin-master", description: "Sewing operation library, SMV, machine type, operation sequence and bottleneck basis." },
      { title: "Sewing Task Library", href: "/manufacturing/operation-bulletin-master", description: "Detailed sewing task library for line balancing, bottleneck analysis and production planning." },
      { title: "Live Production Dashboard", href: "/manufacturing/live-production-dashboard", description: "Live production visibility and output monitoring." },
      { title: "Line Master", href: "/manufacturing/line-master", description: "Line setup and master data." },
      { title: "Line Optimization", href: "/manufacturing/line-optimization", description: "Improve line balance and remove bottlenecks." },
      { title: "Machine Master", href: "/manufacturing/machine-master", description: "Machine master data and machine profile." },
      { title: "Machine Allocation", href: "/manufacturing/machine-allocation", description: "Allocate machines to operations and lines." },
      { title: "Maintenance Entry", href: "/manufacturing/maintenance-entry", description: "Machine maintenance and downtime entries." },
      { title: "Learning Curve", href: "/manufacturing/learning-curve", description: "Track operator and line learning performance." },
    ],
  },
  {
    title: "Productivity & IE",
    description: "IE, bottleneck, skill, productivity and improvement tools.",
    items: [
      { title: "Bottleneck Prediction", href: "/manufacturing/bottleneck-prediction", description: "Detect and predict factory bottlenecks." },
      { title: "Factory Health Predictor", href: "/manufacturing/factory-health-predictor", description: "Predict factory health from operational KPIs." },
      { title: "Skill Gap Engine", href: "/manufacturing/skill-gap-engine", description: "Identify operator skill gaps and training needs." },
      { title: "Attendance Centre", href: "/manufacturing/attendance-centre", description: "Workforce attendance and presence tracking." },
      { title: "Department Master", href: "/manufacturing/department-master", description: "Department structure and accountability." },
    ],
  },
  {
    title: "Factory Operations",
    description: "Factory master, digital twin, operational control and command visibility.",
    items: [
      { title: "Factory Master", href: "/manufacturing/factory-master", description: "Factory profile and master data." },
      { title: "Digital Factory Twin", href: "/manufacturing/digital-factory-twin", description: "Digital representation of factory operations." },
      { title: "Digital Factory Twin Live", href: "/manufacturing/digital-factory-twin-live", description: "Live digital twin monitoring." },
      { title: "Command Wall", href: "/manufacturing/command-wall", description: "Operational command wall for factory visibility." },
      { title: "BGMEA Demo", href: "/manufacturing/bgmea-demo", description: "BGMEA pilot demonstration page." },
      { title: "BGMEA Release Checklist", href: "/manufacturing/bgmea-release-checklist", description: "Pilot release readiness checklist." },
    ],
  },
  {
    title: "AI & Support",
    description: "AI assistant, live assistant and pilot navigation.",
    items: [
      { title: "AI Assistant", href: "/manufacturing/ai-assistant", description: "Ask operational questions using manufacturing intelligence." },
      { title: "AI Assistant Live", href: "/manufacturing/ai-assistant-live", description: "Live AI assistant for factory operations." },
      { title: "Pilot Navigation Hub", href: "/manufacturing/pilot-navigation-hub", description: "BGMEA pilot demonstration navigation." },
      { title: "Global Search", href: "/manufacturing/global-search", description: "Search across manufacturing intelligence modules." },
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

          <h1 className="mt-4 text-5xl font-extrabold">GPA</h1>

          <p className="mt-4 text-2xl font-semibold">
            Garments Performance Analytics
          </p>

          <p className="mt-6 max-w-5xl text-lg text-blue-50">
            AI-powered Manufacturing Operating System for garment factories,
            covering enterprise command, cutting, fabric, sewing, IE,
            productivity, factory operations and executive intelligence.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/manufacturing/enterprise-command-hub" className="rounded-xl bg-white px-6 py-3 font-bold text-blue-700 shadow hover:bg-blue-50">
              Enterprise Command Hub
            </Link>
            <Link href="/manufacturing/operation-bulletin" className="rounded-xl bg-blue-900 px-6 py-3 font-bold text-white shadow hover:bg-blue-950">
              Operation Bulletin
            </Link>
            <Link href="/manufacturing/cutting-command-centre" className="rounded-xl bg-blue-900 px-6 py-3 font-bold text-white shadow hover:bg-blue-950">
              Cutting Tools
            </Link>
            <Link href="/manufacturing/live-production-dashboard" className="rounded-xl bg-blue-900 px-6 py-3 font-bold text-white shadow hover:bg-blue-950">
              Sewing / Production
            </Link>
            <Link href="/manufacturing/fabric-consumption" className="rounded-xl bg-blue-900 px-6 py-3 font-bold text-white shadow hover:bg-blue-950">
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
            GPA now connects the executive layer with operational factory
            tools, including cutting, fabric, sewing, IE, productivity,
            AI decision support and live enterprise monitoring.
          </p>
        </div>
      </section>
    </main>
  );
}