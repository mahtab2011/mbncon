"use client";

import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type GembaObservation = {
  id: string;
  area: string;
  observationType: string;
  details: string;
  observer: string;
  severity: string;
  status: string;
};

export default function GembaObservationList() {
  const [observations, setObservations] = useState<
    GembaObservation[]
  >([]);

  useEffect(() => {
    const q = query(
      collection(db, "gembaObservations"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: GembaObservation[] =
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<
            GembaObservation,
            "id"
          >),
        }));

      setObservations(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">
          Live Gemba Observations
        </h2>

        <p className="mt-2 text-sm text-neutral-600">
          Real-time shopfloor intelligence and observation tracking.
        </p>
      </div>

      <div className="space-y-4">
        {observations.length === 0 && (
          <p className="text-sm text-neutral-500">
            No Gemba observations recorded yet.
          </p>
        )}

        {observations.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-neutral-200 p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-neutral-900">
                {item.area}
              </h3>

              <div className="flex gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700">
                  {item.observationType}
                </span>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                  {item.severity}
                </span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-neutral-700">
              {item.details}
            </p>

            <div className="mt-4 text-sm text-neutral-600">
              <span className="font-semibold">Observer:</span>{" "}
              {item.observer} |{" "}
              <span className="font-semibold">Status:</span>{" "}
              {item.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}