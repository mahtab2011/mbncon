"use client";

import { useState } from "react";

type Lang = "en" | "bn";

export default function GarmentManufacturingPerformanceInvestigationCentrePage() {
    const [showRegistration, setShowRegistration] = useState(false);

const [factoryName, setFactoryName] = useState("");
const [factoryGroup, setFactoryGroup] = useState("");
const [factoryCode, setFactoryCode] = useState("");
const [buyer, setBuyer] = useState("");
const [productType, setProductType] = useState("");
  const [lang, setLang] = useState<Lang>("en");
  const [numberOfLines, setNumberOfLines] = useState("");
const [numberOfEmployees, setNumberOfEmployees] = useState("");
const [investigationLeader, setInvestigationLeader] = useState("");
const [startDate, setStartDate] = useState("");
const [expectedCompletionDate, setExpectedCompletionDate] = useState("");
const [priority, setPriority] = useState("Medium");
const [status, setStatus] = useState("Open");
const [investigationReasons, setInvestigationReasons] = useState<string[]>([]);
const [performanceAreas, setPerformanceAreas] = useState<string[]>([]);
const [investigationMethods, setInvestigationMethods] = useState<string[]>([]);
const [investigationTeam, setInvestigationTeam] = useState<string[]>([]);
const [activeView, setActiveView] = useState<
  "registration" | "previous" | "dashboard" | null
>(null);
const investigationStats = {
  total: 12,
  ongoing: 4,
  completed: 7,
  critical: 3,
  averageDays: 5.6,
};

  const t =
    lang === "en"
      ? {
          title: "Garment Manufacturing Performance Investigation Centre",
          subtitle:
            "A structured Industrial Engineering investigation platform for identifying, analysing and improving manufacturing performance.",
          start: "Start New Investigation",
          previous: "Previous Investigations",
          dashboard: "Executive Dashboard",
        }

      : {
          title: "গার্মেন্টস ম্যানুফ্যাকচারিং পারফরম্যান্স ইনভেস্টিগেশন সেন্টার",
          subtitle:
            "ইন্ডাস্ট্রিয়াল ইঞ্জিনিয়ারিং ভিত্তিক তথ্যনির্ভর তদন্ত ও কর্মক্ষমতা উন্নয়ন প্ল্যাটফর্ম।",
          start: "নতুন তদন্ত শুরু করুন",
          previous: "পূর্ববর্তী তদন্তসমূহ",
          dashboard: "নির্বাহী ড্যাশবোর্ড",
        };
function toggleReason(reason: string) {
  setInvestigationReasons((current) =>
    current.includes(reason)
      ? current.filter((item) => item !== reason)
      : [...current, reason]
  );
}
        const investigationNumber = "INV-" + new Date().getFullYear() + "-0001";
        function togglePerformanceArea(area: string) {
  setPerformanceAreas((current) =>
    current.includes(area)
      ? current.filter((item) => item !== area)
      : [...current, area]
  );
}
function toggleInvestigationMethod(method: string) {
  setInvestigationMethods((current) =>
    current.includes(method)
      ? current.filter((item) => item !== method)
      : [...current, method]
  );
}
function toggleInvestigationTeam(member: string) {
  setInvestigationTeam((current) =>
    current.includes(member)
      ? current.filter((item) => item !== member)
      : [...current, member]
  );
}
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <section className="border-b border-cyan-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">

          <div>

            <h1 className="text-4xl font-black text-cyan-300">
              {t.title}
            </h1>

            <p className="mt-3 max-w-4xl text-slate-300">
              {t.subtitle}
            </p>

          </div>

          <button
            onClick={() =>
              setLang(lang === "en" ? "bn" : "en")
            }
            className="rounded-xl bg-cyan-600 px-5 py-3 font-bold hover:bg-cyan-500"
          >
            {lang === "en" ? "বাংলা" : "English"}
          </button>

        </div>

      </section>

      <section className="mx-auto mt-10 grid max-w-7xl gap-8 md:grid-cols-3">

        <button
        
  onClick={() => {
  setShowRegistration(true);
  setActiveView("registration");
}}
  className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-10 text-left transition hover:border-cyan-400"
>

          <h2 className="text-2xl font-bold text-cyan-300">
            {t.start}
          </h2>

        </button>

        <button
  onClick={() => {
    setShowRegistration(false);
    setActiveView("previous");
  }}
  className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-10 text-left transition hover:border-cyan-400"
>

          <h2 className="text-2xl font-bold text-cyan-300">
  {lang === "en"
    ? "Start Performance Investigation"
    : "পারফরম্যান্স ইনভেস্টিগেশন শুরু করুন"}
</h2>

<p className="mt-4 text-slate-300">
  {lang === "en"
    ? "Register a new factory investigation and begin structured Industrial Engineering analysis."
    : "নতুন কারখানার তদন্ত নিবন্ধন করুন এবং ইন্ডাস্ট্রিয়াল ইঞ্জিনিয়ারিং ভিত্তিক বিশ্লেষণ শুরু করুন।"}
</p>

        </button>
                    <a
              href="/investigation/executive-dashboard"
              className="rounded-3xl border border-purple-500/20 bg-slate-900 p-10 text-left transition hover:border-purple-400"
            >
              <h2 className="text-2xl font-bold text-purple-300">
                {lang === "en"
                  ? "Executive Investigation Dashboard"
                  : "নির্বাহী তদন্ত ড্যাশবোর্ড"}
              </h2>

              <p className="mt-4 text-slate-300">
                {lang === "en"
                  ? "View investigation summary, priority queue, department progress, and management actions."
                  : "তদন্ত সারাংশ, অগ্রাধিকার তালিকা, বিভাগভিত্তিক অগ্রগতি এবং ব্যবস্থাপনা করণীয় দেখুন।"}
              </p>
            </a>
            <a
              href="/software/garment-manufacturing-performance-investigation-centre/auto-data-analysis"
              className="rounded-3xl border border-emerald-500/20 bg-slate-900 p-10 text-left transition hover:border-emerald-400"
            >
              <h2 className="text-2xl font-bold text-emerald-300">
                {lang === "en"
                  ? "AI Auto Data Analysis"
                  : "এআই অটো ডাটা অ্যানালাইসিস"}
              </h2>

              <p className="mt-4 text-slate-300">
                {lang === "en"
                  ? "Analyse production, downtime, trend, and Pareto signals before starting detailed IE investigation."
                  : "বিস্তারিত আইই তদন্ত শুরুর আগে প্রোডাকশন, ডাউনটাইম, ট্রেন্ড এবং প্যারেটো সিগন্যাল বিশ্লেষণ করুন।"}
              </p>
            </a>
        <button
  onClick={() => {
    setShowRegistration(false);
    setActiveView("dashboard");
  }}
  className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-10 text-left transition hover:border-cyan-400"
>

          <h2 className="text-2xl font-bold text-cyan-300">
            {t.dashboard}
          </h2>

        </button>

      </section>
{showRegistration && (
  <section className="mt-8 rounded-3xl border border-cyan-500/20 bg-slate-900 p-8">

    <h2 className="text-3xl font-bold text-cyan-300">
      {lang === "en"
        ? "Factory Investigation Registration"
        : "কারখানা তদন্ত নিবন্ধন"}
    </h2>

    <div className="mt-8 grid gap-6 md:grid-cols-2">

<div className="rounded-2xl border border-cyan-500/20 bg-slate-800 p-5 md:col-span-2">

  <p className="text-sm text-slate-400">
    Investigation Number
  </p>

  <p className="mt-2 text-3xl font-black text-cyan-300">
    {investigationNumber}
  </p>

</div>
      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Factory Name
        </label>

        <input
          value={factoryName}
          onChange={(e) => setFactoryName(e.target.value)}
          className="w-full rounded-xl bg-slate-800 p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Factory Group
        </label>

        <input
          value={factoryGroup}
          onChange={(e) => setFactoryGroup(e.target.value)}
          className="w-full rounded-xl bg-slate-800 p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Factory Code
        </label>

        <input
          value={factoryCode}
          onChange={(e) => setFactoryCode(e.target.value)}
          className="w-full rounded-xl bg-slate-800 p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Buyer
        </label>

        <input
          value={buyer}
          onChange={(e) => setBuyer(e.target.value)}
          className="w-full rounded-xl bg-slate-800 p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Product Type
        </label>

        <input
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          className="w-full rounded-xl bg-slate-800 p-3"
        />
      </div>
<div>
  <label className="mb-2 block text-sm text-slate-300">
    Number of Sewing Lines
  </label>

  <input
    value={numberOfLines}
    onChange={(e) => setNumberOfLines(e.target.value)}
    className="w-full rounded-xl bg-slate-800 p-3"
  />
</div>

<div>
  <label className="mb-2 block text-sm text-slate-300">
    Number of Employees
  </label>

  <input
    value={numberOfEmployees}
    onChange={(e) => setNumberOfEmployees(e.target.value)}
    className="w-full rounded-xl bg-slate-800 p-3"
  />
</div>

<div>
  <label className="mb-2 block text-sm text-slate-300">
    Investigation Leader
  </label>

  <input
    value={investigationLeader}
    onChange={(e) => setInvestigationLeader(e.target.value)}
    className="w-full rounded-xl bg-slate-800 p-3"
  />
</div>

<div>
  <label className="mb-2 block text-sm text-slate-300">
    Start Date
  </label>

  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className="w-full rounded-xl bg-slate-800 p-3"
  />
</div>

<div>
  <label className="mb-2 block text-sm text-slate-300">
    Expected Completion Date
  </label>

  <input
    type="date"
    value={expectedCompletionDate}
    onChange={(e) => setExpectedCompletionDate(e.target.value)}
    className="w-full rounded-xl bg-slate-800 p-3"
  />
</div>

<div>
  <label className="mb-2 block text-sm text-slate-300">
    Priority
  </label>

  <select
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
    className="w-full rounded-xl bg-slate-800 p-3"
  >
    <option>Low</option>
    <option>Medium</option>
    <option>High</option>
    <option>Critical</option>
  </select>
</div>
    <div className="md:col-span-2 rounded-2xl border border-cyan-500/20 bg-slate-800 p-6">

  <h3 className="text-xl font-bold text-cyan-300">
    {lang === "en"
      ? "Reason for Investigation"
      : "তদন্তের কারণ"}
  </h3>
<div className="md:col-span-2 rounded-2xl border border-emerald-500/20 bg-slate-800 p-6">

  <h3 className="text-xl font-bold text-emerald-300">
    {lang === "en"
      ? "Performance Areas to Investigate"
      : "যেসব পারফরম্যান্স এরিয়া ইনভেস্টিগেট করা হবে"}
  </h3>

  <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">

    {[
      "Sample Development",
      "Buyer Approval",
      "Merchandising",
      "Commercial",
      "Planning",
      "Fabric Store",
      "Accessories Store",
      "Cutting",
      "Printing",
      "Embroidery",
      "Sewing",
      "Washing",
      "Finishing",
      "Quality",
      "Maintenance",
      "Warehouse",
      "Shipment",
      "Human Resources",
      "Training",
      "Compliance",
    ].map((area) => (

      <label
        key={area}
        className="flex items-center gap-3 rounded-xl bg-slate-900 p-3 hover:bg-slate-700"
      >
        <input
          type="checkbox"
          checked={performanceAreas.includes(area)}
          onChange={() => togglePerformanceArea(area)}
        />

        <span>{area}</span>

      </label>

    ))}

  </div>

</div>
  <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">

    {[
      "Low Productivity",
      "Low Efficiency",
      "High Rejection",
      "High DHU",
      "High Alteration",
      "High WIP",
      "Shipment Delay",
      "Machine Breakdown",
      "High Overtime",
      "High Absenteeism",
      "Buyer Complaint",
      "Cost Reduction",
    ].map((reason) => (

      <label
        key={reason}
        className="flex items-center gap-3 rounded-xl bg-slate-900 p-3 hover:bg-slate-700"
      >
        <input
          type="checkbox"
          checked={investigationReasons.includes(reason)}
          onChange={() => toggleReason(reason)}
        />

        <span>{reason}</span>

      </label>

    ))}

  </div>
<div className="md:col-span-2 rounded-2xl border border-purple-500/20 bg-slate-800 p-6">

  <h3 className="text-xl font-bold text-purple-300">
    {lang === "en"
      ? "Investigation Methods"
      : "তদন্তের পদ্ধতি"}
  </h3>

  <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">

    {[
      "Observation",
      "Gemba Walk",
      "Method Study",
      "Activity Sampling",
      "Time Study",
      "Motion Study",
      "Process Mapping",
      "Workflow Analysis",
      "Pareto Analysis",
      "Fishbone Diagram",
      "5 Why Analysis",
      "Brainstorming",
      "Worker Interview",
      "Supervisor Interview",
      "Data Analysis",
      "Video Recording",
      "Pilot Trial",
      "Benchmarking",
    ].map((method) => (

      <label
        key={method}
        className="flex items-center gap-3 rounded-xl bg-slate-900 p-3 hover:bg-slate-700"
      >
        <input
          type="checkbox"
          checked={investigationMethods.includes(method)}
          onChange={() => toggleInvestigationMethod(method)}
        />

        <span>{method}</span>

      </label>

    ))}

  </div>
<div className="md:col-span-2 rounded-2xl border border-orange-500/20 bg-slate-800 p-6">

  <h3 className="text-xl font-bold text-orange-300">
    {lang === "en"
      ? "Investigation Team"
      : "ইনভেস্টিগেশন টিম"}
  </h3>

  <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">

    {[
      "Factory Manager",
      "Production Manager",
      "Industrial Engineering Manager",
      "Planning Manager",
      "Quality Manager",
      "Maintenance Manager",
      "Merchandising Representative",
      "Commercial Representative",
      "Human Resources Representative",
      "Line Supervisor",
      "Senior Operator",
      "Mechanic",
      "Store Representative",
      "Shipment Representative",
      "External Consultant",
    ].map((member) => (

      <label
        key={member}
        className="flex items-center gap-3 rounded-xl bg-slate-900 p-3 hover:bg-slate-700"
      >
        <input
          type="checkbox"
          checked={investigationTeam.includes(member)}
          onChange={() => toggleInvestigationTeam(member)}
        />

        <span>{member}</span>

      </label>

    ))}

  </div>

</div>
</div>
</div>
    </div>

  </section>
)}
{activeView === "previous" && (

<section className="mx-auto mt-8 max-w-7xl rounded-3xl border border-cyan-500/20 bg-slate-900 p-8">

  <h2 className="text-3xl font-bold text-cyan-300">
    {lang === "en"
      ? "Previous Factory Investigations"
      : "পূর্ববর্তী কারখানা ইনভেস্টিগেশন"}
  </h2>

  <p className="mt-4 text-slate-300">
    {lang === "en"
      ? "All completed and ongoing investigations will appear here."
      : "সকল সম্পন্ন ও চলমান ইনভেস্টিগেশন এখানে দেখা যাবে।"}
  </p>

  <div className="mt-8 overflow-x-auto">

    <table className="w-full">

      <thead>

        <tr className="border-b border-slate-700">

          <th className="p-3 text-left">Investigation No.</th>

          <th className="p-3 text-left">Factory</th>

          <th className="p-3 text-left">Buyer</th>

          <th className="p-3 text-left">Leader</th>

          <th className="p-3 text-left">Status</th>

        </tr>

      </thead>

      <tbody>

        <tr className="border-b border-slate-800">

          <td className="p-3">INV-2026-0001</td>

          <td className="p-3">Demo Factory</td>

          <td className="p-3">H&M</td>

          <td className="p-3">Factory Manager</td>

          <td className="p-3 text-cyan-300">
            Open
          </td>

        </tr>

      </tbody>

    </table>

  </div>

</section>

)}
<section className="mt-8 grid gap-6 md:grid-cols-5">

  <div className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6">
    <p className="text-sm text-slate-400">
      Total Investigations
    </p>

    <h2 className="mt-3 text-4xl font-black text-cyan-300">
      {investigationStats.total}
    </h2>
  </div>

  <div className="rounded-3xl border border-green-500/20 bg-slate-900 p-6">
    <p className="text-sm text-slate-400">
      Completed
    </p>

    <h2 className="mt-3 text-4xl font-black text-green-400">
      {investigationStats.completed}
    </h2>
  </div>

  <div className="rounded-3xl border border-yellow-500/20 bg-slate-900 p-6">
    <p className="text-sm text-slate-400">
      Ongoing
    </p>

    <h2 className="mt-3 text-4xl font-black text-yellow-400">
      {investigationStats.ongoing}
    </h2>
  </div>

  <div className="rounded-3xl border border-red-500/20 bg-slate-900 p-6">
    <p className="text-sm text-slate-400">
      Critical Cases
    </p>

    <h2 className="mt-3 text-4xl font-black text-red-400">
      {investigationStats.critical}
    </h2>
  </div>

  <div className="rounded-3xl border border-purple-500/20 bg-slate-900 p-6">
    <p className="text-sm text-slate-400">
      Avg Investigation Days
    </p>

    <h2 className="mt-3 text-4xl font-black text-purple-300">
      {investigationStats.averageDays}
    </h2>
  </div>

</section>
    </main>
  );
}