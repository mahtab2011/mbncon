"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function BusinessExcellenceUpdatesPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    designation: "",
    industry: "",
    email: "",
    mobile: "",
    interests: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  setSubmitting(true);
  setError("");
  setSubmitted(true);

  const submissionData = {
    ...formData,
    status: "new",
    source: "business-excellence-updates-page",
    createdAt: serverTimestamp(),
  };

  setFormData({
    fullName: "",
    companyName: "",
    designation: "",
    industry: "",
    email: "",
    mobile: "",
    interests: "",
  });

  try {
    await addDoc(
      collection(db, "businessExcellenceSubscribers"),
      submissionData
    );
  } catch (error) {
    console.error("Firebase submission error:", error);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            MBNCON Executive Intelligence Network
          </p>

          <h1 className="mt-4 text-5xl font-bold leading-tight">
            Subscribe for Business Excellence & AI Transformation Updates
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-slate-300">
            Join manufacturing leaders, operational managers, business owners
            and transformation professionals receiving future insights on AI,
            operational excellence, productivity improvement, Lean systems,
            leadership and enterprise intelligence.
          </p>
        </div>

        <section className="mt-10 rounded-3xl border border-white/10 bg-slate-900 p-10">
          {submitted ? (
            <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-8">
              <h2 className="text-3xl font-bold text-emerald-100">
                Submission Successful
              </h2>

              <p className="mt-4 text-slate-200">
                Thank you. Your submission has been received successfully. You
                can now enjoy future updates on AI in Business Excellence,
                Operations, Lean, Kaizen, TQM and Manufacturing Intelligence.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold">
                Register Your Interest
              </h2>

              {error && (
                <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2"
              >
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Full Name
                  </label>

                  <input
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Company Name
                  </label>

                  <input
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Designation
                  </label>

                  <input
                    name="designation"
                    type="text"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                    placeholder="Managing Director / CEO / Manager"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Industry
                  </label>

                  <input
                    name="industry"
                    type="text"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                    placeholder="Manufacturing / Retail / Hospitality"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Email Address
                  </label>

                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Mobile Number
                  </label>

                  <input
                    name="mobile"
                    type="text"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                    placeholder="Enter mobile number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-slate-300">
                    Areas of Interest
                  </label>

                  <textarea
                    name="interests"
                    rows={5}
                    value={formData.interests}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                    placeholder="AI transformation, productivity, Lean systems, operational excellence, leadership, manufacturing intelligence..."
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-2xl bg-cyan-400 px-8 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting
                      ? "Submitting..."
                      : "Subscribe for Updates"}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>

        <section className="mt-10 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-10">
          <h2 className="text-3xl font-bold text-cyan-100">
            Topics Covered
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "AI Transformation",
              "Manufacturing Productivity",
              "Operational Excellence",
              "Lean Management",
              "Executive Intelligence",
              "Leadership & Accountability",
              "Predictive Intelligence",
              "Business Risk Monitoring",
              "Factory Loss Intelligence",
              "Business Excellence Systems",
            ].map((topic) => (
              <div
                key={topic}
                className="rounded-2xl border border-white/10 bg-slate-950 p-4"
              >
                {topic}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}