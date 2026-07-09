import Link from "next/link";

const inputQuestions = [
  {
    title: "Fabric Width",
    question: "What is the usable fabric width?",
    why: "AI asks this because marker efficiency depends on how many pattern pieces can fit across the fabric width.",
  },
  {
    title: "Pattern Photo or PDF",
    question: "Upload a pattern photo or PDF with a 12-inch scale.",
    why: "AI asks this so it can calibrate real size before tracing the pattern boundary.",
  },
  {
    title: "Garment Size",
    question: "Which garment size is this pattern for?",
    why: "AI asks this because consumption changes by size and size ratio.",
  },
  {
    title: "Fabric Type",
    question: "What type of fabric will be used?",
    why: "AI asks this because woven, knit, stretch, stripe, check, or nap fabrics need different cutting logic.",
  },
];

export default function OptiFabricCuttingAssistantPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/optifabric"
          className="text-sm text-cyan-300 hover:text-cyan-200"
        >
          ← Back to OptiFabric AI
        </Link>

        <section className="mt-8 rounded-3xl bg-slate-900 border border-slate-700 p-8">
          <p className="text-cyan-300 font-semibold mb-3">
            OptiFabric AI Commercial MVP
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI Digital Cutting Master
          </h1>

          <p className="text-slate-300 max-w-3xl text-lg">
            Upload a pattern photo or PDF, calibrate it with a 12-inch scale,
            enter fabric width, and let OptiFabric AI estimate cutting
            consumption, marker efficiency, waste, and saving opportunities.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-8">
          {inputQuestions.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-slate-900 border border-slate-700 p-6"
            >
              <h2 className="text-xl font-bold text-white mb-2">
                {item.title}
              </h2>

              <p className="text-slate-300 mb-4">{item.question}</p>

              <div className="rounded-xl bg-cyan-950/40 border border-cyan-800 p-4">
                <p className="text-sm font-semibold text-cyan-300 mb-1">
                  Why does AI ask this?
                </p>
                <p className="text-sm text-slate-300">{item.why}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-2xl bg-slate-900 border border-slate-700 p-6">
          <h2 className="text-2xl font-bold mb-4">MVP Cutting Workflow</h2>

          <ol className="space-y-3 text-slate-300 list-decimal list-inside">
            <li>Upload pattern photo or PDF.</li>
            <li>Detect 12-inch scale.</li>
            <li>Calibrate real pattern size.</li>
            <li>Trace pattern boundary.</li>
            <li>Calculate pattern area.</li>
            <li>Enter fabric width.</li>
            <li>Generate rough marker layout.</li>
            <li>Estimate fabric consumption.</li>
            <li>Show AI savings recommendation.</li>
            <li>Export PDF cutting suggestion.</li>
          </ol>
          <div className="mt-6">
  <Link
    href="/optifabric/cutting-assistant/upload"
    className="inline-block rounded-2xl bg-cyan-500 px-6 py-4 text-slate-950 font-bold hover:bg-cyan-400"
  >
    Start Pattern Upload
  </Link>
</div>
        </section>

      </div>
    </main>
  );
}