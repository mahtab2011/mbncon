import Link from "next/link";
import PresentationProgress from "@/app/components/optifabric/PresentationProgress";
const uploadSteps = [
  "Upload pattern photo or PDF",
  "Confirm 12-inch scale is visible",
  "Enter scale length",
  "AI calibrates real size",
  "AI prepares tracing stage",
];

export default function OptiFabricPatternUploadPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <PresentationProgress currentStep={0} />
        <Link
          href="/optifabric/cutting-assistant"
          className="text-sm text-cyan-300 hover:text-cyan-200"
        >
          ← Back to Cutting Assistant
        </Link>

        <section className="mt-8 rounded-3xl bg-slate-900 border border-slate-700 p-8">
          <p className="text-cyan-300 font-semibold mb-3">
            Block 002 · Pattern Upload
          </p>

          <h1 className="text-4xl font-bold mb-4">
            Upload Pattern & Calibrate Scale
          </h1>

          <p className="text-slate-300 max-w-3xl">
            Upload a pattern photo or PDF with a 12-inch scale placed beside the
            pattern. OptiFabric AI will use the scale to convert the image into
            real garment measurement.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-4">Upload Pattern File</h2>

            <label className="block mb-3 text-sm font-semibold text-slate-300">
              Pattern photo or PDF
            </label>

            <input
              type="file"
              accept="image/*,.pdf"
              className="w-full rounded-xl bg-slate-800 border border-slate-600 p-4 text-slate-300"
            />

            <div className="mt-5 rounded-xl bg-cyan-950/40 border border-cyan-800 p-4">
              <p className="text-sm font-semibold text-cyan-300 mb-1">
                Why does AI ask this?
              </p>
              <p className="text-sm text-slate-300">
                AI needs the photo or PDF so it can detect the pattern boundary,
                measure the area, and prepare the cutting layout.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-4">Scale Calibration</h2>

            <label className="block mb-3 text-sm font-semibold text-slate-300">
              Visible scale length
            </label>

            <select className="w-full rounded-xl bg-slate-800 border border-slate-600 p-4 text-slate-300">
              <option>12 inches</option>
              <option>30 cm</option>
              <option>Custom scale</option>
            </select>

            <label className="block mt-5 mb-3 text-sm font-semibold text-slate-300">
              Is the scale placed beside the pattern?
            </label>

            <select className="w-full rounded-xl bg-slate-800 border border-slate-600 p-4 text-slate-300">
              <option>Yes, clearly visible</option>
              <option>Partly visible</option>
              <option>No, I need help</option>
            </select>

            <div className="mt-5 rounded-xl bg-cyan-950/40 border border-cyan-800 p-4">
              <p className="text-sm font-semibold text-cyan-300 mb-1">
                Why does AI ask this?
              </p>
              <p className="text-sm text-slate-300">
                Without scale calibration, AI cannot convert pixels into real
                inches or centimeters. This is essential for accurate
                consumption calculation.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-slate-900 border border-slate-700 p-6">
          <h2 className="text-2xl font-bold mb-4">Upload Workflow</h2>

          <ol className="space-y-3 text-slate-300 list-decimal list-inside">
            {uploadSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <div className="mt-6">
            <Link
              href="/optifabric/cutting-assistant/fabric-specs"
              className="inline-block rounded-2xl bg-cyan-500 px-6 py-4 text-slate-950 font-bold hover:bg-cyan-400"
            >
              Continue to Fabric Specs
            </Link>
          </div>
          
        </section>
      </div>
    </main>
  );
}