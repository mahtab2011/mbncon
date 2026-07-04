"use client";

import {
  RankedFactory,
} from "../../../lib/gpa/factoryRankingEngine";

type Props = {
  factories: RankedFactory[];
};

export default function FactoryRankingPanel({
  factories,
}: Props) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-2xl font-bold text-slate-800">
        Enterprise Factory Ranking
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Live ranking based on Factory Health Score.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-slate-100">
              <th className="p-3 text-left">Rank</th>
              <th className="p-3 text-left">Factory</th>
              <th className="p-3 text-center">Health</th>
              <th className="p-3 text-center">Production</th>
              <th className="p-3 text-center">Efficiency</th>
              <th className="p-3 text-center">Quality</th>
              <th className="p-3 text-center">OEE</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {factories.map((factory) => (
              <tr
                key={factory.factoryId}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-3 font-bold">
                  #{factory.rank}
                </td>

                <td className="p-3 font-semibold">
                  {factory.factoryName}
                </td>

                <td className="p-3 text-center">
                  {factory.health}%
                </td>

                <td className="p-3 text-center">
                  {factory.production}%
                </td>

                <td className="p-3 text-center">
                  {factory.efficiency}%
                </td>

                <td className="p-3 text-center">
                  {factory.quality}%
                </td>

                <td className="p-3 text-center">
                  {factory.oee}%
                </td>

                <td className="p-3 text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      factory.status === "GREEN"
                        ? "bg-green-100 text-green-700"
                        : factory.status === "YELLOW"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {factory.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}