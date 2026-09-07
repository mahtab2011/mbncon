import Link from "next/link";

const inputQuestions = [
  {
    titleEnglish: "Fabric Width",
    titleBangla: "কাপড়ের প্রস্থ",
    questionEnglish: "What is the usable fabric width?",
    questionBangla: "ব্যবহারযোগ্য কাপড়ের প্রস্থ কত?",
    whyEnglish:
      "AI asks this because marker efficiency depends on how many pattern pieces can fit across the fabric width.",
    whyBangla:
      "AI এই তথ্য চায় কারণ marker efficiency নির্ভর করে কাপড়ের প্রস্থ জুড়ে কতটি pattern piece বসানো যায় তার ওপর।",
  },
  {
    titleEnglish: "Pattern Photo or PDF",
    titleBangla: "প্যাটার্নের ছবি অথবা PDF",
    questionEnglish:
      "Upload a pattern photo or PDF with a 12-inch scale.",
    questionBangla:
      "১২ ইঞ্চি scale-সহ প্যাটার্নের ছবি অথবা PDF upload করুন।",
    whyEnglish:
      "AI asks this so it can calibrate the real size before tracing the pattern boundary.",
    whyBangla:
      "Pattern boundary trace করার আগে বাস্তব মাপ calibrate করার জন্য AI এই file চায়।",
  },
  {
    titleEnglish: "Garment Size",
    titleBangla: "গার্মেন্টের সাইজ",
    questionEnglish: "Which garment size is this pattern for?",
    questionBangla: "এই pattern কোন garment size-এর জন্য?",
    whyEnglish:
      "AI asks this because fabric consumption changes according to garment size and size ratio.",
    whyBangla:
      "Garment size এবং size ratio অনুযায়ী fabric consumption পরিবর্তিত হয়, তাই AI এই তথ্য চায়।",
  },
  {
    titleEnglish: "Fabric Type",
    titleBangla: "কাপড়ের ধরন",
    questionEnglish: "What type of fabric will be used?",
    questionBangla: "কোন ধরনের fabric ব্যবহার করা হবে?",
    whyEnglish:
      "AI asks this because woven, knit, stretch, stripe, check and nap fabrics require different cutting logic.",
    whyBangla:
      "Woven, knit, stretch, stripe, check এবং nap fabric-এর জন্য ভিন্ন cutting logic প্রয়োজন, তাই AI এই তথ্য চায়।",
  },
];

const workflowSteps = [
  {
    english: "Upload the pattern photo or PDF.",
    bangla: "Pattern-এর ছবি অথবা PDF upload করুন।",
  },
  {
    english: "Detect the 12-inch scale.",
    bangla: "১২ ইঞ্চি scale শনাক্ত করুন।",
  },
  {
    english: "Calibrate the real pattern size.",
    bangla: "Pattern-এর বাস্তব মাপ calibrate করুন।",
  },
  {
    english: "Trace the pattern boundary.",
    bangla: "Pattern boundary trace করুন।",
  },
  {
    english: "Calculate the pattern area.",
    bangla: "Pattern area হিসাব করুন।",
  },
  {
    english: "Enter the usable fabric width.",
    bangla: "ব্যবহারযোগ্য fabric width লিখুন।",
  },
  {
    english: "Generate a rough marker layout.",
    bangla: "একটি প্রাথমিক marker layout তৈরি করুন।",
  },
  {
    english: "Estimate fabric consumption.",
    bangla: "Fabric consumption অনুমান করুন।",
  },
  {
    english: "Review the AI savings recommendation.",
    bangla: "AI savings recommendation পর্যালোচনা করুন।",
  },
  {
    english: "Export the PDF cutting suggestion.",
    bangla: "PDF cutting suggestion export করুন।",
  },
];

export default function OptiFabricCuttingAssistantPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/optifabric"
          className="inline-block text-sm text-cyan-300 transition hover:text-cyan-200"
        >
          <span className="block">← Back to OptiFabric AI</span>
          <span className="mt-1 block text-slate-400">
            ← OptiFabric AI অ্যাপে ফিরে যান
          </span>
        </Link>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-8">
          <p className="mb-2 font-semibold text-cyan-300">
            OptiFabric AI Commercial MVP
          </p>

          <p className="mb-4 font-bold text-cyan-200">
            OptiFabric AI বাণিজ্যিক MVP
          </p>

          <h1 className="mb-3 text-4xl font-bold md:text-5xl">
            AI Digital Cutting Master
          </h1>

          <h2 className="mb-5 text-2xl font-black text-cyan-300 md:text-3xl">
            AI ডিজিটাল কাটিং মাস্টার
          </h2>

          <p className="max-w-3xl text-lg leading-8 text-slate-300">
            Upload a pattern photo or PDF, calibrate it with a 12-inch scale,
            enter the usable fabric width and let OptiFabric AI estimate
            cutting consumption, marker efficiency, waste and saving
            opportunities.
          </p>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
            Pattern-এর ছবি অথবা PDF upload করুন, ১২ ইঞ্চি scale দিয়ে বাস্তব
            মাপ calibrate করুন, ব্যবহারযোগ্য fabric width লিখুন এবং
            OptiFabric AI-কে cutting consumption, marker efficiency, waste ও
            সম্ভাব্য saving হিসাব করতে দিন।
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {inputQuestions.map((item) => (
            <article
              key={item.titleEnglish}
              className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
            >
              <h2 className="text-xl font-bold text-white">
                {item.titleEnglish}
              </h2>

              <h3 className="mt-2 text-lg font-bold text-cyan-300">
                {item.titleBangla}
              </h3>

              <p className="mt-4 text-slate-300">
                {item.questionEnglish}
              </p>

              <p className="mt-2 text-slate-400">
                {item.questionBangla}
              </p>

              <div className="mt-5 rounded-xl border border-cyan-800 bg-cyan-950/40 p-4">
                <p className="text-sm font-semibold text-cyan-300">
                  Why does AI ask this?
                </p>

                <p className="mt-1 text-sm font-bold text-cyan-200">
                  AI কেন এই তথ্য চায়?
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {item.whyEnglish}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.whyBangla}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold">
            MVP Cutting Workflow
          </h2>

          <h3 className="mt-2 text-xl font-black text-cyan-300">
            MVP কাটিং কার্যপ্রবাহ
          </h3>

          <div className="mt-6 space-y-4">
            {workflowSteps.map((step, index) => (
              <div
                key={step.english}
                className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 font-black text-cyan-300">
                  {index + 1}
                </div>

                <div>
                  <p className="font-bold text-slate-200">
                    {step.english}
                  </p>

                  <p className="mt-2 text-slate-400">
                    {step.bangla}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7">
            <Link
              href="/optifabric/cutting-assistant/upload"
              className="inline-block rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-400"
            >
              <span className="block">Start Pattern Upload</span>
              <span className="mt-1 block text-sm">
                Pattern upload শুরু করুন
              </span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}