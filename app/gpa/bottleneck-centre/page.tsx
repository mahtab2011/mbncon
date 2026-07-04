import Link from "next/link";
import AIBottleneckPanel from "@/app/components/gpa/AIBottleneckPanel";

const bottlenecks = [
  {
    area: "Sewing Line 04",
    bnArea: "সুইং লাইন ০৪",
    issue: "Output 18% below target",
    bnIssue: "টার্গেটের চেয়ে ১৮% কম উৎপাদন",
    cause: "Operator imbalance and repeated feeding delay",
    bnCause: "অপারেটর ব্যালান্স সমস্যা এবং বারবার ফিডিং বিলম্ব",
    action: "Rebalance operation sequence and assign feeding support",
    bnAction: "অপারেশন সিকোয়েন্স ব্যালান্স করুন এবং ফিডিং সাপোর্ট দিন",
    severity: "High",
  },
  {
    area: "Finishing Section",
    bnArea: "ফিনিশিং সেকশন",
    issue: "WIP accumulation increasing",
    bnIssue: "WIP জমা বাড়ছে",
    cause: "Inspection capacity lower than sewing output",
    bnCause: "সুইং আউটপুটের তুলনায় ইনস্পেকশন ক্যাপাসিটি কম",
    action: "Add temporary inspection table and hourly WIP review",
    bnAction:
      "অস্থায়ী ইনস্পেকশন টেবিল যোগ করুন এবং ঘণ্টাভিত্তিক WIP রিভিউ করুন",
    severity: "Medium",
  },
  {
    area: "Cutting Input",
    bnArea: "কাটিং ইনপুট",
    issue: "Bundle release delay",
    bnIssue: "বান্ডেল রিলিজে বিলম্ব",
    cause: "Marker approval and numbering delay",
    bnCause: "মার্কার অনুমোদন ও নাম্বারিং বিলম্ব",
    action: "Set fixed release time and pre-approval checklist",
    bnAction:
      "নির্দিষ্ট রিলিজ সময় এবং প্রি-অ্যাপ্রুভাল চেকলিস্ট চালু করুন",
    severity: "Medium",
  },
];

export default function GPABottleneckCentrePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              GPA Bottleneck Intelligence
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Bottleneck Identification & Resolution Centre
            </h1>

            <h2 className="mt-3 text-2xl font-semibold text-emerald-300">
              বটলনেক শনাক্তকরণ ও সমাধান কেন্দ্র
            </h2>

            <p className="mt-4 max-w-4xl text-slate-300">
              AI-assisted productivity control centre for identifying factory
              constraints, ranking bottlenecks, understanding root causes and
              assigning corrective actions.
            </p>

            <p className="mt-2 max-w-4xl text-slate-400">
              কারখানার উৎপাদন বাধা, লাইন ব্যালান্স সমস্যা, WIP জমা, দেরি এবং
              কম আউটপুট শনাক্ত করে দ্রুত সমাধান নির্ধারণের জন্য এই মডিউল।
            </p>
          </div>

          <Link
            href="/gpa/dashboard"
            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            Back to Dashboard
          </Link>
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Active Bottlenecks</p>
            <h2 className="mt-3 text-4xl font-bold text-red-300">3</h2>
            <p className="mt-2 text-sm text-slate-300">সক্রিয় বটলনেক</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Estimated Output Loss</p>
            <h2 className="mt-3 text-4xl font-bold text-yellow-300">18%</h2>
            <p className="mt-2 text-sm text-slate-300">
              সম্ভাব্য উৎপাদন ক্ষতি
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Priority Action</p>
            <h2 className="mt-3 text-2xl font-bold text-emerald-300">
              Line Balancing
            </h2>
            <p className="mt-2 text-sm text-slate-300">লাইন ব্যালান্সিং</p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold">
            Bottleneck List / বটলনেক তালিকা
          </h2>

          <div className="mt-6 space-y-5">
            {bottlenecks.map((item) => (
              <div
                key={item.area}
                className="rounded-2xl border border-slate-800 bg-slate-800 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {item.area}
                    </h3>
                    <p className="mt-1 text-emerald-300">{item.bnArea}</p>
                  </div>

                  <span className="rounded-full border border-red-700 bg-red-950 px-4 py-1 text-sm text-red-200">
                    {item.severity}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-900 p-4">
                    <p className="text-sm text-slate-400">Issue / সমস্যা</p>
                    <p className="mt-2 font-semibold">{item.issue}</p>
                    <p className="mt-1 text-sm text-slate-300">
                      {item.bnIssue}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-900 p-4">
                    <p className="text-sm text-slate-400">Cause / কারণ</p>
                    <p className="mt-2 font-semibold">{item.cause}</p>
                    <p className="mt-1 text-sm text-slate-300">
                      {item.bnCause}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-900 p-4">
                    <p className="text-sm text-slate-400">Action / করণীয়</p>
                    <p className="mt-2 font-semibold text-emerald-300">
                      {item.action}
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      {item.bnAction}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold">
            Resolution Logic / সমাধান পদ্ধতি
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-emerald-400">01</p>
              <h3 className="mt-2 font-semibold">Identify Constraint</h3>
              <p className="mt-2 text-sm text-slate-300">বাধা শনাক্ত করুন</p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-emerald-400">02</p>
              <h3 className="mt-2 font-semibold">Find Root Cause</h3>
              <p className="mt-2 text-sm text-slate-300">মূল কারণ বের করুন</p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-emerald-400">03</p>
              <h3 className="mt-2 font-semibold">Assign Action Owner</h3>
              <p className="mt-2 text-sm text-slate-300">
                দায়িত্বপ্রাপ্ত ব্যক্তি নির্ধারণ করুন
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-emerald-400">04</p>
              <h3 className="mt-2 font-semibold">Track Improvement</h3>
              <p className="mt-2 text-sm text-slate-300">
                উন্নতি পর্যবেক্ষণ করুন
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <AIBottleneckPanel />
        </section>
      </section>
    </main>
  );
}