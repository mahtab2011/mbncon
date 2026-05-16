"use client";

import { useEffect, useState } from "react";
import { getStatusBadgeClass } from "@/lib/software/actionStatusEngine";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type KaizenAction = {
  id: string;
  department: string;
  problem: string;
  improvement: string;
  owner: string;
  targetDate: string;
  status: string;
};

export default function KaizenActionList() {
  const [actions, setActions] = useState<
    KaizenAction[]
  >([]);

  useEffect(() => {
    const q = query(
      collection(db, "kaizenActions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: KaizenAction[] =
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<
            KaizenAction,
            "id"
          >),
        }));

      setActions(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">
          Live Kaizen Actions
        </h2>

        <p className="mt-2 text-sm text-neutral-600">
          Real-time operational improvement tracking.
        </p>
      </div>

      <div className="space-y-4">
        {actions.length === 0 && (
          <p className="text-sm text-neutral-500">
            No Kaizen actions recorded yet.
          </p>
        )}

        {actions.map((action) => (
          <div
            key={action.id}
            className="rounded-2xl border border-neutral-200 p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-neutral-900">
                {action.department}
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
                  Problem:
                </span>{" "}
                {action.problem}
              </p>

              <p>
                <span className="font-semibold">
                  Improvement:
                </span>{" "}
                {action.improvement}
              </p>

              <p>
                <span className="font-semibold">
                  Owner:
                </span>{" "}
                {action.owner}
              </p>

              <p>
                <span className="font-semibold">
                  Target Date:
                </span>{" "}
                {action.targetDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}