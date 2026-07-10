"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Language = "en" | "bn";
type RouteStatus = "checking" | "working" | "missing" | "error";

type PilotRoute = {
  id: string;
  number: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  href: string;
};

type AuditResult = {
  status: RouteStatus;
  httpStatus?: number;
  checkedAt?: string;
};

const pilotRoutes: PilotRoute[] = [
  {
    id: "demo",
    number: "00",
    titleEn: "Demo Landing Page",
    titleBn: "ডেমো ল্যান্ডিং পেজ",
    descriptionEn:
      "The commercial pilot starting point and visitor introduction.",
    descriptionBn:
      "বাণিজ্যিক পাইলটের শুরু এবং দর্শনার্থীদের পরিচিতি পৃষ্ঠা।",
    href: "/optifabric/demo",
  },
  {
    id: "upload",
    number: "01",
    titleEn: "Pattern Upload",
    titleBn: "প্যাটার্ন আপলোড",
    descriptionEn:
      "The user uploads a pattern photograph or document.",
    descriptionBn:
      "ব্যবহারকারী প্যাটার্নের ছবি বা ডকুমেন্ট আপলোড করেন।",
    href: "/optifabric/demo/upload",
  },
  {
    id: "photo-quality",
    number: "02",
    titleEn: "Photo Quality Intelligence",
    titleBn: "ছবির মান বুদ্ধিমত্তা",
    descriptionEn:
      "AI evaluates whether the uploaded image is suitable for tracing.",
    descriptionBn:
      "আপলোড করা ছবি ট্রেসিংয়ের জন্য উপযুক্ত কি না এআই পরীক্ষা করে।",
    href: "/optifabric/demo/photo-quality",
  },
  {
    id: "live-tracing",
    number: "03",
    titleEn: "Interactive Boundary Tracing",
    titleBn: "ইন্টার‌্যাকটিভ সীমানা ট্রেসিং",
    descriptionEn:
      "The user identifies the pattern boundary without CAD experience.",
    descriptionBn:
      "CAD অভিজ্ঞতা ছাড়াই ব্যবহারকারী প্যাটার্নের সীমানা চিহ্নিত করেন।",
    href: "/optifabric/demo/boundary-tracing",
  },
  {
    id: "ai-polygon",
    number: "04",
    titleEn: "AI Polygon Construction",
    titleBn: "এআই পলিগন নির্মাণ",
    descriptionEn:
      "Boundary points are converted into a digital engineering shape.",
    descriptionBn:
      "সীমানার পয়েন্টগুলোকে ডিজিটাল ইঞ্জিনিয়ারিং আকারে রূপান্তর করা হয়।",
    href: "/optifabric/demo/polygon",
  },
  {
    id: "ai-nesting",
    number: "05",
    titleEn: "AI Nesting Demonstration",
    titleBn: "এআই নেস্টিং প্রদর্শনী",
    descriptionEn:
      "Pattern pieces are arranged inside the available fabric width.",
    descriptionBn:
      "উপলভ্য কাপড়ের প্রস্থে প্যাটার্ন অংশগুলো সাজানো হয়।",
    href: "/optifabric/demo/ai-nesting",
  },
  {
    id: "marker-efficiency",
    number: "06",
    titleEn: "Marker Efficiency Intelligence",
    titleBn: "মার্কার দক্ষতা বুদ্ধিমত্তা",
    descriptionEn:
      "The system evaluates productive area and estimated fabric waste.",
    descriptionBn:
      "সিস্টেম কার্যকর ক্ষেত্রফল ও আনুমানিক কাপড় অপচয় মূল্যায়ন করে।",
    href: "/optifabric/demo/marker-efficiency",
  },
  {
    id: "fabric-saving",
    number: "07",
    titleEn: "Fabric Saving Intelligence",
    titleBn: "কাপড় সাশ্রয় বুদ্ধিমত্তা",
    descriptionEn:
      "Efficiency improvement is converted into metres and money.",
    descriptionBn:
      "দক্ষতার উন্নতিকে কাপড়ের মিটার ও আর্থিক সাশ্রয়ে রূপান্তর করা হয়।",
    href: "/optifabric/demo/fabric-saving",
  },
  {
    id: "roi",
    number: "08",
    titleEn: "Commercial ROI Intelligence",
    titleBn: "বাণিজ্যিক ROI বুদ্ধিমত্তা",
    descriptionEn:
      "Fabric savings are converted into commercial return and payback.",
    descriptionBn:
      "কাপড় সাশ্রয়কে বাণিজ্যিক রিটার্ন ও বিনিয়োগ ফেরতের সময়ে রূপান্তর করা হয়।",
    href: "/optifabric/demo/roi",
  },
  {
    id: "pilot-result",
    number: "09",
    titleEn: "Complete Pilot Result",
    titleBn: "সম্পূর্ণ পাইলট ফলাফল",
    descriptionEn:
      "The complete commercial and engineering pilot summary.",
    descriptionBn:
      "সম্পূর্ণ বাণিজ্যিক ও ইঞ্জিনিয়ারিং পাইলট সারসংক্ষেপ।",
    href: "/optifabric/demo/pilot-result",
  },
];

