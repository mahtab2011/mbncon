"use client";

import { useState } from "react";

type Lang = "en" | "bn";

type LearningTopic = {
  category: string;

  english: string;

  bangla: string;

  fullMeaning: string;

  explanationEn: string;

  explanationBn: string;

  importanceEn: string;

  importanceBn: string;

    whereUsed?: string[];

  benefits?: string[];

  commonMistakes?: string[];

  relatedTopics?: string[];

  aiAdvice?: string;

  difficulty?:
    | "Beginner"
    | "Intermediate"
    | "Advanced";

  estimatedLearningTime?: string;

  factoryExampleEn?: string;

  factoryExampleBn?: string;

  implementationStepsEn?: string[];

  implementationStepsBn?: string[];

  expectedImprovement?: string;

  industries?: string[];
};
const topics: LearningTopic[] = [
  {
    category: "Industrial Engineering",
    english: "SMED",
    bangla: "এসএমইডি",
    fullMeaning: "Single Minute Exchange of Dies",

    explanationEn:
      "Machine setup changeover time reduction method.",

    explanationBn:
      "মেশিন সেটআপ পরিবর্তনের সময় কমানোর পদ্ধতি।",

    importanceEn:
      "Reduces setup time, increases production capacity and improves delivery performance.",

    importanceBn:
      "সেটআপ সময় কমায়, উৎপাদন ক্ষমতা বৃদ্ধি করে এবং সময়মতো ডেলিভারি নিশ্চিত করতে সাহায্য করে।",

    whereUsed: [
      "Cutting",
      "Printing",
      "Embroidery",
      "Sewing",
      "Finishing",
    ],

    benefits: [
      "Less machine downtime",
      "Higher productivity",
      "Lower manufacturing cost",
      "Improved delivery performance",
    ],

    commonMistakes: [
      "Tools not prepared",
      "Poor planning",
      "Operator waiting",
    ],

    relatedTopics: [
      "Lean Manufacturing",
      "Kaizen",
      "OEE",
    ],

    aiAdvice:
      "Separate internal setup activities from external setup activities before stopping the machine.",

    difficulty: "Intermediate",

    estimatedLearningTime: "20 Minutes",
  },

  {
    category: "Industrial Engineering",

    english: "Activity Sampling",

    bangla: "অ্যাক্টিভিটি স্যাম্পলিং",

    fullMeaning: "Activity Sampling",

    explanationEn:
      "A statistical observation method used to determine how workers and machines spend their time.",

    explanationBn:
      "কর্মী ও মেশিন কীভাবে সময় ব্যয় করছে তা পরিসংখ্যানভিত্তিক নমুনা পর্যবেক্ষণের মাধ্যমে নির্ধারণ করার পদ্ধতি।",

    importanceEn:
      "Helps identify waiting time, idle time and productivity loss.",

    importanceBn:
      "অপেক্ষার সময়, অলস সময় এবং উৎপাদনশীলতার ক্ষতি শনাক্ত করতে সাহায্য করে।",

    whereUsed: [
      "Production",
      "Cutting",
      "Sewing",
      "Finishing",
    ],

    benefits: [
      "Identifies idle time",
      "Improves utilization",
      "Supports manpower planning",
    ],

    commonMistakes: [
      "Too few observations",
      "Random timing not followed",
    ],

    relatedTopics: [
      "Time Study",
      "Method Study",
      "Productivity",
    ],

    aiAdvice:
      "Collect enough observations to achieve statistical confidence.",

    difficulty: "Intermediate",

    estimatedLearningTime: "25 Minutes",
  },

  {
    category: "Industrial Engineering",

    english: "Gemba Walk",

    bangla: "গেম্বা ওয়াক",

    fullMeaning: "Gemba Walk",

    explanationEn:
      "Going to the actual workplace to observe work directly.",

    explanationBn:
      "যেখানে কাজ হচ্ছে সেখানে গিয়ে সরাসরি পর্যবেক্ষণ করার পদ্ধতি।",

    importanceEn:
      "Helps identify bottlenecks, waste and improvement opportunities.",

    importanceBn:
      "বটলনেক, অপচয় এবং উন্নয়নের সুযোগ শনাক্ত করতে সাহায্য করে।",

    whereUsed: [
      "All Departments",
    ],

    benefits: [
      "Better observation",
      "Faster problem solving",
      "Improved communication",
    ],

    commonMistakes: [
      "Observing from office",
      "Ignoring operators",
    ],

    relatedTopics: [
      "Kaizen",
      "Lean Manufacturing",
      "Root Cause Analysis",
    ],

    aiAdvice:
      "Observe the process before making conclusions.",

    difficulty: "Beginner",

    estimatedLearningTime: "15 Minutes",
  },

  {
    category: "Industrial Engineering",

    english: "Pareto Analysis",

    bangla: "প্যারেটো অ্যানালাইসিস",

    fullMeaning: "Pareto Analysis",

    explanationEn:
      "Identifies the few causes responsible for most problems.",

    explanationBn:
      "যে অল্প কয়েকটি কারণ অধিকাংশ সমস্যার জন্য দায়ী, সেগুলো শনাক্ত করার পদ্ধতি।",

    importanceEn:
      "Helps prioritize improvement efforts.",

    importanceBn:
      "উন্নয়নের কাজকে অগ্রাধিকার দিতে সাহায্য করে।",

    whereUsed: [
      "Quality",
      "Production",
      "Maintenance",
      "Industrial Engineering",
    ],

    benefits: [
      "Focuses on major problems",
      "Supports decision making",
      "Improves productivity",
    ],

    commonMistakes: [
      "Using poor data",
      "Ignoring root causes",
    ],

    relatedTopics: [
      "Fishbone Diagram",
      "Root Cause Analysis",
      "Kaizen",
    ],

    aiAdvice:
      "Always analyse verified data before preparing a Pareto chart.",

    difficulty: "Beginner",

    estimatedLearningTime: "20 Minutes",
  },
];

