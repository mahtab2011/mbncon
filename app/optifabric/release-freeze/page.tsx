"use client";

import Link from "next/link";

type ReviewStatus = "COMPLETE" | "VERIFY AFTER DEPLOYMENT" | "PILOT CHECK";

type ReviewItem = {
  title: string;
  titleBangla: string;
  status: ReviewStatus;
  description: string;
  descriptionBangla: string;
};

type ChecklistGroup = {
  title: string;
  titleBangla: string;
  items: {
    english: string;
    bangla: string;
  }[];
};

const engineeringReview: ReviewItem[] = [
  {
    title: "RC1 Core Workflow",
    titleBangla: "RC1 মূল কার্যপ্রবাহ",
    status: "COMPLETE",
    description:
      "The commercial pilot workflow has been completed from landing page, pattern upload and tracing through nesting, savings analysis and final pilot result.",
    descriptionBangla:
      "Landing page, pattern upload এবং tracing থেকে nesting, savings analysis ও final pilot result পর্যন্ত commercial pilot workflow সম্পন্ন হয়েছে।",
  },
  {
    title: "English and Bangla Coverage",
    titleBangla: "English ও বাংলা কাভারেজ",
    status: "COMPLETE",
    description:
      "The release follows English as the master language while providing English and Bangla guidance for factory users.",
    descriptionBangla:
      "Release-এ English master language হিসেবে ব্যবহৃত হয়েছে এবং factory user-এর জন্য English ও বাংলা guidance রাখা হয়েছে।",
  },
  {
    title: "AI Explanation Standard",
    titleBangla: "AI ব্যাখ্যা মানদণ্ড",
    status: "COMPLETE",
    description:
      "Important engineering inputs explain why AI requests the information and how the input affects the result.",
    descriptionBangla:
      "গুরুত্বপূর্ণ engineering input-এ AI কেন তথ্যটি চায় এবং এটি result-কে কীভাবে প্রভাবিত করে তা ব্যাখ্যা করা হয়েছে।",
  },
  {
    title: "Commercial Presentation Layer",
    titleBangla: "বাণিজ্যিক উপস্থাপনা স্তর",
    status: "COMPLETE",
    description:
      "Executive headers, readiness panels, factory demonstration sections, release information and commercial navigation are in place.",
    descriptionBangla:
      "Executive header, readiness panel, factory demonstration section, release information এবং commercial navigation যুক্ত হয়েছে।",
  },
  {
    title: "Legal Release Pages",
    titleBangla: "আইনি রিলিজ পৃষ্ঠা",
    status: "COMPLETE",
    description:
      "Privacy Policy and Terms and Conditions pages have been added for commercial release preparation.",
    descriptionBangla:
      "Commercial release preparation-এর জন্য Privacy Policy এবং Terms and Conditions page যুক্ত হয়েছে।",
  },
  {
    title: "Play Store Preparation",
    titleBangla: "Play Store প্রস্তুতি",
    status: "COMPLETE",
    description:
      "The asset-control page includes icon, splash screen, feature graphic, store listing and screenshot requirements.",
    descriptionBangla:
      "Asset-control page-এ icon, splash screen, feature graphic, store listing এবং screenshot requirement অন্তর্ভুক্ত হয়েছে।",
  },
  {
    title: "Official User Manual",
    titleBangla: "অফিসিয়াল ব্যবহার নির্দেশিকা",
    status: "COMPLETE",
    description:
      "Role-based operating guidance has been created for Cutting Master, Cutting Supervisor, Production Officer and Factory Manager.",
    descriptionBangla:
      "Cutting Master, Cutting Supervisor, Production Officer এবং Factory Manager-এর জন্য role-based operating guidance তৈরি হয়েছে।",
  },
  {
    title: "Production Build",
    titleBangla: "Production build",
    status: "VERIFY AFTER DEPLOYMENT",
    description:
      "The final build, route audit and TypeScript validation must be checked after Git push and deployment.",
    descriptionBangla:
      "Git push এবং deployment-এর পরে final build, route audit এবং TypeScript validation পরীক্ষা করতে হবে।",
  },
  {
    title: "Mobile Device Review",
    titleBangla: "মোবাইল ডিভাইস যাচাই",
    status: "VERIFY AFTER DEPLOYMENT",
    description:
      "All commercial screens must be checked on deployed mobile widths before screenshots are approved.",
    descriptionBangla:
      "Screenshot approve করার আগে deployed mobile width-এ সব commercial screen পরীক্ষা করতে হবে।",
  },
  {
    title: "Factory Trial Validation",
    titleBangla: "ফ্যাক্টরি ট্রায়াল যাচাই",
    status: "PILOT CHECK",
    description:
      "Engineering results must be verified through controlled factory trials before being treated as approved production instructions.",
    descriptionBangla:
      "Approved production instruction হিসেবে ব্যবহারের আগে controlled factory trial-এর মাধ্যমে engineering result যাচাই করতে হবে।",
  },
];

