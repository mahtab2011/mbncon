"use client";

import Link from "next/link";

type MenuItem = {
  title: string;
  route: string;
};

const suiteMenu: MenuItem[] = [
  { title: "🏠 Manufacturing Home", route: "/manufacturing" },
  { title: "👋 Executive Welcome", route: "/manufacturing/executive-welcome" },
  { title: "📊 Global Executive Dashboard", route: "/manufacturing/global-executive-dashboard" },
  { title: "🎯 Executive Command Centre", route: "/manufacturing/executive-command-centre" },
  { title: "🎬 BGMEA Demo Mode", route: "/manufacturing/bgmea-demo" },
  { title: "✅ Release Checklist", route: "/manufacturing/bgmea-release-checklist" },
];

const cuttingMenu: MenuItem[] = [
  { title: "✂️ Pilot Navigation Hub", route: "/manufacturing/pilot-navigation-hub" },
  { title: "✂️ Cutting Command Centre", route: "/manufacturing/cutting-command-centre" },
  { title: "📐 Pattern Intelligence", route: "/manufacturing/pattern-intelligence" },
  { title: "📏 Marker Intelligence", route: "/manufacturing/marker-intelligence" },
  { title: "🧵 Fabric Consumption", route: "/manufacturing/fabric-consumption" },
  { title: "🤖 AI Fabric Optimizer", route: "/manufacturing/fabric-optimizer" },
];

const fabricMenu: MenuItem[] = [
  { title: "🧶 Fabric Inspection", route: "/manufacturing/fabric-inspection" },
  { title: "🎨 Shade Management", route: "/manufacturing/fabric-shade-management" },
  { title: "📦 Roll & Bundle Traceability", route: "/manufacturing/roll-bundle-traceability" },
];

const gpaMenu: MenuItem[] = [
  { title: "🏭 Factory Health", route: "/gpa/factory-health" },
  { title: "📈 Production Summary", route: "/gpa/production-summary" },
  { title: "🎯 Theory of Constraints", route: "/gpa/toc" },
  { title: "🚧 Bottleneck Centre", route: "/gpa/bottleneck-centre" },
  { title: "⚖️ Line Balancing", route: "/gpa/line-balancing" },
  { title: "⏱️ SMV Intelligence", route: "/gpa/smv-intelligence" },
  { title: "🕒 Time Study", route: "/gpa/time-study" },
  { title: "🔍 Method Study", route: "/gpa/method-study" },
  { title: "🏃 Motion Economy", route: "/gpa/motion-economy" },
  { title: "📋 Activity Sampling", route: "/gpa/activity-sampling" },
  { title: "⚙️ OEE", route: "/gpa/oee" },
  { title: "👣 AI Gemba Walk", route: "/gpa/gemba-walk" },
];

function Section({
  title,
  items,
}: {
  title: string;
  items: MenuItem[];
}) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 border-b pb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
        {title}
      </h3>

      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.route}
            className="block rounded-md px-3 py-2 text-sm transition hover:bg-blue-50 hover:text-blue-700"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ManufacturingSidebar() {
  return (
    <aside className="min-h-screen w-72 overflow-y-auto border-r bg-white p-5 shadow-sm">
      <h2 className="mb-1 text-2xl font-bold text-blue-700">
        GPA Suite
      </h2>

      <p className="mb-6 text-xs text-gray-500">
        Manufacturing Operating System
      </p>

      <Section title="Executive" items={suiteMenu} />

      <Section title="Cutting Intelligence" items={cuttingMenu} />

      <Section title="Fabric Intelligence" items={fabricMenu} />

      <Section title="GPA Modules" items={gpaMenu} />
    </aside>
  );
}