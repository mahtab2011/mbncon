"use client";

// Shared renderer for the English-only and Bangla-only user manual pages.
// Both read from the same lib/optifabric/userManualContent.ts source the
// combined bilingual page uses, so all three views can never drift apart.
import Link from "next/link";
import { ManualRole, ManualSection, manualRoles, pilotChecklist } from "../../../lib/optifabric/userManualContent";

interface Props {
  lang: "en" | "bn";
}

const TEXT = {
  en: {
    badge: "Official Factory User Manual",
    title: "OptiFabric AI User Manual",
    subtitle: "English",
    intro:
      "Official operating guidance for Cutting Masters, Cutting Supervisors, Production Officers and Factory Managers.",
    otherLanguageNote: "Read this manual in Bangla",
    otherLanguageHref: "/optifabric/user-manual/bn",
    combinedNote: "Prefer both languages together?",
    combinedHref: "/optifabric/user-manual",
    combinedLinkText: "Open the bilingual manual",
    ruleTitle: "Important Engineering Rule",
    ruleBody:
      "OptiFabric AI provides engineering support and recommendations. Physical pattern checking, trial cutting and authorised factory approval remain mandatory before bulk production.",
    responsibility: "Primary Responsibility",
    purpose: "Purpose",
    whyAiAsks: "Why Does AI Ask for This?",
    steps: "Step-by-Step Operation",
    expectedResult: "Expected Result",
    commonMistakes: "Common Mistakes",
    bestPractices: "Best Practices",
    checklistTitle: "Factory Pilot Checklist",
    checklistDescription: "Complete every item before approving the pilot result.",
    outcomeTitle: "Expected Factory Outcome",
    outcomeBody:
      "The factory should complete the OptiFabric pilot with verified pattern information, a reviewed marker proposal, a controlled trial cut, measured consumption and a documented management decision.",
    returnHome: "Return to OptiFabric",
  },
  bn: {
    badge: "অফিসিয়াল কারখানা ব্যবহার নির্দেশিকা",
    title: "OptiFabric AI ব্যবহার নির্দেশিকা",
    subtitle: "বাংলা",
    intro:
      "কাটিং মাস্টার, কাটিং সুপারভাইজার, প্রোডাকশন অফিসার এবং ফ্যাক্টরি ম্যানেজারদের জন্য অফিসিয়াল অপারেটিং নির্দেশিকা।",
    otherLanguageNote: "Read this manual in English",
    otherLanguageHref: "/optifabric/user-manual/en",
    combinedNote: "দুই ভাষা একসঙ্গে চান?",
    combinedHref: "/optifabric/user-manual",
    combinedLinkText: "Bilingual manual খুলুন",
    ruleTitle: "গুরুত্বপূর্ণ ইঞ্জিনিয়ারিং নিয়ম",
    ruleBody:
      "OptiFabric AI engineering support এবং recommendation প্রদান করে। Bulk production-এর আগে physical pattern checking, trial cutting এবং authorised factory approval বাধ্যতামূলক।",
    responsibility: "প্রধান দায়িত্ব",
    purpose: "উদ্দেশ্য",
    whyAiAsks: "AI কেন এই তথ্য চায়?",
    steps: "ধাপে ধাপে পরিচালনা",
    expectedResult: "প্রত্যাশিত ফলাফল",
    commonMistakes: "সাধারণ ভুল",
    bestPractices: "সর্বোত্তম পদ্ধতি",
    checklistTitle: "ফ্যাক্টরি পাইলট চেকলিস্ট",
    checklistDescription: "Pilot result approve করার আগে প্রতিটি item সম্পন্ন করুন।",
    outcomeTitle: "প্রত্যাশিত ফ্যাক্টরি ফলাফল",
    outcomeBody:
      "Factory-কে verified pattern information, reviewed marker proposal, controlled trial cut, measured consumption এবং documented management decision-সহ OptiFabric pilot সম্পন্ন করতে হবে।",
    returnHome: "OptiFabric-এ ফিরে যান",
  },
} as const;

function roleName(role: ManualRole, lang: "en" | "bn"): string {
  return lang === "en" ? role.roleEnglish : role.roleBangla;
}
function roleResponsibility(role: ManualRole, lang: "en" | "bn"): string {
  return lang === "en" ? role.responsibilityEnglish : role.responsibilityBangla;
}
function sectionTitle(s: ManualSection, lang: "en" | "bn"): string {
  return lang === "en" ? s.screenTitle : s.screenTitleBangla;
}
function sectionField(s: ManualSection, key: "purpose" | "whyAiAsks" | "expectedResult", lang: "en" | "bn"): string {
  if (lang === "en") return s[key];
  return s[`${key}Bangla` as const] as string;
}
function sectionList(s: ManualSection, key: "steps" | "commonMistakes" | "bestPractices", lang: "en" | "bn"): string[] {
  if (lang === "en") return s[key];
  return s[`${key}Bangla` as const] as string[];
}