export default function ManufacturingLearningCentrePage() {
  const [lang, setLang] = useState<Lang>("en");
  const [search, setSearch] = useState("");

  const filtered = topics.filter((topic) =>
    (
      topic.english +
      topic.bangla +
      topic.category +
      topic.fullMeaning
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-7xl">

        <section className="flex items-start justify-between">

          <div>

            <p className="text-cyan-300 uppercase tracking-[0.25em] text-sm font-bold">
              MBNCON Knowledge System
            </p>

            <h1 className="mt-3 text-5xl font-black">
              {lang === "en"
                ? "Manufacturing Learning Centre"
                : "ম্যানুফ্যাকচারিং লার্নিং সেন্টার"}
            </h1>

            <p className="mt-5 max-w-4xl text-slate-300 leading-8">
              {lang === "en"
                ? "Learn manufacturing concepts, industrial engineering tools and management practices."
                : "ম্যানুফ্যাকচারিং ধারণা, ইন্ডাস্ট্রিয়াল ইঞ্জিনিয়ারিং টুল এবং ব্যবস্থাপনা পদ্ধতি শিখুন।"}
            </p>

          </div>

          <div className="flex gap-2">

            <button
              onClick={() => setLang("en")}
              className={`rounded-xl px-4 py-2 font-bold ${
                lang === "en"
                  ? "bg-cyan-400 text-slate-950"
                  : "bg-slate-800"
              }`}
            >
              EN
            </button>

            <button
              onClick={() => setLang("bn")}
              className={`rounded-xl px-4 py-2 font-bold ${
                lang === "bn"
                  ? "bg-cyan-400 text-slate-950"
                  : "bg-slate-800"
              }`}
            >
              বাংলা
            </button>

          </div>

        </section>

        <section className="mt-8">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              lang === "en"
                ? "Search manufacturing knowledge..."
                : "ম্যানুফ্যাকচারিং বিষয় খুঁজুন..."
            }
            className="w-full rounded-2xl bg-slate-900 border border-white/10 p-4"
          />

        </section>

        <section className="mt-10 grid gap-6">

          {filtered.map((topic) => (

            <div
              key={topic.english}
              className="rounded-3xl border border-cyan-400/20 bg-slate-900 p-8 shadow-lg"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-cyan-300">
                    {topic.category}
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    {lang === "en"
                      ? topic.english
                      : topic.bangla}
                  </h2>

                  <p className="mt-2 text-slate-400">
                    {topic.fullMeaning}
                  </p>

                </div>

              </div>
<div className="mt-6 flex flex-wrap gap-3">

  <span className="rounded-full bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-300">
    Difficulty: {topic.difficulty}
  </span>

  <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-300">
    Learning Time: {topic.estimatedLearningTime}
  </span>

</div>
              <div className="mt-8">

                <h3 className="font-bold text-cyan-300">
                  {lang === "en"
                    ? "What is it?"
                    : "এটি কী?"}
                </h3>

                <p className="mt-3 leading-8 text-slate-200">
                  {lang === "en"
                    ? topic.explanationEn
                    : topic.explanationBn}
                </p>

              </div>

              <div className="mt-8">

                <h3 className="font-bold text-cyan-300">
                  {lang === "en"
                    ? "Why is it important?"
                    : "কেন এটি গুরুত্বপূর্ণ?"}
                </h3>
<div className="mt-8">

  <h3 className="font-bold text-cyan-300">
    {lang === "en"
      ? "Where is it used?"
      : "কোথায় ব্যবহার করা হয়?"}
  </h3>

  <div className="mt-4 flex flex-wrap gap-3">

    {(topic.whereUsed ?? []).map((item) => (
  <span
    key={item}
    className="rounded-full bg-slate-800 px-4 py-2 text-sm"
  >
    {item}
  </span>
))}

  </div>
<div className="mt-8">

  <h3 className="font-bold text-emerald-300">
    {lang === "en"
      ? "Benefits"
      : "সুবিধাসমূহ"}
  </h3>

  <div className="mt-4 grid gap-3 md:grid-cols-2">

    {(topic.benefits ?? []).map((item) => (

      <div
        key={item}
        className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4"
      >
        ✓ {item}
      </div>

    ))}

  </div>
<div className="mt-8">

  <h3 className="font-bold text-red-300">
    {lang === "en"
      ? "Common Mistakes"
      : "সাধারণ ভুল"}
  </h3>

  <div className="mt-4 grid gap-3">

    {(topic.commonMistakes ?? []).map((item) => (

      <div
        key={item}
        className="rounded-xl border border-red-500/20 bg-red-500/10 p-4"
      >
        ⚠ {item}
      </div>

    ))}

  </div>
<div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-6">

  <h3 className="font-bold text-cyan-300">
    AI Advice
  </h3>

  <p className="mt-4 leading-8">
    {topic.aiAdvice}
  </p>

</div>
<div className="mt-8">

  <h3 className="font-bold text-yellow-300">
    {lang === "en"
      ? "Related Topics"
      : "সম্পর্কিত বিষয়"}
  </h3>

  <div className="mt-4 flex flex-wrap gap-3">

    {(topic.relatedTopics ?? []).map((item) => (

      <span
        key={item}
        className="rounded-full bg-yellow-500/20 px-4 py-2 text-sm"
      >
        {item}
      </span>

    ))}

  </div>

</div>
</div>
</div>
</div>
                <p className="mt-3 leading-8 text-slate-200">
                  {lang === "en"
                    ? topic.importanceEn
                    : topic.importanceBn}
                </p>

              </div>

            </div>

          ))}

        </section>

      </div>
    </main>
  );
}