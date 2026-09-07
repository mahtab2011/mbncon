// Shared "Plans & Access" section for the OptiFabric and OptiSewing public
// landing pages, reflecting MBNCON's newly approved public commercial model.
//
// Deliberately NOT placed beside /optifabric/subscription (the existing
// checkout flow, which still charges the older $29.98/2-seat pricing model —
// see subscription.service.ts). This component presents the new plan
// information as informational-only public content, with no checkout button
// of its own, and an explicit note asking visitors to confirm current
// checkout terms with MBNCON before subscribing. Reconciling the checkout
// backend to this pricing is a separate, not-yet-done remediation.

export default function ProductPlans() {
  return (
    <section className="mt-14 rounded-3xl border border-slate-800 bg-slate-900/80 p-7 shadow-lg shadow-black/10">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">
        Plans &amp; Access
      </p>

      <h2 className="mt-3 text-3xl font-black text-white">
        OptiFabric &amp; OptiSewing Commercial Terms
      </h2>

      <p className="mt-2 text-xl font-bold text-emerald-300">
        OptiFabric ও OptiSewing বাণিজ্যিক শর্তাবলি
      </p>

      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/15 p-6">
          <h3 className="text-lg font-black text-emerald-300">
            Bangladesh Garment Factories
          </h3>

          <p className="mt-3 leading-7 text-slate-300">
            Free for eligible, successfully registered Bangladesh garment
            factories — both OptiFabric and OptiSewing, available in English
            and Bangla. Factory verification on Bangladesh Apparel is a
            separate process from this MBNCON commercial entitlement.
          </p>

          <p className="mt-3 leading-7 text-slate-400">
            যোগ্য, সফলভাবে নিবন্ধিত বাংলাদেশি গার্মেন্টস কারখানার জন্য OptiFabric ও
            OptiSewing উভয়ই বিনামূল্যে — ইংরেজি ও বাংলায় উপলব্ধ। Bangladesh
            Apparel-এ কারখানা যাচাইকরণ এই MBNCON বাণিজ্যিক সুবিধা থেকে একটি পৃথক
            প্রক্রিয়া।
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/15 p-6">
          <h3 className="text-lg font-black text-cyan-300">
            International Factories
          </h3>

          <p className="mt-3 leading-7 text-slate-300">
            A 90-day free trial, then monthly plans:
          </p>

          <p className="mt-1 leading-7 text-slate-400">
            ৯০ দিনের বিনামূল্যে ট্রায়াল, এরপর মাসিক প্ল্যান:
          </p>

          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
            <li>
              <span className="font-bold text-white">OptiFabric only</span> —
              US$19.98/month
            </li>
            <li>
              <span className="font-bold text-white">OptiSewing only</span> —
              US$14.98/month
            </li>
            <li>
              <span className="font-bold text-white">
                OptiFabric + OptiSewing bundle
              </span>{" "}
              — US$29.98/month
            </li>
          </ul>

          <p className="mt-4 text-xs leading-6 text-slate-400">
            Monthly auto-renewal. Cancel any time before the next renewal
            date to prevent the next monthly charge. Available in English,
            with additional language support available upon request.
          </p>

          <p className="mt-2 text-xs leading-6 text-slate-500">
            মাসিক অটো-রিনিউয়াল। পরবর্তী মাসিক চার্জ এড়াতে পরবর্তী রিনিউয়াল তারিখের
            আগে যেকোনো সময় বাতিল করুন। ইংরেজিতে উপলব্ধ, অনুরোধের ভিত্তিতে অতিরিক্ত
            ভাষা সহায়তা পাওয়া যায়।
          </p>
        </div>
      </div>

      <p className="mt-6 max-w-4xl text-xs leading-6 text-slate-500">
        This section reflects MBNCON&apos;s current approved public plan
        information for OptiFabric and OptiSewing. It is presented for
        information purposes only — please contact MBNCON to confirm current
        checkout availability for your product combination before
        subscribing.
      </p>

      <p className="mt-2 max-w-4xl text-xs leading-6 text-slate-600">
        এই অংশটি OptiFabric ও OptiSewing-এর জন্য MBNCON-এর বর্তমান অনুমোদিত
        পাবলিক প্ল্যান তথ্য প্রতিফলিত করে। এটি শুধুমাত্র তথ্যগত উদ্দেশ্যে
        উপস্থাপিত — সাবস্ক্রাইব করার আগে আপনার প্রোডাক্ট সংমিশ্রণের জন্য বর্তমান
        চেকআউট প্রাপ্যতা নিশ্চিত করতে অনুগ্রহ করে MBNCON-এর সাথে যোগাযোগ করুন।
      </p>
    </section>
  );
}