const freezeRules: ChecklistGroup[] = [
  {
    title: "Code Freeze Rules",
    titleBangla: "কোড ফ্রিজ নিয়ম",
    items: [
      {
        english:
          "Do not add new commercial features until the RC1 deployment review is complete.",
        bangla:
          "RC1 deployment review সম্পন্ন হওয়ার আগে নতুন commercial feature যোগ করা যাবে না।",
      },
      {
        english:
          "Only defect correction, broken-route correction, mobile correction and release-critical legal updates are allowed.",
        bangla:
          "শুধু defect correction, broken-route correction, mobile correction এবং release-critical legal update করা যাবে।",
      },
      {
        english:
          "Do not redesign completed screens unless a clear defect is found.",
        bangla:
          "স্পষ্ট defect পাওয়া না গেলে completed screen redesign করা যাবে না।",
      },
      {
        english:
          "Preserve the existing route structure during the release audit.",
        bangla:
          "Release audit চলাকালে existing route structure অপরিবর্তিত রাখতে হবে।",
      },
      {
        english:
          "Record every correction made after RC1 freeze.",
        bangla:
          "RC1 freeze-এর পরে করা প্রতিটি correction record করতে হবে।",
      },
    ],
  },
  {
    title: "Duplicate Code Review",
    titleBangla: "ডুপ্লিকেট কোড যাচাই",
    items: [
      {
        english:
          "Identify repeated headers, footers, AI explanation panels and release badges.",
        bangla:
          "Repeated header, footer, AI explanation panel এবং release badge শনাক্ত করুন।",
      },
      {
        english:
          "Convert repeated commercial UI into reusable components only when the change is safe and low-risk.",
        bangla:
          "পরিবর্তন safe ও low-risk হলে repeated commercial UI reusable component-এ রূপান্তর করুন।",
      },
      {
        english:
          "Do not create new abstractions that make simple screens harder to maintain.",
        bangla:
          "Simple screen maintain করা কঠিন করে এমন নতুন abstraction তৈরি করবেন না।",
      },
      {
        english:
          "Remove unused imports, dead constants and unreachable sample blocks.",
        bangla:
          "Unused import, dead constant এবং unreachable sample block বাদ দিন।",
      },
      {
        english:
          "Retain clear local components when they improve readability.",
        bangla:
          "Readability উন্নত হলে পরিষ্কার local component রেখে দিন।",
      },
    ],
  },
  {
    title: "GPA Engine Reuse Review",
    titleBangla: "GPA engine পুনঃব্যবহার যাচাই",
    items: [
      {
        english:
          "Review whether shared polygon, area, consumption, marker or KPI logic already exists in GPA.",
        bangla:
          "Shared polygon, area, consumption, marker অথবা KPI logic GPA-তে আগে থেকেই আছে কি না যাচাই করুন।",
      },
      {
        english:
          "Reuse stable GPA engineering logic without importing enterprise-only UI.",
        bangla:
          "Enterprise-only UI import না করে stable GPA engineering logic পুনঃব্যবহার করুন।",
      },
      {
        english:
          "Keep OptiFabric commercial workflows simpler than GPA enterprise workflows.",
        bangla:
          "OptiFabric commercial workflow-কে GPA enterprise workflow-এর চেয়ে সহজ রাখুন।",
      },
      {
        english:
          "Do not duplicate calculation engines when a tested shared engine can be safely reused.",
        bangla:
          "Tested shared engine নিরাপদে ব্যবহার করা গেলে calculation engine duplicate করবেন না।",
      },
      {
        english:
          "Document any engine that must remain OptiFabric-specific.",
        bangla:
          "OptiFabric-specific রাখতে হবে এমন engine document করুন।",
      },
    ],
  },
];

