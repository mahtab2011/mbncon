import Link from "next/link";

type OptiFabricModule = {
  title: string;
  titleBangla: string;
  description: string;
  descriptionBangla: string;
  href: string;
  status: string;
};

const modules: OptiFabricModule[] = [
  {
    title: "Engineering Wizard",
    titleBangla: "ইঞ্জিনিয়ারিং উইজার্ড",
    description:
      "Follow the guided OptiFabric engineering workflow step by step.",
    descriptionBangla:
      "ধাপে ধাপে OptiFabric engineering workflow সম্পন্ন করুন।",
    href: "/optifabric/engineering-wizard",
    status: "GUIDED WORKFLOW",
  },
  {
    title: "RC1 Mini Pilot",
    titleBangla: "RC1 মিনি পাইলট",
    description:
      "Start the complete commercial demonstration and pattern-analysis journey.",
    descriptionBangla:
      "সম্পূর্ণ commercial demonstration এবং pattern-analysis journey শুরু করুন।",
    href: "/optifabric/mini-pilot",
    status: "START HERE",
  },
  {
    title: "Interactive Boundary Tracing",
    titleBangla: "ইন্টার‌্যাক্টিভ বাউন্ডারি ট্রেসিং",
    description:
      "Upload a pattern image, calibrate the scale and trace its cutting boundary.",
    descriptionBangla:
      "Pattern image upload করুন, scale calibrate করুন এবং cutting boundary trace করুন।",
    href: "/optifabric/mini-pilot/live-tracing",
    status: "ENGINEERING",
  },
  {
    title: "AI Marker Optimization",
    titleBangla: "AI মার্কার অপটিমাইজেশন",
    description:
      "Review AI pattern placement, marker utilisation and fabric-saving potential.",
    descriptionBangla:
      "AI pattern placement, marker utilisation এবং fabric-saving potential যাচাই করুন।",
    href: "/optifabric/mini-pilot/polygon-nesting",
    status: "AI NESTING",
  },
  {
    title: "Pilot Dashboard",
    titleBangla: "পাইলট ড্যাশবোর্ড",
    description:
      "Review the OptiFabric pilot workflow, progress and engineering results.",
    descriptionBangla:
      "OptiFabric pilot workflow, progress এবং engineering result যাচাই করুন।",
    href: "/optifabric/pilot-dashboard",
    status: "PILOT CONTROL",
  },
  {
    title: "Stripe Matching",
    titleBangla: "স্ট্রাইপ ম্যাচিং",
    description:
      "Review stripe-sensitive pattern alignment and fabric-matching requirements.",
    descriptionBangla:
      "Stripe-sensitive pattern alignment এবং fabric-matching requirement যাচাই করুন।",
    href: "/optifabric/stripe-matching",
    status: "FABRIC CONTROL",
  },
];

const benefits = [
  {
    title: "Fabric Saving",
    titleBangla: "কাপড় সাশ্রয়",
    description:
      "Reduce avoidable waste through improved marker and lay planning.",
    descriptionBangla:
      "উন্নত marker ও lay planning-এর মাধ্যমে অপ্রয়োজনীয় অপচয় কমান।",
  },
  {
    title: "Cutting Accuracy",
    titleBangla: "কাটিং নির্ভুলতা",
    description:
      "Use calibrated scale information, pattern tracing and AI guidance.",
    descriptionBangla:
      "Calibrated scale, pattern tracing এবং AI guidance ব্যবহার করুন।",
  },
  {
    title: "Factory Profit",
    titleBangla: "কারখানার লাভ",
    description:
      "Compare present consumption with AI-supported saving opportunities.",
    descriptionBangla:
      "বর্তমান consumption-এর সঙ্গে AI-supported saving opportunity তুলনা করুন।",
  },
];

const releaseLinks = [
  {
    title: "About OptiFabric",
    titleBangla: "OptiFabric পরিচিতি",
    href: "/optifabric/about",
  },
  {
    title: "User Manual",
    titleBangla: "ব্যবহার নির্দেশিকা",
    href: "/optifabric/user-manual",
  },
  {
    title: "Play Store Assets",
    titleBangla: "Play Store উপকরণ",
    href: "/optifabric/play-store-assets",
  },
  {
    title: "RC1 Release Freeze",
    titleBangla: "RC1 রিলিজ ফ্রিজ",
    href: "/optifabric/release-freeze",
  },
  {
    title: "Privacy Policy",
    titleBangla: "গোপনীয়তা নীতিমালা",
    href: "/optifabric/privacy-policy",
  },
  {
    title: "Terms & Conditions",
    titleBangla: "ব্যবহারের শর্তাবলি",
    href: "/optifabric/terms-and-conditions",
  },
];

