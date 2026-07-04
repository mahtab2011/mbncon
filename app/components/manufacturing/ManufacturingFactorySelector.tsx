"use client";

type Factory = {
  id: string;
  name: string;
  country: string;
};

const factories: Factory[] = [
  {
    id: "factory-001",
    name: "MBN Demo Garments Factory",
    country: "Bangladesh",
  },
  {
    id: "factory-002",
    name: "Chattogram Export Unit",
    country: "Bangladesh",
  },
  {
    id: "factory-003",
    name: "Gazipur Knit Division",
    country: "Bangladesh",
  },
];

type Props = {
  value?: string;
  onChange?: (factoryId: string) => void;
};

export default function ManufacturingFactorySelector({
  value = "factory-001",
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">
        Factory
      </label>

      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
      >
        {factories.map((factory) => (
          <option key={factory.id} value={factory.id}>
            {factory.name} ({factory.country})
          </option>
        ))}
      </select>
    </div>
  );
}