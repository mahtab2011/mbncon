export default function InnerGameOfTennisPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-green-50 to-white text-gray-900">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-4xl">
          <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            Inner Game of Tennis • Focus • Balls • Performance
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight">
            How Tennis Players Changed the Game of Tennis
          </h1>

          <p className="mt-6 text-xl leading-9 text-gray-700">
            The modern era of tennis excellence was not built by talent alone.
            It was built by a revolution in focus, repetition, and the way
            players trained with the ball — a revolution led by Coach Nick
            Bollettieri.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-sm">
            <div className="mb-4 text-4xl">🎾</div>
            <h2 className="text-2xl font-bold">The Ball Became the Teacher</h2>
            <p className="mt-4 leading-7 text-gray-600">
              Instead of complex theory first, players were taught to learn from
              the ball. Every stroke, every rally, every error, and every
              repetition became feedback. The ball taught timing, distance,
              patience, rhythm, and control.
            </p>
          </div>

          <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-sm">
            <div className="mb-4 text-4xl">🔁</div>
            <h2 className="text-2xl font-bold">Repetition Built Excellence</h2>
            <p className="mt-4 leading-7 text-gray-600">
              Thousands of balls. Daily. Not just hitting — but with purpose.
              Footwork, balance, consistency, spin, angles, and pressure.
              Repetition turned ability into unshakable performance.
            </p>
          </div>

          <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-sm">
            <div className="mb-4 text-4xl">🧠</div>
            <h2 className="text-2xl font-bold">Focus Changed Everything</h2>
            <p className="mt-4 leading-7 text-gray-600">
              The ball was the center of attention. Distractions disappeared.
              Focus on the present moment, one ball at a time, created calm,
              confidence, and championship results.
            </p>
          </div>
        </div>

        <div className="mt-24 rounded-3xl bg-white p-10 shadow-xl">
          <h2 className="text-4xl font-bold text-green-800">
            Nick Bollettieri&apos;s Coaching Tactics That Changed Tennis Forever
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Focus on the Ball",
                desc: "Players learned to focus on the ball, not the situation, score, crowd, or pressure. This built mental toughness.",
              },
              {
                title: "Repetition Under Pressure",
                desc: "Grip, stance, unit turn, contact point, follow through — basics done perfectly under high repetition.",
              },
              {
                title: "Intensity With Purpose",
                desc: "Every drill had a clear objective: consistency, control, pressure handling, or decision making.",
              },
              {
                title: "Build Champions' Habits",
                desc: "Discipline, work ethic, self-belief, recovery, visualization, and learning from every ball.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-green-100 bg-green-50 p-6"
              >
                <h3 className="text-lg font-bold text-green-800">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-green-100 bg-green-50 p-10">
            <h3 className="text-3xl font-bold text-green-800">
              How Focus on the Ball Changed Modern Tennis Forever
            </h3>

            <p className="mt-6 text-lg leading-8 text-gray-700">
              Before the modern high-performance era, many tennis players
              trained mainly through technique instruction and occasional match
              play. Nick Bollettieri transformed tennis by changing what
              players focused on: the ball itself.
            </p>

            <p className="mt-6 text-lg leading-8 text-gray-700">
              Thousands upon thousands of balls were fed to players every day.
              The ball became the centre of concentration, repetition, rhythm,
              timing, anticipation, balance, and emotional control. Players
              stopped thinking too much about mechanics during play and instead
              learned through focused repetition.
            </p>

            <p className="mt-6 text-lg leading-8 text-gray-700">
              Bollettieri&apos;s system trained players to lock attention onto
              the ball regardless of score pressure, crowd noise, mistakes,
              fatigue, or fear. This changed not only stroke production but also
              the psychological side of tennis. Focus became a weapon.
            </p>

            <p className="mt-6 text-lg leading-8 text-gray-700">
              Repetition under pressure created automatic reactions. Players
              developed faster anticipation, cleaner timing, stronger footwork,
              better recovery movement, and greater mental calm in critical
              points.
            </p>

            <p className="mt-6 text-lg leading-8 text-gray-700">
              The philosophy was simple: one ball at a time, one point at a
              time, one moment at a time.
            </p>

            <p className="mt-6 text-lg leading-8 text-gray-700">
              This method helped produce generations of elite champions
              including Andre Agassi, Monica Seles, Jim Courier, Maria
              Sharapova, Venus Williams, and Serena Williams. The entire culture
              of modern tennis training changed because of this relentless
              emphasis on focus, repetition, discipline, and learning directly
              from the ball.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl bg-gray-900 p-10 text-white">
            <h2 className="text-3xl font-bold">
              Players Transformed Under Bollettieri
            </h2>

            <ul className="mt-6 space-y-3 text-lg leading-8 text-gray-300">
              <li>• Andre Agassi — Grand Slam Champion</li>
              <li>• Monica Seles — World No. 1</li>
              <li>• Jim Courier — Grand Slam Champion</li>
              <li>• Maria Sharapova — 5x Grand Slam Champion</li>
              <li>• Serena &amp; Venus Williams — Dominated an Era</li>
              <li>• Many more world-class champions</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-10 shadow-xl">
            <h2 className="text-3xl font-bold">The Inner Game Legacy</h2>

            <p className="mt-6 text-lg leading-8 text-gray-700">
              Nick Bollettieri did not just coach strokes. He changed the way
              the world trains tennis. By putting the ball, focus, and
              repetition at the center, he created a system that produced
              champions consistently. His philosophy continues to shape modern
              tennis even today.
            </p>
          </div>
        </div>

        <div className="mt-24 rounded-3xl bg-linear-to-r from-green-700 to-emerald-600 p-12 text-center text-white shadow-2xl">
          <h2 className="text-5xl font-extrabold">
            One Ball. One Point. One Moment. That&apos;s Tennis.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-green-100">
            Focus on the ball. Do the basics better than anyone else.
            Repetition with purpose. Compete with calm. This is the Inner Game
            of Tennis.
          </p>

          <button className="mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-green-700 transition hover:scale-105">
            Talk to Us About High-Performance Coaching
          </button>
        </div>
      </section>
    </main>
  );
}