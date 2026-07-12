"use client";

import Link from "next/link";

type TermsSectionProps = {
  number: string;
  title: string;
  titleBangla: string;
  english: string;
  bangla: string;
};

const termsSections: TermsSectionProps[] = [
  {
    number: "01",
    title: "Acceptance of Terms",
    titleBangla: "শর্তাবলি গ্রহণ",
    english:
      "By accessing or using OptiFabric AI, you agree to follow these Terms and Conditions. If you do not agree with these terms, you should not use the application.",
    bangla:
      "OptiFabric AI ব্যবহার বা প্রবেশ করার মাধ্যমে আপনি এই শর্তাবলি মেনে চলতে সম্মত হচ্ছেন। আপনি শর্তাবলির সঙ্গে একমত না হলে অ্যাপ্লিকেশনটি ব্যবহার করবেন না।",
  },
  {
    number: "02",
    title: "Purpose of the Application",
    titleBangla: "অ্যাপ্লিকেশনের উদ্দেশ্য",
    english:
      "OptiFabric AI is an engineering support application designed to assist garment factories with pattern measurement, marker planning, fabric-consumption estimation, cutting preparation and fabric-saving recommendations.",
    bangla:
      "OptiFabric AI একটি ইঞ্জিনিয়ারিং সহায়ক অ্যাপ্লিকেশন, যা গার্মেন্টস কারখানাকে প্যাটার্ন পরিমাপ, মার্কার পরিকল্পনা, কাপড়ের ব্যবহার অনুমান, কাটিং প্রস্তুতি এবং কাপড় সাশ্রয়ের পরামর্শ প্রদান করে।",
  },
  {
    number: "03",
    title: "Engineering Assistance",
    titleBangla: "ইঞ্জিনিয়ারিং সহায়তা",
    english:
      "OptiFabric AI provides calculations, recommendations and decision-support information. Final cutting, production and commercial decisions remain the responsibility of the user and the authorised factory management.",
    bangla:
      "OptiFabric AI হিসাব, পরামর্শ এবং সিদ্ধান্ত গ্রহণে সহায়ক তথ্য প্রদান করে। চূড়ান্ত কাটিং, উৎপাদন এবং বাণিজ্যিক সিদ্ধান্তের দায়িত্ব ব্যবহারকারী ও অনুমোদিত কারখানা ব্যবস্থাপনার ওপর থাকবে।",
  },
  {
    number: "04",
    title: "Accuracy of User Information",
    titleBangla: "ব্যবহারকারীর তথ্যের নির্ভুলতা",
    english:
      "Users are responsible for entering accurate pattern dimensions, ruler calibration, fabric width, marker length, order quantity and other engineering information. Incorrect inputs may produce incorrect results.",
    bangla:
      "সঠিক প্যাটার্নের মাপ, স্কেল ক্যালিব্রেশন, কাপড়ের প্রস্থ, মার্কারের দৈর্ঘ্য, অর্ডারের পরিমাণ এবং অন্যান্য ইঞ্জিনিয়ারিং তথ্য প্রদান করা ব্যবহারকারীর দায়িত্ব। ভুল তথ্য দিলে ভুল ফলাফল আসতে পারে।",
  },
  {
    number: "05",
    title: "Pattern Images and Documents",
    titleBangla: "প্যাটার্ন ছবি ও নথি",
    english:
      "Users may upload only pattern images, documents and production information that they own or are authorised to use. Users must not upload confidential or copyrighted materials without permission.",
    bangla:
      "ব্যবহারকারী শুধুমাত্র নিজস্ব অথবা ব্যবহারের অনুমতিপ্রাপ্ত প্যাটার্ন ছবি, নথি এবং উৎপাদন তথ্য আপলোড করবেন। অনুমতি ছাড়া গোপনীয় বা কপিরাইটযুক্ত উপকরণ আপলোড করা যাবে না।",
  },
  {
    number: "06",
    title: "Factory Validation",
    titleBangla: "কারখানার যাচাই",
    english:
      "AI-generated marker plans, consumption estimates and cutting recommendations should be reviewed by a qualified Cutting Master, Cutting Supervisor, Industrial Engineer or authorised Production Manager before bulk cutting begins.",
    bangla:
      "বাল্ক কাটিং শুরু করার আগে AI দ্বারা তৈরি মার্কার পরিকল্পনা, কাপড়ের ব্যবহার অনুমান এবং কাটিং পরামর্শ একজন যোগ্য Cutting Master, Cutting Supervisor, Industrial Engineer অথবা অনুমোদিত Production Manager দ্বারা যাচাই করতে হবে।",
  },
  {
    number: "07",
    title: "Pilot and Demonstration Results",
    titleBangla: "পাইলট ও প্রদর্শনী ফলাফল",
    english:
      "Results generated in demonstration or pilot mode may use sample information. These results are intended for evaluation and training and must not automatically be treated as approved production instructions.",
    bangla:
      "ডেমো বা পাইলট মোডে তৈরি ফলাফলে নমুনা তথ্য ব্যবহার করা হতে পারে। এসব ফলাফল মূল্যায়ন ও প্রশিক্ষণের জন্য এবং স্বয়ংক্রিয়ভাবে অনুমোদিত উৎপাদন নির্দেশনা হিসেবে ব্যবহার করা যাবে না।",
  },
  {
    number: "08",
    title: "Subscription and Access",
    titleBangla: "সাবস্ক্রিপশন ও প্রবেশাধিকার",
    english:
      "Some features may be provided through a free trial, pilot programme, paid subscription or commercial licence. Feature availability, trial periods and subscription charges may vary by release, country or customer agreement.",
    bangla:
      "কিছু ফিচার বিনামূল্যের ট্রায়াল, পাইলট কার্যক্রম, পেইড সাবস্ক্রিপশন অথবা বাণিজ্যিক লাইসেন্সের মাধ্যমে প্রদান করা হতে পারে। রিলিজ, দেশ অথবা গ্রাহক চুক্তি অনুযায়ী ফিচার, ট্রায়ালের সময় এবং মূল্য পরিবর্তিত হতে পারে।",
  },
  {
    number: "09",
    title: "Permitted Use",
    titleBangla: "অনুমোদিত ব্যবহার",
    english:
      "The application may be used for lawful garment engineering, cutting-room planning, training, productivity improvement and authorised factory operations.",
    bangla:
      "অ্যাপ্লিকেশনটি বৈধ গার্মেন্টস ইঞ্জিনিয়ারিং, কাটিং রুম পরিকল্পনা, প্রশিক্ষণ, উৎপাদনশীলতা উন্নয়ন এবং অনুমোদিত কারখানা পরিচালনার কাজে ব্যবহার করা যাবে।",
  },
  {
    number: "10",
    title: "Prohibited Use",
    titleBangla: "নিষিদ্ধ ব্যবহার",
    english:
      "Users must not attempt to damage the application, bypass access controls, copy protected software, interfere with other users, upload malicious files or use the system for unlawful activities.",
    bangla:
      "অ্যাপ্লিকেশনের ক্ষতি করা, প্রবেশ নিয়ন্ত্রণ এড়িয়ে যাওয়া, সুরক্ষিত সফটওয়্যার নকল করা, অন্য ব্যবহারকারীর কাজে বাধা দেওয়া, ক্ষতিকর ফাইল আপলোড করা অথবা অবৈধ কাজে সিস্টেম ব্যবহার করা নিষিদ্ধ।",
  },
  {
    number: "11",
    title: "Intellectual Property",
    titleBangla: "মেধাস্বত্ব",
    english:
      "The OptiFabric AI name, application design, engineering workflow, software components, written guidance and original content remain protected intellectual property unless otherwise stated.",
    bangla:
      "OptiFabric AI নাম, অ্যাপ্লিকেশন ডিজাইন, ইঞ্জিনিয়ারিং কর্মপ্রবাহ, সফটওয়্যার কম্পোনেন্ট, লিখিত নির্দেশনা এবং মৌলিক কনটেন্ট অন্যথায় উল্লেখ না থাকলে সুরক্ষিত মেধাস্বত্ব হিসেবে বিবেচিত হবে।",
  },
  {
    number: "12",
    title: "Customer Data Ownership",
    titleBangla: "গ্রাহকের তথ্যের মালিকানা",
    english:
      "Pattern files, production information and factory-specific data supplied by a customer remain the property of that customer, subject to the applicable service agreement.",
    bangla:
      "গ্রাহকের দেওয়া প্যাটার্ন ফাইল, উৎপাদন তথ্য এবং কারখানাভিত্তিক তথ্য প্রযোজ্য সেবা চুক্তির অধীনে সংশ্লিষ্ট গ্রাহকের সম্পত্তি হিসেবে থাকবে।",
  },
  {
    number: "13",
    title: "Service Availability",
    titleBangla: "সেবার প্রাপ্যতা",
    english:
      "We aim to keep the application available and reliable, but uninterrupted access cannot always be guaranteed. Maintenance, internet failure, hosting failure or software updates may temporarily affect availability.",
    bangla:
      "অ্যাপ্লিকেশনটি নির্ভরযোগ্য ও সচল রাখার চেষ্টা করা হবে, তবে নিরবচ্ছিন্ন প্রবেশাধিকার সবসময় নিশ্চিত করা সম্ভব নয়। রক্ষণাবেক্ষণ, ইন্টারনেট সমস্যা, হোস্টিং সমস্যা অথবা সফটওয়্যার আপডেটের কারণে সাময়িকভাবে সেবা ব্যাহত হতে পারে।",
  },
  {
    number: "14",
    title: "Limitation of Liability",
    titleBangla: "দায়বদ্ধতার সীমা",
    english:
      "To the extent permitted by applicable law, OptiFabric AI and its operators will not be responsible for production loss, fabric loss, delayed shipment, rejected cutting, business interruption or indirect loss resulting from incorrect information, unauthorised use or failure to validate recommendations.",
    bangla:
      "প্রযোজ্য আইন যতটুকু অনুমোদন করে, ভুল তথ্য, অননুমোদিত ব্যবহার অথবা AI পরামর্শ যাচাই না করার কারণে উৎপাদন ক্ষতি, কাপড়ের ক্ষতি, শিপমেন্ট বিলম্ব, কাটিং বাতিল, ব্যবসায়িক বিঘ্ন অথবা পরোক্ষ ক্ষতির জন্য OptiFabric AI ও এর পরিচালনাকারীরা দায়ী থাকবে না।",
  },
  {
    number: "15",
    title: "Suspension or Termination",
    titleBangla: "প্রবেশাধিকার স্থগিত বা বাতিল",
    english:
      "Access may be suspended or terminated when a user violates these terms, creates a security risk, misuses the application or fails to meet an applicable subscription or licence requirement.",
    bangla:
      "ব্যবহারকারী শর্তাবলি লঙ্ঘন করলে, নিরাপত্তা ঝুঁকি সৃষ্টি করলে, অ্যাপ্লিকেশনের অপব্যবহার করলে অথবা প্রযোজ্য সাবস্ক্রিপশন বা লাইসেন্সের শর্ত পূরণ না করলে প্রবেশাধিকার স্থগিত বা বাতিল করা হতে পারে।",
  },
  {
    number: "16",
    title: "Changes to These Terms",
    titleBangla: "শর্তাবলির পরিবর্তন",
    english:
      "These Terms and Conditions may be updated to reflect new features, commercial arrangements, security requirements or legal obligations. The latest published version will apply.",
    bangla:
      "নতুন ফিচার, বাণিজ্যিক ব্যবস্থা, নিরাপত্তা প্রয়োজন অথবা আইনি বাধ্যবাধকতা অনুযায়ী এই শর্তাবলি হালনাগাদ করা হতে পারে। সর্বশেষ প্রকাশিত সংস্করণ কার্যকর হবে।",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-gradient-to-r from-cyan-950 via-slate-950 to-blue-950">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
              OptiFabric AI
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
              RC1 Commercial Release
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
            Terms &amp; Conditions
          </h1>

          <h2 className="mt-3 text-2xl font-bold text-cyan-300">
            ব্যবহারের শর্তাবলি
          </h2>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            These terms explain how OptiFabric AI may be used as an AI Digital
            Cutting Master and Engineering Assistant.
          </p>

          <p className="mt-3 max-w-4xl leading-8 text-slate-400">
            এই শর্তাবলিতে AI Digital Cutting Master ও Engineering Assistant
            হিসেবে OptiFabric AI ব্যবহারের নিয়ম ব্যাখ্যা করা হয়েছে।
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <InformationCard
              label="Product"
              value="OptiFabric AI"
              bangla="বাণিজ্যিক কাটিং সহায়ক অ্যাপ"
            />

            <InformationCard
              label="Release"
              value="RC1"
              bangla="Release Candidate 1"
            />

            <InformationCard
              label="Last Updated"
              value="12 July 2026"
              bangla="১২ জুলাই ২০২৬"
            />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 rounded-3xl border border-amber-400/30 bg-amber-950/20 p-6">
          <p className="font-bold text-amber-300">
            Important Engineering Notice
          </p>

          <p className="mt-3 leading-7 text-slate-300">
            OptiFabric AI supports engineering decisions but does not replace
            factory authorisation, physical pattern checking, trial cutting or
            professional production control.
          </p>

          <p className="mt-3 leading-7 text-slate-400">
            OptiFabric AI ইঞ্জিনিয়ারিং সিদ্ধান্তে সহায়তা করে, তবে কারখানার
            অনুমোদন, বাস্তব প্যাটার্ন যাচাই, ট্রায়াল কাটিং অথবা পেশাদার উৎপাদন
            নিয়ন্ত্রণের বিকল্প নয়।
          </p>
        </div>

        <div className="space-y-6">
          {termsSections.map((section) => (
            <TermsSection key={section.number} {...section} />
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-cyan-400/30 bg-cyan-950/20 p-7">
          <h2 className="text-2xl font-black text-cyan-300">
            User Confirmation
          </h2>

          <h3 className="mt-2 text-xl font-bold text-white">
            ব্যবহারকারীর সম্মতি
          </h3>

          <p className="mt-5 leading-8 text-slate-300">
            By continuing to use OptiFabric AI, the user confirms that these
            terms have been read and understood and that AI-generated
            recommendations will be reviewed before production use.
          </p>

          <p className="mt-4 leading-8 text-slate-400">
            OptiFabric AI ব্যবহার অব্যাহত রাখার মাধ্যমে ব্যবহারকারী নিশ্চিত
            করছেন যে তিনি শর্তাবলি পড়েছেন ও বুঝেছেন এবং উৎপাদনে ব্যবহারের আগে
            AI দ্বারা তৈরি পরামর্শ যাচাই করবেন।
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/optifabric"
            className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-black text-slate-950 transition hover:bg-cyan-300"
          >
            Return to OptiFabric
          </Link>

          <Link
            href="/optifabric/privacy-policy"
            className="rounded-2xl border border-slate-700 bg-slate-900 px-6 py-4 text-center font-bold text-white transition hover:border-cyan-400 hover:text-cyan-300"
          >
            Read Privacy Policy
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-10 text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-bold text-white">OptiFabric AI</p>

            <p className="mt-1 text-sm">
              AI Digital Cutting Master &amp; Engineering Assistant
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm">
            <Link
              href="/optifabric"
              className="transition hover:text-cyan-300"
            >
              Home
            </Link>

            <Link
              href="/optifabric/about"
              className="transition hover:text-cyan-300"
            >
              About
            </Link>

            <Link
              href="/optifabric/privacy-policy"
              className="transition hover:text-cyan-300"
            >
              Privacy Policy
            </Link>
          </div>

          <p className="text-sm">© 2026 OptiFabric AI</p>
        </div>
      </footer>
    </main>
  );
}

function TermsSection({
  number,
  title,
  titleBangla,
  english,
  bangla,
}: TermsSectionProps) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/10 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-lg font-black text-cyan-300">
          {number}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-black text-white">{title}</h2>

          <h3 className="mt-1 text-lg font-bold text-cyan-300">
            {titleBangla}
          </h3>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                English
              </p>

              <p className="mt-3 leading-8 text-slate-300">{english}</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                বাংলা
              </p>

              <p className="mt-3 leading-8 text-slate-300">{bangla}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

type InformationCardProps = {
  label: string;
  value: string;
  bangla: string;
};

function InformationCard({
  label,
  value,
  bangla,
}: InformationCardProps) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
        {label}
      </p>

      <p className="mt-2 text-lg font-black text-white">{value}</p>

      <p className="mt-1 text-sm text-slate-400">{bangla}</p>
    </div>
  );
}