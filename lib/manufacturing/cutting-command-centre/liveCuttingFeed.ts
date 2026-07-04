import {
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";

import { db } from "../../firebase";

export type LiveCuttingCommand = {
  id: string;
  factory: string;
  line: string;
  marker: string;
  efficiency: number;
  bundlesPending: number;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendation: string;
};

export function subscribeToLiveCuttingFeed(
  callback: (
    feed: LiveCuttingCommand[]
  ) => void
) {
  return onSnapshot(
    collection(db, "cuttingCommandFeed"),
    (
      snapshot: QuerySnapshot<DocumentData>
    ) => {
      const feed: LiveCuttingCommand[] =
        snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            factory: data.factory ?? "",
            line: data.line ?? "",
            marker: data.marker ?? "",
            efficiency: data.efficiency ?? 0,
            bundlesPending: data.bundlesPending ?? 0,
            severity: data.severity ?? "LOW",
            recommendation:
              data.recommendation ?? "",
          };
        });

      callback(feed);
    }
  );
}