const text = {
  en: {
    block: "RC1 Mini Pilot · Block 021",
    title: "End-to-End Route Audit",
    subtitle:
      "Check every OptiFabric pilot page from one dashboard before presenting the commercial demonstration.",
    language: "বাংলা",
    auditAll: "Check All Routes",
    checking: "Checking routes...",
    checked: "Audit completed",
    total: "Total routes",
    working: "Working",
    missing: "Missing",
    errors: "Errors",
    readiness: "Pilot navigation readiness",
    ready: "All pilot routes are working",
    attention: "Some pilot routes need attention",
    open: "Open Page",
    recheck: "Recheck",
    workingLabel: "WORKING",
    missingLabel: "MISSING",
    checkingLabel: "CHECKING",
    errorLabel: "ERROR",
    expectedRoute: "Expected route",
    statusCode: "HTTP status",
    lastChecked: "Last checked",
    notChecked: "Not checked",
    navigationTitle: "Required Pilot Sequence",
    navigationText:
      "Test the pages in this exact order so a visitor can complete the full commercial journey without interruption.",
    correctionTitle: "How to Correct a Missing Route",
    correctionOne:
      "Check the exact folder name inside app/optifabric/demo.",
    correctionTwo:
      "Every route folder must contain a page.tsx file.",
    correctionThree:
      "Update any Link href that points to an old or different route name.",
    correctionFour:
      "Push the correction to GitHub and run this audit again after Vercel deploys.",
    home: "OptiFabric Home",
    result: "Pilot Result",
    restart: "Start Full Demo",
    auditNote:
      "The audit checks whether each page responds successfully on the current deployed website. It does not test every button or calculation inside each page.",
    nextTitle: "Next: Final Commercial Demo Polish",
    nextText:
      "After every route shows Working, Block 022 will add the final presentation controls and BGMEA-ready demonstration finish.",
  },

  bn: {
    block: "RC1 মিনি পাইলট · ব্লক ০২১",
    title: "সম্পূর্ণ রুট অডিট",
    subtitle:
      "বাণিজ্যিক প্রদর্শনীর আগে একটি ড্যাশবোর্ড থেকে OptiFabric পাইলটের প্রতিটি পৃষ্ঠা পরীক্ষা করুন।",
    language: "English",
    auditAll: "সব রুট পরীক্ষা করুন",
    checking: "রুট পরীক্ষা করা হচ্ছে...",
    checked: "অডিট সম্পন্ন হয়েছে",
    total: "মোট রুট",
    working: "কার্যকর",
    missing: "পাওয়া যায়নি",
    errors: "ত্রুটি",
    readiness: "পাইলট নেভিগেশন প্রস্তুতি",
    ready: "সব পাইলট রুট কার্যকর আছে",
    attention: "কিছু পাইলট রুট সংশোধন প্রয়োজন",
    open: "পৃষ্ঠা খুলুন",
    recheck: "আবার পরীক্ষা করুন",
    workingLabel: "কার্যকর",
    missingLabel: "পাওয়া যায়নি",
    checkingLabel: "পরীক্ষা চলছে",
    errorLabel: "ত্রুটি",
    expectedRoute: "প্রত্যাশিত রুট",
    statusCode: "HTTP স্ট্যাটাস",
    lastChecked: "সর্বশেষ পরীক্ষা",
    notChecked: "পরীক্ষা করা হয়নি",
    navigationTitle: "প্রয়োজনীয় পাইলট ক্রম",
    navigationText:
      "দর্শনার্থী যেন বাধা ছাড়াই সম্পূর্ণ বাণিজ্যিক যাত্রা শেষ করতে পারেন, তাই এই সঠিক ক্রমে পৃষ্ঠাগুলো পরীক্ষা করুন।",
    correctionTitle: "রুট পাওয়া না গেলে কীভাবে সংশোধন করবেন",
    correctionOne:
      "app/optifabric/demo-এর ভেতরে সঠিক ফোল্ডারের নাম পরীক্ষা করুন।",
    correctionTwo:
      "প্রতিটি রুট ফোল্ডারের মধ্যে page.tsx ফাইল থাকতে হবে।",
    correctionThree:
      "পুরোনো বা ভিন্ন রুটে নির্দেশ করা Link href সংশোধন করুন।",
    correctionFour:
      "সংশোধন GitHub-এ পুশ করুন এবং Vercel ডিপ্লয়ের পর আবার অডিট চালান।",
    home: "OptiFabric হোম",
    result: "পাইলট ফলাফল",
    restart: "সম্পূর্ণ ডেমো শুরু করুন",
    auditNote:
      "এই অডিট বর্তমান ডিপ্লয় করা ওয়েবসাইটে প্রতিটি পৃষ্ঠা সফলভাবে সাড়া দিচ্ছে কি না পরীক্ষা করে। এটি প্রতিটি পৃষ্ঠার সব বাটন বা হিসাব পরীক্ষা করে না।",
    nextTitle: "পরবর্তী ধাপ: চূড়ান্ত বাণিজ্যিক ডেমো",
    nextText:
      "সব রুট কার্যকর দেখালে ব্লক ০২২-এ চূড়ান্ত উপস্থাপনা নিয়ন্ত্রণ ও BGMEA-উপযোগী ডেমো ফিনিশ যোগ করা হবে।",
  },
};

