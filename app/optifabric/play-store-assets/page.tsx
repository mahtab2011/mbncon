"use client";

import Link from "next/link";

type AssetStatus = "READY" | "DESIGN REQUIRED" | "CAPTURE REQUIRED";

type PlayStoreAsset = {
  title: string;
  banglaTitle: string;
  size: string;
  format: string;
  fileName: string;
  status: AssetStatus;
  purpose: string;
  purposeBangla: string;
};

type ScreenshotItem = {
  number: string;
  title: string;
  banglaTitle: string;
  route: string;
  caption: string;
  captionBangla: string;
};

const playStoreAssets: PlayStoreAsset[] = [
  {
    title: "App Icon",
    banglaTitle: "অ্যাপ আইকন",
    size: "512 × 512 px",
    format: "PNG",
    fileName: "optifabric-app-icon-512.png",
    status: "DESIGN REQUIRED",
    purpose:
      "Primary OptiFabric AI identity displayed in Google Play, Android launchers and app-management screens.",
    purposeBangla:
      "Google Play, Android launcher এবং অ্যাপ ব্যবস্থাপনা স্ক্রিনে OptiFabric AI-এর প্রধান পরিচয় হিসেবে ব্যবহার হবে।",
  },
  {
    title: "Splash Screen",
    banglaTitle: "স্প্ল্যাশ স্ক্রিন",
    size: "1080 × 1920 px",
    format: "PNG",
    fileName: "optifabric-splash-screen.png",
    status: "DESIGN REQUIRED",
    purpose:
      "Displayed briefly while the mobile application starts and prepares the OptiFabric engineering workflow.",
    purposeBangla:
      "মোবাইল অ্যাপ চালু হওয়ার সময় OptiFabric engineering workflow প্রস্তুত হওয়া পর্যন্ত অল্প সময়ের জন্য প্রদর্শিত হবে।",
  },
  {
    title: "Feature Graphic",
    banglaTitle: "ফিচার গ্রাফিক",
    size: "1024 × 500 px",
    format: "PNG or JPEG",
    fileName: "optifabric-feature-graphic.png",
    status: "DESIGN REQUIRED",
    purpose:
      "Main promotional graphic used on the Google Play Store listing.",
    purposeBangla:
      "Google Play Store listing-এ প্রধান প্রচারণামূলক ছবি হিসেবে ব্যবহার হবে।",
  },
  {
    title: "Phone Screenshots",
    banglaTitle: "মোবাইল স্ক্রিনশট",
    size: "1080 × 1920 px",
    format: "PNG or JPEG",
    fileName: "optifabric-screenshot-01-to-08.png",
    status: "CAPTURE REQUIRED",
    purpose:
      "Shows factory users how the product works from pattern upload to final engineering result.",
    purposeBangla:
      "প্যাটার্ন আপলোড থেকে চূড়ান্ত engineering result পর্যন্ত অ্যাপটি কীভাবে কাজ করে তা কারখানার ব্যবহারকারীদের দেখাবে।",
  },
  {
    title: "Privacy Policy",
    banglaTitle: "গোপনীয়তা নীতিমালা",
    size: "Public web page",
    format: "HTTPS URL",
    fileName: "/optifabric/privacy-policy",
    status: "READY",
    purpose:
      "Provides the public privacy-policy link required for commercial release preparation.",
    purposeBangla:
      "বাণিজ্যিক রিলিজ প্রস্তুতির জন্য প্রয়োজনীয় public privacy-policy link প্রদান করবে।",
  },
  {
    title: "Terms and Conditions",
    banglaTitle: "ব্যবহারের শর্তাবলি",
    size: "Public web page",
    format: "HTTPS URL",
    fileName: "/optifabric/terms-and-conditions",
    status: "READY",
    purpose:
      "Explains permitted use, user responsibility and engineering limitations.",
    purposeBangla:
      "অনুমোদিত ব্যবহার, ব্যবহারকারীর দায়িত্ব এবং engineering limitation ব্যাখ্যা করবে।",
  },
];

