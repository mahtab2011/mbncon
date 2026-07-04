"use client";

import FactorySelector from "./FactorySelector";

import { useGpaFactory } from "../../context/GpaFactoryContext";

import {
  getFactory,
} from "../../../lib/gpa/factoryMasterEngine";

export default function EnterpriseFactorySwitcher() {
  const { selectedFactory } = useGpaFactory();

  const factory = getFactory(selectedFactory);

  return (
    <section className="mb-8 grid gap-6 md:grid-cols-3">
      <FactorySelector />

      <div className="rounded-xl bg-white p-5 shadow md:col-span-2">
        <h2 className="text-lg font-bold text-blue-700">
          Selected Factory Profile
        </h2>

        {!factory ? (
          <p className="mt-4 text-red-600">
            Factory not found.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <MiniCard title="Code" value={factory.code} />
            <MiniCard title="Location" value={factory.location} />
            <MiniCard title="Buyer" value={factory.buyer} />
            <MiniCard title="Status" value={factory.status} />
            <MiniCard title="Lines" value={factory.lines.toString()} />
            <MiniCard title="Operators" value={factory.operators.toString()} />
            <MiniCard title="Efficiency" value={`${factory.efficiency}%`} />
            <MiniCard title="OEE" value={`${factory.oee}%`} />
          </div>
        )}
      </div>
    </section>
  );
}

function MiniCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="mt-1 font-bold text-slate-800">{value}</p>
    </div>
  );
}