const releaseChecklist: ChecklistGroup[] = [
  {
    title: "Final Engineering Review",
    titleBangla: "চূড়ান্ত ইঞ্জিনিয়ারিং যাচাই",
    items: [
      {
        english: "All RC1 routes open successfully.",
        bangla: "সব RC1 route সফলভাবে খুলছে।",
      },
      {
        english: "No TypeScript or build errors remain.",
        bangla: "কোনো TypeScript অথবা build error নেই।",
      },
      {
        english: "All internal links point to valid routes.",
        bangla: "সব internal link valid route-এ যাচ্ছে।",
      },
      {
        english: "Pattern tracing and polygon calculation still work.",
        bangla: "Pattern tracing এবং polygon calculation এখনও কাজ করছে।",
      },
      {
        english: "Nesting and savings results display correctly.",
        bangla: "Nesting এবং savings result সঠিকভাবে দেখা যাচ্ছে।",
      },
      {
        english: "No test data is presented as verified production data.",
        bangla:
          "কোনো test data verified production data হিসেবে দেখানো হচ্ছে না।",
      },
    ],
  },
  {
    title: "Final Performance Review",
    titleBangla: "চূড়ান্ত পারফরম্যান্স যাচাই",
    items: [
      {
        english: "Landing page loads without unnecessary delay.",
        bangla: "Landing page অপ্রয়োজনীয় delay ছাড়া load হচ্ছে।",
      },
      {
        english: "Large images do not break the page layout.",
        bangla: "Large image page layout নষ্ট করছে না।",
      },
      {
        english: "No repeated calculation causes visible freezing.",
        bangla: "Repeated calculation-এর কারণে visible freezing হচ্ছে না।",
      },
      {
        english: "Long manual and legal pages remain readable.",
        bangla: "Long manual এবং legal page সহজে পড়া যাচ্ছে।",
      },
      {
        english: "Console errors are reviewed and resolved.",
        bangla: "Console error review ও resolve করা হয়েছে।",
      },
    ],
  },
  {
    title: "Final Mobile Review",
    titleBangla: "চূড়ান্ত মোবাইল যাচাই",
    items: [
      {
        english: "No horizontal scrolling appears on commercial pages.",
        bangla: "Commercial page-এ horizontal scrolling দেখা যাচ্ছে না।",
      },
      {
        english: "Buttons remain large enough for touch operation.",
        bangla: "Button touch operation-এর জন্য যথেষ্ট বড়।",
      },
      {
        english: "English and Bangla text does not overlap.",
        bangla: "English ও বাংলা text overlap করছে না।",
      },
      {
        english: "Cards stack correctly on narrow screens.",
        bangla: "Narrow screen-এ card সঠিকভাবে stack হচ্ছে।",
      },
      {
        english: "Pattern tracing controls remain usable on mobile.",
        bangla: "Mobile-এ pattern tracing control ব্যবহারযোগ্য।",
      },
      {
        english: "Play Store screenshot routes are presentation-ready.",
        bangla: "Play Store screenshot route presentation-ready।",
      },
    ],
  },
  {
    title: "Commercial Release Checklist",
    titleBangla: "বাণিজ্যিক রিলিজ চেকলিস্ট",
    items: [
      {
        english: "Privacy Policy is publicly accessible.",
        bangla: "Privacy Policy publicভাবে accessible।",
      },
      {
        english: "Terms and Conditions are publicly accessible.",
        bangla: "Terms and Conditions publicভাবে accessible।",
      },
      {
        english: "Official store description has been reviewed.",
        bangla: "Official store description review করা হয়েছে।",
      },
      {
        english: "App icon, splash screen and feature graphic are approved.",
        bangla:
          "App icon, splash screen এবং feature graphic approve করা হয়েছে।",
      },
      {
        english: "Final mobile screenshots are captured from deployment.",
        bangla:
          "Deployment থেকে final mobile screenshot capture করা হয়েছে।",
      },
      {
        english: "Release version and date are confirmed.",
        bangla: "Release version এবং date নিশ্চিত করা হয়েছে।",
      },
      {
        english: "Support and contact information are confirmed.",
        bangla: "Support এবং contact information নিশ্চিত করা হয়েছে।",
      },
    ],
  },
];