const screenshots: ScreenshotItem[] = [
  {
    number: "01",
    title: "Commercial Landing Page",
    banglaTitle: "বাণিজ্যিক পরিচিতি পৃষ্ঠা",
    route: "/optifabric",
    caption: "Meet your AI Digital Cutting Master.",
    captionBangla: "আপনার AI Digital Cutting Master-এর সঙ্গে পরিচিত হোন।",
  },
  {
    number: "02",
    title: "Upload Your Pattern",
    banglaTitle: "প্যাটার্ন আপলোড করুন",
    route: "/optifabric/upload",
    caption: "Upload a pattern photo or document without CAD experience.",
    captionBangla:
      "CAD অভিজ্ঞতা ছাড়াই প্যাটার্নের ছবি বা ডকুমেন্ট আপলোড করুন।",
  },
  {
    number: "03",
    title: "AI Photo Guidance",
    banglaTitle: "AI ছবি তোলার নির্দেশনা",
    route: "/optifabric/upload",
    caption: "Follow simple guidance for better engineering accuracy.",
    captionBangla:
      "উন্নত engineering accuracy-এর জন্য সহজ নির্দেশনা অনুসরণ করুন।",
  },
  {
    number: "04",
    title: "Interactive Boundary Tracing",
    banglaTitle: "ইন্টার‌্যাক্টিভ বাউন্ডারি ট্রেসিং",
    route: "/optifabric/live-tracing",
    caption: "Trace pattern boundaries and calibrate real dimensions.",
    captionBangla:
      "প্যাটার্নের সীমানা ট্রেস করুন এবং বাস্তব মাপ ক্যালিব্রেট করুন।",
  },
  {
    number: "05",
    title: "AI Polygon Construction",
    banglaTitle: "AI পলিগন নির্মাণ",
    route: "/optifabric/polygon-demo",
    caption: "Convert selected points into an engineering-ready polygon.",
    captionBangla:
      "নির্বাচিত পয়েন্টকে engineering-ready polygon-এ রূপান্তর করুন।",
  },
  {
    number: "06",
    title: "AI Marker Planning",
    banglaTitle: "AI মার্কার পরিকল্পনা",
    route: "/optifabric/polygon-nesting",
    caption: "Visualise pattern placement and marker utilisation.",
    captionBangla:
      "প্যাটার্ন placement এবং marker utilisation দেখুন।",
  },
  {
    number: "07",
    title: "Fabric Saving Intelligence",
    banglaTitle: "কাপড় সাশ্রয় বিশ্লেষণ",
    route: "/optifabric/polygon-nesting",
    caption: "Estimate marker efficiency, wastage and fabric savings.",
    captionBangla:
      "Marker efficiency, wastage এবং fabric saving অনুমান করুন।",
  },
  {
    number: "08",
    title: "Complete Pilot Result",
    banglaTitle: "সম্পূর্ণ পাইলট ফলাফল",
    route: "/optifabric/complete-pilot-result",
    caption: "Turn engineering information into a factory-ready decision.",
    captionBangla:
      "Engineering information-কে factory-ready decision-এ রূপান্তর করুন।",
  },
];

const shortDescription =
  "AI Digital Cutting Master for pattern tracing, marker planning and fabric-saving intelligence.";

const fullDescription = `OptiFabric AI is an AI Digital Cutting Master and Engineering Assistant designed for garment factories.

The application helps Cutting Masters, Cutting Supervisors, Production Officers and Factory Managers prepare pattern information, trace pattern boundaries, calculate engineering areas, demonstrate marker placement, estimate fabric consumption and identify potential fabric savings.

No CAD experience is required for the guided workflow.

Key capabilities:

• Pattern photo and document upload
• English and Bangla guidance
• AI photo-quality coaching
• 12-inch ruler calibration
• Interactive pattern boundary tracing
• Engineering polygon construction
• AI marker-layout demonstration
• Marker-efficiency estimation
• Fabric-consumption intelligence
• Fabric-saving recommendations
• Commercial ROI demonstration
• Factory pilot result presentation

Every important input includes an explanation answering:

“Why does AI ask for this?”

OptiFabric AI supports factory engineering decisions. Final bulk-cutting decisions should be reviewed and approved by authorised factory professionals.`;

