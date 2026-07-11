"use client";

import Link from "next/link";
import PresentationProgress from "@/app/components/optifabric/PresentationProgress";
import AIExplanationCard from "@/app/components/optifabric/AIExplanationCard";

const boundaryPoints = [
  { id: 1, x: 120, y: 80 },
  { id: 2, x: 230, y: 55 },
  { id: 3, x: 340, y: 110 },
  { id: 4, x: 365, y: 220 },
  { id: 5, x: 300, y: 320 },
  { id: 6, x: 180, y: 345 },
  { id: 7, x: 90, y: 265 },
  { id: 8, x: 70, y: 155 },
];

const engineeringSteps = [
  "AI validates the point order",
  "AI removes duplicate points",
  "AI checks polygon integrity",
  "AI checks for self-intersections",
  "AI calculates polygon area",
  "AI checks grain direction readiness",
  "AI prepares the polygon for nesting",
];

export default function PolygonDemoPage() {
  const polygonPoints = boundaryPoints
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <PresentationProgress currentStep={3} />
        <Link
          href="/optifabric/demo/boundary-tracing"
          className="text-cyan-300 hover:text-cyan-200"
        >
          ← Back to Boundary Tracing
        </Link>

        <section className="mt-6 rounded-3xl bg-gradient-to-r from-cyan-950 via-blue-950 to-slate-900 p-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
            STEP 3 OF 8
          </p>

          <h1 className="mt-4 text-5xl font-black">
            AI Polygon Construction
          </h1>

          <p className="mt-3 text-2xl font-bold text-cyan-100">
            AI পলিগন তৈরি
          </p>

          <p className="mt-6 max-w-4xl text-xl text-slate-300">
            OptiFabric AI converts selected boundary points into a clean polygon
            that can be measured, rotated and prepared for fabric nesting.
          </p>

          <p className="mt-3 max-w-4xl text-lg text-slate-400">
            OptiFabric AI নির্বাচিত সীমানার বিন্দুগুলোকে একটি পরিষ্কার পলিগনে
            রূপান্তর করে, যা পরিমাপ, ঘোরানো এবং কাপড়ে নেস্টিংয়ের জন্য প্রস্তুত।
          </p>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-900 p-8">
            <h2 className="text-3xl font-black">
              Selected Boundary Points
            </h2>

            <p className="mt-2 text-lg text-slate-400">
              নির্বাচিত সীমানার বিন্দু
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {boundaryPoints.map((point) => (
                <div
                  key={point.id}
                  className="rounded-xl bg-slate-800 p-4"
                >
                  <p className="font-black text-cyan-300">
                    Point {point.id}
                  </p>

                  <p className="mt-2 text-sm text-slate-300">
                    X: {point.x}
                  </p>

                  <p className="text-sm text-slate-300">
                    Y: {point.y}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-blue-950 p-5">
              <h3 className="font-black text-cyan-300">
                Why does AI need these points?
              </h3>

              <p className="mt-2 text-slate-200">
                The points define the outside edge of the pattern. AI joins them
                to create the polygon used for area and nesting calculations.
              </p>

              <h3 className="mt-5 font-black text-cyan-300">
                AI কেন এই বিন্দুগুলো চায়?
              </h3>

              <p className="mt-2 text-slate-200">
                এই বিন্দুগুলো প্যাটার্নের বাইরের সীমানা নির্ধারণ করে। AI
                বিন্দুগুলো যুক্ত করে ক্ষেত্রফল ও নেস্টিং হিসাবের জন্য পলিগন তৈরি
                করে।
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-blue-950 p-8">
            <h2 className="text-3xl font-black">
              AI Engineering Process
            </h2>

            <p className="mt-2 text-lg text-blue-200">
              AI ইঞ্জিনিয়ারিং প্রক্রিয়া
            </p>

            <div className="mt-6 space-y-4">
              {engineeringSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-xl bg-blue-900 p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-black text-slate-950">
                    {index + 1}
                  </div>

                  <p className="font-semibold">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-slate-900 p-5">
              <h3 className="font-black text-green-300">
                No CAD Experience Required
              </h3>

              <p className="mt-2 text-slate-200">
                The user only selects the boundary points. OptiFabric AI performs
                the polygon construction automatically.
              </p>

              <h3 className="mt-5 font-black text-green-300">
                CAD অভিজ্ঞতা প্রয়োজন নেই
              </h3>

              <p className="mt-2 text-slate-200">
                ব্যবহারকারী শুধু সীমানার বিন্দু নির্বাচন করবেন। OptiFabric AI
                স্বয়ংক্রিয়ভাবে পলিগন তৈরি করবে।
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-slate-900 p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">
                Generated Polygon
              </h2>

              <p className="mt-2 text-lg text-slate-400">
                তৈরি করা পলিগন
              </p>
            </div>

            <span className="rounded-full bg-green-500 px-4 py-2 font-black text-slate-950">
              READY
            </span>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border-4 border-cyan-700 bg-slate-200 p-4">
            <svg
              viewBox="0 0 440 400"
              className="h-[420px] w-full"
              role="img"
              aria-label="Generated pattern polygon"
            >
              <rect width="440" height="400" fill="#e2e8f0" />

              <polygon
                points={polygonPoints}
                fill="rgba(34, 211, 238, 0.28)"
                stroke="#0891b2"
                strokeWidth="5"
              />

              {boundaryPoints.map((point) => (
                <g key={point.id}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="8"
                    fill="#22d3ee"
                    stroke="#083344"
                    strokeWidth="3"
                  />

                  <text
                    x={point.x + 12}
                    y={point.y - 12}
                    fill="#082f49"
                    fontSize="15"
                    fontWeight="700"
                  >
                    {point.id}
                  </text>
                </g>
              ))}

              <line
                x1="210"
                y1="105"
                x2="210"
                y2="295"
                stroke="#16a34a"
                strokeWidth="4"
                strokeDasharray="12 8"
              />

              <text
                x="225"
                y="205"
                fill="#166534"
                fontSize="16"
                fontWeight="700"
              >
                Grain Line
              </text>
            </svg>
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-green-950 p-8">
          <h2 className="text-center text-4xl font-black">
            Polygon Successfully Generated
          </h2>

          <p className="mt-3 text-center text-2xl font-bold text-green-200">
            পলিগন সফলভাবে তৈরি হয়েছে
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl bg-green-900 p-5 text-center">
              <p className="text-sm text-green-200">Boundary Points</p>
              <p className="mt-2 text-4xl font-black">
                {boundaryPoints.length}
              </p>
            </div>

            <div className="rounded-xl bg-green-900 p-5 text-center">
              <p className="text-sm text-green-200">Polygon Status</p>
              <p className="mt-2 text-2xl font-black">VALID</p>
            </div>

            <div className="rounded-xl bg-green-900 p-5 text-center">
              <p className="text-sm text-green-200">Rotation</p>
              <p className="mt-2 text-2xl font-black">READY</p>
            </div>

            <div className="rounded-xl bg-green-900 p-5 text-center">
              <p className="text-sm text-green-200">Nesting</p>
              <p className="mt-2 text-2xl font-black">READY</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-950 p-5">
            <h3 className="font-black text-cyan-300">
              AI Engineering Note
            </h3>

            <p className="mt-2 text-slate-200">
              The polygon is now ready to be placed on a solid fabric lay. The
              next step will compare a standard layout with an AI optimized
              nesting layout.
            </p>

            <h3 className="mt-5 font-black text-cyan-300">
              AI ইঞ্জিনিয়ারিং নোট
            </h3>

            <p className="mt-2 text-slate-200">
              পলিগন এখন সলিড কাপড়ের লেতে বসানোর জন্য প্রস্তুত। পরবর্তী ধাপে
              সাধারণ লেআউট এবং AI অপটিমাইজড নেস্টিং লেআউট তুলনা করা হবে।
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/optifabric/demo/nesting"
              className="inline-block rounded-2xl bg-cyan-400 px-10 py-5 text-xl font-black text-slate-950 hover:bg-cyan-300"
            >
              Continue to AI Nesting →
            </Link>
          </div>
        </section>
        <div className="mt-8">
  <AIExplanationCard
    title="Polygon Construction"
    titleBn="পলিগন নির্মাণ"

    purpose="Convert the traced boundary into an engineering-grade polygon suitable for accurate area calculation and AI nesting."

    purposeBn="ট্রেস করা সীমানাকে প্রকৌশলগত মানের পলিগনে রূপান্তর করা যাতে সঠিক ক্ষেত্রফল গণনা এবং AI নেস্টিং করা যায়।"

    why="AI requires a mathematically accurate polygon because every area, marker and fabric calculation depends on its precision."

    whyBn="AI-এর জন্য গাণিতিকভাবে সঠিক পলিগন প্রয়োজন, কারণ ক্ষেত্রফল, মার্কার এবং কাপড়ের সকল হিসাব এর উপর নির্ভর করে।"

    bestPractice="Ensure the traced boundary is complete before generating the polygon."

    bestPracticeBn="পলিগন তৈরির আগে নিশ্চিত করুন যে পুরো সীমানা সঠিকভাবে ট্রেস করা হয়েছে।"

    commonMistake="Generating the polygon before completing the full boundary tracing."

    commonMistakeBn="সম্পূর্ণ সীমানা ট্রেস করার আগে পলিগন তৈরি করা।"
  />
</div>
      </div>
    </main>
  );
}