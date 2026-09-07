import type {
  DatasetFabricSpecification,
  DatasetOrderPlan,
  DatasetPatternPiece,
} from "@/lib/optifabric/masters";

export type OptiFabricWorkflowStepId =
  | "dataset-selection"
  | "pattern-upload"
  | "pattern-processing"
  | "pattern-recognition"
  | "scale-calibration"
  | "boundary-tracing"
  | "pattern-measurement"
  | "pattern-area"
  | "fabric-specification"
  | "size-ratio-planning"
  | "order-planning"
  | "marker-optimization"
  | "lay-planning"
  | "fabric-consumption"
  | "wastage-analysis"
  | "engineering-recommendations"
  | "savings-calculation"
  | "engineering-report";

export type OptiFabricWorkflowStepStatus =
  | "not-started"
  | "active"
  | "completed"
  | "warning"
  | "blocked";

export interface OptiFabricWorkflowStep {
  id: OptiFabricWorkflowStepId;
  sequence: number;
  title: string;
  description: string;
  status: OptiFabricWorkflowStepStatus;
  startedAt?: string;
  completedAt?: string;
}

export interface WorkflowPatternResult {
  datasetPatternPieceId: string;
  patternPieceId: string;

  sourceFileName?: string;
  sourceFileType?: string;
  sourceFileUrl?: string;

  recognitionConfidencePercent?: number;
  recognisedPatternPieceId?: string;

  scalePixels?: number;
  scaleRealLength?: number;
  scaleUnit?: "inch" | "cm";

  width?: number;
  height?: number;
  dimensionUnit?: "inch" | "cm" | "mm";

  pixelArea?: number;
  realArea?: number;
  areaUnit?: "square-inch" | "square-centimetre";

  boundaryPointCount?: number;
  tracingCompleted?: boolean;

  warnings?: string[];
}

export interface WorkflowMarkerResult {
  markerWidth?: number;
  markerWidthUnit?: "inch" | "cm";

  markerLength?: number;
  markerLengthUnit?: "metre" | "yard";

  totalPatternArea?: number;
  markerArea?: number;

  markerEfficiencyPercent?: number;
  endLossPercent?: number;
  estimatedWastagePercent?: number;

  placementCount?: number;
  optimizationIterations?: number;

  notes?: string[];
}

export interface WorkflowLayPlanResult {
  plannedLayCount?: number;
  plannedPlies?: number;
  garmentsPerLay?: number;
  totalPlannedGarments?: number;

  bundleSize?: number;
  estimatedBundles?: number;

  balanceQuantity?: number;
  excessQuantity?: number;

  notes?: string[];
}

export interface WorkflowConsumptionResult {
  consumptionPerGarment?: number;
  consumptionUnit?: "metre" | "yard";

  totalNetFabric?: number;
  totalAllowanceFabric?: number;
  totalRequiredFabric?: number;

  allowancePercent?: number;
  wastagePercent?: number;

  referenceConsumptionPerGarment?: number;
  savingsPerGarment?: number;
  totalFabricSavings?: number;
}

export interface WorkflowSavingsResult {
  referenceFabricQuantity?: number;
  optimizedFabricQuantity?: number;

  fabricSavingsQuantity?: number;
  fabricSavingsPercent?: number;

  fabricCostPerUnit?: number;
  currencyCode?: string;

  estimatedFinancialSavings?: number;
}

export interface OptiFabricWorkflowState {
  workflowId: string;
  workflowVersion: string;

  datasetId: string;
  datasetCode: string;
  datasetVersion: string;

  garmentCategoryId: string;
  garmentCategoryName: string;

  datasetName: string;

  fabricSpecification: DatasetFabricSpecification;
  orderPlan: DatasetOrderPlan;
  patternPieces: DatasetPatternPiece[];

  currentStepId: OptiFabricWorkflowStepId;
  steps: OptiFabricWorkflowStep[];

  patternResults: WorkflowPatternResult[];
  markerResult?: WorkflowMarkerResult;
  layPlanResult?: WorkflowLayPlanResult;
  consumptionResult?: WorkflowConsumptionResult;
  savingsResult?: WorkflowSavingsResult;

  engineeringRecommendations: string[];
  workflowWarnings: string[];

  reportGenerated: boolean;
  reportGeneratedAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface WorkflowProgressSummary {
  totalSteps: number;
  completedSteps: number;
  activeSteps: number;
  warningSteps: number;
  blockedSteps: number;
  completionPercent: number;
}