export default function SingleLanguageManual({ lang }: Props) {
  const t = TEXT[lang];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-gradient-to-r from-emerald-950 via-slate-950 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
            {t.badge}
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">{t.title}</h1>
          <p className="mt-2 text-lg font-bold text-emerald-300">{t.subtitle}</p>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">{t.intro}</p>

          <p className="mt-4 max-w-4xl text-sm text-slate-400">
            <Link href={t.otherLanguageHref} className="font-bold text-emerald-300 hover:underline">
              {t.otherLanguageNote}
            </Link>
            {" · "}
            {t.combinedNote}{" "}
            <Link href={t.combinedHref} className="font-bold text-emerald-300 hover:underline">
              {t.combinedLinkText}
            </Link>
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {manualRoles.map((role) => (
              <a
                key={role.id}
                href={`#${role.id}`}
                className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 transition hover:border-emerald-400 hover:bg-emerald-950/40"
              >
                <p className="font-black text-white">{roleName(role, lang)}</p>
              </a>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-amber-400/30 bg-amber-950/20 p-7">
          <h2 className="text-2xl font-black text-amber-300">{t.ruleTitle}</h2>
          <p className="mt-5 leading-8 text-slate-300">{t.ruleBody}</p>
        </div>

        <div className="mt-12 space-y-14">
          {manualRoles.map((role) => (
            <section key={role.id} id={role.id} className="scroll-mt-6">
              <div className="rounded-3xl border border-emerald-400/30 bg-gradient-to-r from-emerald-950/70 to-slate-900 p-7">
                <h2 className="text-3xl font-black text-white">{roleName(role, lang)}</h2>
                <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
                    {t.responsibility}
                  </p>
                  <p className="mt-3 leading-8 text-slate-300">{roleResponsibility(role, lang)}</p>
                </div>
              </div>

              <div className="mt-7 space-y-7">
                {role.sections.map((section) => (
                  <article
                    key={`${role.id}-${section.screenNumber}`}
                    className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80"
                  >
                    <div className="border-b border-slate-800 bg-slate-900 p-6 sm:p-8">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-lg font-black text-emerald-300">
                          {section.screenNumber}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-black text-white">{sectionTitle(section, lang)}</h3>
                          <p className="mt-4 inline-block rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 font-mono text-sm text-slate-300">
                            {section.route}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8 p-6 sm:p-8">
                      <Topic title={t.purpose} text={sectionField(section, "purpose", lang)} />
                      <Topic
                        title={t.whyAiAsks}
                        text={sectionField(section, "whyAiAsks", lang)}
                        highlighted
                      />
                      <ListBlock
                        title={t.steps}
                        items={sectionList(section, "steps", lang)}
                        numbered
                      />
                      <Topic title={t.expectedResult} text={sectionField(section, "expectedResult", lang)} />
                      <ListBlock
                        title={t.commonMistakes}
                        items={sectionList(section, "commonMistakes", lang)}
                        warning
                      />
                      <ListBlock
                        title={t.bestPractices}
                        items={sectionList(section, "bestPractices", lang)}
                        positive
                      />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="text-3xl font-black text-white">{t.checklistTitle}</h2>
          <p className="mt-2 text-slate-400">{t.checklistDescription}</p>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {pilotChecklist.map((item, index) => (
              <div
                key={item.english}
                className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 font-black text-emerald-300">
                  {index + 1}
                </div>
                <p className="font-bold text-white">{lang === "en" ? item.english : item.bangla}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-green-400/30 bg-green-950/20 p-7">
          <h2 className="text-2xl font-black text-green-300">{t.outcomeTitle}</h2>
          <p className="mt-5 leading-8 text-slate-300">{t.outcomeBody}</p>
        </section>

        <div className="mt-12">
          <Link
            href="/optifabric"
            className="inline-block rounded-2xl bg-red-600 px-6 py-4 text-center font-black text-white transition hover:bg-red-500"
          >
            {t.returnHome}
          </Link>
        </div>
      </section>
    </main>
  );
}

function Topic({ title, text, highlighted = false }: { title: string; text: string; highlighted?: boolean }) {
  return (
    <section className={highlighted ? "rounded-2xl border border-emerald-400/30 bg-emerald-950/30 p-6" : ""}>
      <h5 className="text-xl font-black text-white">{title}</h5>
      <p className="mt-3 leading-8 text-slate-300">{text}</p>
    </section>
  );
}

function ListBlock({
  title,
  items,
  numbered = false,
  warning = false,
  positive = false,
}: {
  title: string;
  items: string[];
  numbered?: boolean;
  warning?: boolean;
  positive?: boolean;
}) {
  const borderClass = warning ? "border-red-400/20" : positive ? "border-green-400/20" : "border-slate-800";
  const badgeClass = warning
    ? "border-red-400/30 bg-red-400/10 text-red-300"
    : positive
      ? "border-green-400/30 bg-green-400/10 text-green-300"
      : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";

  return (
    <section>
      <h5 className="text-xl font-black text-white">{title}</h5>
      <div className={`mt-4 rounded-2xl border bg-slate-950/70 p-5 ${borderClass}`}>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item} className="flex gap-3">
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
    </section>
  );
}
