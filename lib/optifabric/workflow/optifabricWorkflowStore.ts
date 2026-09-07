import {
  getEngineeringDatasetByCode,
  getGarmentCategoryById,
} from "@/lib/optifabric/masters";

import type {
  OptiFabricWorkflowState,
  OptiFabricWorkflowStep,
  OptiFabricWorkflowStepId,
  WorkflowProgressSummary,
} from "./optifabricWorkflowTypes";

export const OPTIFABRIC_WORKFLOW_STORAGE_KEY =
  "optifabric-ai-active-workflow";

export const OPTIFABRIC_WORKFLOW_VERSION = "1.0.0";

const workflowStepDefinitions: Array<
  Omit<OptiFabricWorkflowStep, "status">
> = [
  {
    id: "dataset-selection",
    sequence: 1,
    title: "Dataset Selection",
    description:
      "Select the garment category and engineering dataset.",
  },
  {
    id: "pattern-upload",
    sequence: 2,
    title: "Pattern Upload",
    description:
      "Upload PDF, JPG, JPEG or PNG pattern files.",
  },
  {
    id: "pattern-processing",
    sequence: 3,
    title: "PDF and Image Processing",
    description:
      "Prepare uploaded pattern files for engineering analysis.",
  },
  {
    id: "pattern-recognition",
    sequence: 4,
    title: "AI Pattern Recognition",
    description:
      "Identify garment category and individual pattern pieces.",
  },
  {
    id: "scale-calibration",
    sequence: 5,
    title: "Scale Calibration",
    description:
      "Convert image pixels into real engineering dimensions.",
  },
  {
    id: "boundary-tracing",
    sequence: 6,
    title: "Pattern Boundary Tracing",
    description:
      "Trace the external boundary of every pattern piece.",
  },
  {
    id: "pattern-measurement",
    sequence: 7,
    title: "Pattern Measurement",
    description:
      "Calculate real width, height and key dimensions.",
  },
  {
    id: "pattern-area",
    sequence: 8,
    title: "Pattern Area Calculation",
    description:
      "Calculate the real area of every pattern component.",
  },
  {
    id: "fabric-specification",
    sequence: 9,
    title: "Fabric Specification",
    description:
      "Confirm fabric width, structure, pattern and allowances.",
  },
  {
    id: "size-ratio-planning",
    sequence: 10,
    title: "Size-Ratio Planning",
    description:
      "Prepare the required size combination for marker planning.",
  },
  {
    id: "order-planning",
    sequence: 11,
    title: "Order Quantity Planning",
    description:
      "Convert the order quantity into marker and lay requirements.",
  },
  {
    id: "marker-optimization",
    sequence: 12,
    title: "Marker Optimization",
    description:
      "Generate an optimized pattern placement within usable fabric width.",
  },
  {
    id: "lay-planning",
    sequence: 13,
    title: "Lay Planning",
    description:
      "Calculate plies, lays, bundles and balance quantities.",
  },
  {
    id: "fabric-consumption",
    sequence: 14,
    title: "Fabric Consumption",
    description:
      "Calculate consumption per garment and total fabric requirement.",
  },
  {
    id: "wastage-analysis",
    sequence: 15,
    title: "Fabric Wastage Analysis",
    description:
      "Analyse marker loss, end loss, allowance and process wastage.",
  },
  {
    id: "engineering-recommendations",
    sequence: 16,
    title: "AI Engineering Recommendations",
    description:
      "Generate practical cutting and consumption improvement actions.",
  },
  {
    id: "savings-calculation",
    sequence: 17,
    title: "Savings Calculation",
    description:
      "Compare reference and optimized engineering results.",
  },
  {
    id: "engineering-report",
    sequence: 18,
    title: "PDF Engineering Report",
    description:
      "Generate the professional OptiFabric AI engineering report.",
  },
];

function createWorkflowId(datasetCode: string): string {
  const timestamp = Date.now();

  const randomCode = Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase();

  return `${datasetCode}-${timestamp}-${randomCode}`;
}

