import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { firestoreCollections } from "./firestoreSchema";
import type {
  ProductionLog,
  WastageLog,
  ManpowerLog,
  ExportLog,
  UtilitiesLog,
  MaintenanceLog,
  RiskReport,
  ExecutiveReport,
} from "./firestoreSchema";

type GenericRecord = Record<string, any>;

async function addRecord(collectionName: string, data: GenericRecord) {
  return addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

async function getLatestRecords(
  collectionName: string,
  factoryId: string,
  count = 12
) {
  const q = query(
    collection(db, collectionName),
    where("factoryId", "==", factoryId),
    orderBy("createdAt", "desc"),
    limit(count)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/* Core add functions */

export async function addProductionLog(log: Omit<ProductionLog, "createdAt">) {
  return addRecord(firestoreCollections.productionLogs, log);
}

export async function addWastageLog(log: Omit<WastageLog, "createdAt">) {
  return addRecord(firestoreCollections.wastageLogs, log);
}

export async function addManpowerLog(log: Omit<ManpowerLog, "createdAt">) {
  return addRecord(firestoreCollections.manpowerLogs, log);
}

export async function addExportLog(log: Omit<ExportLog, "createdAt">) {
  return addRecord(firestoreCollections.exportLogs, log);
}

export async function addUtilitiesLog(log: Omit<UtilitiesLog, "createdAt">) {
  return addRecord(firestoreCollections.utilitiesLogs, log);
}

export async function addMaintenanceLog(log: Omit<MaintenanceLog, "createdAt">) {
  return addRecord(firestoreCollections.maintenanceLogs, log);
}

export async function addRiskReport(report: Omit<RiskReport, "createdAt">) {
  return addRecord(firestoreCollections.riskReports, report);
}

export async function addExecutiveReport(
  report: Omit<ExecutiveReport, "createdAt">
) {
  return addRecord(firestoreCollections.executiveReports, report);
}

/* Core getters */

export async function getProductionLogs(factoryId: string) {
  return getLatestRecords(firestoreCollections.productionLogs, factoryId);
}

export async function getManpowerLogs(factoryId: string) {
  return getLatestRecords(firestoreCollections.manpowerLogs, factoryId);
}

export async function getWastageLogs(factoryId: string) {
  return getLatestRecords(firestoreCollections.wastageLogs, factoryId);
}

export async function getExportLogs(factoryId: string) {
  return getLatestRecords(firestoreCollections.exportLogs, factoryId);
}

export async function getUtilitiesLogs(factoryId: string) {
  return getLatestRecords(firestoreCollections.utilitiesLogs, factoryId);
}

export async function getMaintenanceLogs(factoryId: string) {
  return getLatestRecords(firestoreCollections.maintenanceLogs, factoryId);
}

export async function getRiskReports(factoryId: string) {
  return getLatestRecords(firestoreCollections.riskReports, factoryId);
}

export async function getLatestExecutiveReports(factoryId: string) {
  return getLatestRecords(firestoreCollections.executiveReports, factoryId, 5);
}

/* Enterprise add functions */

export async function addBuyerOrderEntry(data: GenericRecord) {
  return addRecord(firestoreCollections.buyerOrderEntries, data);
}

export async function addSupplierOrderEntry(data: GenericRecord) {
  return addRecord(firestoreCollections.supplierOrderEntries, data);
}

export async function addMaterialEntry(data: GenericRecord) {
  return addRecord(firestoreCollections.materialEntries, data);
}

export async function addQualityEntry(data: GenericRecord) {
  return addRecord(firestoreCollections.qualityEntries, data);
}

export async function addRawMaterialQAEntry(data: GenericRecord) {
  return addRecord(firestoreCollections.rawMaterialQualityEntries, data);
}

export async function addLocalTransportBookingEntry(data: GenericRecord) {
  return addRecord(firestoreCollections.localTransportBookings, data);
}

export async function addShippingLineBookingEntry(data: GenericRecord) {
  return addRecord(firestoreCollections.shippingLineBookings, data);
}

export async function addShipmentScheduleEntry(data: GenericRecord) {
  return addRecord(firestoreCollections.shipmentSchedules, data);
}

export async function addCostingProfitabilityEntry(data: GenericRecord) {
  return addRecord(firestoreCollections.costingProfitabilityEntries, data);
}

export async function addLeanKaizenEntry(data: GenericRecord) {
  return addRecord(firestoreCollections.leanKaizenEntries, data);
}

export async function addTqmEntry(data: GenericRecord) {
  return addRecord(firestoreCollections.tqmEntries, data);
}

export async function addPostOrderIntelligenceEntry(data: GenericRecord) {
  return addRecord(firestoreCollections.postOrderIntelligenceEntries, data);
}

export async function addFactoryLossIntelligenceEntry(data: GenericRecord) {
  return addRecord(firestoreCollections.factoryLossIntelligenceEntries, data);
}

/* Enterprise getters */

export async function getBuyerOrderEntries(factoryId: string) {
  return getLatestRecords(firestoreCollections.buyerOrderEntries, factoryId);
}

export async function getSupplierOrderEntries(factoryId: string) {
  return getLatestRecords(firestoreCollections.supplierOrderEntries, factoryId);
}

export async function getMaterialEntries(factoryId: string) {
  return getLatestRecords(firestoreCollections.materialEntries, factoryId);
}

export async function getQualityEntries(factoryId: string) {
  return getLatestRecords(firestoreCollections.qualityEntries, factoryId);
}

export async function getRawMaterialQAEntries(factoryId: string) {
  return getLatestRecords(
    firestoreCollections.rawMaterialQualityEntries,
    factoryId
  );
}

export async function getLocalTransportBookingEntries(factoryId: string) {
  return getLatestRecords(
    firestoreCollections.localTransportBookings,
    factoryId
  );
}

export async function getShippingLineBookingEntries(factoryId: string) {
  return getLatestRecords(firestoreCollections.shippingLineBookings, factoryId);
}

export async function getShipmentScheduleEntries(factoryId: string) {
  return getLatestRecords(firestoreCollections.shipmentSchedules, factoryId);
}

export async function getCostingProfitabilityEntries(factoryId: string) {
  return getLatestRecords(
    firestoreCollections.costingProfitabilityEntries,
    factoryId
  );
}

export async function getLeanKaizenEntries(factoryId: string) {
  return getLatestRecords(firestoreCollections.leanKaizenEntries, factoryId);
}

export async function getTqmEntries(factoryId: string) {
  return getLatestRecords(firestoreCollections.tqmEntries, factoryId);
}

export async function getPostOrderIntelligenceEntries(factoryId: string) {
  return getLatestRecords(
    firestoreCollections.postOrderIntelligenceEntries,
    factoryId
  );
}

export async function getFactoryLossIntelligenceEntries(factoryId: string) {
  return getLatestRecords(
    firestoreCollections.factoryLossIntelligenceEntries,
    factoryId
  );
}