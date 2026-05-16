export default function EmployeeEmpowermentIntelligencePage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white to-orange-50 text-gray-800">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-4xl">
          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
            MBNCON Workforce Excellence Systems
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight">
            Employee Empowerment Intelligence System
          </h1>

          <p className="mt-6 text-xl leading-9 text-gray-600">
            Sustainable organizational excellence is impossible without empowered
            people. This system helps organizations create responsible,
            skilled, confident, and accountable teams capable of solving
            operational problems, improving productivity, reducing waste,
            and strengthening long-term business performance.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-orange-700">
              Why Employee Empowerment Matters
            </h2>

            <ul className="mt-6 space-y-4 text-lg leading-8 text-gray-700">
              <li>• Faster problem solving on the shop floor</li>
              <li>• Increased employee confidence and ownership</li>
              <li>• Higher productivity and efficiency</li>
              <li>• Better customer service quality</li>
              <li>• Reduced operational delays</li>
              <li>• Stronger teamwork and collaboration</li>
              <li>• Greater innovation and idea generation</li>
              <li>• Reduced dependence on top management</li>
              <li>• Improved morale and employee retention</li>
              <li>• Stronger adaptability during organizational change</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-orange-700">
              Key Foundations of Empowerment
            </h2>

            <ul className="mt-6 space-y-4 text-lg leading-8 text-gray-700">
              <li>• Trust-based leadership culture</li>
              <li>• Clear communication systems</li>
              <li>• Role clarity and accountability</li>
              <li>• Continuous learning opportunities</li>
              <li>• Access to information and tools</li>
              <li>• Respectful workplace environment</li>
              <li>• Recognition and appreciation systems</li>
              <li>• Inclusive decision-making processes</li>
              <li>• Psychological safety for sharing ideas</li>
              <li>• Leadership support during mistakes and learning</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 rounded-3xl bg-white p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-orange-700">
            Empowerment Intelligence Framework
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-orange-100 p-6">
              <h3 className="text-xl font-bold">1. Skill Empowerment</h3>

              <p className="mt-4 leading-8 text-gray-700">
                Employees receive practical training, cross-functional
                exposure, and operational knowledge so they can make
                informed decisions confidently.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100 p-6">
              <h3 className="text-xl font-bold">2. Decision Empowerment</h3>

              <p className="mt-4 leading-8 text-gray-700">
                Teams are trusted with controlled decision-making authority
                within defined operational boundaries to improve speed,
                ownership, and responsiveness.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100 p-6">
              <h3 className="text-xl font-bold">3. Improvement Empowerment</h3>

              <p className="mt-4 leading-8 text-gray-700">
                Employees actively participate in Kaizen, Lean, productivity,
                quality, and innovation initiatives to strengthen
                organizational growth.
              </p>
            </div>
          </div>
        </div>
<div className="mt-16 rounded-3xl bg-white p-10 shadow-xl">
  <h2 className="text-3xl font-bold text-orange-700">
    Respectful Behavioural Coaching
  </h2>

  <p className="mt-6 text-lg leading-8 text-gray-700">
    Empowerment grows when managers and supervisors correct behaviour without
    damaging the person. Employees learn faster when they feel respected,
    listened to, supported, and trusted to improve.
  </p>

  <div className="mt-10 grid gap-6 md:grid-cols-2">
    {[
      "Listen actively before giving advice",
      "Put yourself in the employee's position",
      "Use empathy to understand pressure and difficulty",
      "Praise employees for jobs well done",
      "Correct privately, never embarrass publicly",
      "Use positive reinforcement phrases",
      "Avoid demoralising or insulting words",
      "Focus on behaviour, not personality",
      "Give a practical solution and support",
      "Agree a follow-up date for improvement",
      "Retrain employees after mistakes",
      "Help employees learn instead of fear failure",
    ].map((item) => (
      <div
        key={item}
        className="rounded-2xl border border-orange-100 bg-orange-50 p-5 text-lg font-medium text-gray-700"
      >
        {item}
      </div>
    ))}
  </div>

  <div className="mt-10 rounded-2xl bg-orange-50 p-8">
    <h3 className="text-2xl font-bold text-orange-700">
      Positive Reinforcement Examples
    </h3>

    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <div>
        <h4 className="text-lg font-bold text-green-700">
          Better Phrases
        </h4>

        <ul className="mt-4 space-y-3 text-gray-700">
          <li>• “You handled this well before — let us improve this part.”</li>
          <li>• “I know you can do this with the right support.”</li>
          <li>• “Let us review the method together.”</li>
          <li>• “This mistake is a learning point, not a personal failure.”</li>
          <li>• “Your effort is appreciated; now let us improve the result.”</li>
        </ul>
      </div>

      <div>
        <h4 className="text-lg font-bold text-red-700">
          Avoid These Phrases
        </h4>

        <ul className="mt-4 space-y-3 text-gray-700">
          <li>• “You always make mistakes.”</li>
          <li>• “You are careless.”</li>
          <li>• “Why can’t you understand?”</li>
          <li>• “Everyone else can do it except you.”</li>
          <li>• “This is your fault.”</li>
        </ul>
      </div>
    </div>
  </div>
</div>
        <div className="mt-16 rounded-3xl bg-orange-700 p-10 text-white shadow-2xl">
          <h2 className="text-3xl font-bold">
            Adaptive Leadership & Empowerment
          </h2>

          <p className="mt-6 text-lg leading-9 text-orange-100">
            Empowerment is not simply delegation. It requires adaptive
            leadership capable of building trust, encouraging learning,
            tolerating constructive disagreement, and supporting employees
            during uncertainty and organizational change.
          </p>

          <p className="mt-6 text-lg leading-9 text-orange-100">
            Organizations often fail because employees are expected to
            perform adaptive work without sufficient involvement,
            understanding, or ownership. Sustainable transformation
            requires participation from all levels of the organization.
          </p>

          <p className="mt-6 text-lg leading-9 text-orange-100">
            MBNCON promotes empowerment cultures where employees become
            contributors to problem-solving, innovation, continuous
            improvement, and operational excellence.
          </p>
        </div>

        <div className="mt-16 rounded-3xl bg-white p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-orange-700">
            Common Organizational Barriers
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-orange-50 p-6">
              <ul className="space-y-3 text-lg leading-8 text-gray-700">
                <li>• Fear-based management culture</li>
                <li>• Micromanagement practices</li>
                <li>• Lack of trust in employees</li>
                <li>• Poor communication systems</li>
                <li>• Lack of training opportunities</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-orange-50 p-6">
              <ul className="space-y-3 text-lg leading-8 text-gray-700">
                <li>• Resistance to new ideas</li>
                <li>• Blame-oriented workplace culture</li>
                <li>• Weak recognition systems</li>
                <li>• Unclear responsibilities</li>
                <li>• Limited employee involvement</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-3xl border border-orange-200 bg-white p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-orange-700">
            MBNCON Consulting Approach
          </h2>

          <div className="mt-8 space-y-5 text-lg leading-8 text-gray-700">
            <p>
              • Workforce capability assessment and empowerment diagnostics
            </p>

            <p>
              • Leadership coaching and empowerment culture development
            </p>

            <p>
              • Employee engagement and communication systems
            </p>

            <p>
              • Lean, Kaizen, and continuous improvement integration
            </p>

            <p>
              • Problem-solving and operational ownership systems
            </p>

            <p>
              • Practical empowerment implementation frameworks
            </p>

            <p>
              • Adaptive leadership integration for organizational change
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}