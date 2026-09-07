import { PatternLibraryItem } from "./index";

export const shirtPatternMaster: PatternLibraryItem[] = [
  {
    id: "front",
    name: "Front",
    required: true,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 1,
    description:
      "Main front body panel containing the button stand and front opening.",
  },
  {
    id: "back",
    name: "Back",
    required: true,
    cutQuantity: 1,
    cutOnFold: true,
    custom: false,
    sequence: 2,
    description:
      "Main back body panel. Normally cut on fold for symmetry.",
  },
  {
    id: "sleeve",
    name: "Sleeve",
    required: true,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 3,
    description:
      "Sleeve pattern forming the arm section of the garment.",
  },
  {
    id: "collar",
    name: "Collar",
    required: true,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 4,
    description:
      "Upper collar pattern used to construct the shirt collar.",
  },
  {
    id: "collar-stand",
    name: "Collar Stand",
    required: true,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 5,
    description:
      "Collar stand joining the collar to the neckline.",
  },
  {
    id: "cuff",
    name: "Cuff",
    required: true,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 6,
    description:
      "Sleeve cuff pattern for finishing the sleeve opening.",
  },
  {
    id: "placket",
    name: "Placket",
    required: true,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 7,
    description:
      "Sleeve placket component used for sleeve opening construction.",
  },
  {
    id: "pocket",
    name: "Pocket",
    required: false,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 8,
    description:
      "Optional chest pocket pattern.",
  },
  {
    id: "pocket-placement-guide",
    name: "Pocket Placement Guide",
    required: false,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 9,
    description:
      "Engineering guide used to position the pocket accurately.",
  },
  {
    id: "back-yoke",
    name: "Back Yoke",
    required: true,
    cutQuantity: 1,
    cutOnFold: true,
    custom: false,
    sequence: 10,
    description:
      "Upper back yoke providing shape and support to the shirt back.",
  },
  {
    id: "front-yoke",
    name: "Front Yoke",
    required: false,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 11,
    description:
      "Optional front yoke used in selected shirt constructions.",
  },
  {
    id: "sleeve-placket",
    name: "Sleeve Placket",
    required: true,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 12,
    description:
      "Sleeve placket reinforcement component.",
  },
  {
    id: "sleeve-placket-facing",
    name: "Sleeve Placket Facing",
    required: true,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 13,
    description:
      "Facing used with the sleeve placket for clean construction.",
  },
  {
    id: "back-loop",
    name: "Back Loop",
    required: false,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 14,
    description:
      "Optional locker loop positioned below the back yoke.",
  },
  {
    id: "front-facing",
    name: "Front Facing",
    required: false,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 15,
    description:
      "Optional front facing for specialised shirt designs.",
  },
  {
    id: "hem-facing",
    name: "Hem Facing",
    required: false,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 16,
    description:
      "Optional hem facing used for premium garment finishing.",
  },
];