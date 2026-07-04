import {
  collection,
  getDocs,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";

import { db } from "../firebase";

export type LiveExecutiveSummary = {
  factories: number;
  production: number;
  efficiency: number;
  quality: number;
  criticalAlerts: number;
};

type FactoryExecutiveSummaryDoc = {
  productionToday?: number;
  efficiency?: number;
  qualityScore?: number;
  criticalAlerts?: number;
};

export async function getLiveExecutiveSummary(): Promise<LiveExecutiveSummary> {
  const snapshot = await getDocs(
    collection(db, "factoryExecutiveSummary")
  );

  if (snapshot.empty) {
    return {
      factories: 0,
      production: 0,
      efficiency: 0,
      quality: 0,
      criticalAlerts: 0,
    };
  }

  let factories = 0;
  let production = 0;
  let efficiency = 0;
  let quality = 0;
  let criticalAlerts = 0;

  snapshot.docs.forEach((doc) => {
    const data = doc.data() as FactoryExecutiveSummaryDoc;

    factories++;

    production += data.productionToday ?? 0;
    efficiency += data.efficiency ?? 0;
    quality += data.qualityScore ?? 0;
    criticalAlerts += data.criticalAlerts ?? 0;
  });

  return {
    factories,
    production,
    efficiency:
      factories > 0
        ? Math.round(efficiency / factories)
        : 0,
    quality:
      factories > 0
        ? Math.round(quality / factories)
        : 0,
    criticalAlerts,
  };
}

export function subscribeToLiveExecutiveSummary(
  callback: (
    summary: LiveExecutiveSummary
  ) => void
) {
  return onSnapshot(
    collection(db, "factoryExecutiveSummary"),
    (
      snapshot: QuerySnapshot<DocumentData>
    ) => {
      let factories = 0;
      let production = 0;
      let efficiency = 0;
      let quality = 0;
      let criticalAlerts = 0;

      snapshot.docs.forEach((doc) => {
        const data =
          doc.data() as FactoryExecutiveSummaryDoc;

        factories++;

        production += data.productionToday ?? 0;
        efficiency += data.efficiency ?? 0;
        quality += data.qualityScore ?? 0;
        criticalAlerts += data.criticalAlerts ?? 0;
      });

      callback({
        factories,
        production,
        efficiency:
          factories > 0
            ? Math.round(efficiency / factories)
            : 0,
        quality:
          factories > 0
            ? Math.round(quality / factories)
            : 0,
        criticalAlerts,
      });
    }
  );
}