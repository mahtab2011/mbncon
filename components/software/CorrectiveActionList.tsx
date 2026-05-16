"use client";

import { useEffect, useState } from "react";
import { getStatusBadgeClass } from "@/lib/software/actionStatusEngine";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
updateDoc,
} from "firebase/firestore";
import {
  operationalStatuses,
  OperationalStatus,
} from "@/lib/software/actionStatusEngine";
import { db } from "@/lib/firebase";

type CorrectiveAction = {
  id: string;
  issue: string;
  rootCause: string;
  owner: string;
  deadline: string;
  status: string;
};

export default function CorrectiveActionList() {
  const [actions, setActions] = useState<
    CorrectiveAction[]
  >([]);

  useEffect(() => {
    const q = query(
      collection(db, "correctiveActions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: CorrectiveAction[] =
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<
            CorrectiveAction,
            "id"
          >),
        }));

      setActions(data);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (
  id: string,
  status: OperationalStatus
) => {
  await updateDoc(doc(db, "correctiveActions", id), {
    status,
  });
};
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">
          Live Corrective Actions
        </h2>

        <p className="mt-2 text-sm text-neutral-600">
          Operational issue resolution and accountability tracking.
        </p>
      </div>

      <div className="space-y-4">
        {actions.length === 0 && (
          <p className="text-sm text-neutral-500">
            No corrective actions recorded yet.
          </p>
        )}

        {actions.map((action) => (
          <div
            key={action.id}
            className="rounded-2xl border border-neutral-200 p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-neutral-900">
                {action.issue}
              </h3>

              <span
  className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeClass(
    action.status
  )}`}
>
  {action.status}
</span>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="font-semibold">
                  Root Cause:
                </span>{" "}
                {action.rootCause}
              </p>

              <p>
                <span className="font-semibold">
                  Owner:
                </span>{" "}
                {action.owner}
              </p>

              <p>
                <span className="font-semibold">
                  Deadline:
                </span>{" "}
                {action.deadline}
              </p>
            </div>
            <select
  value={action.status}
  onChange={(e) =>
    updateStatus(
      action.id,
      e.target.value as OperationalStatus
    )
  }
  className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-semibold outline-none"
>
  {operationalStatuses.map((status) => (
    <option key={status} value={status}>
      {status}
    </option>
  ))}
</select>
          </div>
        ))}
      </div>
    </div>
  );
}