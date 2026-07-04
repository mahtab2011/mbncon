import { defectMasterLibrary } from "./defectMaster";
import { fabricDefectLibrary } from "./fabricDefectMaster";
import { measurementPointLibrary } from "./measurementPointMaster";
import { machinePreventiveMaintenanceLibrary } from "./machinePreventiveMaintenanceMaster";
import { operationSOPLibrary } from "./operationSOPMaster";
import { activitySamplingRulesLibrary } from "./activitySamplingRulesMaster";
import { timeStudyElementLibrary } from "./timeStudyElementMaster";
import { methodStudyImprovementLibrary } from "./methodStudyImprovementMaster";

import { aiRootCauseKnowledgeBase } from "./aiRootCauseKnowledgeBase";
import { aiCorrectiveActionKnowledgeBase } from "./aiCorrectiveActionKnowledgeBase";
import { aiPreventiveActionKnowledgeBase } from "./aiPreventiveActionKnowledgeBase";
import { aiLineBalancingKnowledgeBase } from "./aiLineBalancingKnowledgeBase";

export const manufacturingKnowledgeRegistry = {
  defectMasterLibrary,

  fabricDefectLibrary,

  measurementPointLibrary,

  machinePreventiveMaintenanceLibrary,

  operationSOPLibrary,

  activitySamplingRulesLibrary,

  timeStudyElementLibrary,

  methodStudyImprovementLibrary,

  aiRootCauseKnowledgeBase,

  aiCorrectiveActionKnowledgeBase,

  aiPreventiveActionKnowledgeBase,

  aiLineBalancingKnowledgeBase,
};

export function getKnowledgeLibraryNames(): string[] {
  return Object.keys(manufacturingKnowledgeRegistry);
}