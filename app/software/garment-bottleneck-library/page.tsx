"use client";

import { useMemo, useState } from "react";

type Lang = "en" | "bn";

type BottleneckItem = {
  id: string;
    department: string;
  process: string;
  activity: string;
  bottleneck: string;
  category: string;
  symptoms: string;
  rootCause: string;
  financialImpact: number;
  delayDays: number;
  severity: "Low" | "Medium" | "High" | "Critical";
  priority: "Monitor" | "Supervisor Action" | "Department Head Action" | "Factory Manager Action" | "Executive Action";
  responsibleDepartment: string;
  responsiblePerson: string;
  immediateAction: string;
  correctiveAction: string;
  preventiveAction: string;
  aiRecommendation: string;
  consultantNotes: string;
  industrialEngineeringTools: string;
  kpiToMonitor: string;
  estimatedSaving: number;
  occurrenceFrequency: "Rare" | "Occasional" | "Frequent" | "Very Frequent";
  difficultyToSolve: "Easy" | "Medium" | "Difficult" | "Very Difficult";
  status: "Open" | "Monitoring" | "Recovered";
};

const initialBottlenecks: BottleneckItem[] = [
  {id: "BT-001",
    department: "Sample Room",
    process: "Fit Sample",
    activity: "Sample Approval",
    bottleneck: "Sample approval delay",
    category: "Buyer",
    symptoms: "Bulk production cannot start, production plan waits, shipment date becomes tight.",
    rootCause: "Buyer comments received late and sample room capacity overloaded.",
    financialImpact: 18000,
    delayDays: 6,
    severity: "Critical",
    priority: "Executive Action",
    responsibleDepartment: "Sample Room",
    responsiblePerson: "Sample Room Manager",
    immediateAction: "Arrange online fit approval meeting within 24 hours.",
    correctiveAction: "Reserve urgent sample capacity and follow up buyer comments daily.",
    preventiveAction: "Set buyer approval deadline before order confirmation.",
    aiRecommendation: "Escalate sample approval today and prepare production in parallel where possible.",
    consultantNotes: "Check sample room load, buyer response time and number of pending samples.",
    industrialEngineeringTools: "Gemba Walk, Pareto Analysis, Root Cause Analysis",
    kpiToMonitor: "Average sample approval days",
    estimatedSaving: 12000,
    occurrenceFrequency: "Frequent",
    difficultyToSolve: "Medium",
    status: "Open",
  },
];
function getKnowledgeColor(score: number) {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-400";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
}
function getKnowledgeScore(item: BottleneckItem) {
  let score = 0;

  if (item.symptoms) score += 10;
  if (item.rootCause) score += 10;
  if (item.immediateAction) score += 10;
  if (item.correctiveAction) score += 10;
  if (item.preventiveAction) score += 10;
  if (item.aiRecommendation) score += 10;
  if (item.consultantNotes) score += 10;
  if (item.industrialEngineeringTools) score += 10;
  if (item.kpiToMonitor) score += 10;
  if (item.estimatedSaving > 0) score += 10;

  return score;
}
function calculatePriorityScore(item: BottleneckItem) {
  let score = 0;

  score += item.financialImpact / 1000;

  score += item.delayDays * 5;

  if (item.severity === "Critical") score += 30;
  if (item.severity === "High") score += 20;
  if (item.severity === "Medium") score += 10;

  if (item.occurrenceFrequency === "Very Frequent") score += 20;
  if (item.occurrenceFrequency === "Frequent") score += 12;
  if (item.occurrenceFrequency === "Occasional") score += 6;

  return Math.min(Math.round(score), 100);
}
export default function GarmentBottleneckLibraryPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [items, setItems] = useState<BottleneckItem[]>(initialBottlenecks);

  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.department)))],
    [items]
  );

  const filteredItems = useMemo(() => {
    return items
  .filter((item) => {
    const matchesDepartment =
      departmentFilter === "All" || item.department === departmentFilter;

    const matchesSeverity =
      severityFilter === "All" || item.severity === severityFilter;

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    const query = search.toLowerCase();

    const matchesSearch =
      item.department.toLowerCase().includes(query) ||
      item.process.toLowerCase().includes(query) ||
      item.activity.toLowerCase().includes(query) ||
      item.bottleneck.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.symptoms.toLowerCase().includes(query) ||
      item.rootCause.toLowerCase().includes(query) ||
      item.aiRecommendation.toLowerCase().includes(query) ||
      item.consultantNotes.toLowerCase().includes(query) ||
      item.industrialEngineeringTools.toLowerCase().includes(query);

    return (
      matchesDepartment &&
      matchesSeverity &&
      matchesStatus &&
      matchesSearch
    );
  })
  .sort(
    (a, b) =>
      calculatePriorityScore(b) -
      calculatePriorityScore(a)
  );
  }, [items, departmentFilter, severityFilter, statusFilter, search]);

  const totalImpact = useMemo(
    () => filteredItems.reduce((sum, item) => sum + item.financialImpact, 0),
    [filteredItems]
  );

  const criticalCount = useMemo(
    () => filteredItems.filter((item) => item.severity === "Critical").length,
    [filteredItems]
  );

  const openCount = useMemo(
    () => filteredItems.filter((item) => item.status === "Open").length,
    [filteredItems]
  );

  const t =
    lang === "en"
      ? {
          title: "Garment Bottleneck Library",
          subtitle:
            "Master knowledge base for garment value stream bottlenecks, root causes, financial impact and AI recovery actions.",
          total: "Total Bottlenecks",
          critical: "Critical Bottlenecks",
          open: "Open Issues",
          impact: "Financial Impact",
          department: "Department",
          process: "Process",
          bottleneck: "Bottleneck",
          severity: "Severity",
          delay: "Delay",
          financial: "Financial Impact",
          root: "Root Cause",
          ai: "AI Recommendation",
          status: "Status",
          search: "Search bottleneck, root cause, recommendation...",
          aiPanel: "AI Knowledge Advisor",
        }
      : {
          title: "গার্মেন্টস বটলনেক লাইব্রেরি",
          subtitle:
            "গার্মেন্টস ভ্যালু স্ট্রিম বটলনেক, মূল কারণ, আর্থিক প্রভাব এবং AI রিকভারি অ্যাকশনের মাস্টার জ্ঞানভান্ডার।",
          total: "মোট বটলনেক",
          critical: "ক্রিটিক্যাল বটলনেক",
          open: "ওপেন ইস্যু",
          impact: "আর্থিক প্রভাব",
          department: "বিভাগ",
          process: "প্রসেস",
          bottleneck: "বটলনেক",
          severity: "গুরুত্ব",
          delay: "বিলম্ব",
          financial: "আর্থিক প্রভাব",
          root: "মূল কারণ",
          ai: "AI সুপারিশ",
          status: "অবস্থা",
          search: "বটলনেক, মূল কারণ, সুপারিশ খুঁজুন...",
          aiPanel: "AI জ্ঞান উপদেষ্টা",
        };

  function addNewBottleneck() {
  setItems((current) => [
    {id: `BT-${String(current.length + 1).padStart(3, "0")}`,
      department: "New Department",
      process: "New Process",
      activity: "New Activity",
      bottleneck: "New Bottleneck",
      category: "Management",
      symptoms: "Write visible symptoms",
      rootCause: "Write root cause",
      financialImpact: 0,
      delayDays: 0,
      severity: "Medium",
      priority: "Supervisor Action",
      responsibleDepartment: "New Department",
      responsiblePerson: "Responsible Person",
      immediateAction: "Write immediate action",
      correctiveAction: "Write corrective action",
      preventiveAction: "Write preventive action",
      aiRecommendation: "Write AI recommendation",
      consultantNotes: "Write consultant notes",
      industrialEngineeringTools: "Gemba Walk, Pareto Analysis",
      kpiToMonitor: "Write performance measure",
      estimatedSaving: 0,
      occurrenceFrequency: "Occasional",
      difficultyToSolve: "Medium",
      status: "Open",
    },
    ...current,
  ]);
}

  function updateItem(
    index: number,
    field: keyof BottleneckItem,
    value: string | number
  ) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
              MBN Garment Value Stream Intelligence
            </p>

            <h1 className="mt-3 text-4xl font-black lg:text-5xl">
              {t.title}
            </h1>

            <p className="mt-4 max-w-5xl text-slate-300">
              {t.subtitle}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setLang("en")}
              className={`rounded-xl px-4 py-2 font-bold ${
                lang === "en" ? "bg-cyan-400 text-slate-950" : "bg-slate-800"
              }`}
            >
              EN
            </button>

            <button
              onClick={() => setLang("bn")}
              className={`rounded-xl px-4 py-2 font-bold ${
                lang === "bn" ? "bg-cyan-400 text-slate-950" : "bg-slate-800"
              }`}
            >
              বাংলা
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <KPI title={t.total} value={filteredItems.length.toString()} />
          <KPI title={t.critical} value={criticalCount.toString()} />
          <KPI title={t.open} value={openCount.toString()} />
          <KPI title={t.impact} value={`$${totalImpact.toLocaleString()}`} />
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6">
          <div className="grid gap-4 md:grid-cols-5">
            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className="rounded-xl bg-slate-950 p-3"
            >
              {departments.map((department) => (
                <option key={department}>{department}</option>
              ))}
            </select>

            <select
              value={severityFilter}
              onChange={(event) => setSeverityFilter(event.target.value)}
              className="rounded-xl bg-slate-950 p-3"
            >
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl bg-slate-950 p-3"
            >
              <option>All</option>
              <option>Open</option>
              <option>Monitoring</option>
              <option>Recovered</option>
            </select>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.search}
              className="rounded-xl bg-slate-950 p-3 md:col-span-2"
            />
          </div>

          <button
            onClick={addNewBottleneck}
            className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950"
          >
            + Add New Bottleneck
          </button>
        </section>

        <section className="mb-8 mt-8 grid gap-6 lg:grid-cols-2">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg transition hover:border-cyan-400"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-300">{item.department}</p>

                  <h3 className="mt-1 text-2xl font-bold">
                    {item.bottleneck}
                  </h3>

                  <p className="mt-2 text-slate-400">
                    {item.process} → {item.activity}
                  </p>
                </div>

                <span className="rounded-xl bg-red-600 px-3 py-2 text-sm font-bold">
                  {item.severity}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Category</p>
                  <p>{item.category}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Delay</p>
                  <p>{item.delayDays} Days</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Financial Impact</p>
                  <p>${item.financialImpact}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Estimated Saving</p>
                  <p>${item.estimatedSaving}</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-800 p-4">
                <p className="text-xs text-cyan-300">AI Recommendation</p>

                <p className="mt-2 text-sm leading-7">
                  {item.aiRecommendation}
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4">
                <p className="text-xs font-bold text-yellow-300">
                  {lang === "en"
                    ? "Executive Priority Score"
                    : "নির্বাহী অগ্রাধিকার স্কোর"}
                </p>

                <p className="mt-3 text-4xl font-black text-white">
                  {calculatePriorityScore(item)}
                  <span className="text-lg">/100</span>
                </p>

                <p className="mt-2 text-sm">
                  {calculatePriorityScore(item) >= 90
                    ? "🔴 Executive Emergency"
                    : calculatePriorityScore(item) >= 70
                    ? "🟠 Factory Manager Action"
                    : calculatePriorityScore(item) >= 50
                    ? "🟡 Department Head Action"
                    : "🟢 Monitor"}
                </p>
              </div>

              <div className="mt-6">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">
                    Knowledge Completion
                  </span>

                  <span className="font-bold text-cyan-300">
                    {getKnowledgeScore(item)}%
                  </span>
                </div>

                <div className="mt-2 h-3 rounded-full bg-slate-700">
                  <div
                    className={`h-3 rounded-full ${getKnowledgeColor(
                      getKnowledgeScore(item)
                    )}`}
                    style={{
                      width: `${getKnowledgeScore(item)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">
                    {lang === "en"
                      ? "Financial Impact"
                      : "ফাইন্যান্সিয়াল ইমপ্যাক্ট"}
                  </span>

                  <span className="font-bold text-yellow-300">
                    ${item.financialImpact.toLocaleString()}
                  </span>
                </div>

                <div className="mt-2 h-3 rounded-full bg-slate-700">
                  <div
                    className="h-3 rounded-full bg-yellow-400"
                    style={{
                      width: `${Math.min(item.financialImpact / 500, 100)}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  {item.financialImpact >= 30000
                    ? "Very High Impact"
                    : item.financialImpact >= 15000
                    ? "High Impact"
                    : item.financialImpact >= 5000
                    ? "Medium Impact"
                    : "Low Impact"}
                </p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 overflow-x-auto rounded-3xl border border-white/10 bg-slate-900 p-6">
          <table className="min-w-[1500px] w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-sm text-slate-300">
                <th className="p-3">{t.department}</th>
                <th className="p-3">{t.process}</th>
                <th className="p-3">{t.bottleneck}</th>
                <th className="p-3">{t.severity}</th>
                <th className="p-3">{t.delay}</th>
                <th className="p-3">{t.financial}</th>
                <th className="p-3">{t.root}</th>
                <th className="p-3">{t.ai}</th>
                <th className="p-3">{t.status}</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => {
                const realIndex = items.indexOf(item);

                return (
                  <tr
                    key={item.id}
                    className="border-b border-white/5"
                  >
                    <EditableCell
                      value={item.department}
                      onChange={(value) =>
                        updateItem(realIndex, "department", value)
                      }
                    />

                    <EditableCell
                      value={item.process}
                      onChange={(value) =>
                        updateItem(realIndex, "process", value)
                      }
                    />

                    <EditableCell
                      value={item.bottleneck}
                      onChange={(value) =>
                        updateItem(realIndex, "bottleneck", value)
                      }
                    />

                    <td className="p-3">
                      <select
                        value={item.severity}
                        onChange={(event) =>
                          updateItem(realIndex, "severity", event.target.value)
                        }
                        className="rounded-lg bg-slate-950 p-2"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        value={item.delayDays}
                        onChange={(event) =>
                          updateItem(
                            realIndex,
                            "delayDays",
                            Number(event.target.value)
                          )
                        }
                        className="w-24 rounded-lg bg-slate-950 p-2"
                      />
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        value={item.financialImpact}
                        onChange={(event) =>
                          updateItem(
                            realIndex,
                            "financialImpact",
                            Number(event.target.value)
                          )
                        }
                        className="w-32 rounded-lg bg-slate-950 p-2"
                      />
                    </td>

                    <EditableCell
                      value={item.rootCause}
                      wide
                      onChange={(value) =>
                        updateItem(realIndex, "rootCause", value)
                      }
                    />

                    <EditableCell
                      value={item.aiRecommendation}
                      wide
                      onChange={(value) =>
                        updateItem(realIndex, "aiRecommendation", value)
                      }
                    />

                    <td className="p-3">
                      <select
                        value={item.status}
                        onChange={(event) =>
                          updateItem(realIndex, "status", event.target.value)
                        }
                        className="rounded-lg bg-slate-950 p-2"
                      >
                        <option>Open</option>
                        <option>Monitoring</option>
                        <option>Recovered</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
          <h2 className="text-2xl font-bold text-cyan-300">{t.aiPanel}</h2>

          <p className="mt-4 leading-8 text-slate-200">
            {lang === "en"
              ? "The library identifies bottlenecks across business development, sample room, commercial, sourcing, production, quality and shipment. The next version will connect this library to live factory alerts and AI recovery planning."
              : "এই লাইব্রেরি বিজনেস ডেভেলপমেন্ট, স্যাম্পল রুম, কমার্শিয়াল, সোর্সিং, উৎপাদন, মান নিয়ন্ত্রণ এবং শিপমেন্ট জুড়ে বটলনেক শনাক্ত করে। পরবর্তী সংস্করণে এটি লাইভ ফ্যাক্টরি অ্যালার্ট এবং AI রিকভারি প্ল্যানিংয়ের সাথে যুক্ত হবে।"}
          </p>
        </section>
      </div>
    </main>
  );
}

function KPI({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function EditableCell({
  value,
  onChange,
  wide,
}: {
  value: string;
  onChange: (value: string) => void;
  wide?: boolean;
}) {
  return (
    <td className="p-3">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`rounded-lg bg-slate-950 p-2 ${
          wide ? "w-80" : "w-44"
        }`}
      />
    </td>
  );
}