import Link from "next/link";

const apps = [
  {
  code: "⭐ GPA",
  name: "Garments Performance Analytics",
  bangla: "গার্মেন্টস পারফরম্যান্স অ্যানালিটিক্স",
  description:
    "MBNCON's flagship AI-powered Manufacturing Operating System featuring Enterprise Command Hub, Executive Intelligence, Multi-Factory Analytics, Predictive AI, CEO Cockpit, Factory Ranking, Heat Maps and Live Manufacturing Intelligence.",
  status: "RC1",
  route: "/manufacturing/gpa",
},

  {
    code: "EXEC",
    name: "Executive Command Centre",
    bangla: "নির্বাহী কমান্ড সেন্টার",
    description:
      "Global executive dashboard with AI factory health, production, quality, maintenance and shipment intelligence.",
    status: "ACTIVE",
    route: "/manufacturing/global-executive-dashboard",
  },

  {
    code: "CUT",
    name: "Cutting Intelligence Suite",
    bangla: "কাটিং ইন্টেলিজেন্স স্যুট",
    description:
      "Pattern Intelligence, Marker Intelligence, Fabric Consumption, Fabric Inspection, Shade Management, Roll Traceability and AI Fabric Optimizer.",
    status: "ACTIVE",
    route: "/manufacturing/pilot-navigation-hub",
  },

  {
    code: "FAB",
    name: "Fabric Inspection Centre",
    bangla: "ফেব্রিক ইন্সপেকশন সেন্টার",
    description:
      "AI fabric inspection, 4-point system, defect intelligence and roll approval.",
    status: "ACTIVE",
    route: "/manufacturing/fabric-inspection",
  },

  {
    code: "SHADE",
    name: "Fabric Shade Management",
    bangla: "ফেব্রিক শেড ম্যানেজমেন্ট",
    description:
      "Shade grouping, lay allocation, bundle integrity and AI shade control.",
    status: "ACTIVE",
    route: "/manufacturing/fabric-shade-management",
  },

  {
    code: "TRACE",
    name: "Roll & Bundle Traceability",
    bangla: "রোল ও বান্ডেল ট্রেসেবিলিটি",
    description:
      "Track every roll from inspection through lay, bundle and sewing line.",
    status: "ACTIVE",
    route: "/manufacturing/roll-bundle-traceability",
  },

  {
    code: "OPT",
    name: "AI Fabric Optimizer",
    bangla: "এআই ফেব্রিক অপটিমাইজার",
    description:
      "Optimize marker efficiency, fabric utilization and cutting cost.",
    status: "ACTIVE",
    route: "/manufacturing/fabric-optimizer",
  },

  {
    code: "CMD",
    name: "Executive Manufacturing Command Centre",
    bangla: "ম্যানুফ্যাকচারিং কমান্ড সেন্টার",
    description:
      "Executive overview of production, cutting, quality, maintenance and AI decisions.",
    status: "ACTIVE",
    route: "/manufacturing/executive-command-centre",
  },

  {
    code: "LIVE",
    name: "Live Factory Intelligence",
    bangla: "লাইভ ফ্যাক্টরি ইন্টেলিজেন্স",
    description:
      "Next phase: live Firestore-powered factory monitoring and AI decision support.",
    status: "PILOT",
  },
];

export default function ManufacturingHomePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          MBNCON Manufacturing Intelligence Suite
        </h1>

        <p className="mt-2 text-gray-600">
          Enterprise Manufacturing Operating System powered by AI
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {apps.map((app) => (
          <div
            key={app.code}
            className="rounded-xl bg-white p-6 shadow-md transition hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-blue-700">
                {app.code}
              </h2>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  app.status === "ACTIVE" || app.status === "RC1"
                    ? "bg-green-100 text-green-700"
: app.status === "RC1"
? "bg-purple-100 text-purple-700"
                    : app.status === "PILOT"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {app.status}
              </span>
            </div>

            <h3 className="text-lg font-semibold">
              {app.name}
            </h3>

            <p className="mb-2 text-sm text-gray-500">
              {app.bangla}
            </p>

            <p className="mb-6 text-sm text-gray-600">
              {app.description}
            </p>

            {app.route ? (
              <Link
                href={app.route}
                className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
              >
                Open Application
              </Link>
            ) : (
              <button
                disabled
                className="rounded-lg bg-blue-100 px-5 py-2 font-semibold text-blue-700"
              >
                Pilot Phase
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}