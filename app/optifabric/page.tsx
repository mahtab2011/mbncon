import Link from "next/link";

type OptiFabricModule = {
  title: string;
  titleBangla: string;
  description: string;
  descriptionBangla: string;
  href: string;
  status: string;
};

type ProductionCapability = {
  step: string;
  title: string;
  titleBangla: string;
  description: string;
  descriptionBangla: string;
};

const productionCapabilities: ProductionCapability[] = [
  {
    step: "01",
    title: "Create or Open Cutting Project",
    titleBangla: "কাটিং প্রজেক্ট তৈরি বা খুলুন",
    description:
      "Start from the production project workspace so garment, order, fabric and engineering data remain connected throughout the cutting workflow.",
    descriptionBangla:
      "Production project workspace থেকে কাজ শুরু করুন, যাতে garment, order, fabric এবং engineering data পুরো cutting workflow জুড়ে একই থাকে।",
  },
  {
    step: "02",
    title: "Pattern & Geometry Engineering",
    titleBangla: "প্যাটার্ন ও জ্যামিতি ইঞ্জিনিয়ারিং",
    description:
      "Upload or select pattern pieces, validate scale and geometry, and prepare engineering-ready pattern data.",
    descriptionBangla:
      "Pattern piece upload বা select করুন, scale ও geometry যাচাই করুন এবং engineering-ready pattern data প্রস্তুত করুন।",
  },
  {
    step: "03",
    title: "AI Marker Engineering",
    titleBangla: "AI মার্কার ইঞ্জিনিয়ারিং",
    description:
      "Generate marker quantities, compare alternatives, detect voids, perform hole filling and intelligent compaction, and review AI recommendations.",
    descriptionBangla:
      "Marker quantity তৈরি ও তুলনা করুন, void detection, hole filling এবং intelligent compaction চালিয়ে AI recommendation যাচাই করুন।",
  },
  {
    step: "04",
    title: "Production Cutting Decision",
    titleBangla: "প্রোডাকশন কাটিং সিদ্ধান্ত",
    description:
      "Review utilisation, waste, marker length, fabric consumption, engineering score and cutting readiness before production approval.",
    descriptionBangla:
      "Production approval-এর আগে utilisation, waste, marker length, fabric consumption, engineering score এবং cutting readiness যাচাই করুন।",
  },
];

const demoModules: OptiFabricModule[] = [
  {
    title: "Engineering Wizard",
    titleBangla: "ইঞ্জিনিয়ারিং উইজার্ড",
    description:
      "Guided demonstration of the OptiFabric engineering workflow for presentations, learning and training.",
    descriptionBangla:
      "Presentation, learning এবং training-এর জন্য OptiFabric engineering workflow-এর guided demonstration।",
    href: "/optifabric/engineering-wizard",
    status: "DEMO / TRAINING",
  },
  {
    title: "RC1 Mini Pilot",
    titleBangla: "RC1 মিনি পাইলট",
    description:
      "Preserved pilot workflow for demonstrations and historical validation. It is not the normal production entry point.",
    descriptionBangla:
      "Demonstration ও historical validation-এর জন্য সংরক্ষিত pilot workflow। এটি normal production entry point নয়।",
    href: "/optifabric/mini-pilot",
    status: "LEGACY PILOT",
  },
  {
    title: "Interactive Boundary Tracing",
    titleBangla: "ইন্টার‌্যাক্টিভ বাউন্ডারি ট্রেসিং",
    description:
      "Training workspace for uploading a pattern image, calibrating scale and tracing a cutting boundary.",
    descriptionBangla:
      "Pattern image upload, scale calibration এবং cutting boundary tracing শেখার training workspace।",
    href: "/optifabric/mini-pilot/live-tracing",
    status: "TRAINING TOOL",
  },
  {
    title: "Pilot Dashboard",
    titleBangla: "পাইলট ড্যাশবোর্ড",
    description:
      "Review the earlier pilot workflow, progress and engineering demonstration results.",
    descriptionBangla:
      "আগের pilot workflow, progress এবং engineering demonstration result পর্যালোচনা করুন।",
    href: "/optifabric/pilot-dashboard",
    status: "PILOT ARCHIVE",
  },
];