export default function RouteAuditPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [results, setResults] = useState<Record<string, AuditResult>>(
    () =>
      Object.fromEntries(
        pilotRoutes.map((route) => [
          route.id,
          {
            status: "checking" as RouteStatus,
          },
        ])
      )
  );

  const [isAuditing, setIsAuditing] = useState(false);
  const [hasCompletedAudit, setHasCompletedAudit] = useState(false);

  const t = text[language];

  const checkRoute = useCallback(async (route: PilotRoute) => {
    setResults((current) => ({
      ...current,
      [route.id]: {
        status: "checking",
      },
    }));

    try {
      const response = await fetch(route.href, {
        method: "GET",
        cache: "no-store",
        headers: {
          "x-optifabric-route-audit": "true",
        },
      });

      const status: RouteStatus = response.ok
        ? "working"
        : response.status === 404
          ? "missing"
          : "error";

      setResults((current) => ({
        ...current,
        [route.id]: {
          status,
          httpStatus: response.status,
          checkedAt: new Date().toLocaleTimeString(),
        },
      }));

      return status;
    } catch {
      setResults((current) => ({
        ...current,
        [route.id]: {
          status: "error",
          checkedAt: new Date().toLocaleTimeString(),
        },
      }));

      return "error" as RouteStatus;
    }
  }, []);

  const auditAllRoutes = useCallback(async () => {
    setIsAuditing(true);
    setHasCompletedAudit(false);

    await Promise.all(
      pilotRoutes.map((route) => checkRoute(route))
    );

    setIsAuditing(false);
    setHasCompletedAudit(true);
  }, [checkRoute]);

  useEffect(() => {
    auditAllRoutes();
  }, [auditAllRoutes]);

  const summary = useMemo(() => {
    const values = Object.values(results);

    return {
      total: pilotRoutes.length,
      working: values.filter(
        (result) => result.status === "working"
      ).length,
      missing: values.filter(
        (result) => result.status === "missing"
      ).length,
      errors: values.filter(
        (result) => result.status === "error"
      ).length,
      checking: values.filter(
        (result) => result.status === "checking"
      ).length,
    };
  }, [results]);

  const readiness =
    summary.working === summary.total &&
    summary.missing === 0 &&
    summary.errors === 0;

  const readinessPercentage =
    summary.total > 0
      ? (summary.working / summary.total) * 100
      : 0;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950 via-blue-950 to-slate-900 p-6 shadow-2xl sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
                {t.block}
              </p>

              <h1 className="text-3xl font-black sm:text-5xl">
                {t.title}
              </h1>

              <p className="mt-5 max-w-4xl text-base leading-7 text-slate-300 sm:text-xl">
                {t.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setLanguage((current) =>
                  current === "en" ? "bn" : "en"
                )
              }
              className="w-fit rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-3 font-bold text-cyan-200 transition hover:bg-cyan-400/20"
            >
              {t.language}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={auditAllRoutes}
              disabled={isAuditing}
              className="rounded-2xl bg-cyan-400 px-6 py-4 font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAuditing ? t.checking : t.auditAll}
            </button>

            <Link
              href="/optifabric/demo"
              className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-6 py-4 font-bold text-cyan-200 transition hover:bg-cyan-400/20"
            >
              {t.restart}
            </Link>

            <Link
              href="/optifabric/demo/pilot-result"
              className="rounded-2xl border border-slate-600 bg-slate-900 px-6 py-4 font-bold text-slate-200 transition hover:border-cyan-400"
            >
              {t.result}
            </Link>

            <Link
              href="/optifabric"
              className="rounded-2xl border border-slate-600 bg-slate-900 px-6 py-4 font-bold text-slate-200 transition hover:border-cyan-400"
            >
              {t.home}
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            label={t.total}
            value={summary.total}
            type="neutral"
          />

          <SummaryCard
            label={t.working}
            value={summary.working}
            type="working"
          />

          <SummaryCard
            label={t.missing}
            value={summary.missing}
            type="missing"
          />

          <SummaryCard
            label={t.errors}
            value={summary.errors}
            type="error"
          />

          <SummaryCard
            label={t.readiness}
            value={`${readinessPercentage.toFixed(0)}%`}
            type={readiness ? "working" : "neutral"}
          />
        </section>

        <section
          className={`mt-8 rounded-3xl border p-6 sm:p-8 ${
            readiness
              ? "border-emerald-500/30 bg-emerald-500/10"
              : "border-amber-500/30 bg-amber-500/10"
          }`}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p
                className={`text-sm font-black uppercase tracking-[0.25em] ${
                  readiness
                    ? "text-emerald-300"
                    : "text-amber-300"
                }`}
              >
                {hasCompletedAudit ? t.checked : t.checking}
              </p>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                {readiness ? t.ready : t.attention}
              </h2>
            </div>

            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full border-4 text-xl font-black ${
                readiness
                  ? "border-emerald-400 text-emerald-200"
                  : "border-amber-400 text-amber-200"
              }`}
            >
              {readinessPercentage.toFixed(0)}%
            </div>
          </div>

          <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-950/60">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                readiness ? "bg-emerald-400" : "bg-amber-400"
              }`}
              style={{
                width: `${readinessPercentage}%`,
              }}
            />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-3xl font-black">
            {t.navigationTitle}
          </h2>

          <p className="mt-3 max-w-4xl leading-7 text-slate-400">
            {t.navigationText}
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {pilotRoutes.map((route) => (
              <RouteAuditCard
                key={route.id}
                route={route}
                result={results[route.id]}
                language={language}
                labels={{
                  open: t.open,
                  recheck: t.recheck,
                  working: t.workingLabel,
                  missing: t.missingLabel,
                  checking: t.checkingLabel,
                  error: t.errorLabel,
                  expectedRoute: t.expectedRoute,
                  statusCode: t.statusCode,
                  lastChecked: t.lastChecked,
                  notChecked: t.notChecked,
                }}
                onRecheck={() => checkRoute(route)}
              />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6">
            <h2 className="text-2xl font-black text-amber-200">
              {t.correctionTitle}
            </h2>

            <div className="mt-5 space-y-4">
              <CorrectionItem number="1" text={t.correctionOne} />
              <CorrectionItem number="2" text={t.correctionTwo} />
              <CorrectionItem number="3" text={t.correctionThree} />
              <CorrectionItem number="4" text={t.correctionFour} />
            </div>
          </article>

          <article className="rounded-3xl border border-blue-500/30 bg-blue-500/10 p-6">
            <h2 className="text-2xl font-black text-blue-200">
              Audit Limitation
            </h2>

            <p className="mt-4 leading-7 text-blue-50">
              {t.auditNote}
            </p>

            <div className="mt-6 rounded-2xl border border-blue-400/20 bg-slate-950/30 p-5">
              <p className="text-sm font-black uppercase tracking-widest text-blue-300">
                Required manual test
              </p>

              <p className="mt-3 leading-7 text-blue-50">
                Open every working page and click its main action,
                language switch, back button and next button.
              </p>
            </div>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950 via-blue-950 to-slate-900 p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
            RC1 Finalisation
          </p>

          <h2 className="mt-3 text-3xl font-black">
            {t.nextTitle}
          </h2>

          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
            {t.nextText}
          </p>
        </section>
      </div>
    </main>
  );
}

function RouteAuditCard({
  route,
  result,
  language,
  labels,
  onRecheck,
}: {
  route: PilotRoute;
  result?: AuditResult;
  language: Language;
  labels: {
    open: string;
    recheck: string;
    working: string;
    missing: string;
    checking: string;
    error: string;
    expectedRoute: string;
    statusCode: string;
    lastChecked: string;
    notChecked: string;
  };
  onRecheck: () => void;
}) {
  const status = result?.status ?? "checking";

  const statusText: Record<RouteStatus, string> = {
    working: labels.working,
    missing: labels.missing,
    checking: labels.checking,
    error: labels.error,
  };

  const statusStyle: Record<RouteStatus, string> = {
    working:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    missing:
      "border-rose-500/40 bg-rose-500/10 text-rose-200",
    checking:
      "border-amber-500/40 bg-amber-500/10 text-amber-200",
    error:
      "border-orange-500/40 bg-orange-500/10 text-orange-200",
  };

  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400 text-lg font-black text-slate-950">
          {route.number}
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${statusStyle[status]}`}
        >
          {statusText[status]}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-black">
        {language === "en" ? route.titleEn : route.titleBn}
      </h3>

      <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">
        {language === "en"
          ? route.descriptionEn
          : route.descriptionBn}
      </p>

      <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {labels.expectedRoute}
        </p>

        <p className="mt-2 break-all font-mono text-sm text-cyan-300">
          {route.href}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-slate-500">{labels.statusCode}</p>
            <p className="mt-1 font-bold text-white">
              {result?.httpStatus ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-slate-500">{labels.lastChecked}</p>
            <p className="mt-1 font-bold text-white">
              {result?.checkedAt ?? labels.notChecked}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={route.href}
          className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300"
        >
          {labels.open} →
        </Link>

        <button
          type="button"
          onClick={onRecheck}
          disabled={status === "checking"}
          className="rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {labels.recheck}
        </button>
      </div>
    </article>
  );
}

function SummaryCard({
  label,
  value,
  type,
}: {
  label: string;
  value: number | string;
  type: "neutral" | "working" | "missing" | "error";
}) {
  const styles = {
    neutral: "border-slate-800 bg-slate-900 text-white",
    working:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    missing:
      "border-rose-500/30 bg-rose-500/10 text-rose-200",
    error:
      "border-orange-500/30 bg-orange-500/10 text-orange-200",
  };

  return (
    <article className={`rounded-3xl border p-5 ${styles[type]}`}>
      <p className="text-sm font-semibold text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black">{value}</p>
    </article>
  );
}

function CorrectionItem({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-amber-400/20 bg-slate-950/30 p-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-black text-slate-950">
        {number}
      </div>

      <p className="text-sm leading-6 text-amber-50">{text}</p>
    </div>
  );
}