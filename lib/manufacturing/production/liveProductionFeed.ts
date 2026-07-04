import {
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";

import { db } from "../../firebase";

export type LiveProductionRecord = {
  id: string;
  factory: string;
  line: string;
  buyer: string;
  style: string;
  target: number;
  actual: number;
  efficiency: number;
  operators: number;
  helpers: number;
  defects: number;
  downtime: number;
  wip: number;
};

export function subscribeToLiveProduction(
  callback: (
    production: LiveProductionRecord[]
  ) => void
) {
  return onSnapshot(
    collection(db, "productionFeed"),
    (
      snapshot: QuerySnapshot<DocumentData>
    ) => {
      const production =
        snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            factory: data.factory ?? "",
            line: data.line ?? "",
            buyer: data.buyer ?? "",
            style: data.style ?? "",
            target: data.target ?? 0,
            actual: data.actual ?? 0,
            efficiency: data.efficiency ?? 0,
            operators: data.operators ?? 0,
            helpers: data.helpers ?? 0,
            defects: data.defects ?? 0,
            downtime: data.downtime ?? 0,
            wip: data.wip ?? 0,
          };
        });

      callback(production);
    }
  );
}