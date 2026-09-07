"use client";

import Link from "next/link";
import {
  ManualRole,
  ManualSection,
  manualRoles,
  pilotChecklist,
} from "../../../lib/optifabric/userManualContent";

export default function OptiFabricUserManualPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-gradient-to-r from-cyan-950 via-slate-950 to-blue-950">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
              RC1 Block 044
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-300">
              Official Factory User Manual
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
            OptiFabric AI User Manual
          </h1>

          <h2 className="mt-3 text-3xl font-black text-cyan-300">
            OptiFabric AI ব্যবহার নির্দেশিকা
          </h2>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Official bilingual operating guidance for Cutting Masters, Cutting
            Supervisors, Production Officers and Factory Managers.
          </p>

          <p className="mt-3 max-w-4xl leading-8 text-slate-400">
            Cutting Master, Cutting Supervisor, Production Officer এবং Factory
            Manager-এর জন্য official bilingual operating guidance।
          </p>

          <p className="mt-4 max-w-4xl text-sm text-slate-400">
            Prefer a single language?{" "}
            <Link href="/optifabric/user-manual/en" className="font-bold text-cyan-300 hover:underline">
              English only
            </Link>{" "}
            ·{" "}
            <Link href="/optifabric/user-manual/bn" className="font-bold text-cyan-300 hover:underline">
              শুধু বাংলা
            </Link>
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {manualRoles.map((role) => (
              <a
                key={role.id}
                href={`#${role.id}`}
                className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 transition hover:border-cyan-400 hover:bg-cyan-950/40"
              >
                <p className="font-black text-white">{role.roleEnglish}</p>
                <p className="mt-2 font-bold text-cyan-300">
                  {role.roleBangla}
                </p>
              </a>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-amber-400/30 bg-amber-950/20 p-7">
          <h2 className="text-2xl font-black text-amber-300">
            Important Engineering Rule
          </h2>

          <h3 className="mt-2 text-xl font-bold text-white">
            গুরুত্বপূর্ণ ইঞ্জিনিয়ারিং নিয়ম
          </h3>

          <p className="mt-5 leading-8 text-slate-300">
            OptiFabric AI provides engineering support and recommendations.
            Physical pattern checking, trial cutting and authorised factory
            approval remain mandatory before bulk production.
          </p>

          <p className="mt-4 leading-8 text-slate-400">
            OptiFabric AI engineering support এবং recommendation প্রদান করে।
            Bulk production-এর আগে physical pattern checking, trial cutting
            এবং authorised factory approval বাধ্যতামূলক।
          </p>
        </div>

        <div className="mt-12 space-y-16">
          {manualRoles.map((role) => (
            <RoleManual key={role.id} role={role} />
          ))}
        </div>

        <section className="mt-16">
          <SectionHeading
            title="Factory Pilot Checklist"
            bangla="ফ্যাক্টরি পাইলট চেকলিস্ট"
            description="Complete every item before approving the pilot result."
            descriptionBangla="Pilot result approve করার আগে প্রতিটি item সম্পন্ন করুন।"
          />

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {pilotChecklist.map((item, index) => (
              <div
                key={item.english}
                className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 font-black text-cyan-300">
                  {index + 1}
                </div>

                <div>
                  <p className="font-bold text-white">{item.english}</p>
                  <p className="mt-2 text-slate-400">{item.bangla}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-green-400/30 bg-green-950/20 p-7">
          <h2 className="text-2xl font-black text-green-300">
            Expected Factory Outcome
          </h2>

          <h3 className="mt-2 text-xl font-bold text-white">
            প্রত্যাশিত ফ্যাক্টরি ফলাফল
          </h3>

          <p className="mt-5 leading-8 text-slate-300">
            The factory should complete the OptiFabric pilot with verified
            pattern information, a reviewed marker proposal, a controlled trial
            cut, measured consumption and a documented management decision.
          </p>

          <p className="mt-4 leading-8 text-slate-400">
            Factory-কে verified pattern information, reviewed marker proposal,
            controlled trial cut, measured consumption এবং documented
            management decision-সহ OptiFabric pilot সম্পন্ন করতে হবে।
          </p>
        </section>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Link
            href="/optifabric"
            className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-black text-slate-950 transition hover:bg-cyan-300"
          >
            Return to OptiFabric
          </Link>

          <Link
            href="/optifabric/play-store-assets"
            className="rounded-2xl border border-slate-700 bg-slate-900 px-6 py-4 text-center font-bold transition hover:border-cyan-400 hover:text-cyan-300"
          >
            Play Store Assets
          </Link>

          <Link
            href="/optifabric/privacy-policy"
            className="rounded-2xl border border-slate-700 bg-slate-900 px-6 py-4 text-center font-bold transition hover:border-cyan-400 hover:text-cyan-300"
          >
            Privacy Policy
          </Link>

          <Link
            href="/optifabric/terms-and-conditions"
            className="rounded-2xl border border-slate-700 bg-slate-900 px-6 py-4 text-center font-bold transition hover:border-cyan-400 hover:text-cyan-300"
          >
            Terms &amp; Conditions
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-bold text-white">OptiFabric AI</p>
            <p>AI Digital Cutting Master &amp; Engineering Assistant</p>
          </div>

          <p>Official RC1 Factory User Manual</p>

          <p>© 2026 OptiFabric AI</p>
        </div>
      </footer>
    </main>
  );
}

function RoleManual({ role }: { role: ManualRole }) {
  return (
    <section id={role.id} className="scroll-mt-6">
      <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-r from-cyan-950/70 to-slate-900 p-7">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400">
          Factory Role
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          {role.roleEnglish}
        </h2>

        <h3 className="mt-2 text-2xl font-black text-cyan-300">
          {role.roleBangla}
        </h3>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <LanguagePanel
            label="Primary Responsibility"
            text={role.responsibilityEnglish}
          />

          <LanguagePanel
            label="প্রধান দায়িত্ব"
            text={role.responsibilityBangla}
          />
        </div>
      </div>

      <div className="mt-7 space-y-7">
        {role.sections.map((section) => (
          <ManualSectionCard
            key={`${role.id}-${section.screenNumber}`}
            section={section}
          />
        ))}
      </div>
    </section>
  );
}

function ManualSectionCard({ section }: { section: ManualSection }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80">
      <div className="border-b border-slate-800 bg-slate-900 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-lg font-black text-cyan-300">
            {section.screenNumber}
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-black text-white">
              {section.screenTitle}
            </h3>

            <h4 className="mt-2 text-xl font-bold text-cyan-300">
              {section.screenTitleBangla}
            </h4>

            <p className="mt-4 inline-block rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 font-mono text-sm text-slate-300">
              {section.route}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6 sm:p-8">
        <ManualTopic
          title="Purpose"
          titleBangla="উদ্দেশ্য"
          english={section.purpose}
          bangla={section.purposeBangla}
        />

        <ManualTopic
          title="Why Does AI Ask for This?"
          titleBangla="AI কেন এই তথ্য চায়?"
          english={section.whyAiAsks}
          bangla={section.whyAiAsksBangla}
          highlighted
        />

        <BilingualList
          title="Step-by-Step Operation"
          titleBangla="ধাপে ধাপে পরিচালনা"
          englishItems={section.steps}
          banglaItems={section.stepsBangla}
          numbered
        />

        <ManualTopic
          title="Expected Result"
          titleBangla="প্রত্যাশিত ফলাফল"
          english={section.expectedResult}
          bangla={section.expectedResultBangla}
        />

        <BilingualList
          title="Common Mistakes"
          titleBangla="সাধারণ ভুল"
          englishItems={section.commonMistakes}
          banglaItems={section.commonMistakesBangla}
          warning
        />

        <BilingualList
          title="Best Practices"
          titleBangla="সর্বোত্তম পদ্ধতি"
          englishItems={section.bestPractices}
          banglaItems={section.bestPracticesBangla}
          positive
        />
      </div>
    </article>
  );
}

function ManualTopic({
  title,
  titleBangla,
  english,
  bangla,
  highlighted = false,
}: {
  title: string;
  titleBangla: string;
  english: string;
  bangla: string;
  highlighted?: boolean;
}) {
  return (
    <section
      className={
        highlighted
          ? "rounded-2xl border border-cyan-400/30 bg-cyan-950/30 p-6"
          : ""
      }
    >
      <h5 className="text-xl font-black text-white">{title}</h5>
      <p className="mt-1 text-lg font-bold text-cyan-300">{titleBangla}</p>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <LanguagePanel label="English" text={english} />
        <LanguagePanel label="বাংলা" text={bangla} />
      </div>
    </section>
  );
}

function BilingualList({
  title,
  titleBangla,
  englishItems,
  banglaItems,
  numbered = false,
  warning = false,
  positive = false,
}: {
  title: string;
  titleBangla: string;
  englishItems: string[];
  banglaItems: string[];
  numbered?: boolean;
  warning?: boolean;
  positive?: boolean;
}) {
  const borderClass = warning
    ? "border-red-400/20"
    : positive
      ? "border-green-400/20"
      : "border-slate-800";

  const badgeClass = warning
    ? "border-red-400/30 bg-red-400/10 text-red-300"
    : positive
      ? "border-green-400/30 bg-green-400/10 text-green-300"
      : "border-cyan-400/30 bg-cyan-400/10 text-cyan-300";

  return (
    <section>
      <h5 className="text-xl font-black text-white">{title}</h5>
      <p className="mt-1 text-lg font-bold text-cyan-300">{titleBangla}</p>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <ListPanel
          label="English"
          items={englishItems}
          numbered={numbered}
          borderClass={borderClass}
          badgeClass={badgeClass}
        />

        <ListPanel
          label="বাংলা"
          items={banglaItems}
          numbered={numbered}
          borderClass={borderClass}
          badgeClass={badgeClass}
        />
      </div>
    </section>
  );
}

function ListPanel({
  label,
  items,
  numbered,
  borderClass,
  badgeClass,
}: {
  label: string;
  items: string[];
  numbered: boolean;
  borderClass: string;
  badgeClass: string;
}) {
  return (
    <div
      className={`rounded-2xl border bg-slate-950/70 p-5 ${borderClass}`}
    >
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-400">
        {label}
      </p>

      <div className="mt-4 space-y-4">
        {items.map((item, index) => (
          <div key={`${label}-${item}`} className="flex gap-3">
            <span
              className={`flex h-7 min-w-7 items-center justify-center rounded-lg border px-2 text-xs font-black ${badgeClass}`}
            >
              {numbered ? index + 1 : "•"}
            </span>

            <p className="leading-7 text-slate-300">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LanguagePanel({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-400">
        {label}
      </p>

      <p className="mt-3 leading-8 text-slate-300">{text}</p>
    </div>
  );
}

function SectionHeading({
  title,
  bangla,
  description,
  descriptionBangla,
}: {
  title: string;
  bangla: string;
  description: string;
  descriptionBangla: string;
}) {
  return (
    <div>
      <h2 className="text-3xl font-black text-white">{title}</h2>
      <p className="mt-2 text-2xl font-black text-cyan-300">{bangla}</p>
      <p className="mt-4 text-slate-300">{description}</p>
      <p className="mt-2 text-slate-400">{descriptionBangla}</p>
    </div>
  );
}