function createInitialSteps(): OptiFabricWorkflowStep[] {
  const now = new Date().toISOString();

  return workflowStepDefinitions.map((step) => ({
    ...step,
    status:
      step.id === "dataset-selection"
        ? "completed"
        : step.id === "pattern-upload"
          ? "active"
          : "not-started",
    startedAt:
      step.id === "dataset-selection" ||
      step.id === "pattern-upload"
        ? now
        : undefined,
    completedAt:
      step.id === "dataset-selection"
        ? now
        : undefined,
  }));
}

export function createWorkflowFromDataset(
  datasetCode: string
): OptiFabricWorkflowState {
  const dataset = getEngineeringDatasetByCode(datasetCode);

  if (!dataset) {
    throw new Error(
      `Engineering dataset ${datasetCode} could not be found.`
    );
  }

  const garmentCategory = getGarmentCategoryById(
    dataset.garmentCategoryId
  );

  if (!garmentCategory) {
    throw new Error(
      `Garment category ${dataset.garmentCategoryId} could not be found.`
    );
  }

  const now = new Date().toISOString();

  return {
    workflowId: createWorkflowId(dataset.code),
    workflowVersion: OPTIFABRIC_WORKFLOW_VERSION,

    datasetId: dataset.id,
    datasetCode: dataset.code,
    datasetVersion: dataset.version,

    garmentCategoryId: garmentCategory.id,
    garmentCategoryName: garmentCategory.name.en,

    datasetName: dataset.name.en,

    fabricSpecification: {
      ...dataset.fabricSpecification,
    },

    orderPlan: {
      ...dataset.orderPlan,
      sizeRatio: dataset.orderPlan.sizeRatio
        ? { ...dataset.orderPlan.sizeRatio }
        : undefined,
      colours: dataset.orderPlan.colours
        ? dataset.orderPlan.colours.map((colour) => ({
            ...colour,
            colourName: { ...colour.colourName },
          }))
        : undefined,
    },

    patternPieces: dataset.patternPieces.map((piece) => ({
      ...piece,
      displayName: piece.displayName
        ? { ...piece.displayName }
        : undefined,
      placementRules: piece.placementRules
        ? [...piece.placementRules]
        : undefined,
      notes: piece.notes
        ? { ...piece.notes }
        : undefined,
    })),

    currentStepId: "pattern-upload",
    steps: createInitialSteps(),

    patternResults: dataset.patternPieces.map((piece) => ({
      datasetPatternPieceId: piece.id,
      patternPieceId: piece.patternPieceId,
      tracingCompleted: false,
      warnings: [],
    })),

    engineeringRecommendations: [],
    workflowWarnings: [],

    reportGenerated: false,

    createdAt: now,
    updatedAt: now,
  };
}

export function saveWorkflowState(
  workflow: OptiFabricWorkflowState
): void {
  if (typeof window === "undefined") {
    return;
  }

  const stateToSave: OptiFabricWorkflowState = {
    ...workflow,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(
    OPTIFABRIC_WORKFLOW_STORAGE_KEY,
    JSON.stringify(stateToSave)
  );
}

export function loadWorkflowState():
  | OptiFabricWorkflowState
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedState = window.localStorage.getItem(
    OPTIFABRIC_WORKFLOW_STORAGE_KEY
  );

  if (!storedState) {
    return null;
  }

  try {
    const parsedState = JSON.parse(
      storedState
    ) as OptiFabricWorkflowState;

    if (
      !parsedState.workflowId ||
      !parsedState.datasetCode ||
      !Array.isArray(parsedState.steps)
    ) {
      return null;
    }

    return parsedState;
  } catch {
    return null;
  }
}

export function clearWorkflowState(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(
    OPTIFABRIC_WORKFLOW_STORAGE_KEY
  );
}

