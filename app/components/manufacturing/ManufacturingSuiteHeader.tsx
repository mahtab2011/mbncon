"use client";

type ManufacturingAppCode =
  | "GPA"
  | "GQA"
  | "GPM"
  | "GFM"
  | "GHR"
  | "GCI"
  | "GFO"
  | "GBI"
  | "GKC";

type Props = {
  currentApp?: ManufacturingAppCode;
  language?: "EN" | "BN";
};

const manufacturingSuiteApps = [
  { appCode: "GPA", appName: "Garments Productivity App" },
  { appCode: "GQA", appName: "Garments Quality Assurance" },
  { appCode: "GPM", appName: "Garments Planning & Merchandising" },
  { appCode: "GFM", appName: "Garments Factory Maintenance" },
  { appCode: "GHR", appName: "Garments HR & Performance" },
  { appCode: "GCI", appName: "Garments Compliance Intelligence" },
  { appCode: "GFO", appName: "Garments Fabric Optimization" },
  { appCode: "GBI", appName: "Garments Business Intelligence" },
  { appCode: "GKC", appName: "Garments Knowledge Centre" },
];

const factories = [
  {
    factoryId: "factory-001",
    factoryName: "MBN Demo Garments Factory",
  },
  {
    factoryId: "factory-002",
    factoryName: "Chattogram Export Unit",
  },
];

const shifts = [
  { shiftId: "shift-a", shiftName: "Shift A" },
  { shiftId: "shift-b", shiftName: "Shift B" },
  { shiftId: "general", shiftName: "General Shift" },
];

export default function ManufacturingSuiteHeader({
  currentApp = "GPA",
  language = "EN",
}: Props) {
  const daysRemaining = 183;

  return (
    <header className="w-full border-b bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">
            MBNCON Manufacturing Intelligence Suite
          </h1>

          <p className="text-sm text-gray-500">
            Manufacturing Operating System
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="rounded-lg border px-3 py-2 text-sm"
            defaultValue={currentApp}
          >
            {manufacturingSuiteApps.map((app) => (
              <option key={app.appCode} value={app.appCode}>
                {app.appCode} — {app.appName}
              </option>
            ))}
          </select>

          <select className="rounded-lg border px-3 py-2 text-sm">
            {factories.map((factory) => (
              <option key={factory.factoryId} value={factory.factoryId}>
                {factory.factoryName}
              </option>
            ))}
          </select>

          <select className="rounded-lg border px-3 py-2 text-sm">
            {shifts.map((shift) => (
              <option key={shift.shiftId} value={shift.shiftId}>
                {shift.shiftName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-lg border px-4 py-2 hover:bg-gray-100">
            Global Search
          </button>

          <button className="rounded-lg border px-4 py-2 hover:bg-gray-100">
            Notifications
          </button>

          <div className="rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            Trial: {daysRemaining} Days
          </div>

          <button className="rounded-lg border px-4 py-2">
            {language === "EN" ? "বাংলা" : "English"}
          </button>

          <div className="rounded-full bg-blue-600 px-4 py-2 font-semibold text-white">
            MS
          </div>
        </div>
      </div>
    </header>
  );
}