export default function PlayStoreAssetsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-gradient-to-r from-cyan-950 via-slate-950 to-blue-950">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
              RC1 Block 043
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-300">
              Play Store Release Preparation
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
            Play Store Assets
          </h1>

          <h2 className="mt-3 text-2xl font-bold text-cyan-300">
            Play Store প্রকাশনার উপকরণ
          </h2>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            This page controls the official visual assets, store-listing text,
            screenshot sequence and public release links for OptiFabric AI.
          </p>

          <p className="mt-3 max-w-4xl leading-8 text-slate-400">
            এই পৃষ্ঠায় OptiFabric AI-এর official visual asset, store-listing
            text, screenshot sequence এবং public release link নিয়ন্ত্রণ করা
            হবে।
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl space-y-12 px-6 py-12">
        <section>
          <SectionHeading
            title="Required Visual Assets"
            bangla="প্রয়োজনীয় ভিজ্যুয়াল উপকরণ"
            description="Official files required before the Google Play Store submission."
          />

          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            {playStoreAssets.map((asset) => (
              <AssetCard key={asset.title} asset={asset} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            title="Official Brand Direction"
            bangla="অফিসিয়াল ব্র্যান্ড নির্দেশনা"
            description="All graphics must remain consistent with the commercial OptiFabric identity."
          />

          <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <BrandCard
              label="Primary Background"
              value="Deep Slate / Engineering Navy"
              bangla="গাঢ় Slate ও Engineering Navy"
            />

            <BrandCard
              label="Primary Accent"
              value="Cyan Intelligence Glow"
              bangla="Cyan Intelligence Glow"
            />

            <BrandCard
              label="Primary Symbol"
              value="Fabric Polygon + AI Cutting Path"
              bangla="Fabric Polygon ও AI Cutting Path"
            />

            <BrandCard
              label="Brand Promise"
              value="Smarter Cutting. Lower Waste."
              bangla="বুদ্ধিমান কাটিং। কম অপচয়।"
            />
          </div>
        </section>

        <section>
          <SectionHeading
            title="Screenshot Capture Plan"
            bangla="স্ক্রিনশট ধারণ পরিকল্পনা"
            description="Capture these screens after the Git deployment has been checked."
          />

          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            {screenshots.map((screenshot) => (
              <ScreenshotCard
                key={screenshot.number}
                screenshot={screenshot}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            title="Store Listing"
            bangla="স্টোর লিস্টিং"
            description="Release-ready English marketing copy for the first commercial listing."
          />

          <div className="mt-7 space-y-6">
            <ListingCard
              title="Application Name"
              value="OptiFabric AI"
              limit="Recommended: maximum 30 characters"
            />

            <ListingCard
              title="Short Description"
              value={shortDescription}
              limit={`${shortDescription.length} characters`}
            />

            <ListingCard
              title="Full Description"
              value={fullDescription}
              limit={`${fullDescription.length} characters`}
              preserveFormatting
            />
          </div>
        </section>

        <section>
          <SectionHeading
            title="Screenshot Marketing Captions"
            bangla="স্ক্রিনশট মার্কেটিং ক্যাপশন"
            description="Use these captions inside the final Play Store screenshot designs."
          />

          <div className="mt-7 overflow-hidden rounded-3xl border border-slate-800">
            <div className="grid grid-cols-[70px_1fr] bg-slate-900 px-5 py-4 text-sm font-black text-cyan-300 sm:grid-cols-[70px_1fr_1fr]">
              <span>No.</span>
              <span>English</span>
              <span className="hidden sm:block">বাংলা</span>
            </div>

            {screenshots.map((item) => (
              <div
                key={item.number}
                className="grid grid-cols-[70px_1fr] gap-3 border-t border-slate-800 bg-slate-950 px-5 py-5 sm:grid-cols-[70px_1fr_1fr]"
              >
                <span className="font-black text-cyan-400">
                  {item.number}
                </span>

                <span className="text-slate-300">{item.caption}</span>

                <span className="col-start-2 text-slate-400 sm:col-start-auto">
                  {item.captionBangla}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-amber-400/30 bg-amber-950/20 p-7">
          <h2 className="text-2xl font-black text-amber-300">
            Capture After Deployment
          </h2>

          <h3 className="mt-2 text-xl font-bold text-white">
            Git deployment-এর পরে screenshot নিন
          </h3>

          <p className="mt-5 leading-8 text-slate-300">
            Do not capture the final Play Store screenshots from a broken or
            incomplete localhost environment. First push the completed RC1
            files to Git, check every route on the deployed website and then
            capture the approved mobile screens.
          </p>

          <p className="mt-4 leading-8 text-slate-400">
            Broken অথবা অসম্পূর্ণ localhost environment থেকে final Play Store
            screenshot নেওয়া হবে না। প্রথমে সম্পূর্ণ RC1 file Git-এ push করতে
            হবে, deployed website-এর প্রতিটি route পরীক্ষা করতে হবে এবং এরপর
            approved mobile screen capture করতে হবে।
          </p>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/optifabric"
            className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-black text-slate-950 transition hover:bg-cyan-300"
          >
            Return to OptiFabric
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

          <p>RC1 Play Store Asset Preparation</p>

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
}: {
  title: string;
  bangla: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-3xl font-black text-white">{title}</h2>
      <p className="mt-2 text-xl font-bold text-cyan-300">{bangla}</p>
      <p className="mt-3 max-w-3xl text-slate-400">{description}</p>
    </div>
  );
}

function AssetCard({ asset }: { asset: PlayStoreAsset }) {
  const statusStyle =
    asset.status === "READY"
      ? "border-green-400/30 bg-green-400/10 text-green-300"
      : asset.status === "CAPTURE REQUIRED"
        ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
        : "border-cyan-400/30 bg-cyan-400/10 text-cyan-300";

  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black">{asset.title}</h3>
          <p className="mt-1 font-bold text-cyan-300">
            {asset.banglaTitle}
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-2 text-xs font-black ${statusStyle}`}
        >
          {asset.status}
        </span>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 sm:grid-cols-3">
        <AssetValue label="Size" value={asset.size} />
        <AssetValue label="Format" value={asset.format} />
        <AssetValue label="File" value={asset.fileName} />
      </div>

      <p className="mt-5 leading-7 text-slate-300">{asset.purpose}</p>
      <p className="mt-3 leading-7 text-slate-400">
        {asset.purposeBangla}
      </p>
    </article>
  );
}

function AssetValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.15em] text-cyan-400">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function BrandCard({
  label,
  value,
  bangla,
}: {
  label: string;
  value: string;
  bangla: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-400">
        {label}
      </p>
      <p className="mt-4 text-lg font-black text-white">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{bangla}</p>
    </article>
  );
}

function ScreenshotCard({
  screenshot,
}: {
  screenshot: ScreenshotItem;
}) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
      <div className="flex gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 font-black text-cyan-300">
          {screenshot.number}
        </div>

        <div>
          <h3 className="text-xl font-black text-white">
            {screenshot.title}
          </h3>

          <p className="mt-1 font-bold text-cyan-300">
            {screenshot.banglaTitle}
          </p>

          <p className="mt-4 break-all rounded-xl bg-slate-950 px-4 py-3 font-mono text-sm text-slate-300">
            {screenshot.route}
          </p>

          <p className="mt-4 text-slate-300">{screenshot.caption}</p>

          <p className="mt-2 text-slate-400">
            {screenshot.captionBangla}
          </p>
        </div>
      </div>
    </article>
  );
}

function ListingCard({
  title,
  value,
  limit,
  preserveFormatting = false,
}: {
  title: string;
  value: string;
  limit: string;
  preserveFormatting?: boolean;
}) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-black text-white">{title}</h3>

        <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-slate-400">
          {limit}
        </span>
      </div>

      <div
        className={`mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-5 leading-8 text-slate-300 ${
          preserveFormatting ? "whitespace-pre-line" : ""
        }`}
      >
        {value}
      </div>
    </article>
  );
}