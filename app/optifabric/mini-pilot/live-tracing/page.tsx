"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { fabricPatternTypes } from "@/lib/optifabric/fabricPatternTypes";
import { loadImage } from "@/lib/optifabric/imageLoader";
import {
  calculatePolygonPixelArea,
  convertPixelAreaToSqInches,
} from "@/lib/optifabric/polygonAreaEngine";
import { PolygonPoint } from "@/lib/optifabric/polygonTypes";

export default function LiveTracingPage() {
  const [fabricType, setFabricType] = useState("solid");
  const [points, setPoints] = useState<PolygonPoint[]>([]);
  const [scalePixels, setScalePixels] = useState(600);
  const [imageSrc, setImageSrc] = useState<string>("");

  const selectedFabric = fabricPatternTypes.find(
    (item) => item.id === fabricType
  );

  const pixelArea = useMemo(() => {
    return calculatePolygonPixelArea(points);
  }, [points]);

  const areaSqInches = useMemo(() => {
    return convertPixelAreaToSqInches(pixelArea, 12, scalePixels);
  }, [pixelArea, scalePixels]);

  async function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const image = await loadImage(file);

    setImageSrc(image);
    setPoints([]);
  }

  function handleCanvasClick(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = Number((event.clientX - rect.left).toFixed(2));
    const y = Number((event.clientY - rect.top).toFixed(2));

    const newPoint: PolygonPoint = {
      id: `point-${Date.now()}-${points.length}`,
      x,
      y,
    };

    setPoints([...points, newPoint]);
  }

  function undoLastPoint() {
    setPoints(points.slice(0, -1));
  }

  function clearPoints() {
    setPoints([]);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/optifabric/mini-pilot"
          className="text-cyan-300 hover:text-cyan-200"
        >
          ← Back to Mini Pilot
        </Link>

        <section className="mt-8 rounded-3xl bg-slate-900 border border-slate-700 p-8">
          <p className="text-cyan-300 font-semibold mb-3">
            Mini Pilot · Live Pattern Tracing
          </p>

          <h1 className="text-4xl font-bold mb-4">
            Live Pattern Tracing Workspace
          </h1>

          <p className="text-slate-300 max-w-3xl">
            Upload a pattern image, click around the boundary, and OptiFabric AI
            converts the traced outline into area for nesting, consumption, and
            savings calculation.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-4">Pattern Upload</h2>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full rounded-xl bg-slate-800 border border-slate-600 p-4 text-slate-300"
            />

            <label className="block mt-6 mb-2 text-sm font-semibold text-slate-300">
              Fabric Pattern Type
            </label>

            <select
              value={fabricType}
              onChange={(event) => setFabricType(event.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-600 p-4 text-slate-300"
            >
              {fabricPatternTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <label className="block mt-6 mb-2 text-sm font-semibold text-slate-300">
              12-inch scale length in pixels
            </label>

            <input
              type="number"
              value={scalePixels}
              onChange={(event) => setScalePixels(Number(event.target.value))}
              className="w-full rounded-xl bg-slate-800 border border-slate-600 p-4 text-slate-300"
            />

            <div className="mt-5 rounded-xl bg-cyan-950/40 border border-cyan-800 p-4">
              <p className="text-sm font-semibold text-cyan-300 mb-1">
                Why does AI ask this?
              </p>

              <p className="text-sm text-slate-300">
                {selectedFabric?.description}
              </p>

              <p className="text-sm text-cyan-300 mt-3 font-semibold">
                AI Logic
              </p>

              <p className="text-sm text-slate-300">
                {selectedFabric?.aiLogic}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-4">Tracing Controls</h2>

            <button
              onClick={undoLastPoint}
              className="rounded-xl bg-slate-700 px-5 py-3 text-white font-bold hover:bg-slate-600"
            >
              Undo Last Point
            </button>

            <button
              onClick={clearPoints}
              className="ml-3 rounded-xl bg-red-700 px-5 py-3 text-white font-bold hover:bg-red-600"
            >
              Clear
            </button>

            <div className="mt-6 rounded-xl bg-slate-800 border border-slate-600 p-4">
              <p>Boundary Points: {points.length}</p>
              <p className="mt-2">Pixel Area: {pixelArea.toFixed(2)}</p>
              <p className="mt-2 font-bold text-cyan-300">
                Area: {areaSqInches.toFixed(2)} sq inches
              </p>
            </div>

            <div className="mt-5 rounded-xl bg-amber-950/40 border border-amber-700 p-4">
              <p className="text-sm text-amber-200">
                Pilot instruction: upload one pattern image, then click around
                the outer boundary. Use Undo if a point is wrong.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-slate-900 border border-slate-700 p-6">
          <h2 className="text-2xl font-bold mb-4">Pattern Preview</h2>

          <div
            onClick={handleCanvasClick}
            className="relative h-[420px] rounded-xl bg-white overflow-hidden cursor-crosshair"
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Uploaded pattern"
                className="absolute inset-0 h-full w-full object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                Upload a pattern image to start tracing
              </div>
            )}

            <svg className="absolute inset-0 h-full w-full">
              {points.length > 1 && (
                <polyline
                  points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke="black"
                  strokeWidth="3"
                />
              )}

              {points.length > 2 && (
                <polygon
                  points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="rgba(14,165,233,0.20)"
                  stroke="black"
                  strokeWidth="2"
                />
              )}

              {points.map((point, index) => (
                <g key={point.id}>
                  <circle cx={point.x} cy={point.y} r="6" fill="red" />
                  <text
                    x={point.x + 8}
                    y={point.y - 8}
                    fontSize="12"
                    fill="black"
                  >
                    {index + 1}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </section>

        <div className="mt-10 flex justify-end">
          <Link
            href="/optifabric/mini-pilot/polygon-nesting"
            className="rounded-2xl bg-cyan-500 px-8 py-4 text-slate-950 font-bold hover:bg-cyan-400"
          >
            Continue to Polygon Nesting →
          </Link>
        </div>
      </div>
    </main>
  );
}