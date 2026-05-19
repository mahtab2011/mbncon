"use client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function InnerGameOfTennisPage() {
  const corePrinciples = [
    {
      title: "The Ball Became the Teacher",
      icon: "🎾",
      desc:
        "Instead of complex theory first, players were taught to learn from the ball. Every stroke, every rally, every error, and every repetition became feedback. The ball taught timing, distance, patience, rhythm, and control.",
    },
    {
      title: "Repetition Built Excellence",
      icon: "🔁",
      desc:
        "Thousands of balls. Daily. Not just hitting — but with purpose. Footwork, balance, consistency, spin, angles, and pressure. Repetition turned ability into unshakable performance.",
    },
    {
      title: "Focus Changed Everything",
      icon: "🧠",
      desc:
        "The ball was the center of attention. Distractions disappeared. Focus on the present moment, one ball at a time, created calm, confidence, and championship results.",
    },
  ];

  const coachingTactics = [
    {
      title: "Focus on the Ball",
      desc:
        "Players learned to focus on the ball, not the situation, score, crowd, or pressure. This built mental toughness.",
    },
    {
      title: "Repetition Under Pressure",
      desc:
        "Grip, stance, unit turn, contact point, follow through — basics done perfectly under high repetition.",
    },
    {
      title: "Intensity With Purpose",
      desc:
        "Every drill had a clear objective: consistency, control, pressure handling, or decision making.",
    },
    {
      title: "Build Champions' Habits",
      desc:
        "Discipline, work ethic, self-belief, recovery, visualization, and learning from every ball.",
    },
  ];

  const transformedPlayers = [
    "Andre Agassi — Grand Slam Champion",
    "Monica Seles — World No. 1",
    "Jim Courier — Grand Slam Champion",
    "Maria Sharapova — 5x Grand Slam Champion",
    "Serena & Venus Williams — Dominated an Era",
    "Many more world-class champions",
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* HERO */}
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              Inner Game of Tennis • Focus • Balls • Performance
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight">
              How Tennis Players Changed the Game of Tennis
            </h1>

            <p className="mt-6 text-xl leading-9 text-white/85">
              The modern era of tennis excellence was not built by talent alone.
              It was built by a revolution in focus, repetition, and the way
              players trained with the ball — a revolution led by Coach Nick
              Bollettieri.
            </p>
          </div>
        </div>
      </section>

      {/* CORE PRINCIPLES */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            {corePrinciples.map((item) => {
              const id = slugify(item.title);

              return (
                <a
                  key={item.title}
                  href={`#${id}`}
                  className="scroll-mt-28 rounded-3xl border border-green-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-4 text-4xl">
                    {item.icon}
                  </div>

                  <h2
                    id={id}
                    className="text-2xl font-bold"
                  >
                    {item.title}
                  </h2>

                  <p className="mt-4 leading-7 text-gray-600">
                    {item.desc}
                  </p>
                </a>
              );
            })}
          </div>

          {/* COACHING TACTICS */}
          <section className="mt-24 rounded-3xl bg-white p-10 shadow-xl">
            <h2 className="text-4xl font-bold text-green-800">
              Nick Bollettieri&apos;s Coaching Tactics That Changed Tennis Forever
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {coachingTactics.map((item) => {
                const id = slugify(item.title);

                return (
                  <section
                    key={item.title}
                    id={id}
                    className="scroll-mt-28 rounded-2xl border border-green-100 bg-green-50 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <h3 className="text-lg font-bold text-green-800">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-gray-700">
                      {item.desc}
                    </p>
                  </section>
                );
              })}
            </div>

            {/* INNER GAME STORY */}
            <div className="mt-12 rounded-3xl border border-green-100 bg-green-50 p-10">
              <h3 className="text-3xl font-bold text-green-800">
                How Focus on the Ball Changed Modern Tennis Forever
              </h3>

              <div className="mt-6 space-y-6 text-lg leading-8 text-gray-700">
                <p>
                  Before the modern high-performance era, many tennis players
                  trained mainly through technique instruction and occasional
                  match play. Nick Bollettieri transformed tennis by changing
                  what players focused on: the ball itself.
                </p>

                <p>
                  Thousands upon thousands of balls were fed to players every
                  day. The ball became the centre of concentration, repetition,
                  rhythm, timing, anticipation, balance, and emotional control.
                  Players stopped thinking too much about mechanics during play
                  and instead learned through focused repetition.
                </p>

                <p>
                  Bollettieri&apos;s system trained players to lock attention
                  onto the ball regardless of score pressure, crowd noise,
                  mistakes, fatigue, or fear. This changed not only stroke
                  production but also the psychological side of tennis. Focus
                  became a weapon.
                </p>

                <p>
                  Repetition under pressure created automatic reactions. Players
                  developed faster anticipation, cleaner timing, stronger
                  footwork, better recovery movement, and greater mental calm in
                  critical points.
                </p>

                <p>
                  The philosophy was simple: one ball at a time, one point at a
                  time, one moment at a time.
                </p>

                <p>
                  This method helped produce generations of elite champions
                  including Andre Agassi, Monica Seles, Jim Courier, Maria
                  Sharapova, Venus Williams, and Serena Williams. The entire
                  culture of modern tennis training changed because of this
                  relentless emphasis on focus, repetition, discipline, and
                  learning directly from the ball.
                </p>
              </div>
            </div>
          </section>

          {/* PLAYERS & LEGACY */}
          <div className="mt-20 grid gap-10 lg:grid-cols-2">
            {/* PLAYERS */}
            <section className="rounded-3xl bg-slate-900 p-10 text-white shadow-xl">
              <h2 className="text-3xl font-bold">
                Players Transformed Under Bollettieri
              </h2>

              <ul className="mt-6 space-y-3 text-lg leading-8 text-gray-300">
                {transformedPlayers.map((item) => {
                  const id = slugify(item);

                  return (
                    <li
                      key={item}
                      id={id}
                      className="scroll-mt-28 rounded-xl bg-white/5 p-3 transition duration-300 hover:bg-white/10"
                    >
                      • {item}
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* LEGACY */}
            <section className="rounded-3xl bg-white p-10 shadow-xl transition duration-300 hover:shadow-2xl">
              <h2 className="text-3xl font-bold">
                The Inner Game Legacy
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-700">
                Nick Bollettieri did not just coach strokes. He changed the way
                the world trains tennis. By putting the ball, focus, and
                repetition at the center, he created a system that produced
                champions consistently. His philosophy continues to shape modern
                tennis even today.
              </p>
            </section>
          </div>

          {/* CTA */}
          <section className="mt-24 rounded-3xl bg-green-700 p-12 text-center text-white shadow-2xl transition duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <h2 className="text-5xl font-extrabold">
              One Ball. One Point. One Moment. That&apos;s Tennis.
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-green-100">
              Focus on the ball. Do the basics better than anyone else.
              Repetition with purpose. Compete with calm. This is the Inner
              Game of Tennis.
            </p>

            <button className="mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-green-700 transition duration-300 hover:scale-105 hover:shadow-xl">
              Talk to Us About High-Performance Coaching
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}