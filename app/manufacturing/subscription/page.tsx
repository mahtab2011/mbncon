const licensedApps = [
  {
    code: "GPA",
    name: "Garments Productivity App",
    status: "ACTIVE",
  },
];

const futureApps = [
  "GQA",
  "GPM",
  "GFM",
  "GHR",
  "GCI",
  "GFO",
  "GBI",
  "GKC",
];

export default function ManufacturingSubscriptionPage() {
  const trialDaysRemaining = 183;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="mb-2 text-4xl font-bold text-blue-700">
        Subscription & License Centre
      </h1>

      <p className="mb-8 text-gray-600">
        Manage trial status, licensed applications and commercial access.
      </p>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">
            Subscription Status
          </p>
          <h2 className="mt-2 text-3xl font-bold text-green-700">
            Trial Active
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">
            Trial Remaining
          </p>
          <h2 className="mt-2 text-3xl font-bold text-blue-700">
            {trialDaysRemaining} Days
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">
            Current Plan
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            Six Month Free Trial
          </h2>
        </div>
      </div>

      <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-blue-700">
          Licensed Applications
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {licensedApps.map((app) => (
            <div
              key={app.code}
              className="rounded-lg border border-green-200 bg-green-50 p-4"
            >
              <h3 className="text-xl font-bold text-green-700">
                {app.code}
              </h3>

              <p className="text-sm text-gray-700">
                {app.name}
              </p>

              <span className="mt-3 inline-block rounded-full bg-green-200 px-3 py-1 text-xs font-bold text-green-800">
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-blue-700">
          Future Applications
        </h2>

        <div className="grid gap-4 md:grid-cols-4">
          {futureApps.map((app) => (
            <div
              key={app}
              className="rounded-lg border bg-gray-50 p-4 text-center"
            >
              <h3 className="text-lg font-bold text-gray-700">
                {app}
              </h3>

              <p className="mt-2 text-xs font-semibold text-gray-500">
                Not Licensed Yet
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}