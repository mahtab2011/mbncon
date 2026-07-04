import { GPAProductionRecord } from "./gpaProductionDataModel";

export const gpaSampleProductionData: GPAProductionRecord[] = [
  {
    id: "REC-001",

    factoryName: "MBN Sample Factory",

    floorName: "Floor 01",

    department: "SEWING",

    lineName: "Line 01",

    buyerName: "H&M",

    styleNo: "HM-4502",

    orderNo: "ORD-10001",

    operationName: "Body Join",

    date: "2026-06-29",

    hourSlot: "09:00 - 10:00",

    hourlyTarget: 120,

    hourlyOutput: 103,

    operators: 32,

    helpers: 5,

    targetOperators: 35,

    wip: 145,

    defects: 6,

    waitingMinutes: 18,

    machineStatus: "RUNNING",

    bottleneckFlag: "BOTTLENECK",

    supervisorName: "Mr. Rahman",

    productionManagerName: "Ms. Akter",

    remarks: "Feeding delay observed",
  },

  {
    id: "REC-002",

    factoryName: "MBN Sample Factory",

    floorName: "Floor 01",

    department: "SEWING",

    lineName: "Line 02",

    buyerName: "Zara",

    styleNo: "ZR-9080",

    orderNo: "ORD-10002",

    operationName: "Sleeve Attach",

    date: "2026-06-29",

    hourSlot: "09:00 - 10:00",

    hourlyTarget: 135,

    hourlyOutput: 134,

    operators: 36,

    helpers: 6,

    targetOperators: 36,

    wip: 62,

    defects: 2,

    waitingMinutes: 3,

    machineStatus: "RUNNING",

    bottleneckFlag: "NONE",

    supervisorName: "Mr. Karim",

    productionManagerName: "Ms. Akter",
  },

  {
    id: "REC-003",

    factoryName: "MBN Sample Factory",

    floorName: "Floor 02",

    department: "FINISHING",

    lineName: "Finishing 01",

    buyerName: "Primark",

    styleNo: "PR-5500",

    orderNo: "ORD-10003",

    operationName: "Final Inspection",

    date: "2026-06-29",

    hourSlot: "09:00 - 10:00",

    hourlyTarget: 160,

    hourlyOutput: 122,

    operators: 18,

    helpers: 3,

    targetOperators: 22,

    wip: 210,

    defects: 9,

    waitingMinutes: 28,

    machineStatus: "RUNNING",

    bottleneckFlag: "CRITICAL_BOTTLENECK",

    supervisorName: "Ms. Fatema",

    productionManagerName: "Mr. Islam",

    remarks: "Inspection capacity overloaded",
  },

  {
    id: "REC-004",

    factoryName: "MBN Sample Factory",

    floorName: "Floor 03",

    department: "CUTTING",

    lineName: "Cutting 01",

    buyerName: "Next",

    styleNo: "NX-6600",

    orderNo: "ORD-10004",

    operationName: "Fabric Spreading",

    date: "2026-06-29",

    hourSlot: "09:00 - 10:00",

    hourlyTarget: 95,

    hourlyOutput: 95,

    operators: 10,

    helpers: 2,

    targetOperators: 10,

    wip: 20,

    defects: 1,

    waitingMinutes: 0,

    machineStatus: "RUNNING",

    bottleneckFlag: "NONE",

    supervisorName: "Mr. Hasan",

    productionManagerName: "Mr. Islam",
  },
];