const factoryPilotChecklist: ChecklistGroup[] = [
  {
    title: "Factory Preparation",
    titleBangla: "ফ্যাক্টরি প্রস্তুতি",
    items: [
      {
        english: "Pilot factory and responsible manager confirmed.",
        bangla: "Pilot factory এবং responsible manager নিশ্চিত করা হয়েছে।",
      },
      {
        english: "One simple pilot style selected.",
        bangla: "একটি simple pilot style নির্বাচন করা হয়েছে।",
      },
      {
        english: "Cutting Master and Cutting Supervisor assigned.",
        bangla:
          "Cutting Master এবং Cutting Supervisor দায়িত্ব পেয়েছেন।",
      },
      {
        english: "Production Officer or Industrial Engineer assigned.",
        bangla:
          "Production Officer অথবা Industrial Engineer দায়িত্ব পেয়েছেন।",
      },
      {
        english: "Existing marker and consumption baseline recorded.",
        bangla:
          "Existing marker এবং consumption baseline record করা হয়েছে।",
      },
    ],
  },
  {
    title: "Pattern and Marker Validation",
    titleBangla: "প্যাটার্ন ও মার্কার যাচাই",
    items: [
      {
        english: "Pattern image follows photo-quality guidance.",
        bangla: "Pattern image photo-quality guidance অনুসরণ করে।",
      },
      {
        english: "Ruler calibration is verified.",
        bangla: "Ruler calibration যাচাই করা হয়েছে।",
      },
      {
        english: "Pattern boundary is checked by the Cutting Master.",
        bangla:
          "Cutting Master pattern boundary পরীক্ষা করেছেন।",
      },
      {
        english: "Usable fabric width is measured from the actual roll.",
        bangla:
          "Actual roll থেকে usable fabric width মাপা হয়েছে।",
      },
      {
        english: "Grain, nap, stripe and print restrictions are reviewed.",
        bangla:
          "Grain, nap, stripe এবং print restriction review করা হয়েছে।",
      },
    ],
  },
  {
    title: "Trial Execution",
    titleBangla: "ট্রায়াল বাস্তবায়ন",
    items: [
      {
        english: "AI marker result is reviewed before cutting.",
        bangla: "Cutting-এর আগে AI marker result review করা হয়েছে।",
      },
      {
        english: "A controlled trial lay is prepared.",
        bangla: "Controlled trial lay প্রস্তুত করা হয়েছে।",
      },
      {
        english: "Top, middle and bottom plies are inspected.",
        bangla: "Top, middle এবং bottom ply inspect করা হয়েছে।",
      },
      {
        english: "Cut accuracy and part completeness are verified.",
        bangla:
          "Cut accuracy এবং part completeness যাচাই করা হয়েছে।",
      },
      {
        english: "Actual consumption is measured.",
        bangla: "Actual consumption measure করা হয়েছে।",
      },
    ],
  },
  {
    title: "Pilot Approval",
    titleBangla: "পাইলট অনুমোদন",
    items: [
      {
        english: "AI estimate is compared with the actual result.",
        bangla:
          "AI estimate actual result-এর সঙ্গে compare করা হয়েছে।",
      },
      {
        english: "Quality impact is reviewed.",
        bangla: "Quality impact review করা হয়েছে।",
      },
      {
        english: "Fabric saving is verified rather than assumed.",
        bangla:
          "Fabric saving assume না করে verify করা হয়েছে।",
      },
      {
        english: "Corrective actions are documented.",
        bangla: "Corrective action document করা হয়েছে।",
      },
      {
        english: "Factory Manager approval is recorded.",
        bangla: "Factory Manager approval record করা হয়েছে।",
      },
    ],
  },
];