export default function OptiFabricHomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-gradient-to-r from-cyan-950 via-slate-950 to-blue-950">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
              MBNCON AI Engineering Solutions
            </span>

            <span className="rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-xs font-black text-green-300">
              RC1 COMMERCIAL PILOT
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            OptiFabric AI
          </h1>

          <h2 className="mt-3 text-2xl font-black text-cyan-300 sm:text-3xl">
            AI Digital Cutting Master
          </h2>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300 sm:text-xl">
            AI Fabric Cutting and Engineering Optimization Platform for garment
            factories, Cutting Masters, Cutting Supervisors, Production
            Officers and Factory Managers.
          </p>

          <p className="mt-3 max-w-4xl leading-8 text-slate-400">
            Garment factory, Cutting Master, Cutting Supervisor, Production
            Officer এবং Factory Manager-এর জন্য AI fabric cutting ও
            engineering optimization platform।
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Link
              href="/optifabric/mini-pilot"
              className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-black text-slate-950 transition hover:bg-cyan-300"
            >
              Start RC1 Mini Pilot
            </Link>

            <Link
              href="/optifabric/engineering-wizard"
              className="rounded-2xl border border-cyan-400 bg-cyan-950/40 px-6 py-4 text-center font-black text-cyan-200 transition hover:bg-cyan-900/60"
            >
              Open Engineering Wizard
            </Link>

            <Link
              href="/optifabric/user-manual"
              className="rounded-2xl border border-slate-600 bg-slate-900 px-6 py-4 text-center font-bold text-white transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Read User Manual
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <section>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400">
              Commercial Engineering Benefits
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Why Factories Will Use OptiFabric AI
            </h2>

            <p className="mt-2 text-xl font-bold text-cyan-300">
              কারখানা কেন OptiFabric AI ব্যবহার করবে
            </p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/10"
              >
                <h3 className="text-xl font-black text-white">
                  {benefit.title}
                </h3>

                <p className="mt-2 font-bold text-cyan-300">
                  {benefit.titleBangla}
                </p>

                <p className="mt-5 leading-7 text-slate-300">
                  {benefit.description}
                </p>

                <p className="mt-3 leading-7 text-slate-400">
                  {benefit.descriptionBangla}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400">
              Working Product Modules
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              OptiFabric AI Modules
            </h2>

            <p className="mt-2 text-xl font-bold text-cyan-300">
              OptiFabric AI মডিউল
            </p>

            <p className="mt-4 max-w-4xl leading-8 text-slate-400">
              The six cards below now connect only to routes that exist in the
              current OptiFabric application.
            </p>
          </div>

          <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => (
              <Link
                key={module.href}
                href={module.href}
                className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-950/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 font-black text-cyan-300">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-2 text-[10px] font-black tracking-wide text-slate-400">
                    {module.status}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-black text-white transition group-hover:text-cyan-300">
                  {module.title}
                </h3>

                <p className="mt-2 font-bold text-cyan-300">
                  {module.titleBangla}
                </p>

                <p className="mt-5 leading-7 text-slate-300">
                  {module.description}
                </p>

                <p className="mt-3 leading-7 text-slate-400">
                  {module.descriptionBangla}
                </p>

                <div className="mt-6 font-black text-cyan-400">
                  Open Module →
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-cyan-400/30 bg-cyan-950/20 p-7">
          <h2 className="text-2xl font-black text-cyan-300">
            Why Does AI Ask for Engineering Information?
          </h2>

          <h3 className="mt-2 text-xl font-bold text-white">
            AI কেন ইঞ্জিনিয়ারিং তথ্য চায়?
          </h3>

          <p className="mt-5 max-w-5xl leading-8 text-slate-300">
            Fabric width, ruler calibration, pattern boundaries, marker length
            and fabric type directly affect pattern area, marker utilisation,
            estimated consumption and possible fabric saving. OptiFabric
            explains these relationships so that users without CAD experience
            can make safer engineering decisions.
          </p>

          <p className="mt-4 max-w-5xl leading-8 text-slate-400">
            Fabric width, ruler calibration, pattern boundary, marker length এবং
            fabric type সরাসরি pattern area, marker utilisation, estimated
            consumption এবং সম্ভাব্য fabric saving-কে প্রভাবিত করে। তাই CAD
            experience না থাকা ব্যবহারকারীও যেন নিরাপদ engineering decision
            নিতে পারেন, OptiFabric প্রতিটি গুরুত্বপূর্ণ input-এর কারণ ব্যাখ্যা
            করে।
          </p>
        </section>

        <section className="mt-14">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400">
              RC1 Release Centre
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Documentation and Release Information
            </h2>

            <p className="mt-2 text-xl font-bold text-cyan-300">
              ডকুমেন্টেশন ও রিলিজ তথ্য
            </p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {releaseLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-400 hover:bg-cyan-950/30"
              >
                <p className="font-black text-white">{item.title}</p>

                <p className="mt-2 text-sm font-bold text-cyan-300">
                  {item.titleBangla}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-amber-400/30 bg-amber-950/20 p-7">
          <h2 className="text-2xl font-black text-amber-300">
            Factory Validation Required
          </h2>

          <h3 className="mt-2 text-xl font-bold text-white">
            ফ্যাক্টরি যাচাই প্রয়োজন
          </h3>

          <p className="mt-5 leading-8 text-slate-300">
            OptiFabric AI supports engineering decisions. Pattern measurements,
            marker proposals and savings estimates must be reviewed through
            physical pattern checking and controlled trial cutting before bulk
            production.
          </p>

          <p className="mt-4 leading-8 text-slate-400">
            OptiFabric AI engineering decision-এ সহায়তা করে। Bulk production-এর
            আগে physical pattern checking এবং controlled trial cutting-এর
            মাধ্যমে pattern measurement, marker proposal এবং savings estimate
            যাচাই করতে হবে।
          </p>
        </section>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black text-white">OptiFabric AI</p>
            <p className="mt-1">
              AI Digital Cutting Master &amp; Engineering Assistant
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/optifabric/privacy-policy"
              className="transition hover:text-cyan-300"
            >
              Privacy Policy
            </Link>

            <Link
              href="/optifabric/terms-and-conditions"
              className="transition hover:text-cyan-300"
            >
              Terms &amp; Conditions
            </Link>

            <Link
              href="/optifabric/user-manual"
              className="transition hover:text-cyan-300"
            >
              User Manual
            </Link>
          </div>

          <p>© 2026 OptiFabric AI</p>
        </div>
      </footer>
    </main>
  );
}