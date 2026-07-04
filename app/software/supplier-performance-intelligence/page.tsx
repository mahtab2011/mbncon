"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/software/DashboardShell";

type Lang = "en" | "bn";

type SupplierRow = {
  name: string;
  category: string;
  qualityScore: number;
  deliveryScore: number;
  priceScore: number;
  leadTimeScore: number;
  dependencyRisk: number;
  lateDeliveryCost: number;
  rejectionCost: number;
  shortageCost: number;
};

const initialSuppliers: SupplierRow[] = [
  {
    name: "ABC Fabric Mills",
    category: "Fabric",
    qualityScore: 86,
    deliveryScore: 78,
    priceScore: 74,
    leadTimeScore: 80,
    dependencyRisk: 35,
    lateDeliveryCost: 12000,
    rejectionCost: 4500,
    shortageCost: 3000,
  },
  {
    name: "Prime Accessories Ltd",
    category: "Accessories",
    qualityScore: 72,
    deliveryScore: 64,
    priceScore: 68,
    leadTimeScore: 61,
    dependencyRisk: 55,
    lateDeliveryCost: 18500,
    rejectionCost: 7200,
    shortageCost: 6400,
  },
  {
    name: "Global Label House",
    category: "Label & Packaging",
    qualityScore: 91,
    deliveryScore: 88,
    priceScore: 82,
    leadTimeScore: 86,
    dependencyRisk: 22,
    lateDeliveryCost: 2500,
    rejectionCost: 900,
    shortageCost: 700,
  },
];

