"use client";

import { useMemo, useState } from "react";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type ComplaintRow = {
  customer: string;
  product: string;
  complaintType: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  quantityAffected: number;
  rootCause: string;
  correctiveAction: string;
  responsiblePerson: string;
  status: "Open" | "In Progress" | "Closed";
};

const tqmFlow = [
  "Record Complaint",
  "Assess Severity",
  "Find Root Cause",
  "Assign Corrective Action",
  "Verify Closure",
];

export default function CustomerComplaintCorrectiveActionPage() {
  const [rows, setRows] = useState<ComplaintRow[]>([
    {
      customer: "European Buyer A",
      product: "Leather Shoe Upper",
      complaintType: "Stitching Defect",
      severity: "High",
      quantityAffected: 48,
      rootCause: "Operator skill gap and weak final checking",
      correctiveAction: "Retrain operator and strengthen inspection",
      responsiblePerson: "Quality Manager",
      status: "In Progress",
    },
    {
      customer: "Retail Customer B",
      product: "Finished Product",
      complaintType: "Packaging Damage",
      severity: "Medium",
      quantityAffected: 22,
      rootCause: "Handling and packing method weakness",
      correctiveAction: "Revise packing SOP and train packing team",
      responsiblePerson: "Packing Supervisor",
      status: "Open",
    },
  ]);

  const [form, setForm] = useState<ComplaintRow>({
    customer: "",
    product: "",
    complaintType: "",
    severity: "Medium",
    quantityAffected: 0,
    rootCause: "",
    correctiveAction: "",
    responsiblePerson: "",
    status: "Open",
  });

  const summary = useMemo(() => {
    const open = rows.filter((r) => r.status !== "Closed").length;

    const critical = rows.filter(
      (r) => r.severity === "Critical"
    ).length;

    const totalAffected = rows.reduce(
      (sum, r) => sum + r.quantityAffected,
      0
    );

    return {
      open,
      critical,
      totalAffected,
    };
  }, [rows]);

  const addComplaint = () => {
    if (
      !form.customer ||
      !form.product ||
      !form.complaintType ||
      !form.rootCause ||
      !form.correctiveAction ||
      !form.responsiblePerson
    ) {
      alert("Please complete all required fields.");
      return;
    }

    setRows([...rows, form]);

    setForm({
      customer: "",
      product: "",
      complaintType: "",
      severity: "Medium",
      quantityAffected: 0,
      rootCause: "",
      correctiveAction: "",
      responsiblePerson: "",
      status: "Open",
    });
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section
        id="customer-complaint-overview"
        className="scroll-mt-28 bg-slate-950 px-6 py-16 text-white"
      >
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Customer Complaint & Corrective Action System
          </p>

          <h1 className="max-w-6xl text-5xl font-extrabold leading-tight">
            Turn Customer Complaints Into Root-Cause Learning and
            Corrective Action
          </h1>

          <p className="mt-6 max-w-5xl text-xl leading-relaxed text-white/85">
            This TQM module captures customer complaints, severity,
            affected quantity, root causes, corrective actions,
            responsible owners, status, and follow-up so quality
            problems become structured improvement opportunities.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            <a
              href="#live-complaint-register"
              className="rounded-3xl bg-red-100 p-8 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-sm font-bold uppercase tracking-wide text-red-700">
                Open Actions
              </p>

              <h2 className="mt-4 text-5xl font-extrabold text-red-950">
                {summary.open}
              </h2>
            </a>

            <a
              href="#live-complaint-register"
              className="rounded-3xl bg-yellow-100 p-8 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-sm font-bold uppercase tracking-wide text-yellow-700">
                Critical Complaints
              </p>

              <h2 className="mt-4 text-5xl font-extrabold text-yellow-950">
                {summary.critical}
              </h2>
            </a>

            <a
              href="#live-complaint-register"
              className="rounded-3xl bg-blue-100 p-8 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
                Quantity Affected
              </p>

              <h2 className="mt-4 text-5xl font-extrabold text-blue-950">
                {summary.totalAffected}
              </h2>
            </a>
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-3">
            <section
              id="complaint-entry-form"
              className="scroll-mt-28 rounded-3xl bg-white p-8 shadow-md"
            >
              <h2 className="text-3xl font-extrabold text-red-950">
                Complaint Entry Form
              </h2>

              <div className="mt-8 space-y-5">
                {[
                  ["customer", "Customer / Buyer"],
                  ["product", "Product / Style"],
                  ["complaintType", "Complaint Type"],
                  ["rootCause", "Root Cause"],
                  ["correctiveAction", "Corrective Action"],
                  ["responsiblePerson", "Responsible Person"],
                ].map(([key, label]) => (
                  <section
                    key={key}
                    id={slugify(label)}
                    className="scroll-mt-28 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <label className="block">
                      <span className="font-bold text-slate-700">
                        {label}
                      </span>

                      <input
                        value={String(
                          form[key as keyof ComplaintRow]
                        )}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [key]: e.target.value,
                          })
                        }
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-red-600"
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    </label>
                  </section>
                ))}

                <section
                  id="quantity-affected"
                  className="scroll-mt-28 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <label className="block">
                    <span className="font-bold text-slate-700">
                      Quantity Affected
                    </span>

                    <input
                      type="number"
                      value={form.quantityAffected}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          quantityAffected: Number(
                            e.target.value
                          ),
                        })
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-red-600"
                    />
                  </label>
                </section>

                <section
                  id="severity"
                  className="scroll-mt-28 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <label className="block">
                    <span className="font-bold text-slate-700">
                      Severity
                    </span>

                    <select
                      value={form.severity}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          severity:
                            e.target
                              .value as ComplaintRow["severity"],
                        })
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-red-600"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </label>
                </section>

                <section
                  id="status"
                  className="scroll-mt-28 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <label className="block">
                    <span className="font-bold text-slate-700">
                      Status
                    </span>

                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status:
                            e.target
                              .value as ComplaintRow["status"],
                        })
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-red-600"
                    >
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Closed</option>
                    </select>
                  </label>
                </section>

                <button
                  onClick={addComplaint}
                  className="w-full rounded-2xl bg-red-900 px-8 py-4 text-lg font-extrabold text-white shadow-md transition hover:-translate-y-1 hover:bg-red-800"
                >
                  Save Complaint & Corrective Action
                </button>
              </div>
            </section>

            <section
              id="live-complaint-register"
              className="scroll-mt-28 rounded-3xl bg-white p-8 shadow-md xl:col-span-2"
            >
              <h2 className="text-3xl font-extrabold text-slate-900">
                Live Complaint & Corrective Action Register
              </h2>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-200 text-left">
                      <th className="rounded-l-xl p-4">
                        Customer
                      </th>
                      <th className="p-4">Product</th>
                      <th className="p-4">Complaint</th>
                      <th className="p-4">Severity</th>
                      <th className="p-4">Qty</th>
                      <th className="p-4">Owner</th>
                      <th className="rounded-r-xl p-4">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-200"
                      >
                        <td className="p-4 font-bold">
                          {row.customer}
                        </td>

                        <td className="p-4">
                          {row.product}
                        </td>

                        <td className="p-4">
                          {row.complaintType}
                        </td>

                        <td className="p-4">
                          {row.severity}
                        </td>

                        <td className="p-4">
                          {row.quantityAffected}
                        </td>

                        <td className="p-4">
                          {row.responsiblePerson}
                        </td>

                        <td className="p-4">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 space-y-5">
                {rows.map((row, index) => (
                  <a
                    key={index}
                    href={`#${slugify(row.complaintType)}`}
                    id={slugify(row.complaintType)}
                    className="block rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <h3 className="text-2xl font-extrabold text-blue-950">
                      {row.complaintType}
                    </h3>

                    <p className="mt-3 text-lg text-slate-700">
                      <strong>Root Cause:</strong>{" "}
                      {row.rootCause}
                    </p>

                    <p className="mt-3 text-lg text-slate-700">
                      <strong>Corrective Action:</strong>{" "}
                      {row.correctiveAction}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          </div>

          <section
            id="tqm-implementation-flow"
            className="mt-12 scroll-mt-28 rounded-3xl bg-slate-900 p-8 text-white shadow-md"
          >
            <h2 className="text-3xl font-extrabold text-cyan-300">
              TQM Implementation Flow
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
              {tqmFlow.map((item) => (
                <a
                  key={item}
                  id={slugify(item)}
                  href={`#${slugify(item)}`}
                  className="rounded-2xl bg-white/10 p-6 transition hover:-translate-y-1 hover:bg-white/20"
                >
                  <h3 className="text-xl font-extrabold text-yellow-300">
                    {item}
                  </h3>

                  <p className="mt-4 text-slate-300">
                    Standard TQM implementation step to ensure
                    complaints are managed through evidence,
                    accountability, and follow-up.
                  </p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}