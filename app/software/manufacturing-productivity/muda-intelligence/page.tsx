export default function MudaIntelligencePage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white to-orange-50 text-gray-900">
      <section className="mx-auto max-w-7xl px-6 py-20">
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

          <p className="mt-8 text-xl leading-9 text-gray-700">
            Muda Intelligence helps factories identify hidden waste,
            inefficiencies, delays, unnecessary movement, excess inventory,
            quality losses, and production bottlenecks using modern digital
            lean-management systems.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {[
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
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-orange-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold">{item.title}</h2>

              <p className="mt-4 leading-7 text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 rounded-3xl bg-white p-10 shadow-xl">
          <h2 className="text-4xl font-bold">
            Smart Waste Intelligence Dashboard
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
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
            ].map((feature) => (
              <div
                key={feature}
                className="rounded-2xl bg-orange-50 p-5 text-lg font-medium capitalize"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl bg-gray-900 p-10 text-white">
            <h2 className="text-3xl font-bold">
              Benefits for Manufacturers
            </h2>

            <ul className="mt-8 space-y-4 text-lg leading-8 text-gray-300">
              <li>• Reduce operational costs</li>
              <li>• Improve production efficiency</li>
              <li>• Minimize quality defects</li>
              <li>• Improve delivery performance</li>
              <li>• Increase employee engagement</li>
              <li>• Improve lean manufacturing culture</li>
              <li>• Support continuous improvement initiatives</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-orange-600 p-10 text-white">
            <h2 className="text-3xl font-bold">
              Future AI Features
            </h2>

            <ul className="mt-8 space-y-4 text-lg leading-8 text-orange-100">
              <li>• AI waste prediction</li>
              <li>• Smart kaizen recommendations</li>
              <li>• Automated bottleneck detection</li>
              <li>• Voice reporting for supervisors</li>
              <li>• Mobile factory-floor inspections</li>
              <li>• Real-time production alerts</li>
              <li>• AI-powered productivity analytics</li>
            </ul>
          </div>
        </div>

        <div className="mt-24 rounded-3xl bg-linear-to-r from-orange-600 to-red-500 p-12 text-center text-white shadow-2xl">
          <h2 className="text-5xl font-extrabold">
            Remove Waste. Build Excellence.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-orange-100">
            MBN Consultancy develops intelligent manufacturing systems that
            help factories become leaner, smarter, faster, and more profitable.
          </p>

          <button className="mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-orange-700 transition hover:scale-105">
            Request Consultation
          </button>
        </div>
      </section>
    </main>
  );
}