export default function SupplierPerformanceIntelligencePage() {
  const [lang, setLang] = useState<Lang>("en");
  const [suppliers, setSuppliers] = useState(initialSuppliers);

  const t = {
    en: {
      title: "Supplier Performance Intelligence",
      subtitle:
        "Supplier scorecard, hidden cost, sourcing risk and corrective action intelligence",
      supplier: "Supplier",
      category: "Category",
      quality: "Quality",
      delivery: "Delivery",
      price: "Price",
      leadTime: "Lead Time",
      dependency: "Dependency Risk",
      score: "Final Score",
      rating: "Rating",
      hiddenCost: "Hidden Cost",
      totalHiddenCost: "Total Supplier Hidden Cost",
      highestRisk: "Highest Risk Supplier",
      preferred: "Preferred Supplier",
      approved: "Approved Supplier",
      watchlist: "Watchlist",
      highRisk: "High Risk",
      ai: "AI Supplier Recommendation",
    },
    bn: {
      title: "সরবরাহকারী পারফরম্যান্স ইন্টেলিজেন্স",
      subtitle:
        "সরবরাহকারী স্কোরকার্ড, লুকানো খরচ, সোর্সিং ঝুঁকি ও সংশোধনমূলক ব্যবস্থা বিশ্লেষণ",
      supplier: "সরবরাহকারী",
      category: "ক্যাটাগরি",
      quality: "মান",
      delivery: "ডেলিভারি",
      price: "দাম",
      leadTime: "লিড টাইম",
      dependency: "নির্ভরতা ঝুঁকি",
      score: "চূড়ান্ত স্কোর",
      rating: "রেটিং",
      hiddenCost: "লুকানো খরচ",
      totalHiddenCost: "মোট সরবরাহকারী লুকানো খরচ",
      highestRisk: "সর্বোচ্চ ঝুঁকিপূর্ণ সরবরাহকারী",
      preferred: "পছন্দনীয় সরবরাহকারী",
      approved: "অনুমোদিত সরবরাহকারী",
      watchlist: "ওয়াচলিস্ট",
      highRisk: "উচ্চ ঝুঁকি",
      ai: "AI সরবরাহকারী সুপারিশ",
    },
  }[lang];

  function finalScore(row: SupplierRow) {
    const positive =
      row.qualityScore * 0.3 +
      row.deliveryScore * 0.3 +
      row.priceScore * 0.2 +
      row.leadTimeScore * 0.2;

    const penalty = row.dependencyRisk * 0.25;

    return Math.max(0, Math.min(100, positive - penalty));
  }

  function hiddenCost(row: SupplierRow) {
    return row.lateDeliveryCost + row.rejectionCost + row.shortageCost;
  }

  function rating(score: number) {
    if (score >= 85) return t.preferred;
    if (score >= 70) return t.approved;
    if (score >= 50) return t.watchlist;
    return t.highRisk;
  }

  function updateSupplier(
    index: number,
    field: keyof SupplierRow,
    value: string | number
  ) {
    setSuppliers((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  }

  const totalHiddenCost = useMemo(
    () => suppliers.reduce((sum, row) => sum + hiddenCost(row), 0),
    [suppliers]
  );

  const highestRiskSupplier = useMemo(() => {
    return [...suppliers].sort((a, b) => finalScore(a) - finalScore(b))[0];
  }, [suppliers]);

  return (
    <DashboardShell title="Supplier Performance Intelligence">
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link
                href="/software"
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition duration-300 hover:bg-white/10"
              >
                ← Back to Dashboard
              </Link>

              <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-fuchsia-300">
                MBNCON Supplier Intelligence
              </p>

              <h1 className="mt-3 text-4xl font-bold md:text-5xl">
                {t.title}
              </h1>

              <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
                {t.subtitle}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setLang("en")}
                className={`rounded-xl px-4 py-2 font-bold ${
                  lang === "en"
                    ? "bg-fuchsia-400 text-slate-950"
                    : "bg-slate-800"
                }`}
              >
                EN
              </button>

              <button
                onClick={() => setLang("bn")}
                className={`rounded-xl px-4 py-2 font-bold ${
                  lang === "bn"
                    ? "bg-fuchsia-400 text-slate-950"
                    : "bg-slate-800"
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>

          <section className="mt-10 grid gap-4 md:grid-cols-3">
            <KPI
              title={t.totalHiddenCost}
              value={`$${totalHiddenCost.toFixed(0)}`}
            />
            <KPI title={t.highestRisk} value={highestRiskSupplier.name} />
            <KPI
              title={t.rating}
              value={rating(finalScore(highestRiskSupplier))}
            />
          </section>

          <section className="mt-10 overflow-x-auto rounded-3xl border border-white/10 bg-slate-900 p-6">
            <table className="min-w-[1200px] w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-sm text-slate-300">
                  <th className="p-3">{t.supplier}</th>
                  <th className="p-3">{t.category}</th>
                  <th className="p-3">{t.quality}</th>
                  <th className="p-3">{t.delivery}</th>
                  <th className="p-3">{t.price}</th>
                  <th className="p-3">{t.leadTime}</th>
                  <th className="p-3">{t.dependency}</th>
                  <th className="p-3">{t.hiddenCost}</th>
                  <th className="p-3">{t.score}</th>
                  <th className="p-3">{t.rating}</th>
                </tr>
              </thead>

              <tbody>
                {suppliers.map((row, index) => {
                  const score = finalScore(row);

                  return (
                    <tr key={index} className="border-b border-white/5">
                      <td className="p-3">
                        <input
                          value={row.name}
                          onChange={(event) =>
                            updateSupplier(index, "name", event.target.value)
                          }
                          className="w-44 rounded-lg bg-slate-950 p-2"
                        />
                      </td>

                      <td className="p-3">
                        <input
                          value={row.category}
                          onChange={(event) =>
                            updateSupplier(
                              index,
                              "category",
                              event.target.value
                            )
                          }
                          className="w-36 rounded-lg bg-slate-950 p-2"
                        />
                      </td>

                      {(
                        [
                          "qualityScore",
                          "deliveryScore",
                          "priceScore",
                          "leadTimeScore",
                          "dependencyRisk",
                        ] as (keyof SupplierRow)[]
                      ).map((field) => (
                        <td key={field} className="p-3">
                          <input
                            type="number"
                            value={row[field]}
                            onChange={(event) =>
                              updateSupplier(
                                index,
                                field,
                                Number(event.target.value)
                              )
                            }
                            className="w-24 rounded-lg bg-slate-950 p-2"
                          />
                        </td>
                      ))}

                      <td className="p-3 font-bold text-yellow-300">
                        ${hiddenCost(row).toFixed(0)}
                      </td>

                      <td className="p-3 font-bold text-fuchsia-300">
                        {score.toFixed(1)}
                      </td>

                      <td className="p-3 font-bold">{rating(score)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section className="mt-10 rounded-3xl border border-fuchsia-400/30 bg-fuchsia-400/10 p-8">
            <h2 className="text-2xl font-bold text-fuchsia-200">{t.ai}</h2>

            <p className="mt-4 max-w-5xl leading-8 text-slate-200">
              {lang === "en"
                ? `${highestRiskSupplier.name} currently has the weakest supplier score. Management should review delivery reliability, dependency exposure, rejection cost and shortage cost before placing further critical orders.`
                : `${highestRiskSupplier.name} বর্তমানে সবচেয়ে দুর্বল সরবরাহকারী স্কোর দেখাচ্ছে। গুরুত্বপূর্ণ অর্ডার দেওয়ার আগে ডেলিভারি নির্ভরযোগ্যতা, নির্ভরতা ঝুঁকি, রিজেকশন খরচ এবং শর্টেজ খরচ পর্যালোচনা করা উচিত।`}
            </p>
          </section>
        </section>
      </main>
    </DashboardShell>
  );
}

function KPI({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-3 text-3xl font-black">{value}</p>
    </div>
  );
}