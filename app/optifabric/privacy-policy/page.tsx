"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <section className="border-b border-slate-800 bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <p className="text-cyan-400 font-semibold uppercase tracking-widest">
            OptiFabric AI
          </p>

          <h1 className="mt-3 text-5xl font-black">
            Privacy Policy
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-slate-300">
            Your engineering data belongs to you.
            OptiFabric AI is designed to help garment factories
            improve cutting efficiency while protecting confidential
            production information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6 py-12 space-y-10">

        <PolicyCard
          title="1. Information We Collect"
          english="Pattern images, engineering measurements, marker information, fabric specifications, language preference and optional account information."
          bangla="প্যাটার্ন ছবি, ইঞ্জিনিয়ারিং পরিমাপ, মার্কার তথ্য, কাপড়ের তথ্য, ভাষা নির্বাচন এবং প্রয়োজন হলে অ্যাকাউন্ট তথ্য।"
        />

        <PolicyCard
          title="2. Why We Collect Information"
          english="To calculate marker efficiency, estimate fabric consumption, generate AI recommendations and improve engineering accuracy."
          bangla="মার্কার দক্ষতা, কাপড়ের ব্যবহার, AI বিশ্লেষণ এবং প্রকৌশল নির্ভুলতা উন্নত করার জন্য।"
        />

        <PolicyCard
          title="3. AI Decision Transparency"
          english="Every important AI recommendation includes an explanation describing why the information is required."
          bangla="AI প্রতিটি গুরুত্বপূর্ণ সিদ্ধান্তের সাথে ব্যাখ্যা প্রদান করে কেন তথ্যটি প্রয়োজন।"
        />

        <PolicyCard
          title="4. Factory Ownership"
          english="Factory production information always remains the property of the factory."
          bangla="কারখানার সকল উৎপাদন তথ্য সংশ্লিষ্ট কারখানার নিজস্ব সম্পত্তি।"
        />

        <PolicyCard
          title="5. Data Security"
          english="Engineering information is stored using modern cloud security technologies and encrypted communication."
          bangla="ইঞ্জিনিয়ারিং তথ্য নিরাপদ ক্লাউড প্রযুক্তি এবং এনক্রিপ্টেড যোগাযোগের মাধ্যমে সংরক্ষিত হয়।"
        />

        <PolicyCard
          title="6. No Selling of Data"
          english="OptiFabric AI never sells customer engineering information to third parties."
          bangla="OptiFabric AI কখনও গ্রাহকের প্রকৌশল তথ্য তৃতীয় পক্ষের কাছে বিক্রি করে না।"
        />

        <PolicyCard
          title="7. User Responsibilities"
          english="Users should upload only images and documents that they are authorised to use."
          bangla="ব্যবহারকারী শুধুমাত্র অনুমোদিত ছবি ও নথি আপলোড করবেন।"
        />

        <PolicyCard
          title="8. Updates"
          english="This Privacy Policy may be updated as new engineering features become available."
          bangla="নতুন ফিচার যুক্ত হলে এই নীতিমালা হালনাগাদ করা হতে পারে।"
        />

      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center text-slate-400 md:flex-row">
          <p>
            © 2026 OptiFabric AI
            <br />
            AI Digital Cutting Master & Engineering Assistant
          </p>

          <div className="flex gap-6">
            <Link
              href="/optifabric"
              className="text-cyan-400 hover:text-cyan-300"
            >
              Home
            </Link>

            <Link
              href="/optifabric/about"
              className="text-cyan-400 hover:text-cyan-300"
            >
              About
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

type PolicyCardProps = {
  title: string;
  english: string;
  bangla: string;
};

function PolicyCard({
  title,
  english,
  bangla,
}: PolicyCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-cyan-400">
        {title}
      </h2>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 font-semibold text-white">
            English
          </h3>

          <p className="leading-8 text-slate-300">
            {english}
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-white">
            বাংলা
          </h3>

          <p className="leading-8 text-slate-300">
            {bangla}
          </p>
        </div>
      </div>
    </div>
  );
}