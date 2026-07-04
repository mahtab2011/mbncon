export const firestoreManufacturingCollections = {
  factories: "manufacturing_factories",
  departments: "manufacturing_departments",
  productionLines: "manufacturing_production_lines",
  styles: "manufacturing_styles",
  machines: "manufacturing_machines",
  operators: "manufacturing_operators",

  productionEntries: "manufacturing_production_entries",
  qualityEntries: "manufacturing_quality_entries",
  maintenanceEntries: "manufacturing_maintenance_entries",
  attendanceEntries: "manufacturing_attendance_entries",

  fabricInspection: "manufacturing_fabric_inspection",
  fabricShadeManagement: "manufacturing_fabric_shade_management",
  patternIntelligence: "manufacturing_pattern_intelligence",
  markerIntelligence: "manufacturing_marker_intelligence",
  fabricConsumption: "manufacturing_fabric_consumption",
  cuttingCommandCentre: "manufacturing_cutting_command_centre",
  fabricOptimizer: "manufacturing_fabric_optimizer",
  rollBundleTraceability: "manufacturing_roll_bundle_traceability",

  executiveAlerts: "manufacturing_executive_alerts",
  executiveDecisions: "manufacturing_executive_decisions",
  factoryHealth: "manufacturing_factory_health",
  globalExecutiveDashboard: "manufacturing_global_executive_dashboard",
} as const;

export type FirestoreManufacturingCollectionKey =
  keyof typeof firestoreManufacturingCollections;

export type FirestoreManufacturingCollectionName =
  (typeof firestoreManufacturingCollections)[FirestoreManufacturingCollectionKey];

export function getManufacturingCollectionName(
  key: FirestoreManufacturingCollectionKey
): FirestoreManufacturingCollectionName {
  return firestoreManufacturingCollections[key];
}