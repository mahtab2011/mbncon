"use client";

export default function ManufacturingProductivityPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">

      {/* HERO SECTION */}
      <section className="bg-linear-to-r from-blue-900 via-indigo-800 to-red-700 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-yellow-300">
            Manufacturing Productivity System
          </p>

          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight">
            Practical Operational Excellence &
            Productivity Transformation
          </h1>

          <p className="mt-8 max-w-4xl text-xl leading-relaxed text-white/90">
            A practical business transformation framework focused on
            measurable productivity improvement, operational discipline,
            employee engagement, bottleneck reduction, workflow visibility,
            waste reduction, and sustainable continuous improvement.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/contact"
              className="rounded-xl bg-white px-8 py-4 font-bold text-blue-900 shadow-lg"
            >
              Request Consultation
            </a>

            <a
              href="#framework"
              className="rounded-xl border border-white px-8 py-4 font-bold text-white"
            >
              Explore Framework
            </a>
          </div>
        </div>
      </section>
      {/* OPERATIONAL DIAGNOSIS */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-red-600">
              Operational Diagnosis Framework
            </p>

            <h2 className="text-4xl font-extrabold text-slate-900">
              Identify The Right Problems Before Solving Them
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-700">
              Sustainable productivity improvement begins with identifying
              operational bottlenecks, hidden waste, workflow breakdowns,
              quality losses, training gaps, communication barriers, and
              process inefficiencies through structured operational analysis.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
              "Problem Definition & KPI Baseline",
              "Historical Data Analysis",
              "Operational Workflow Mapping",
              "Value Stream Mapping",
              "Activity Sampling",
              "Pareto Analysis",
              "Fishbone Root Cause Analysis",
              "Bottleneck Identification",
              "Quality Rejection Analysis",
              "Employee & Supervisor Interviews",
              "Productivity Measurement",
              "Operational Observation",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-slate-900">
                  {item}
                </h3>

                <p className="mt-4 text-slate-700">
                  Structured operational analysis designed to identify
                  measurable improvement opportunities and practical
                  transformation priorities.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* INTRODUCTION */}
      <section
        id="framework"
        className="px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">

          <h2 className="text-4xl font-extrabold text-violet-900">
            People-Centred Productivity Transformation
          </h2>

          <p className="mt-8 max-w-5xl text-xl leading-relaxed text-violet-900">
            Sustainable productivity improvement begins with leadership
            commitment, employee involvement, operational visibility,
            measurable objectives, and continuous improvement culture.
            This system combines operational excellence methodology with
            practical productivity software concepts for manufacturing
            environments.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-red-200 bg-red-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-red-950">
                Leadership Commitment
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-red-950">
                Productivity improvement begins with top management
                commitment, operational discipline, measurable objectives,
                and leadership mobilisation across departments.
              </p>
            </div>

            <div className="rounded-3xl border border-blue-200 bg-blue-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-blue-950">
                Employee Involvement
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-blue-950">
                Employees participate through teamwork, empowerment,
                operational suggestions, small improvements, ownership,
                accountability, and continuous engagement.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-emerald-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-emerald-950">
                Continuous Improvement
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-emerald-950">
                Improvement is sustained through measurable controls,
                operational reviews, KPI visibility, standardisation,
                training, and continuous improvement culture.
              </p>
            </div>

          </div>
        </div>
      </section>
      {/* CONTINUOUS IMPROVEMENT FLOW */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
              Continuous Improvement Methodology
            </p>

            <h2 className="text-4xl font-extrabold text-slate-900">
              Structured Productivity Transformation Flow
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-700">
              Sustainable operational excellence is achieved through a
              structured improvement framework involving leadership,
              employees, operational analysis, measurable interventions,
              workflow optimisation, and continuous improvement culture.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            <div className="rounded-3xl border border-red-200 bg-red-100 p-8 shadow-sm">
              <div className="mb-5 text-5xl font-extrabold text-red-700">
                1
              </div>

              <h3 className="text-2xl font-extrabold text-red-950">
                Define
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-red-950">
                Define the operational problem, identify stakeholders,
                establish management commitment, involve employees,
                and create measurable productivity objectives.
              </p>
            </div>

            <div className="rounded-3xl border border-orange-200 bg-orange-100 p-8 shadow-sm">
              <div className="mb-5 text-5xl font-extrabold text-orange-700">
                2
              </div>

              <h3 className="text-2xl font-extrabold text-orange-950">
                Measure
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-orange-950">
                Measure workflow performance using operational data,
                rejection analysis, wastage tracking, productivity
                measurement, downtime analysis, and KPI visibility.
              </p>
            </div>

            <div className="rounded-3xl border border-blue-200 bg-blue-100 p-8 shadow-sm">
              <div className="mb-5 text-5xl font-extrabold text-blue-700">
                3
              </div>

              <h3 className="text-2xl font-extrabold text-blue-950">
                Analyse
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-blue-950">
                Analyse bottlenecks, workflow breakdowns, operational
                inefficiencies, root causes, communication gaps,
                training needs, and hidden operational waste.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-emerald-100 p-8 shadow-sm">
              <div className="mb-5 text-5xl font-extrabold text-emerald-700">
                4
              </div>

              <h3 className="text-2xl font-extrabold text-emerald-950">
                Improve
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-emerald-950">
                Implement practical improvements through teamwork,
                staff training, workflow redesign, machine upgrades,
                bottleneck reduction, Kaizen activities, and pilot projects.
              </p>
            </div>

            <div className="rounded-3xl border border-violet-200 bg-violet-100 p-8 shadow-sm">
              <div className="mb-5 text-5xl font-extrabold text-violet-700">
                5
              </div>

              <h3 className="text-2xl font-extrabold text-violet-950">
                Control
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-violet-950">
                Control operational gains through KPI tracking,
                operational reviews, accountability systems,
                standardisation, reporting visibility,
                and management discipline.
              </p>
            </div>

            <div className="rounded-3xl border border-pink-200 bg-pink-100 p-8 shadow-sm">
              <div className="mb-5 text-5xl font-extrabold text-pink-700">
                6
              </div>

              <h3 className="text-2xl font-extrabold text-pink-950">
                Sustain
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-pink-950">
                Sustain long-term productivity improvement through
                continuous improvement culture, leadership coaching,
                employee empowerment, operational learning,
                and organisational discipline.
              </p>
            </div>

          </div>
        </div>
      </section>
            {/* HUMAN PERFORMANCE & COACHING */}
      <section className="bg-linear-to-r from-violet-50 via-blue-50 to-emerald-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-violet-700">
              Human Performance & Coaching Framework
            </p>

            <h2 className="text-4xl font-extrabold text-violet-950">
              Improve People Performance by Reducing Interference
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-violet-900">
              Productivity is not only a machine, process, or dashboard issue.
              It is also affected by focus, confidence, fear, communication,
              leadership behaviour, training quality, and employee involvement.
              This framework supports managers and staff through coaching,
              problem-solving, teamwork, and practical performance improvement.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-yellow-200 bg-yellow-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-yellow-950">
                Inner Game Focus
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-yellow-950">
                Helps staff and managers reduce fear, confusion, distraction,
                poor confidence, and internal interference so that their real
                potential can be converted into better operational performance.
              </p>
            </div>

            <div className="rounded-3xl border border-blue-200 bg-blue-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-blue-950">
                GROW Coaching Model
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-blue-950">
                Uses Goal, Reality, Options, and Way Forward to guide
                supervisors, managers, and teams through practical improvement
                conversations and measurable action plans.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-emerald-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-emerald-950">
                Empowered Team Culture
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-emerald-950">
                Encourages employee suggestions, small decisions, teamwork,
                ownership, accountability, and continuous improvement through
                respectful leadership and practical shop-floor involvement.
              </p>
            </div>
          </div>

          <div className="mt-14 rounded-3xl bg-white p-8 shadow-md">
            <h3 className="text-3xl font-extrabold text-slate-900">
              Layered Problem-Solving Workflow
            </h3>

            <p className="mt-5 max-w-5xl text-lg leading-relaxed text-slate-700">
              The system can help managers expand a main problem into secondary
              and tertiary problems through brainstorming. Solutions are then
              developed from the deepest practical causes upward, narrowed into
              the best three improvement options, and selected for pilot
              testing, measurement, control, and sustainability.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {[
                "Main Problem",
                "Secondary Problems",
                "Tertiary Problems",
                "Top 3 Solutions",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-violet-200 bg-violet-50 p-5 text-center font-extrabold text-violet-950"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* OPERATIONAL INTELLIGENCE TOOLKIT */}
      <section className="bg-slate-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
              Operational Intelligence Toolkit
            </p>

            <h2 className="text-4xl font-extrabold">
              Practical Productivity Analysis & Decision Support
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-slate-300">
              The system combines operational analysis, productivity
              engineering, workflow visibility, practical analytics,
              and management decision support to identify measurable
              improvement opportunities.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {[
              {
                title: "Activity Sampling",
                color: "bg-cyan-500",
              },
              {
                title: "Value Stream Mapping",
                color: "bg-blue-500",
              },
              {
                title: "Bottleneck Analysis",
                color: "bg-red-500",
              },
              {
                title: "Workflow Visibility",
                color: "bg-violet-500",
              },
              {
                title: "Downtime Tracking",
                color: "bg-orange-500",
              },
              {
                title: "Rejection Analysis",
                color: "bg-pink-500",
              },
              {
                title: "Wastage Measurement",
                color: "bg-emerald-500",
              },
              {
                title: "Operational KPI Dashboard",
                color: "bg-yellow-500",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl bg-slate-800 p-7 shadow-lg"
              >
                <div
                  className={`mb-5 h-4 w-24 rounded-full ${item.color}`}
                />

                <h3 className="text-2xl font-extrabold">
                  {item.title}
                </h3>

                <p className="mt-5 text-lg leading-relaxed text-slate-300">
                  Structured operational intelligence tools designed
                  to identify measurable productivity opportunities,
                  hidden operational losses, and workflow inefficiencies.
                </p>
              </div>
            ))}

          </div>

          <div className="mt-16 rounded-3xl border border-slate-700 bg-slate-800 p-8">
            <h3 className="text-3xl font-extrabold text-cyan-300">
              AI-Guided Operational Visibility
            </h3>

            <p className="mt-6 text-xl leading-relaxed text-slate-300">
              Future versions of the system can include AI-assisted
              operational analysis, multilingual reporting,
              productivity forecasting, workflow alerts,
              operational coaching prompts, dashboard visibility,
              and practical management decision support for
              factories, warehouses, retail operations,
              and service organisations.
            </p>
          </div>

        </div>
      </section>
            {/* REAL CASE STUDY */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-red-700">
              Real Transformation Experience
            </p>

            <h2 className="text-4xl font-extrabold text-slate-900">
              Practical Manufacturing Improvement Based on Real Factory Work
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-slate-700">
              This productivity framework is informed by real industrial
              improvement work involving quality problems, rejection analysis,
              productivity gaps, employee training, pilot projects, bottleneck
              identification, and measurable business impact.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-red-200 bg-red-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-red-950">
                Quality Challenge
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-red-950">
                High rejection levels were analysed through structured data
                collection, quality checks, operational observation, and root
                cause analysis.
              </p>
            </div>

            <div className="rounded-3xl border border-blue-200 bg-blue-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-blue-950">
                Productivity Gap
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-blue-950">
                Actual production performance was compared against rated
                capacity to identify hidden productivity losses and operational
                constraints.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-emerald-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-emerald-950">
                Pilot Improvement
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-emerald-950">
                Pilot projects were used to test training, skill development,
                workflow changes, and quality improvement before wider rollout.
              </p>
            </div>

            <div className="rounded-3xl border border-violet-200 bg-violet-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-violet-950">
                Sustainable Control
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-violet-950">
                Improvement was supported through training systems, control
                metrics, team involvement, skill certification, and management
                review discipline.
              </p>
            </div>
          </div>

          <div className="mt-14 rounded-3xl bg-linear-to-r from-blue-900 via-violet-800 to-red-700 p-8 text-white shadow-lg">
            <h3 className="text-3xl font-extrabold">
              Case Study Highlights
            </h3>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-6">
                <p className="text-4xl font-extrabold text-yellow-300">
                  8.5%
                </p>
                <p className="mt-3 text-lg text-white/90">
                  baseline rejection level identified through operational data.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6">
                <p className="text-4xl font-extrabold text-yellow-300">
                  20%
                </p>
                <p className="mt-3 text-lg text-white/90">
                  productivity improvement target built into the transformation
                  plan.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6">
                <p className="text-4xl font-extrabold text-yellow-300">
                  $859k+
                </p>
                <p className="mt-3 text-lg text-white/90">
                  estimated annual savings opportunity for one production line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
       {/* MANUFACTURING MODULES */}
      <section className="bg-linear-to-r from-slate-50 via-blue-50 to-violet-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
              Manufacturing Modules
            </p>

            <h2 className="text-4xl font-extrabold text-slate-900">
              Practical Productivity Software Components
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-slate-700">
              The Manufacturing Productivity System can be developed using
              practical operational modules designed to support workflow
              visibility, productivity analysis, quality improvement,
              operational control, coaching, and continuous improvement.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {[
              {
                title: "Production KPI Dashboard",
                color: "bg-blue-100 border-blue-300 text-blue-950",
              },
              {
                title: "Operator Productivity Tracking",
                color: "bg-red-100 border-red-300 text-red-950",
              },
              {
                title: "Quality Rejection Monitoring",
                color: "bg-pink-100 border-pink-300 text-pink-950",
              },
              {
                title: "Machine Downtime Analysis",
                color: "bg-orange-100 border-orange-300 text-orange-950",
              },
              {
                title: "Bottleneck Management",
                color: "bg-violet-100 border-violet-300 text-violet-950",
              },
              {
                title: "Kaizen & Suggestion System",
                color: "bg-emerald-100 border-emerald-300 text-emerald-950",
              },
              {
                title: "Skill Matrix & Training Tracker",
                color: "bg-cyan-100 border-cyan-300 text-cyan-950",
              },
              {
                title: "Operational Audit System",
                color: "bg-yellow-100 border-yellow-300 text-yellow-950",
              },
              {
                title: "Continuous Improvement Tracker",
                color: "bg-indigo-100 border-indigo-300 text-indigo-950",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-3xl border p-8 shadow-md ${item.color}`}
              >
                <h3 className="text-2xl font-extrabold">
                  {item.title}
                </h3>

                <p className="mt-5 text-lg leading-relaxed">
                  Practical operational software support designed for
                  measurable productivity improvement, workflow visibility,
                  accountability, training support, and continuous
                  operational excellence.
                </p>
              </div>
            ))}

          </div>

          <div className="mt-16 rounded-3xl bg-slate-900 p-8 text-white shadow-lg">
            <h3 className="text-3xl font-extrabold text-cyan-300">
              Future Enterprise Expansion
            </h3>

            <p className="mt-6 text-xl leading-relaxed text-slate-300">
              Future versions can support multilingual operations,
              AI-guided analysis, voice-assisted workflows,
              mobile shop-floor reporting, operational forecasting,
              management coaching prompts, and university-level
              operational learning simulations.
            </p>
          </div>

        </div>
      </section>
       {/* PRODUCTIVITY TRANSFORMATION WORKFLOW */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
              Productivity Transformation Workflow
            </p>

            <h2 className="text-4xl font-extrabold text-slate-900">
              Structured Operational Improvement Journey
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-slate-700">
              The system follows a structured transformation journey
              combining operational analysis, leadership involvement,
              employee participation, measurable interventions,
              pilot improvements, and sustainable operational control.
            </p>
          </div>

          <div className="mt-16 space-y-8">

            {[
              {
                step: "01",
                title: "Management Commitment & Goal Setting",
                color: "border-red-300 bg-red-100 text-red-950",
              },
              {
                step: "02",
                title: "Operational Diagnosis & Data Collection",
                color: "border-orange-300 bg-orange-100 text-orange-950",
              },
              {
                step: "03",
                title: "Root Cause & Bottleneck Analysis",
                color: "border-blue-300 bg-blue-100 text-blue-950",
              },
              {
                step: "04",
                title: "Team Brainstorming & Coaching",
                color: "border-violet-300 bg-violet-100 text-violet-950",
              },
              {
                step: "05",
                title: "Pilot Improvement Projects",
                color: "border-emerald-300 bg-emerald-100 text-emerald-950",
              },
              {
                step: "06",
                title: "Measurement & KPI Verification",
                color: "border-cyan-300 bg-cyan-100 text-cyan-950",
              },
              {
                step: "07",
                title: "Operational Control & Standardisation",
                color: "border-yellow-300 bg-yellow-100 text-yellow-950",
              },
              {
                step: "08",
                title: "Continuous Improvement Culture",
                color: "border-pink-300 bg-pink-100 text-pink-950",
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`rounded-3xl border p-8 shadow-md ${item.color}`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="text-5xl font-extrabold opacity-80">
                    {item.step}
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-lg leading-relaxed">
                      Structured operational improvement supported by
                      measurable workflows, leadership engagement,
                      teamwork, coaching, productivity analysis,
                      accountability, and sustainability.
                    </p>
                  </div>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>
            {/* AI PRODUCTIVITY ASSISTANT */}
      <section className="bg-linear-to-r from-indigo-950 via-violet-900 to-blue-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-yellow-300">
              AI Productivity Assistant
            </p>

            <h2 className="text-4xl font-extrabold">
              AI-Guided Support for Managers, Supervisors, and Improvement Teams
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-white/85">
              The future version of this system can support managers with
              practical AI-guided prompts, productivity observations,
              bottleneck alerts, improvement suggestions, coaching questions,
              multilingual reporting, and decision support.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              "Ask AI to explain productivity loss",
              "Generate improvement ideas",
              "Summarise daily operational issues",
              "Suggest coaching questions",
              "Translate reports into local languages",
              "Prepare management action plans",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/20 bg-white/10 p-7 shadow-lg"
              >
                <h3 className="text-xl font-extrabold text-yellow-300">
                  {item}
                </h3>

                <p className="mt-4 leading-relaxed text-white/80">
                  AI-assisted guidance designed to support practical
                  operational thinking, not replace management judgement.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
       {/* GLOBAL & UNIVERSITY COLLABORATION */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-5xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
              Global Manufacturing & Learning Vision
            </p>

            <h2 className="text-4xl font-extrabold text-slate-900">
              Practical Productivity Systems for Industry & Education
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-slate-700">
              The long-term vision of this platform is to support factories,
              SMEs, universities, training institutes, and operational teams
              through practical productivity systems, multilingual operational
              learning, AI-guided coaching, and continuous improvement
              methodology.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-3xl border border-blue-200 bg-blue-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-blue-950">
                Multilingual Operations
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-blue-950">
                Future versions can support English, Bangla, Hindi, Urdu,
                Tamil, Telugu, Kannada, Malayalam, Arabic, Spanish,
                Portuguese, French, Chinese, Swahili, and other languages.
              </p>
            </div>

            <div className="rounded-3xl border border-red-200 bg-red-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-red-950">
                Manufacturing Regions
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-red-950">
                Designed for practical use in South Asia, the Middle East,
                Africa, Southeast Asia, Latin America, and other emerging
                manufacturing regions.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-emerald-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-emerald-950">
                University Collaboration
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-emerald-950">
                The platform may support Industrial Engineering, Production
                Management, Business Management, Operational Excellence,
                and Continuous Improvement learning environments.
              </p>
            </div>

            <div className="rounded-3xl border border-violet-200 bg-violet-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-violet-950">
                AI-Guided Learning
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-violet-950">
                Future learning modules may include multilingual coaching,
                operational simulations, workflow training, productivity
                analytics, leadership exercises, and improvement case studies.
              </p>
            </div>

          </div>

          <div className="mt-16 rounded-3xl bg-linear-to-r from-blue-900 via-violet-800 to-red-700 p-8 text-white shadow-lg">
            <h3 className="text-3xl font-extrabold">
              Long-Term Vision
            </h3>

            <p className="mt-6 text-xl leading-relaxed text-white/90">
              To develop practical, affordable, multilingual operational
              productivity systems that help organisations improve efficiency,
              reduce waste, strengthen teamwork, improve leadership visibility,
              and support sustainable continuous improvement culture across
              manufacturing and service industries.
            </p>
          </div>

        </div>
      </section>
          {/* CONSULTATION CTA */}
      <section className="bg-linear-to-r from-emerald-700 via-blue-800 to-violet-900 px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl text-center">

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Productivity Transformation Partnership
          </p>

          <h2 className="text-5xl font-extrabold leading-tight">
            Start Building A More Productive Organisation
          </h2>

          <p className="mx-auto mt-8 max-w-4xl text-2xl leading-relaxed text-white/90">
            Explore practical operational excellence, measurable productivity
            improvement, workflow visibility, employee engagement,
            AI-guided operational support, and sustainable continuous
            improvement systems tailored to your organisation.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <a
              href="/contact"
              className="rounded-2xl bg-white px-8 py-5 text-lg font-extrabold text-blue-900 shadow-xl transition hover:scale-105"
            >
              Request Consultation
            </a>

            <a
              href="/services"
              className="rounded-2xl border-2 border-white px-8 py-5 text-lg font-extrabold text-white transition hover:bg-white hover:text-blue-900"
            >
              Explore Services
            </a>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
              <h3 className="text-3xl font-extrabold text-yellow-300">
                20%
              </h3>

              <p className="mt-4 text-lg text-white/90">
                target productivity improvement philosophy built into the
                transformation framework.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
              <h3 className="text-3xl font-extrabold text-yellow-300">
                AI + Human
              </h3>

              <p className="mt-4 text-lg text-white/90">
                practical combination of operational analytics,
                coaching, leadership, and AI-guided support.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
              <h3 className="text-3xl font-extrabold text-yellow-300">
                Global Vision
              </h3>

              <p className="mt-4 text-lg text-white/90">
                multilingual productivity systems for manufacturing,
                logistics, retail, hospitality, and service industries.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}