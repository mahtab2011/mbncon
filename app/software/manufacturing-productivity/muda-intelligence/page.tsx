"use client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function MudaIntelligencePage() {
  const wasteAreas = [
    {
      title: "Overproduction",
      desc: "Detect excessive production before demand.",
    },
    {
      title: "Waiting Time",
      desc: "Identify delays between processes.",
    },
    {
      title: "Transport Waste",
      desc: "Reduce unnecessary movement of materials.",
    },
    {
      title: "Overprocessing",
      desc: "Eliminate non-value-added operations.",
    },
    {
      title: "Inventory Waste",
      desc: "Control excessive stock and storage costs.",
    },
    {
      title: "Motion Waste",
      desc: "Improve operator movement efficiency.",
    },
    {
      title: "Defect Analysis",
      desc: "Track rework, rejects, and quality losses.",
    },
    {
      title: "Unused Talent",
      desc: "Utilize workforce knowledge effectively.",
    },
  ];

  const dashboardFeatures = [
    "live production loss monitoring",
    "downtime analysis",
    "machine idle tracking",
    "operator efficiency analysis",
    "reject trend analysis",
    "production bottleneck alerts",
    "material waste costing",
    "energy loss monitoring",
    "maintenance waste tracking",
    "excess inventory alerts",
    "transport inefficiency analysis",
    "department productivity ranking",
  ];

  const manufacturerBenefits = [
    "Reduce operational costs",
    "Improve production efficiency",
    "Minimize quality defects",
    "Improve delivery performance",
    "Increase employee engagement",
    "Improve lean manufacturing culture",
    "Support continuous improvement initiatives",
  ];

  const aiFeatures = [
    "AI waste prediction",
    "Smart kaizen recommendations",
    "Automated bottleneck detection",
    "Voice reporting for supervisors",
    "Mobile factory-floor inspections",
    "Real-time production alerts",
    "AI-powered productivity analytics",
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* HERO */}
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
              Lean Manufacturing • Muda Intelligence System
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight">
              Eliminate Waste.
              <br />
              Improve Productivity.
              <br />
              Increase Profitability.
            </h1>

            <p className="mt-8 text-xl leading-9 text-slate-300">
              Muda Intelligence helps factories identify hidden waste,
              inefficiencies, delays, unnecessary movement, excess inventory,
              quality losses, and production bottlenecks using modern digital
              lean-management systems.
            </p>
          </div>
        </div>
      </section>

      {/* WASTE TYPES */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {wasteAreas.map((item) => {
              const id = slugify(item.title);

              return (
                <a
                  key={item.title}
                  href={`#${id}`}
                  className="scroll-mt-28 rounded-3xl border border-orange-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <h2
                    id={id}
                    className="text-2xl font-bold"
                  >
                    {item.title}
                  </h2>

                  <p className="mt-4 leading-7 text-gray-600">
                    {item.desc}
                  </p>
                </a>
              );
            })}
          </div>

          {/* DASHBOARD */}
          <section className="mt-24 rounded-3xl bg-white p-10 shadow-xl">
            <h2 className="text-4xl font-bold">
              Smart Waste Intelligence Dashboard
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {dashboardFeatures.map((feature) => {
                const id = slugify(feature);

                return (
                  <div
                    key={feature}
                    id={id}
                    className="scroll-mt-28 rounded-2xl bg-orange-50 p-5 text-lg font-medium capitalize transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {feature}
                  </div>
                );
              })}
            </div>
          </section>

          {/* BENEFITS & AI */}
          <div className="mt-24 grid gap-10 lg:grid-cols-2">
            {/* BENEFITS */}
            <section className="rounded-3xl bg-slate-900 p-10 text-white shadow-xl transition duration-300 hover:shadow-2xl">
              <h2 className="text-3xl font-bold">
                Benefits for Manufacturers
              </h2>

              <ul className="mt-8 space-y-4 text-lg leading-8 text-gray-300">
                {manufacturerBenefits.map((item) => {
                  const id = slugify(item);

                  return (
                    <li
                      key={item}
                      id={id}
                      className="scroll-mt-28 rounded-xl bg-white/5 p-4 transition duration-300 hover:bg-white/10"
                    >
                      • {item}
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* AI FEATURES */}
            <section className="rounded-3xl bg-orange-600 p-10 text-white shadow-xl transition duration-300 hover:shadow-2xl">
              <h2 className="text-3xl font-bold">
                Future AI Features
              </h2>

              <ul className="mt-8 space-y-4 text-lg leading-8 text-orange-100">
                {aiFeatures.map((item) => {
                  const id = slugify(item);

                  return (
                    <li
                      key={item}
                      id={id}
                      className="scroll-mt-28 rounded-xl bg-white/10 p-4 transition duration-300 hover:bg-white/20"
                    >
                      • {item}
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>

          {/* CTA */}
          <section className="mt-24 rounded-3xl bg-orange-600 p-12 text-center text-white shadow-2xl transition duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <h2 className="text-5xl font-extrabold">
              Remove Waste. Build Excellence.
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-orange-100">
              MBN Consultancy develops intelligent manufacturing systems that
              help factories become leaner, smarter, faster, and more profitable.
            </p>

            <button className="mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-orange-700 transition duration-300 hover:scale-105 hover:shadow-xl">
              Request Consultation
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}