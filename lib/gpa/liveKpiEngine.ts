import {
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";

import { db } from "../firebase";

export type EnterpriseKpi = {
  factories: number;
  production: number;
  efficiency: number;
  quality: number;
  cutting: number;
  fabric: number;
  shipment: number;
  maintenance: number;
  oee: number;
  factoryHealth: number;
};

export function subscribeEnterpriseKpi(
  callback: (kpi: EnterpriseKpi) => void
) {
  return onSnapshot(
    collection(db, "enterpriseKpi"),
    (
      snapshot: QuerySnapshot<DocumentData>
    ) => {
      if (snapshot.empty) {
        callback({
          factories: 0,
          production: 0,
          efficiency: 0,
          quality: 0,
          cutting: 0,
          fabric: 0,
          shipment: 0,
          maintenance: 0,
          oee: 0,
          factoryHealth: 0,
        });

        return;
      }

      let factories = 0;
      let production = 0;
      let efficiency = 0;
      let quality = 0;
      let cutting = 0;
      let fabric = 0;
      let shipment = 0;
      let maintenance = 0;
      let oee = 0;
      let factoryHealth = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        factories++;

        production += data.production ?? 0;
        efficiency += data.efficiency ?? 0;
        quality += data.quality ?? 0;
        cutting += data.cutting ?? 0;
        fabric += data.fabric ?? 0;
        shipment += data.shipment ?? 0;
        maintenance += data.maintenance ?? 0;
        oee += data.oee ?? 0;
        factoryHealth += data.factoryHealth ?? 0;
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
        cutting:
          factories > 0
            ? Math.round(cutting / factories)
            : 0,
        fabric:
          factories > 0
            ? Math.round(fabric / factories)
            : 0,
        shipment:
          factories > 0
            ? Math.round(shipment / factories)
            : 0,
        maintenance:
          factories > 0
            ? Math.round(maintenance / factories)
            : 0,
        oee:
          factories > 0
            ? Math.round(oee / factories)
            : 0,
        factoryHealth:
          factories > 0
            ? Math.round(factoryHealth / factories)
            : 0,
      });
    }
  );
}