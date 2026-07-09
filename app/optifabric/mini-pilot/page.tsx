"use client";

import { useState } from "react";
import { fabricPatternTypes } from "@/lib/optifabric/fabricPatternTypes";

export default function MiniPilotPage() {
  const [product, setProduct] = useState("shirt");
  const [fabricType, setFabricType] = useState("solid");

  const selectedFabric =
    fabricPatternTypes.find(
      (f) => f.id === fabricType
    );

  return (
    <main className="min-h-screen bg-slate-100">

      <div className="max-w-6xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-2">
          OptiFabric AI Mini Pilot RC1
        </h1>

        <p className="text-slate-600 mb-8">
          AI Digital Cutting Master
        </p>

        {/* Product */}

        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <h2 className="text-xl font-bold mb-4">
            Product
          </h2>

          <select
            className="border rounded-lg p-3 w-full"
            value={product}
            onChange={(e) =>
              setProduct(e.target.value)
            }
          >
            <option value="shirt">
              Shirt
            </option>

            <option value="jacket">
              Jacket
            </option>

            <option value="trouser">
              Trouser
            </option>

          </select>

        </div>

        {/* Fabric */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            Fabric Pattern Type
          </h2>

          <select
            className="border rounded-lg p-3 w-full"
            value={fabricType}
            onChange={(e) =>
              setFabricType(e.target.value)
            }
          >

            {fabricPatternTypes.map((item) => (

              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>

            ))}

          </select>

          <div className="mt-6 rounded-xl bg-cyan-50 border border-cyan-300 p-5">

            <h3 className="font-bold mb-2">
              Why does AI ask this?
            </h3>

            <p>
              {selectedFabric?.description}
            </p>

            <p className="mt-4 font-semibold text-cyan-700">
              AI Logic
            </p>

            <p>
              {selectedFabric?.aiLogic}
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}