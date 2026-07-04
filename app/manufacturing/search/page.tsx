"use client";

import { useState } from "react";
import Link from "next/link";

type SearchItem = {
  title: string;
  bangla: string;
  app: string;
  category: string;
  route: string;
  keywords: string[];
};

const searchItems: SearchItem[] = [
  {
    title: "GPA Executive Dashboard",
    bangla: "জিপিএ নির্বাহী ড্যাশবোর্ড",
    app: "GPA",
    category: "Dashboard",
    route: "/gpa/dashboard",
    keywords: ["dashboard", "executive", "summary", "gpa"],
  },
  {
    title: "Factory Health",
    bangla: "ফ্যাক্টরি হেলথ",
    app: "GPA",
    category: "Productivity",
    route: "/gpa/dashboard",
    keywords: ["factory", "health", "score", "risk"],
  },
  {
    title: "Bottleneck Centre",
    bangla: "বটলনেক সেন্টার",
    app: "GPA",
    category: "TOC",
    route: "/gpa/bottleneck-centre",
    keywords: ["bottleneck", "toc", "constraint", "line"],
  },
  {
    title: "Line Balancing",
    bangla: "লাইন ব্যালান্সিং",
    app: "GPA",
    category: "IE",
    route: "/gpa/dashboard",
    keywords: ["line", "balancing", "operator", "capacity"],
  },
  {
    title: "SMV Intelligence",
    bangla: "এসএমভি ইন্টেলিজেন্স",
    app: "GPA",
    category: "IE",
    route: "/gpa/dashboard",
    keywords: ["smv", "sam", "standard minute", "operation"],
  },
  {
    title: "Time Study",
    bangla: "টাইম স্টাডি",
    app: "GPA",
    category: "IE",
    route: "/gpa/dashboard",
    keywords: ["time", "study", "cycle", "rating"],
  },
  {
    title: "Method Study",
    bangla: "মেথড স্টাডি",
    app: "GPA",
    category: "IE",
    route: "/gpa/dashboard",
    keywords: ["method", "process", "improvement"],
  },
  {
    title: "Motion Economy",
    bangla: "মোশন ইকোনমি",
    app: "GPA",
    category: "IE",
    route: "/gpa/dashboard",
    keywords: ["motion", "economy", "movement", "waste"],
  },
  {
    title: "Activity Sampling",
    bangla: "অ্যাক্টিভিটি স্যাম্পলিং",
    app: "GPA",
    category: "IE",
    route: "/gpa/dashboard",
    keywords: ["activity", "sampling", "idle", "utilization"],
  },
  {
    title: "OEE",
    bangla: "ওইই",
    app: "GPA",
    category: "Machine",
    route: "/gpa/dashboard",
    keywords: ["oee", "machine", "availability", "performance", "quality"],
  },
  {
    title: "AI Gemba Walk",
    bangla: "এআই গেম্বা ওয়াক",
    app: "GPA",
    category: "AI",
    route: "/gpa/dashboard",
    keywords: ["gemba", "walk", "observation", "ai"],
  },
  {
    title: "Subscription & License",
    bangla: "সাবস্ক্রিপশন ও লাইসেন্স",
    app: "Suite",
    category: "Admin",
    route: "/manufacturing/subscription",
    keywords: ["subscription", "license", "trial", "payment"],
  },
];

export default function ManufacturingSearchPage() {
  const [query, setQuery] = useState("");

  const filteredItems = searchItems.filter((item) => {
    const searchText = [
      item.title,
      item.bangla,
      item.app,
      item.category,
      ...item.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return searchText.includes(query.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="mb-2 text-4xl font-bold text-blue-700">
        Global Manufacturing Search
      </h1>

      <p className="mb-6 text-gray-600">
        Search across GPA and future manufacturing applications.
      </p>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search dashboard, bottleneck, SMV, OEE, Gemba..."
        className="mb-6 w-full rounded-xl border bg-white px-5 py-4 text-lg shadow-sm"
      />

      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <div
            key={`${item.app}-${item.title}`}
            className="rounded-xl bg-white p-5 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-bold text-blue-700">
                {item.title}
              </h2>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                {item.app} / {item.category}
              </span>
            </div>

            <p className="mb-4 text-sm text-gray-500">
              {item.bangla}
            </p>

            <Link
              href={item.route}
              className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Open
            </Link>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="rounded-xl bg-white p-6 text-gray-500 shadow-sm">
            No matching manufacturing module found.
          </div>
        )}
      </div>
    </main>
  );
}