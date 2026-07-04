export type MaintenanceFrequency =
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "HALF_YEARLY"
  | "YEARLY";

export interface MachinePreventiveMaintenanceTask {
  code: string;

  machineType: string;

  taskName: string;

  frequency: MaintenanceFrequency;

  description: string;

  responsiblePerson: string;

  estimatedMinutes: number;

  safetyRequired: boolean;
}

export const machinePreventiveMaintenanceLibrary: MachinePreventiveMaintenanceTask[] =
[
  {
    code: "PM001",

    machineType: "Single Needle Lockstitch",

    taskName: "Clean machine",

    frequency: "DAILY",

    description:
      "Remove lint, thread and dust from all accessible parts.",

    responsiblePerson:
      "Operator",

    estimatedMinutes: 5,

    safetyRequired: false,
  },

  {
    code: "PM002",

    machineType: "Single Needle Lockstitch",

    taskName: "Check oil level",

    frequency: "DAILY",

    description:
      "Verify oil level and refill if required.",

    responsiblePerson:
      "Mechanic",

    estimatedMinutes: 5,

    safetyRequired: false,
  },

  {
    code: "PM003",

    machineType: "Single Needle Lockstitch",

    taskName: "Inspect drive belt",

    frequency: "WEEKLY",

    description:
      "Check belt tension and wear.",

    responsiblePerson:
      "Mechanic",

    estimatedMinutes: 10,

    safetyRequired: true,
  },

  {
    code: "PM004",

    machineType: "Single Needle Lockstitch",

    taskName: "Inspect hook timing",

    frequency: "MONTHLY",

    description:
      "Verify hook timing and adjust if necessary.",

    responsiblePerson:
      "Senior Mechanic",

    estimatedMinutes: 20,

    safetyRequired: true,
  },

  {
    code: "PM005",

    machineType: "Single Needle Lockstitch",

    taskName: "Complete preventive inspection",

    frequency: "QUARTERLY",

    description:
      "Full inspection of moving parts, bearings, shafts and lubrication system.",

    responsiblePerson:
      "Maintenance Engineer",

    estimatedMinutes: 45,

    safetyRequired: true,
  },
];