export function startDatasetWorkflow(
  datasetCode: string
): OptiFabricWorkflowState {
  const workflow = createWorkflowFromDataset(datasetCode);

  saveWorkflowState(workflow);

  return workflow;
}

export function setWorkflowStepStatus(
  workflow: OptiFabricWorkflowState,
  stepId: OptiFabricWorkflowStepId,
  status: OptiFabricWorkflowStep["status"]
): OptiFabricWorkflowState {
  const now = new Date().toISOString();

  const updatedSteps = workflow.steps.map((step) => {
    if (step.id !== stepId) {
      return step;
    }

    return {
      ...step,
      status,
      startedAt:
        step.startedAt ??
        (status === "active" ||
        status === "completed" ||
        status === "warning"
          ? now
          : undefined),
      completedAt:
        status === "completed"
          ? now
          : status === "not-started" ||
              status === "active"
            ? undefined
            : step.completedAt,
    };
  });

  const updatedWorkflow: OptiFabricWorkflowState = {
    ...workflow,
    currentStepId:
      status === "active"
        ? stepId
        : workflow.currentStepId,
    steps: updatedSteps,
    updatedAt: now,
  };

  saveWorkflowState(updatedWorkflow);

  return updatedWorkflow;
}

export function activateWorkflowStep(
  workflow: OptiFabricWorkflowState,
  stepId: OptiFabricWorkflowStepId
): OptiFabricWorkflowState {
  const now = new Date().toISOString();

  const updatedSteps = workflow.steps.map((step) => {
    if (step.id === stepId) {
      return {
        ...step,
        status: "active" as const,
        startedAt: step.startedAt ?? now,
        completedAt: undefined,
      };
    }

    if (step.status === "active") {
      return {
        ...step,
        status: "not-started" as const,
      };
    }

    return step;
  });

  const updatedWorkflow: OptiFabricWorkflowState = {
    ...workflow,
    currentStepId: stepId,
    steps: updatedSteps,
    updatedAt: now,
  };

  saveWorkflowState(updatedWorkflow);

  return updatedWorkflow;
}

export function completeWorkflowStep(
  workflow: OptiFabricWorkflowState,
  completedStepId: OptiFabricWorkflowStepId,
  nextStepId?: OptiFabricWorkflowStepId
): OptiFabricWorkflowState {
  const now = new Date().toISOString();

  const updatedSteps = workflow.steps.map((step) => {
    if (step.id === completedStepId) {
      return {
        ...step,
        status: "completed" as const,
        startedAt: step.startedAt ?? now,
        completedAt: now,
      };
    }

    if (nextStepId && step.id === nextStepId) {
      return {
        ...step,
        status: "active" as const,
        startedAt: step.startedAt ?? now,
        completedAt: undefined,
      };
    }

    if (step.status === "active") {
      return {
        ...step,
        status: "not-started" as const,
      };
    }

    return step;
  });

  const updatedWorkflow: OptiFabricWorkflowState = {
    ...workflow,
    currentStepId:
      nextStepId ?? completedStepId,
    steps: updatedSteps,
    updatedAt: now,
  };

  saveWorkflowState(updatedWorkflow);

  return updatedWorkflow;
}

export function getWorkflowProgress(
  workflow: OptiFabricWorkflowState
): WorkflowProgressSummary {
  const totalSteps = workflow.steps.length;

  const completedSteps = workflow.steps.filter(
    (step) => step.status === "completed"
  ).length;

  const activeSteps = workflow.steps.filter(
    (step) => step.status === "active"
  ).length;

  const warningSteps = workflow.steps.filter(
    (step) => step.status === "warning"
  ).length;

  const blockedSteps = workflow.steps.filter(
    (step) => step.status === "blocked"
  ).length;

  const completionPercent =
    totalSteps > 0
      ? Math.round((completedSteps / totalSteps) * 100)
      : 0;

  return {
    totalSteps,
    completedSteps,
    activeSteps,
    warningSteps,
    blockedSteps,
    completionPercent,
  };
}