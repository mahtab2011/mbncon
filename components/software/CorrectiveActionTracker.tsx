"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type ActionStatus =
  | "Open"
  | "In Progress"
  | "Completed"
  | "Escalated";

export default function CorrectiveActionTracker() {
  const [issue, setIssue] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [owner, setOwner] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] =
    useState<ActionStatus>("Open");

    const [saving, setSaving] = useState(false);
const [saved, setSaved] = useState(false);

const handleSave = async () => {
  if (!issue || !rootCause || !owner || !deadline) {
    alert("Please complete all fields before saving.");
    return;
  }

  try {
    setSaving(true);
    setSaved(false);

    await addDoc(collection(db, "correctiveActions"), {
      issue,
      rootCause,
      owner,
      deadline,
      status,
      createdAt: serverTimestamp(),
    });

    setIssue("");
    setRootCause("");
    setOwner("");
    setDeadline("");
    setStatus("Open");
    setSaved(true);
  } catch (error) {
    console.error("Error saving corrective action:", error);
    alert("Failed to save corrective action.");
  } finally {
    setSaving(false);
  }
};
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">
          Corrective Action Tracking
        </h2>

        <p className="mt-2 text-sm text-neutral-600">
          Track operational issues, root causes, ownership,
          and resolution progress.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">
            Operational Issue
          </label>

          <textarea
            value={issue}
            onChange={(e) =>
              setIssue(e.target.value)
            }
            rows={4}
            placeholder="Describe the operational issue..."
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">
            Root Cause
          </label>

          <textarea
            value={rootCause}
            onChange={(e) =>
              setRootCause(e.target.value)
            }
            rows={4}
            placeholder="Describe the identified root cause..."
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
              onChange={(e) =>
                setOwner(e.target.value)
              }
              placeholder="Manager / Department Head"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              Target Resolution Date
            </label>

            <input
              type="date"
              value={deadline}
              onChange={(e) =>
                setDeadline(e.target.value)
              }
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">
            Current Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as ActionStatus
              )
            }
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
          >
            <option>Open</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Escalated</option>
          </select>
        </div>

        <button className="mt-4 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:opacity-90">
          Save Corrective Action
        </button>
      </div>
    </div>
  );
}