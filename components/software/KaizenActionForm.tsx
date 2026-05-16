"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function KaizenActionForm() {
  const [department, setDepartment] = useState("");
  const [problem, setProblem] = useState("");
  const [improvement, setImprovement] = useState("");
  const [owner, setOwner] = useState("");
  const [targetDate, setTargetDate] = useState("");
const [saving, setSaving] = useState(false);
const [saved, setSaved] = useState(false);

const handleSave = async () => {
  if (!department || !problem || !improvement || !owner || !targetDate) {
    alert("Please complete all fields before saving.");
    return;
  }

  try {
    setSaving(true);
    setSaved(false);

    await addDoc(collection(db, "kaizenActions"), {
      department,
      problem,
      improvement,
      owner,
      targetDate,
      status: "Open",
      createdAt: serverTimestamp(),
    });

    setDepartment("");
    setProblem("");
    setImprovement("");
    setOwner("");
    setTargetDate("");
    setSaved(true);
  } catch (error) {
    console.error("Error saving Kaizen action:", error);
    alert("Failed to save Kaizen action.");
  } finally {
    setSaving(false);
  }
};
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">
          Kaizen Action Form
        </h2>

        <p className="mt-2 text-sm text-neutral-600">
          Continuous improvement tracking for manufacturing excellence.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">
            Department
          </label>

          <input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Production / Cutting / Sewing / Finishing"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">
            Problem Identified
          </label>

          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Describe waste, delay, quality issue or inefficiency..."
            rows={4}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">
            Improvement Action
          </label>

          <textarea
            value={improvement}
            onChange={(e) => setImprovement(e.target.value)}
            placeholder="Describe the proposed improvement..."
            rows={4}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              Responsible Owner
            </label>

            <input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Manager / Supervisor"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              Target Completion Date
            </label>

            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>
        </div>

        <button
  onClick={handleSave}
  disabled={saving}
  className="mt-4 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
>
  {saving ? "Saving..." : "Save Kaizen Action"}
</button>

{saved && (
  <p className="text-sm font-semibold text-emerald-700">
    Kaizen action saved successfully.
  </p>
)}
      </div>
    </div>
  );
}