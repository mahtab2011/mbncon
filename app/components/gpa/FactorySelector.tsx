"use client";

import { useGpaFactory } from "../../context/GpaFactoryContext";

import {
  getAllFactories,
  FactoryMaster,
} from "../../../lib/gpa/factoryMasterEngine";

export default function FactorySelector() {
  const {
    selectedFactory,
    setSelectedFactory,
  } = useGpaFactory();

  const factories: FactoryMaster[] = getAllFactories();

  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <h2 className="text-lg font-bold text-blue-700">
        Factory Selection
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Executive Enterprise View
      </p>

      <select
        className="mt-4 w-full rounded-lg border p-3"
        value={selectedFactory}
        onChange={(e) =>
          setSelectedFactory(e.target.value)
        }
      >
        {factories.map((factory: FactoryMaster) => (
          <option
            key={factory.id}
            value={factory.id}
          >
            {factory.code} — {factory.name}
          </option>
        ))}
      </select>

      <div className="mt-4 rounded-lg bg-slate-50 p-3">
        <p className="text-sm text-gray-600">
          Selected Factory
        </p>

        <p className="font-bold text-blue-700">
          {selectedFactory}
        </p>
      </div>
    </div>
  );
}