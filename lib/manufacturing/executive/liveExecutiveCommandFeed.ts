import {
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";

import { db } from "../../firebase";

export type LiveExecutiveCommand = {
  id: string;
  factory: string;
  department: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  headline: string;
  recommendation: string;
  createdAt: number;
};

export function subscribeToExecutiveCommandFeed(
  callback: (
    feed: LiveExecutiveCommand[]
  ) => void
) {
  return onSnapshot(
    collection(db, "executiveCommandFeed"),
    (
      snapshot: QuerySnapshot<DocumentData>
    ) => {
      const feed: LiveExecutiveCommand[] =
        snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            factory: data.factory ?? "",
            department: data.department ?? "",
            severity: data.severity ?? "LOW",
            headline: data.headline ?? "",
            recommendation:
              data.recommendation ?? "",
            createdAt:
              data.createdAt ?? Date.now(),
          };
        });

      callback(feed);
    }
  );
}