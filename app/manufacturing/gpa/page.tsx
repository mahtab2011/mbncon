import Link from "next/link";

export default function GpaLandingPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-7xl px-8 py-16">

        <h1 className="text-5xl font-extrabold text-blue-700">
          GPA
        </h1>

        <p className="mt-4 text-2xl font-semibold text-slate-700">
          Garments Performance Analytics
        </p>

        <p className="mt-8 max-w-4xl text-lg text-slate-600">
          AI-powered Manufacturing Operating System for garment factories.
          Designed for factory owners, executives, BGMEA, buying houses,
          production teams and continuous improvement.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">

          <Link
            href="/manufacturing/enterprise-command-hub"
            className="rounded-2xl bg-white p-6 shadow hover:shadow-lg"
          >
            <h2 className="text-2xl font-bold text-blue-700">
              Enterprise Command Hub
            </h2>

            <p className="mt-3 text-slate-600">
              Live enterprise intelligence dashboard.
            </p>
          </Link>

          <Link
            href="/manufacturing/global-executive-dashboard"
            className="rounded-2xl bg-white p-6 shadow hover:shadow-lg"
          >
            <h2 className="text-2xl font-bold text-blue-700">
              Executive Dashboard
            </h2>

            <p className="mt-3 text-slate-600">
              CEO and board-level KPIs.
            </p>
          </Link>

          <Link
            href="/manufacturing/pilot-navigation-hub"
            className="rounded-2xl bg-white p-6 shadow hover:shadow-lg"
          >
            <h2 className="text-2xl font-bold text-blue-700">
              Pilot Navigation
            </h2>

            <p className="mt-3 text-slate-600">
              BGMEA Pilot demonstration.
            </p>
          </Link>

        </div>

        <div className="mt-16 rounded-2xl bg-blue-700 p-8 text-white">

          <h2 className="text-3xl font-bold">
            BGMEA Pilot Release Candidate 1
          </h2>

          <p className="mt-4 text-lg">
            Multi-factory enterprise intelligence platform including
            Executive Score, Factory Ranking, Heat Map,
            Predictive Analytics, CEO Morning Brief,
            AI Decision Centre and Live Enterprise Monitoring.
          </p>

        </div>

      </section>
    </main>
  );
}