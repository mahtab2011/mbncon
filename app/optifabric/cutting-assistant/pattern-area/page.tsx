import Link from "next/link";

import {
  calculatePatternArea,
} from "@/lib/optifabric/patternAreaEngine";

export default function PatternAreaPage() {
  const result = calculatePatternArea({
    patternPieceCount: 8,
    scaleLengthInches: 12,
    pixelLengthOfScale: 600,
    estimatedPixelArea: 420000,
  });

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/optifabric/cutting-assistant/pattern-analysis"
          className="inline-block text-cyan-300 hover:text-cyan-200"
        >
          <span className="block">← Back to Pattern Analysis</span>
          <span className="mt-1 block text-sm text-slate-400">
            ← Pattern Analysis-এ ফিরে যান
          </span>
        </Link>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-8">
          <p className="font-semibold text-cyan-300">
            Block 005 · Pattern Area Engine
          </p>
          <p className="mt-2 font-bold text-cyan-200">
            ব্লক ০০৫ · Pattern Area Engine
          </p>

          <h1 className="mt-5 text-4xl font-bold">
            AI Pattern Area Calculation
          </h1>
          <h2 className="mt-3 text-2xl font-black text-cyan-300">
            AI Pattern Area Calculation
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-slate-300">
            OptiFabric AI converts the traced pattern boundary into real square
            inches using the calibrated 12-inch scale.
          </p>
          <p className="mt-4 max-w-3xl leading-8 text-slate-400">
            Calibrated ১২ ইঞ্চি scale ব্যবহার করে OptiFabric AI traced pattern
            boundary-কে বাস্তব square inch-এ রূপান্তর করে।
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Area Result</h2>
            <h3 className="mt-2 text-xl font-black text-cyan-300">
              Area ফলাফল
            </h3>

            <div className="mt-6 space-y-4">
              <Row e="Total Area" b="মোট area" v={`${result.totalAreaSqInches} sq inches`} />
              <Row e="Total Area" b="মোট area" v={`${result.totalAreaSqFeet} sq feet`} />
              <Row e="Area Per Piece" b="প্রতি piece-এর area" v={`${result.areaPerPieceSqInches} sq inches`} />
              <Row e="Calibration Ratio" b="Calibration ratio" v={`${result.calibrationRatio} inch per pixel`} />
              <Row e="Confidence" b="AI confidence" v={`${result.confidence}%`} hi />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">AI Engineering Notes</h2>
            <h3 className="mt-2 text-xl font-black text-cyan-300">
              AI Engineering নোট
            </h3>

            <ul className="mt-6 space-y-3">
              {result.notes.map((note) => (
                <li key={note} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  • {note}
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-950/20 p-4">
              <p className="font-bold text-amber-300">বাংলা ব্যাখ্যা</p>
              <p className="mt-2 text-sm text-slate-400">
                Pattern area সঠিক হলে পরবর্তী marker layout, fabric consumption
                এবং savings calculation আরও নির্ভুল হয়।
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-cyan-800 bg-cyan-950/40 p-6">
          <h2 className="text-xl font-bold text-cyan-300">
            Why does AI calculate pattern area?
          </h2>
          <h3 className="mt-2 text-lg font-black text-cyan-200">
            AI কেন pattern area হিসাব করে?
          </h3>

          <p className="mt-4 leading-8 text-slate-300">
            AI needs the real pattern area before estimating fabric
            consumption, marker efficiency, cutting waste and possible savings.
          </p>
          <p className="mt-3 leading-8 text-slate-400">
            Fabric consumption, marker efficiency, cutting waste এবং সম্ভাব্য
            saving হিসাব করার আগে AI-এর বাস্তব pattern area প্রয়োজন।
          </p>
        </section>

        <div className="mt-10 flex justify-end">
          <Link
            href="/optifabric/cutting-assistant/marker-layout"
            className="rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-slate-950 hover:bg-cyan-400"
          >
            <span className="block">Continue to Marker Layout →</span>
            <span className="mt-1 block text-sm">
              Marker Layout-এ এগিয়ে যান →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}

function Row({e,b,v,hi=false}:{e:string;b:string;v:string;hi?:boolean}){
 return <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
   <p className="font-bold text-white">{e}</p>
   <p className="mt-1 text-sm text-slate-400">{b}</p>
   <p className={`mt-3 text-lg font-black ${hi?"text-cyan-300":"text-white"}`}>{v}</p>
 </div>
}