export default function ReleaseFreezePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-gradient-to-r from-cyan-950 via-slate-950 to-blue-950">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-green-300">
              RC1 Block 045
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-300">
              Release Candidate Freeze
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
            RC1 Release Candidate Freeze
          </h1>

          <h2 className="mt-3 text-3xl font-black text-cyan-300">
            RC1 রিলিজ ক্যান্ডিডেট ফ্রিজ
          </h2>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            OptiFabric AI RC1 feature development is now frozen for deployment,
            engineering verification, mobile review and controlled factory
            pilot preparation.
          </p>

          <p className="mt-3 max-w-4xl leading-8 text-slate-400">
            Deployment, engineering verification, mobile review এবং controlled
            factory pilot preparation-এর জন্য OptiFabric AI RC1 feature
            development এখন freeze করা হলো।
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Release"
              value="RC1"
              bangla="Commercial Release Candidate"
            />

            <SummaryCard
              label="Feature Status"
              value="Frozen"
              bangla="নতুন feature সাময়িকভাবে বন্ধ"
            />

            <SummaryCard
              label="Next Gate"
              value="Git & Deployment Audit"
              bangla="Git push ও deployed route review"
            />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl space-y-16 px-6 py-12">
        <section className="rounded-3xl border border-green-400/30 bg-green-950/20 p-7">
          <h2 className="text-2xl font-black text-green-300">
            RC1 Freeze Declaration
          </h2>

          <h3 className="mt-2 text-xl font-bold text-white">
            RC1 ফ্রিজ ঘোষণা
          </h3>

          <p className="mt-5 leading-8 text-slate-300">
            The existing OptiFabric AI RC1 scope is considered complete. From
            this point, changes should be limited to defects, broken routes,
            mobile usability, performance, legal release requirements and
            factory-pilot safety.
          </p>

          <p className="mt-4 leading-8 text-slate-400">
            Existing OptiFabric AI RC1 scope সম্পূর্ণ হিসেবে বিবেচিত হবে। এখন
            থেকে পরিবর্তন শুধু defect, broken route, mobile usability,
            performance, legal release requirement এবং factory-pilot safety-তে
            সীমাবদ্ধ থাকবে।
          </p>
        </section>

        <section>
          <SectionHeading
            title="Engineering Review Status"
            bangla="ইঞ্জিনিয়ারিং যাচাইয়ের অবস্থা"
            description="Current release position before the Git and deployment audit."
            descriptionBangla="Git ও deployment audit-এর আগের বর্তমান release position।"
          />

          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            {engineeringReview.map((item) => (
              <ReviewCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            title="Freeze and Code Review"
            bangla="ফ্রিজ ও কোড যাচাই"
            description="Rules for protecting RC1 stability during final engineering review."
            descriptionBangla="Final engineering review চলাকালে RC1 stability রক্ষার নিয়ম।"
          />

          <div className="mt-7 space-y-7">
            {freezeRules.map((group) => (
              <ChecklistSection key={group.title} group={group} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            title="RC1 Commercial Release Checklist"
            bangla="RC1 বাণিজ্যিক রিলিজ চেকলিস্ট"
            description="Complete these checks after deployment and before Play Store submission."
            descriptionBangla="Deployment-এর পরে এবং Play Store submission-এর আগে এসব check সম্পন্ন করুন।"
          />

          <div className="mt-7 space-y-7">
            {releaseChecklist.map((group) => (
              <ChecklistSection key={group.title} group={group} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            title="Factory Pilot Checklist"
            bangla="ফ্যাক্টরি পাইলট চেকলিস্ট"
            description="Use this checklist for the first controlled factory trial."
            descriptionBangla="প্রথম controlled factory trial-এর জন্য এই checklist ব্যবহার করুন।"
          />

          <div className="mt-7 space-y-7">
            {factoryPilotChecklist.map((group) => (
              <ChecklistSection key={group.title} group={group} />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-amber-400/30 bg-amber-950/20 p-7">
          <h2 className="text-2xl font-black text-amber-300">
            Release Restriction
          </h2>

          <h3 className="mt-2 text-xl font-bold text-white">
            রিলিজ সীমাবদ্ধতা
          </h3>

          <p className="mt-5 leading-8 text-slate-300">
            The RC1 pilot may demonstrate engineering calculations and
            commercial potential, but it must not be presented as a fully
            automated CAD replacement or as an approved bulk-cutting system
            until controlled factory validation is complete.
          </p>

          <p className="mt-4 leading-8 text-slate-400">
            RC1 pilot engineering calculation এবং commercial potential
            demonstrate করতে পারবে, তবে controlled factory validation সম্পন্ন
            হওয়ার আগে এটিকে fully automated CAD replacement অথবা approved
            bulk-cutting system হিসেবে উপস্থাপন করা যাবে না।
          </p>
        </section>

        <section className="rounded-3xl border border-cyan-400/30 bg-cyan-950/20 p-7">
          <h2 className="text-2xl font-black text-cyan-300">
            Next Controlled Sequence
          </h2>

          <h3 className="mt-2 text-xl font-bold text-white">
            পরবর্তী নিয়ন্ত্রিত ধাপ
          </h3>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <SequenceCard number="01" title="Git Add" bangla="সব file stage" />
            <SequenceCard
              number="02"
              title="Git Commit"
              bangla="RC1 freeze commit"
            />
            <SequenceCard
              number="03"
              title="Git Push"
              bangla="Remote repository update"
            />
            <SequenceCard
              number="04"
              title="Deployment Audit"
              bangla="Route, build ও mobile check"
            />
            <SequenceCard
              number="05"
              title="Pilot Preparation"
              bangla="Screenshot ও factory trial"
            />
          </div>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Link
            href="/optifabric"
            className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-black text-slate-950 transition hover:bg-cyan-300"
          >
            Return to OptiFabric
          </Link>

          <Link
            href="/optifabric/user-manual"
            className="rounded-2xl border border-slate-700 bg-slate-900 px-6 py-4 text-center font-bold transition hover:border-cyan-400 hover:text-cyan-300"
          >
            User Manual
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

          <p>RC1 Feature Freeze Active</p>

          <p>© 2026 OptiFabric AI</p>
        </div>
      </footer>
    </main>
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

function SummaryCard({
  label,
  value,
  bangla,
}: {
  label: string;
  value: string;
  bangla: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-400">
        {label}
      </p>

      <p className="mt-2 text-lg font-black text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{bangla}</p>
    </div>
  );
}

function ReviewCard({ item }: { item: ReviewItem }) {
  const statusClass =
    item.status === "COMPLETE"
      ? "border-green-400/30 bg-green-400/10 text-green-300"
      : item.status === "PILOT CHECK"
        ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
        : "border-cyan-400/30 bg-cyan-400/10 text-cyan-300";

  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-white">{item.title}</h3>
          <p className="mt-2 font-bold text-cyan-300">
            {item.titleBangla}
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-2 text-xs font-black ${statusClass}`}
        >
          {item.status}
        </span>
      </div>

      <p className="mt-5 leading-7 text-slate-300">{item.description}</p>

      <p className="mt-3 leading-7 text-slate-400">
        {item.descriptionBangla}
      </p>
    </article>
  );
}

function ChecklistSection({ group }: { group: ChecklistGroup }) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
      <h3 className="text-2xl font-black text-white">{group.title}</h3>

      <p className="mt-2 text-xl font-bold text-cyan-300">
        {group.titleBangla}
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {group.items.map((item, index) => (
          <div
            key={item.english}
            className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-black text-cyan-300">
              {index + 1}
            </div>

            <div>
              <p className="font-bold leading-7 text-white">
                {item.english}
              </p>

              <p className="mt-2 leading-7 text-slate-400">
                {item.bangla}
              </p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function SequenceCard({
  number,
  title,
  bangla,
}: {
  number: string;
  title: string;
  bangla: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-black text-cyan-300">
        {number}
      </div>

      <p className="mt-4 font-black text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{bangla}</p>
    </div>
  );
}