const benefits = [
  {
    title: "Fabric Saving",
    titleBangla: "কাপড় সাশ্রয়",
    description:
      "Reduce avoidable waste through AI-supported marker optimisation, hole filling, intelligent compaction and improved lay planning.",
    descriptionBangla:
      "AI-supported marker optimisation, hole filling, intelligent compaction এবং উন্নত lay planning-এর মাধ্যমে অপ্রয়োজনীয় অপচয় কমান।",
  },
  {
    title: "Cutting Accuracy",
    titleBangla: "কাটিং নির্ভুলতা",
    description:
      "Use calibrated geometry, cutting-gap controls, collision validation and engineering checks before production cutting.",
    descriptionBangla:
      "Production cutting-এর আগে calibrated geometry, cutting-gap control, collision validation এবং engineering check ব্যবহার করুন।",
  },
  {
    title: "Engineering Decision Support",
    titleBangla: "ইঞ্জিনিয়ারিং সিদ্ধান্ত সহায়তা",
    description:
      "Compare marker alternatives using utilisation, waste, marker length, cost, confidence and AI engineering recommendations.",
    descriptionBangla:
      "Utilisation, waste, marker length, cost, confidence এবং AI engineering recommendation ব্যবহার করে marker alternative তুলনা করুন।",
  },
];

