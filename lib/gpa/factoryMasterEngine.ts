export type FactoryStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "MAINTENANCE";

export type FactoryMaster = {
  id: string;
  code: string;
  name: string;
  location: string;

  buyer: string;

  lines: number;

  operators: number;

  status: FactoryStatus;

  production: number;

  efficiency: number;

  quality: number;

  oee: number;
};

export const demoFactories: FactoryMaster[] = [
  {
    id: "F001",
    code: "DHK-01",
    name: "MBN Apparel Ltd.",
    location: "Dhaka",

    buyer: "H&M",

    lines: 24,

    operators: 1320,

    status: "ACTIVE",

    production: 91,

    efficiency: 88,

    quality: 96,

    oee: 87,
  },

  {
    id: "F002",
    code: "CTG-01",
    name: "MBN Knit Division",

    location: "Chattogram",

    buyer: "Zara",

    lines: 18,

    operators: 980,

    status: "ACTIVE",

    production: 86,

    efficiency: 84,

    quality: 93,

    oee: 82,
  },

  {
    id: "F003",
    code: "SYL-01",
    name: "MBN Sportswear",

    location: "Sylhet",

    buyer: "Decathlon",

    lines: 12,

    operators: 640,

    status: "MAINTENANCE",

    production: 72,

    efficiency: 76,

    quality: 90,

    oee: 70,
  },
];

export function getFactory(
  id: string
): FactoryMaster | undefined {
  return demoFactories.find(
    (factory) => factory.id === id
  );
}

export function getAllFactories() {
  return demoFactories;
}