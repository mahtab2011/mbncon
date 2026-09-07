import { PatternLibraryItem } from "./index";

export const poloPatternMaster: PatternLibraryItem[] = [
  {
    id: "polo-front",
    name: "Polo Front",
    required: true,
    cutQuantity: 1,
    cutOnFold: true,
    custom: false,
    sequence: 1,
    description:
      "Main front body panel including the front placket opening.",
  },
  {
    id: "polo-back",
    name: "Polo Back",
    required: true,
    cutQuantity: 1,
    cutOnFold: true,
    custom: false,
    sequence: 2,
    description:
      "Main back body panel extending from neckline to hem.",
  },
  {
    id: "polo-sleeve",
    name: "Sleeve",
    required: true,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 3,
    description:
      "Short sleeve pattern used for both left and right sleeves.",
  },
  {
    id: "polo-rib-collar",
    name: "Rib Collar",
    required: true,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 4,
    description:
      "Knitted rib collar attached to the neckline.",
  },
  {
    id: "polo-collar-stand",
    name: "Collar Stand",
    required: false,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 5,
    description:
      "Collar stand used on premium polo constructions.",
  },
  {
    id: "polo-front-placket",
    name: "Front Placket",
    required: true,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 6,
    description:
      "Visible front placket carrying buttonholes.",
  },
  {
    id: "polo-under-placket",
    name: "Under Placket",
    required: true,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 7,
    description:
      "Internal reinforcement positioned beneath the front placket.",
  },
  {
    id: "polo-placket-interlining",
    name: "Placket Interlining",
    required: false,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 8,
    description:
      "Interlining used to reinforce the placket.",
  },
  {
    id: "polo-rib-cuff",
    name: "Sleeve Rib Cuff",
    required: false,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 9,
    description:
      "Knitted rib cuff used on premium polo sleeves.",
  },
  {
    id: "polo-pocket",
    name: "Chest Pocket",
    required: false,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 10,
    description:
      "Optional chest pocket.",
  },
  {
    id: "polo-pocket-facing",
    name: "Pocket Facing",
    required: false,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 11,
    description:
      "Facing supporting the chest pocket opening.",
  },
  {
    id: "polo-side-vent-facing",
    name: "Side Vent Facing",
    required: false,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 12,
    description:
      "Facing used to reinforce side vents.",
  },
  {
    id: "polo-neck-tape",
    name: "Neck Tape",
    required: false,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 13,
    description:
      "Internal neck tape improving comfort and durability.",
  },
  {
    id: "polo-shoulder-tape",
    name: "Shoulder Reinforcement Tape",
    required: false,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 14,
    description:
      "Reinforcement tape applied to both shoulder seams.",
  },
  {
    id: "polo-back-neck-facing",
    name: "Back Neck Facing",
    required: false,
    cutQuantity: 1,
    cutOnFold: true,
    custom: false,
    sequence: 15,
    description:
      "Facing used to finish the back neckline.",
  },
  {
    id: "polo-hem-facing",
    name: "Hem Facing",
    required: false,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 16,
    description:
      "Separate facing used for premium hem construction.",
  },
  {
    id: "polo-care-label-guide",
    name: "Care Label Placement Guide",
    required: false,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 17,
    description:
      "Reference guide showing the standard care label position.",
  },
  {
    id: "polo-brand-label-guide",
    name: "Brand Label Placement Guide",
    required: false,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 18,
    description:
      "Reference guide showing the standard brand label position.",
  },
];