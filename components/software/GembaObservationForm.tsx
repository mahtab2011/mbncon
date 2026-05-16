"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function GembaObservationForm() {
  const [area, setArea] = useState("");
  const [observationType, setObservationType] = useState("");
  const [details, setDetails] = useState("");
  const [observer, setObserver] = useState("");
  const [severity, setSeverity] = useState("Medium");
const [saving, setSaving] = useState(false);
const [saved, setSaved] = useState(false);

const handleSave = async () => {
  if (!area || !observationType || !details || !observer) {
    alert("Please complete all fields before saving.");
    return;
  }

  try {
    setSaving(true);
    setSaved(false);

    await addDoc(collection(db, "gembaObservations"), {
      area,
      observationType,
      details,
      observer,
      severity,
      status: "Open",
      createdAt: serverTimestamp(),
    });

    setArea("");
    setObservationType("");
    setDetails("");
    setObserver("");
    setSeverity("Medium");
    setSaved(true);
  } catch (error) {
    console.error("Error saving Gemba observation:", error);
    alert("Failed to save Gemba observation.");
  } finally {
    setSaving(false);
  }
};
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">
          Gemba Observation Form
        </h2>

        <p className="mt-2 text-sm text-neutral-600">
          Real-time manufacturing floor intelligence and operational observations.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">
            Factory Area
          </label>

          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Sewing / Cutting / Finishing / Warehouse"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">
            Observation Type
          </label>

          <select
            value={observationType}
            onChange={(e) => setObservationType(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
          >
            <option value="">Select Observation Type</option>
            <option value="Safety">Safety</option>
            <option value="Quality">Quality</option>
            <option value="Machine">Machine</option>
            <option value="Delay">Delay</option>
            <option value="Waste">Waste</option>
            <option value="Manpower">Manpower</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">
            Observation Details
          </label>

          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Describe the operational issue or observation..."
            rows={5}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              Observer
            </label>

            <input
              value={observer}
              onChange={(e) => setObserver(e.target.value)}
              placeholder="Supervisor / Auditor"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              Severity
            </label>

            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
        </div>

        <button
          className="mt-4 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Save Gemba Observation
        </button>
      </div>
    </div>
  );
}