const releaseLinks = [
  {
    title: "About OptiFabric",
    titleBangla: "OptiFabric পরিচিতি",
    href: "/optifabric/about",
  },
  {
    title: "User Manual (Bilingual)",
    titleBangla: "ব্যবহার নির্দেশিকা (দ্বিভাষিক)",
    href: "/optifabric/user-manual",
  },
  {
    title: "User Manual (English Only)",
    titleBangla: "User Manual (শুধু ইংরেজি)",
    href: "/optifabric/user-manual/en",
  },
  {
    title: "User Manual (Bangla Only)",
    titleBangla: "ব্যবহার নির্দেশিকা (শুধু বাংলা)",
    href: "/optifabric/user-manual/bn",
  },
  {
    title: "Play Store Assets",
    titleBangla: "Play Store উপকরণ",
    href: "/optifabric/play-store-assets",
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
      <section className="border-b border-slate-800 bg-gradient-to-r from-emerald-950 via-slate-950 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
              MBNCON AI Engineering Solutions
            </span>

            <span className="rounded-full border border-red-400/30 bg-red-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-red-300">
              Production Engineering Platform
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            OptiFabric AI
          </h1>

          <h2 className="mt-3 text-2xl font-black text-emerald-300 sm:text-3xl">
            AI Digital Cutting Master &amp; Engineering Assistant
          </h2>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300 sm:text-xl">
            Production-focused AI fabric cutting and engineering optimisation
            platform for garment factories, Cutting Masters, Cutting
            Supervisors, Production Officers and Factory Managers.
          </p>

          <p className="mt-3 max-w-4xl leading-8 text-slate-400">
            Garment factory, Cutting Master, Cutting Supervisor, Production
            Officer এবং Factory Manager-এর জন্য production-focused AI fabric
            cutting ও engineering optimisation platform।
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Link
              href="/optifabric/project"
              className="rounded-2xl bg-red-600 px-6 py-4 text-center font-black text-white transition hover:bg-red-500"
            >
              Open Production Workspace
            </Link>

            <Link
              href="#demo-training"
              className="rounded-2xl border border-violet-400/60 bg-violet-950/30 px-6 py-4 text-center font-black text-violet-200 transition hover:bg-violet-900/50"
            >
              Demo &amp; Training
            </Link>

            <Link
              href="/optifabric/user-manual"
              className="rounded-2xl border border-slate-600 bg-slate-900 px-6 py-4 text-center font-bold text-white transition hover:border-emerald-400 hover:text-emerald-300"
            >
              Read User Manual
            </Link>

            <Link
              href="/optifabric/signup"
              className="rounded-2xl border border-slate-600 bg-slate-900 px-6 py-4 text-center font-bold text-white transition hover:border-emerald-400 hover:text-emerald-300"
            >
              Sign Up
            </Link>

            <Link
              href="/optifabric/login"
              className="rounded-2xl border border-slate-600 bg-slate-900 px-6 py-4 text-center font-bold text-white transition hover:border-emerald-400 hover:text-emerald-300"
            >
              Sign In
            </Link>

            <Link
              href="/optifabric/subscription"
              className="rounded-2xl border border-slate-600 bg-slate-900 px-6 py-4 text-center font-bold text-white transition hover:border-emerald-400 hover:text-emerald-300"
            >
              Subscription
            </Link>
          </div>

          <div className="mt-7 rounded-2xl border border-emerald-500/20 bg-emerald-950/15 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
              Production Navigation
            </p>

            <p className="mt-2 max-w-5xl leading-7 text-slate-300">
              Cutting Masters should enter through the Production Workspace.
              The earlier RC1 Mini Pilot and Engineering Wizard are retained
              below only for demonstrations, presentations and training.
            </p>

            <p className="mt-2 max-w-5xl leading-7 text-slate-400">
              Cutting Master-এর normal কাজ Production Workspace থেকে শুরু হবে।
              RC1 Mini Pilot এবং Engineering Wizard শুধু demonstration,
              presentation এবং training-এর জন্য নিচে সংরক্ষিত থাকবে।
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <section>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400">
              Production Engineering Benefits
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
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">
              Production Workflow
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Cutting Master Production Flow
            </h2>

            <p className="mt-2 text-xl font-bold text-emerald-300">
              কাটিং মাস্টারের প্রোডাকশন ওয়ার্কফ্লো
            </p>

            <p className="mt-4 max-w-4xl leading-8 text-slate-400">
              The production user follows one project-based workflow. Demo and
              pilot routes are intentionally separated so they do not interrupt
              factory operation.
            </p>
          </div>

          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {productionCapabilities.map((capability) => (
              <article
                key={capability.step}
                className="rounded-3xl border border-emerald-500/20 bg-slate-900/80 p-6 shadow-lg shadow-black/10"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 font-black text-emerald-300">
                    {capability.step}
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">
                      {capability.title}
                    </h3>

                    <p className="mt-2 font-bold text-emerald-300">
                      {capability.titleBangla}
                    </p>
                  </div>
                </div>

                <p className="mt-5 leading-7 text-slate-300">
                  {capability.description}
                </p>

                <p className="mt-3 leading-7 text-slate-400">
                  {capability.descriptionBangla}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-7 rounded-3xl border border-cyan-400/30 bg-cyan-950/20 p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                  Start Production
                </p>

                <h3 className="mt-2 text-2xl font-black text-white">
                  Enter the Project-Based Cutting Workspace
                </h3>

                <p className="mt-2 max-w-3xl leading-7 text-slate-400">
                  Projects keep garment geometry, marker engineering and
                  production decisions connected instead of sending the Cutting
                  Master through the old pilot workflow.
                </p>
              </div>

              <Link
                href="/optifabric/project"
                className="shrink-0 rounded-2xl bg-cyan-400 px-6 py-4 text-center font-black text-slate-950 transition hover:bg-cyan-300"
              >
                Open Production Workspace →
              </Link>
            </div>
          </div>
        </section>

        <section
          id="demo-training"
          className="mt-14 rounded-3xl border border-violet-500/20 bg-violet-950/10 p-7"
        >
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-300">
              Demo &amp; Training
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Demonstration and Training Tools
            </h2>

            <p className="mt-2 text-xl font-bold text-violet-300">
              ডেমো ও ট্রেনিং টুল
            </p>

            <p className="mt-4 max-w-4xl leading-8 text-slate-400">
              These routes are retained for presentations, demonstrations,
              learning and controlled testing. They are separated from the
              normal factory production workflow.
            </p>
          </div>

          <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {demoModules.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="group rounded-3xl border border-violet-500/20 bg-slate-950/50 p-6 transition hover:-translate-y-1 hover:border-violet-400/50 hover:bg-violet-950/30"
              >
                <span className="rounded-full border border-violet-500/30 bg-violet-950/40 px-3 py-2 text-[10px] font-black tracking-wide text-violet-300">
                  {module.status}
                </span>

                <h3 className="mt-6 text-xl font-black text-white transition group-hover:text-violet-200">
                  {module.title}
                </h3>

                <p className="mt-2 font-bold text-violet-300">
                  {module.titleBangla}
                </p>

                <p className="mt-5 leading-7 text-slate-300">
                  {module.description}
                </p>

                <p className="mt-3 leading-7 text-slate-400">
                  {module.descriptionBangla}
                </p>

                <div className="mt-6 font-black text-violet-300">
                  Open Demo / Training →
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
            Fabric width, calibrated geometry, pattern boundaries, cutting
            gaps, marker length, lay conditions and fabric type directly affect
            pattern area, marker utilisation, fabric consumption and possible
            saving. OptiFabric keeps these engineering relationships connected
            so production decisions are traceable and reviewable.
          </p>

          <p className="mt-4 max-w-5xl leading-8 text-slate-400">
            Fabric width, calibrated geometry, pattern boundary, cutting gap,
            marker length, lay condition এবং fabric type সরাসরি pattern area,
            marker utilisation, fabric consumption এবং সম্ভাব্য saving-কে
            প্রভাবিত করে। OptiFabric এই engineering relationship-গুলো connected
            রাখে, যাতে production decision সহজে যাচাই করা যায়।
          </p>
        </section>

        <section className="mt-14">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400">
              Support &amp; Release Information
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Documentation and Product Information
            </h2>

            <p className="mt-2 text-xl font-bold text-cyan-300">
              ডকুমেন্টেশন ও প্রোডাক্ট তথ্য
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
            marker proposals, optimisation results and savings estimates must
            be reviewed through physical pattern checking and controlled trial
            cutting before bulk production.
          </p>

          <p className="mt-4 leading-8 text-slate-400">
            OptiFabric AI engineering decision-এ সহায়তা করে। Bulk production-এর
            আগে physical pattern checking এবং controlled trial cutting-এর
            মাধ্যমে pattern measurement, marker proposal, optimisation result
            এবং savings estimate যাচাই করতে হবে।
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