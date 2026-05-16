export default function InnerGameOfManagementPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white to-purple-50 text-gray-900">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-4xl">
          <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
            Management Excellence • Human Performance
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight">
            Inner Game of Management
          </h1>

          <p className="mt-8 text-xl leading-9 text-gray-700">
            High-performing management begins inside the manager — with focus,
            self-awareness, confidence, listening, emotional control, coaching
            mindset, decision quality, and the ability to reduce internal
            interference while improving team performance.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {[
            {
              title: "Self-Awareness",
              desc: "Understand your own thinking, reactions, habits, and leadership style before trying to improve others.",
            },
            {
              title: "Focus & Attention",
              desc: "Develop the ability to stay present, listen deeply, observe facts, and avoid distraction during management decisions.",
            },
            {
              title: "Confidence Without Ego",
              desc: "Build calm leadership confidence while avoiding defensive behavior, blame culture, or command-and-control habits.",
            },
            {
              title: "Listening Leadership",
              desc: "Improve communication by listening to employees, customers, suppliers, and frontline realities before acting.",
            },
            {
              title: "Coaching Mindset",
              desc: "Shift from only giving instructions to developing people through questions, support, feedback, and trust.",
            },
            {
              title: "Decision Quality",
              desc: "Reduce emotional reactions and improve decisions through observation, reflection, evidence, and learning.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-purple-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold">{item.title}</h2>
              <p className="mt-4 leading-7 text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 rounded-3xl bg-white p-10 shadow-xl">
          <h2 className="text-4xl font-bold">
            From Inner Game to Management Performance
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              "reduce internal interference",
              "improve calm decision-making",
              "increase employee trust",
              "strengthen communication",
              "coach instead of control",
              "observe before judging",
              "build learning culture",
              "improve meeting quality",
              "reduce workplace conflict",
              "support psychological safety",
              "improve accountability",
              "develop future leaders",
            ].map((feature) => (
              <div
                key={feature}
                className="rounded-2xl bg-purple-50 p-5 text-lg font-medium capitalize"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl bg-gray-900 p-10 text-white">
            <h2 className="text-3xl font-bold">
              Management Behaviours We Improve
            </h2>

            <ul className="mt-8 space-y-4 text-lg leading-8 text-gray-300">
              <li>• Listening before reacting</li>
              <li>• Asking better questions</li>
              <li>• Coaching team members</li>
              <li>• Giving constructive feedback</li>
              <li>• Managing pressure calmly</li>
              <li>• Handling disagreement professionally</li>
              <li>• Making decisions based on facts</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-purple-700 p-10 text-white">
            <h2 className="text-3xl font-bold">
              Business Benefits
            </h2>

            <ul className="mt-8 space-y-4 text-lg leading-8 text-purple-100">
              <li>• Better leadership effectiveness</li>
              <li>• Stronger employee engagement</li>
              <li>• Improved productivity</li>
              <li>• Fewer unnecessary conflicts</li>
              <li>• Faster problem-solving</li>
              <li>• Better change management</li>
              <li>• Healthier workplace culture</li>
            </ul>
          </div>
        </div>

        <div className="mt-24 rounded-3xl bg-linear-to-r from-purple-700 to-indigo-600 p-12 text-center text-white shadow-2xl">
          <h2 className="text-5xl font-extrabold">
            Better Managers Build Better Organizations
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-purple-100">
            MBN Consultancy helps managers and leaders improve performance from
            the inside out — combining human psychology, operational excellence,
            coaching methods, and AI-supported management systems.
          </p>

          <button className="mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-purple-700 transition hover:scale-105">
            Request Management Consultation
          </button>
        </div>
      </section>
    </main>
  );
}