"use client";

type ChecklistItem = {
  id: string;
  area: string;
  status: "READY" | "PARTIAL" | "NEXT";
  note: string;
};

const checklist: ChecklistItem[] = [
  {
    id: "RC-001",
    area: "Manufacturing Home",
    status: "READY",
    note: "Main suite landing page is active.",
  },
  {
    id: "RC-002",
    area: "Executive Welcome",
    status: "READY",
    note: "MD/CEO morning briefing page is ready.",
  },
  {
    id: "RC-003",
    area: "BGMEA Demo Flow",
    status: "READY",
    note: "Guided pilot demonstration mode is ready.",
  },
  {
    id: "RC-004",
    area: "Global Executive Dashboard",
    status: "READY",
    note: "Executive summary and AI overview are ready.",
  },
  {
    id: "RC-005",
    area: "Cutting Intelligence Suite",
    status: "READY",
    note: "Cutting, marker, consumption, optimizer and traceability modules are ready.",
  },
  {
    id: "RC-006",
    area: "Fabric Intelligence",
    status: "READY",
    note: "Inspection, shade management and fabric optimization are ready.",
  },
  {
    id: "RC-007",
    area: "Mobile Responsiveness",
    status: "PARTIAL",
    note: "Core pages are responsive; final mobile polish still needed.",
  },
  {
    id: "RC-008",
    area: "Firestore Live Data",
    status: "PARTIAL",
    note: "Architecture exists; live collection wiring remains next phase.",
  },
  {
    id: "RC-009",
    area: "Play Store Packaging",
    status: "NEXT",
    note: "PWA/Android packaging will follow after pilot demo approval.",
  },
];

function statusClass(status: ChecklistItem["status"]) {
  if (status === "READY") return "bg-green-100 text-green-700";
  if (status === "PARTIAL") return "bg-yellow-100 text-yellow-700";
  return "bg-blue-100 text-blue-700";
}

export default function BGMEAReleaseChecklistPage() {
  const ready = checklist.filter((item) => item.status === "READY").length;
  const partial = checklist.filter((item) => item.status === "PARTIAL").length;
  const next = checklist.filter((item) => item.status === "NEXT").length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <section className="mb-8 rounded-2xl bg-blue-700 p-8 text-white shadow">
        <h1 className="text-4xl font-bold">
          BGMEA Pilot Release Checklist
        </h1>

        <p className="mt-3 text-blue-100">
          GPA pilot readiness review for executive demo, cutting intelligence,
          fabric intelligence and next-phase live data deployment.
        </p>
      </section>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card title="Ready" value={ready.toString()} />
        <Card title="Partial" value={partial.toString()} />
        <Card title="Next Phase" value={next.toString()} />
        <Card title="Pilot Status" value="Demo Ready" />
      </div>

      <section className="mb-8 rounded-xl border border-green-200 bg-green-50 p-6">
        <h2 className="text-2xl font-bold text-green-700">
          Release Assessment
        </h2>

        <p className="mt-3 text-gray-700">
          GPA is ready for a controlled BGMEA pilot demonstration. The strongest
          demo flow is Executive Welcome → Global Dashboard → Executive Command
          Centre → Cutting Intelligence → Fabric Inspection → Fabric Optimizer
          → Roll & Bundle Traceability.
        </p>
      </section>

      <div className="grid gap-6">
        {checklist.map((item) => (
          <section
            key={item.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {item.area}
                </h2>

                <p className="mt-2 text-gray-600">
                  {item.note}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${statusClass(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="mt-2 text-2xl font-bold text-blue-700">
        {value}
      </h2>
    </div>
  );
}