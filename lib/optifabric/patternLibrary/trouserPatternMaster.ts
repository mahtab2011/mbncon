import { PatternLibraryItem } from "./index";

export const trouserPatternMaster: PatternLibraryItem[] = [
  {
    id: "trouser-front",
    name: "Trouser Front",
    required: true,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 1,
    description:
      "Main front trouser panel containing the front waist, rise, inseam, outseam and hem shaping.",
  },
  {
    id: "trouser-back",
    name: "Trouser Back",
    required: true,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 2,
    description:
      "Main back trouser panel containing the back rise, seat shaping, inseam, outseam and hem.",
  },
  {
    id: "trouser-waistband",
    name: "Waistband",
    required: true,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 3,
    description:
      "Outer waistband component used to support and finish the trouser waist.",
  },
  {
    id: "trouser-waistband-facing",
    name: "Waistband Facing",
    required: false,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 4,
    description:
      "Inner waistband component used to provide a clean internal waist finish.",
  },
  {
    id: "trouser-waistband-interlining",
    name: "Waistband Interlining",
    required: false,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 5,
    description:
      "Fusible or non-fusible reinforcement used to stabilise the waistband.",
  },
  {
    id: "trouser-fly",
    name: "Fly",
    required: true,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 6,
    description:
      "Front fly extension or separate fly component used for the trouser opening.",
  },
  {
    id: "trouser-fly-facing",
    name: "Fly Facing",
    required: true,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 7,
    description:
      "Facing component used to finish and support the front fly opening.",
  },
  {
    id: "trouser-fly-shield",
    name: "Fly Shield",
    required: true,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 8,
    description:
      "Protective under-fly component positioned behind the zipper opening.",
  },
  {
    id: "trouser-front-pocket-bag",
    name: "Front Pocket Bag",
    required: true,
    cutQuantity: 4,
    cutOnFold: false,
    custom: false,
    sequence: 9,
    description:
      "Pocketing components forming the internal front pocket bag.",
  },
  {
    id: "trouser-front-pocket-facing",
    name: "Front Pocket Facing",
    required: true,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 10,
    description:
      "Main-fabric facing used to finish the visible front pocket opening.",
  },
  {
    id: "trouser-front-pocket-bearer",
    name: "Front Pocket Bearer",
    required: false,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 11,
    description:
      "Support component attached to the pocket bag behind the front pocket opening.",
  },
  {
    id: "trouser-coin-pocket",
    name: "Coin Pocket",
    required: false,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 12,
    description:
      "Small supplementary pocket normally positioned inside or above a front pocket.",
  },
  {
    id: "trouser-back-pocket-welt",
    name: "Back Pocket Welt",
    required: false,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 13,
    description:
      "Welt component used to construct a tailored back pocket opening.",
  },
  {
    id: "trouser-back-pocket-facing",
    name: "Back Pocket Facing",
    required: false,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 14,
    description:
      "Facing component used to reinforce and finish the back pocket opening.",
  },
  {
    id: "trouser-back-pocket-bag",
    name: "Back Pocket Bag",
    required: false,
    cutQuantity: 4,
    cutOnFold: false,
    custom: false,
    sequence: 15,
    description:
      "Pocketing pieces forming the internal back pocket bag.",
  },
  {
    id: "trouser-back-pocket-flap",
    name: "Back Pocket Flap",
    required: false,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 16,
    description:
      "Optional flap used to cover and style the back pocket opening.",
  },
  {
    id: "trouser-belt-loop",
    name: "Belt Loop",
    required: true,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 17,
    description:
      "Long strip used to manufacture the required number of trouser belt loops.",
  },
  {
    id: "trouser-front-lining",
    name: "Front Knee Lining",
    required: false,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 18,
    description:
      "Partial front lining extending towards the knee in tailored trousers.",
  },
  {
    id: "trouser-crotch-reinforcement",
    name: "Crotch Reinforcement",
    required: false,
    cutQuantity: 1,
    cutOnFold: false,
    custom: false,
    sequence: 19,
    description:
      "Optional reinforcement component supporting the crotch or seat area.",
  },
  {
    id: "trouser-hem-facing",
    name: "Hem Facing",
    required: false,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 20,
    description:
      "Separate facing used when the trouser hem requires a shaped or reinforced finish.",
  },
];