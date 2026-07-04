import {
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";

import { db } from "../../firebase";

export type LiveFabricInspection = {
  id: string;
  factory: string;
  rollNo: string;
  fabric: string;
  supplier: string;
  gsm: number;
  shade: string;
  defects: number;
  passRate: number;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendation: string;
};

export function subscribeToLiveFabricInspection(
  callback: (
    inspections: LiveFabricInspection[]
  ) => void
) {
  return onSnapshot(
    collection(db, "fabricInspectionFeed"),
    (
      snapshot: QuerySnapshot<DocumentData>
    ) => {
      const inspections: LiveFabricInspection[] =
        snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            factory: data.factory ?? "",
            rollNo: data.rollNo ?? "",
            fabric: data.fabric ?? "",
            supplier: data.supplier ?? "",
            gsm: data.gsm ?? 0,
            shade: data.shade ?? "",
            defects: data.defects ?? 0,
            passRate: data.passRate ?? 0,
            severity: data.severity ?? "LOW",
            recommendation:
              data.recommendation ?? "",
          };
        });

      callback(inspections);
    }
  );
}