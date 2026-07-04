// lib/manufacturing/gpa/gpaModuleMaster.ts

export type GPAModule = {
  id: string;
  title: string;
  shortTitle: string;
  category:
    | "TOC"
    | "IE"
    | "LEAN"
    | "KAIZEN"
    | "GEMBA"
    | "VSM"
    | "PEOPLE"
    | "AI"
    | "DASHBOARD";

  route: string;
  description: string;
  keyTools: string[];
  primaryOutcome: string;
  maturityLevel: "Foundation" | "Intermediate" | "Advanced" | "Executive";
};

export const gpaModules: GPAModule[] = [
  {
    id: "gpa-001",
    title: "Bottleneck Identification & Resolution Centre",
    shortTitle: "Bottleneck Centre",
    category: "TOC",
    route: "/software/garments-productivity-app/bottleneck-centre",
    description:
      "Theory of Constraints based module to identify the current factory constraint, quantify loss, assign actions, and track resolution.",
    keyTools: [
      "Theory of Constraints",
      "Five Focusing Steps",
      "Constraint Classification",
      "Root Cause Analysis",
      "Throughput Thinking",
      "AI Bottleneck Priority",
    ],
    primaryOutcome: "Identify and remove the biggest productivity constraint first.",
    maturityLevel: "Executive",
  },
  {
    id: "gpa-002",
    title: "Industrial Engineering Centre",
    shortTitle: "IE Centre",
    category: "IE",
    route: "/software/garments-productivity-app/industrial-engineering",
    description:
      "Core industrial engineering tools for time study, method study, activity sampling, SMV, capacity, and line balancing.",
    keyTools: [
      "Time Study",
      "Method Study",
      "Activity Sampling",
      "SMV / SAM",
      "Line Balancing",
      "Capacity Planning",
      "Motion Economy",
    ],
    primaryOutcome: "Improve labour, method, and capacity utilisation.",
    maturityLevel: "Advanced",
  },
  {
    id: "gpa-003",
    title: "Lean Manufacturing Centre",
    shortTitle: "Lean Centre",
    category: "LEAN",
    route: "/software/garments-productivity-app/lean-centre",
    description:
      "Lean manufacturing centre covering 5S, Kanban, Muda, Mura, Muri, standard work, flow, pull, and visual management.",
    keyTools: [
      "5S",
      "Kanban",
      "Muda",
      "Mura",
      "Muri",
      "Standard Work",
      "Visual Management",
      "Poka-Yoke",
      "SMED",
    ],
    primaryOutcome: "Reduce waste and create stable production flow.",
    maturityLevel: "Advanced",
  },
  {
    id: "gpa-004",
    title: "Kaizen Improvement Centre",
    shortTitle: "Kaizen Centre",
    category: "KAIZEN",
    route: "/software/garments-productivity-app/kaizen-centre",
    description:
      "Continuous improvement module for small improvements, team kaizen, suggestion schemes, before-after tracking, and savings calculation.",
    keyTools: [
      "Kaizen",
      "PDCA",
      "Suggestion Scheme",
      "A3 Thinking",
      "Before & After",
      "Savings Tracker",
    ],
    primaryOutcome: "Turn improvement ideas into measurable productivity gains.",
    maturityLevel: "Intermediate",
  },
  {
    id: "gpa-005",
    title: "Gemba Walk Centre",
    shortTitle: "Gemba Centre",
    category: "GEMBA",
    route: "/software/garments-productivity-app/gemba-centre",
    description:
      "Digital Gemba Walk module based on Genchi Genbutsu: go to the real place, observe real facts, and act on evidence.",
    keyTools: [
      "Gemba Walk",
      "Genchi Genbutsu",
      "Observation Checklist",
      "Photo Evidence",
      "Action Tracking",
      "Follow-up",
    ],
    primaryOutcome: "Solve problems by observing the actual workplace.",
    maturityLevel: "Foundation",
  },
  {
    id: "gpa-006",
    title: "Value Stream Mapping Centre",
    shortTitle: "VSM Centre",
    category: "VSM",
    route: "/software/garments-productivity-app/value-stream-mapping",
    description:
      "Current-state and future-state value stream mapping for lead time, cycle time, waiting time, inventory, and value-added ratio.",
    keyTools: [
      "Current State Map",
      "Future State Map",
      "Lead Time",
      "Cycle Time",
      "Waiting Time",
      "Value Added Ratio",
      "Information Flow",
    ],
    primaryOutcome: "Expose end-to-end waste and redesign the future flow.",
    maturityLevel: "Advanced",
  },
  {
    id: "gpa-007",
    title: "Empowerment & Productivity Culture Centre",
    shortTitle: "Empowerment Centre",
    category: "PEOPLE",
    route: "/software/garments-productivity-app/empowerment-centre",
    description:
      "People-centred productivity module covering empowerment, ownership, recognition, communication, coaching, and productivity culture.",
    keyTools: [
      "Empowerment Index",
      "Ownership Culture",
      "Hourensou",
      "Hansei",
      "Tatakidai",
      "Ikigai",
      "Ganbaru",
      "Shokunin",
      "Inner Game",
      "GROW Coaching",
    ],
    primaryOutcome: "Build people capability and ownership for sustained productivity.",
    maturityLevel: "Executive",
  },
  {
    id: "gpa-008",
    title: "AI Productivity Coach",
    shortTitle: "AI Coach",
    category: "AI",
    route: "/software/garments-productivity-app/ai-productivity-coach",
    description:
      "AI assistant that reads productivity signals, identifies improvement priorities, and recommends practical factory actions.",
    keyTools: [
      "AI Diagnosis",
      "Loss Analysis",
      "Constraint Recommendation",
      "Improvement Priority",
      "Action Plan",
      "Savings Estimate",
    ],
    primaryOutcome: "Convert productivity data into management action.",
    maturityLevel: "Executive",
  },
  {
    id: "gpa-009",
    title: "GPA Executive Dashboard",
    shortTitle: "Executive Dashboard",
    category: "DASHBOARD",
    route: "/software/garments-productivity-app/dashboard",
    description:
      "Executive dashboard showing productivity, bottlenecks, efficiency, improvement status, waste, risk, and AI recommendations.",
    keyTools: [
      "Factory Productivity",
      "Line Productivity",
      "Bottleneck Score",
      "Efficiency",
      "Improvement Projects",
      "AI Alerts",
    ],
    primaryOutcome: "Give top management one command centre for productivity.",
    maturityLevel: "Executive",
  },
];

export const gpaStrategicPrinciples = [
  "Start with the bottleneck before applying broad improvement tools.",
  "Use Theory of Constraints to identify where management attention must go first.",
  "Use Industrial Engineering to measure the work scientifically.",
  "Use Lean and Kaizen to remove waste and improve flow.",
  "Use Gemba Walk to verify facts at the workplace.",
  "Use empowerment to make productivity improvement sustainable.",
  "Use AI to convert data into clear management action.",
];

export function getGPAModuleById(id: string) {
  return gpaModules.find((module) => module.id === id);
}

export function getGPAModulesByCategory(category: GPAModule["category"]) {
  return gpaModules.filter((module) => module.category === category);
}

export function getExecutiveGPAModules() {
  return gpaModules.filter((module) => module.maturityLevel === "Executive");
}