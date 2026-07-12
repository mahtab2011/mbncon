import Link from "next/link";

import AppReleaseInfo from "@/app/components/optifabric/AppReleaseInfo";
import CommercialFooter from "@/app/components/optifabric/CommercialFooter";
import { optiFabricReleaseConfig } from "@/lib/optifabric/releaseConfig";

export default function OptiFabricAboutPage() {
  const config = optiFabricReleaseConfig;

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 px-3 py-4 text-white sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/optifabric"
            className="text-cyan-300 hover:text-cyan-200"
          >
            ← Back to OptiFabric
          </Link>

          <span className="w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300">
            {config.releaseName}
          </span>
        </div>

        <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950 via-blue-950 to-slate-900 p-6 shadow-2xl sm:p-8 lg:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
            About the Product
          </p>

          <h1 className="mt-4 break-words text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
            {config.productName}
          </h1>

          <p className="mt-4 break-words text-lg font-bold leading-7 text-cyan-200 sm:text-2xl">
            {config.productSubtitle}
          </p>

          <p className="mt-3 break-words text-base leading-7 text-slate-300 sm:text-lg">
            {config.productSubtitleBn}
          </p>

          <p className="mt-6 max-w-5xl break-words text-base leading-7 text-slate-300 sm:text-lg">
            OptiFabric AI is a commercial garment-pattern engineering and
            fabric-optimisation application designed to support factory cutting
            teams without requiring advanced CAD knowledge.
          </p>

          <p className="mt-3 max-w-5xl break-words text-base leading-7 text-slate-400 sm:text-lg">
            OptiFabric AI একটি বাণিজ্যিক গার্মেন্টস প্যাটার্ন ইঞ্জিনিয়ারিং ও
            কাপড় অপ্টিমাইজেশন অ্যাপ্লিকেশন। উন্নত CAD জ্ঞান ছাড়াই কারখানার
            কাটিং টিমকে সহায়তা করার জন্য এটি তৈরি করা হয়েছে।
          </p>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-xl sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
              Product Mission
            </p>

            <h2 className="mt-3 break-words text-2xl font-black sm:text-3xl">
              Make Engineering Intelligence Accessible
            </h2>

            <p className="mt-4 break-words leading-7 text-slate-300">
              OptiFabric AI converts complex pattern-engineering activities into
              a simple guided workflow for Cutting Masters, Cutting Supervisors,
              Production Officers and Factory Managers.
            </p>

            <p className="mt-4 break-words leading-7 text-slate-400">
              OptiFabric AI জটিল প্যাটার্ন ইঞ্জিনিয়ারিং কাজকে কাটিং মাস্টার,
              কাটিং সুপারভাইজার, প্রোডাকশন অফিসার এবং ফ্যাক্টরি ম্যানেজারের
              জন্য সহজ নির্দেশিত কার্যপ্রবাহে রূপান্তর করে।
            </p>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-xl sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-300">
              Commercial Objective
            </p>

            <h2 className="mt-3 break-words text-2xl font-black sm:text-3xl">
              Reduce Fabric Waste and Improve Decisions
            </h2>

            <p className="mt-4 break-words leading-7 text-slate-300">
              The product helps factories understand pattern quality, marker
              efficiency, potential fabric savings and commercial return before
              production decisions are finalised.
            </p>

            <p className="mt-4 break-words leading-7 text-slate-400">
              উৎপাদনের সিদ্ধান্ত চূড়ান্ত করার আগে প্যাটার্নের মান, মার্কার
              দক্ষতা, সম্ভাব্য কাপড় সাশ্রয় এবং বাণিজ্যিক লাভ বুঝতে এই পণ্য
              কারখানাকে সহায়তা করে।
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-xl sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
            Who It Is Designed For
          </p>

          <h2 className="mt-3 break-words text-2xl font-black sm:text-3xl">
            Factory Users
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {config.targetUsers.map((user) => (
              <div
                key={user.id}
                className="min-w-0 rounded-2xl border border-slate-700 bg-slate-950/70 p-5"
              >
                <p className="break-words text-lg font-black text-white">
                  {user.name}
                </p>

                <p className="mt-2 break-words text-sm leading-6 text-slate-400">
                  {user.nameBn}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-xl sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
            Commercial Workflow
          </p>

          <h2 className="mt-3 break-words text-2xl font-black sm:text-3xl">
            Seven Guided Engineering Stages
          </h2>

          <p className="mt-3 break-words leading-7 text-slate-400">
            সাতটি নির্দেশিত ইঞ্জিনিয়ারিং ধাপ
          </p>

          <div className="mt-6 space-y-4">
            {config.commercialWorkflow.map((step, index) => (
              <Link
                key={step.id}
                href={step.route}
                className="flex min-w-0 flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 transition hover:border-cyan-400/50 hover:bg-cyan-950/20 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-black text-slate-950">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <p className="break-words font-black text-white">
                      {step.name}
                    </p>

                    <p className="mt-1 break-words text-sm leading-6 text-slate-400">
                      {step.nameBn}
                    </p>
                  </div>
                </div>

                <span className="w-fit shrink-0 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-300">
                  Open Step →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-blue-500/20 bg-blue-950/20 p-5 shadow-xl sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              Product Principles
            </p>

            <div className="mt-5 space-y-4">
              <Principle text="Simple English and Bangla guidance" />
              <Principle text="No advanced CAD experience required" />
              <Principle text="Every AI request explains why the information is needed" />
              <Principle text="Factory-friendly mobile workflow" />
              <Principle text="Engineering decisions supported by commercial ROI" />
            </div>
          </div>

          <div className="rounded-3xl border border-green-500/20 bg-green-950/20 p-5 shadow-xl sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-300">
              Commercial Use
            </p>

            <div className="mt-5 space-y-4">
              <Principle text="BGMEA and industry presentations" />
              <Principle text="Controlled garment-factory trials" />
              <Principle text="Buyer and investor demonstrations" />
              <Principle text="Cutting-team training and onboarding" />
              <Principle text="Commercial subscription validation" />
            </div>
          </div>
        </section>

        <div className="mt-8">
          <AppReleaseInfo />
        </div>

        <section className="mt-8 rounded-3xl border border-amber-500/20 bg-amber-950/20 p-5 shadow-xl sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300">
            Controlled Pilot Notice
          </p>

          <p className="mt-4 break-words leading-7 text-slate-300">
            {config.controlledPilotNotice}
          </p>

          <p className="mt-3 break-words leading-7 text-slate-400">
            {config.controlledPilotNoticeBn}
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-xl sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
            Developer and Support
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard
              label="Organisation"
              value={config.developer.organisation}
            />

            <InfoCard
              label="Website"
              value={config.developer.website}
            />

            <InfoCard
              label="Support Email"
              value={config.developer.supportEmail}
            />
          </div>
        </section>

        <div className="mt-8">
          <CommercialFooter />
        </div>
      </div>
    </main>
  );
}

function Principle({ text }: { text: string }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
      <span className="shrink-0 font-black text-green-300">✓</span>

      <p className="break-words leading-6 text-slate-300">{text}</p>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
        {label}
      </p>

      <p className="mt-3 break-words text-base font-black text-white">
        {value}
      </p>
    </div>
  );
}