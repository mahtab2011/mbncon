"use client";

import { useEffect, useMemo, useState } from "react";

export default function TimeStudyPage() {
  const [observedTime, setObservedTime] = useState(42);
  const [rating, setRating] = useState(100);
  const [allowance, setAllowance] = useState(15);
  const [isRunning, setIsRunning] = useState(false);
  const [observations, setObservations] = useState<number[]>([]);

  const standardTime = useMemo(() => {
    const normalTime = observedTime * (rating / 100);
    return normalTime * (1 + allowance / 100);
  }, [observedTime, rating, allowance]);
  const normalTime = useMemo(() => {
    return observedTime * (rating / 100);
  }, [observedTime, rating]);
  const averageObservedTime = useMemo(() => {
    if (observations.length === 0) return 0;

    const total = observations.reduce((sum, value) => sum + value, 0);
    return total / observations.length;
  }, [observations]);
  const bestTime = useMemo(() => {
    if (observations.length === 0) return 0;
    return Math.min(...observations);
  }, [observations]);
    const averageStandardTime = useMemo(() => {
    if (averageObservedTime === 0) return 0;

    const averageNormalTime = averageObservedTime * (rating / 100);
    return averageNormalTime * (1 + allowance / 100);
  }, [averageObservedTime, rating, allowance]);

  const worstTime = useMemo(() => {
    if (observations.length === 0) return 0;
    return Math.max(...observations);
  }, [observations]);
    const timeRange = useMemo(() => {
    if (observations.length === 0) return 0;
    return worstTime - bestTime;
  }, [observations, bestTime, worstTime]);
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setObservedTime((currentTime) => currentTime + 0.1);
    }, 100);

    return () => clearInterval(timer);
  }, [isRunning]);

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-4xl font-bold text-slate-900">
        Time Study Stopwatch
      </h1>

      <p className="mt-2 text-slate-600">
        Record observed time, performance rating, allowance, and calculated
        standard time for garment operations.
      </p>

                              <section className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5">
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Observed Time</p>
          <h2 className="mt-3 text-2xl font-bold text-blue-700">
            {observedTime.toFixed(2)}s
          </h2>
        </div>
                <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Range</p>
          <h2 className="mt-3 text-2xl font-bold text-orange-600">
            {timeRange.toFixed(2)}s
          </h2>
        </div>
                <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Normal Time
          </p>

          <h2 className="mt-3 text-4xl font-bold text-indigo-700">
            {normalTime.toFixed(2)}s
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Average Time</p>
          <h2 className="mt-3 text-4xl font-bold text-cyan-700">
            {averageObservedTime.toFixed(2)}s
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Rating</p>
          <h2 className="mt-3 text-4xl font-bold text-yellow-600">
            {rating}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Allowance</p>
          <h2 className="mt-3 text-4xl font-bold text-green-700">
            {allowance}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Standard Time</p>
          <h2 className="mt-3 text-4xl font-bold text-purple-700">
            {standardTime.toFixed(2)}s
          </h2>
        </div>
                <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Best Time</p>
          <h2 className="mt-3 text-4xl font-bold text-green-600">
            {bestTime.toFixed(2)}s
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Worst Time</p>
          <h2 className="mt-3 text-4xl font-bold text-red-600">
            {worstTime.toFixed(2)}s
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Observations</p>
          <h2 className="mt-3 text-4xl font-bold text-slate-800">
            {observations.length}
          </h2>
        </div>
                <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Avg Standard Time
          </p>

          <h2 className="mt-3 text-4xl font-bold text-fuchsia-700">
            {averageStandardTime.toFixed(2)}s
          </h2>
        </div>
      </section>

      <section className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          Stopwatch Controls
        </h2>

        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={() => setIsRunning(true)}
            className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-500"
          >
            Start
          </button>

          <button
            onClick={() => setIsRunning(false)}
            className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-white transition hover:bg-yellow-400"
          >
            Stop
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setObservedTime(0);
            }}
            className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500"
          >
            Reset
          </button>

          <button
            onClick={() =>
              setObservations((previous) => [
                ...previous,
                Number(observedTime.toFixed(2)),
              ])
            }
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
          >
            Save Observation
          </button>

          <button
            onClick={() => setObservations([])}
            className="rounded-lg bg-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-600"
          >
            Clear Observations
          </button>
        </div>

        <p className="mt-5 text-sm text-slate-500">
          Use the stopwatch to capture live observed cycle time during operation study.
        </p>
      </section>
      <section className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          Operator Performance Rating Guide
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Use this guide to select a fair performance rating during time study.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-5">
          <button
            onClick={() => setRating(80)}
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-left"
          >
            <p className="font-bold text-red-700">80%</p>
            <p className="mt-2 text-sm text-slate-600">Slow pace</p>
          </button>

          <button
            onClick={() => setRating(90)}
            className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-left"
          >
            <p className="font-bold text-yellow-700">90%</p>
            <p className="mt-2 text-sm text-slate-600">Below normal</p>
          </button>

          <button
            onClick={() => setRating(100)}
            className="rounded-lg border border-green-200 bg-green-50 p-4 text-left"
          >
            <p className="font-bold text-green-700">100%</p>
            <p className="mt-2 text-sm text-slate-600">Normal pace</p>
          </button>

          <button
            onClick={() => setRating(110)}
            className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-left"
          >
            <p className="font-bold text-blue-700">110%</p>
            <p className="mt-2 text-sm text-slate-600">Fast pace</p>
          </button>

          <button
            onClick={() => setRating(120)}
            className="rounded-lg border border-purple-200 bg-purple-50 p-4 text-left"
          >
            <p className="font-bold text-purple-700">120%</p>
            <p className="mt-2 text-sm text-slate-600">Very fast</p>
          </button>
        </div>
      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          Allowance Selector
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Select a practical allowance percentage for personal needs, fatigue,
          and unavoidable delay.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <button
            onClick={() => setAllowance(10)}
            className="rounded-lg border border-green-200 bg-green-50 p-4 text-left"
          >
            <p className="font-bold text-green-700">10%</p>
            <p className="mt-2 text-sm text-slate-600">Light work</p>
          </button>

          <button
            onClick={() => setAllowance(15)}
            className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-left"
          >
            <p className="font-bold text-blue-700">15%</p>
            <p className="mt-2 text-sm text-slate-600">Normal garment work</p>
          </button>

          <button
            onClick={() => setAllowance(20)}
            className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-left"
          >
            <p className="font-bold text-yellow-700">20%</p>
            <p className="mt-2 text-sm text-slate-600">Fatigue / delay risk</p>
          </button>

          <button
            onClick={() => setAllowance(25)}
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-left"
          >
            <p className="font-bold text-red-700">25%</p>
            <p className="mt-2 text-sm text-slate-600">High fatigue operation</p>
          </button>
        </div>
      </section>
      <section className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          Time Study Input
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Observed Time Seconds
            </span>

            <input
              type="number"
              value={observedTime}
              onChange={(event) => setObservedTime(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Performance Rating %
            </span>

            <input
              type="number"
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Allowance %
            </span>

            <input
              type="number"
              value={allowance}
              onChange={(event) => setAllowance(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3"
            />
          </label>
        </div>
      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          Time Study Performance Charts
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Live charts will be connected to actual observations in the next phase.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="font-semibold text-slate-800">
              Run Chart
            </h3>

            <div className="mt-4 flex h-56 items-center justify-center rounded-lg border-2 border-dashed border-slate-300">
              <p className="text-slate-400">
                Line Chart Placeholder
              </p>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Displays cycle-by-cycle observed times to identify trends.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="font-semibold text-slate-800">
              Histogram
            </h3>

            <div className="mt-4 flex h-56 items-center justify-center rounded-lg border-2 border-dashed border-slate-300">
              <p className="text-slate-400">
                Histogram Placeholder
              </p>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Shows the frequency distribution of observed times.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="font-semibold text-slate-800">
              Box Plot
            </h3>

            <div className="mt-4 flex h-56 items-center justify-center rounded-lg border-2 border-dashed border-slate-300">
              <p className="text-slate-400">
                Box Plot Placeholder
              </p>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Highlights median, quartiles, spread, and outliers.
            </p>
          </div>

        </div>

        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-5">
          <h3 className="font-semibold text-blue-800">
            Phase 2
          </h3>

          <p className="mt-2 text-sm text-slate-700">
            These placeholders will be replaced with interactive charts driven by
            the recorded observations. The Run Chart, Histogram, and Box Plot
            will update automatically whenever a new observation is saved.
          </p>
        </div>
      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          AI Analysis of Abnormal Observations
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          AI highlights unusual cycle times that may require further investigation.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-slate-100">
                <th className="p-3 text-left">Cycle</th>
                <th className="p-3 text-left">Observed Time</th>
                <th className="p-3 text-left">AI Assessment</th>
                <th className="p-3 text-left">Possible Reason</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-3">Cycle 4</td>
                <td className="p-3">65.20 sec</td>
                <td className="p-3 font-semibold text-red-600">
                  Abnormally High
                </td>
                <td className="p-3">
                  Possible machine stoppage or waiting for material.
                </td>
              </tr>

              <tr className="border-b">
                <td className="p-3">Cycle 11</td>
                <td className="p-3">28.10 sec</td>
                <td className="p-3 font-semibold text-blue-600">
                  Abnormally Low
                </td>
                <td className="p-3">
                  Possible skipped element or timing error.
                </td>
              </tr>

              <tr>
                <td className="p-3">Remaining Cycles</td>
                <td className="p-3">Within Expected Range</td>
                <td className="p-3 font-semibold text-green-600">
                  Normal
                </td>
                <td className="p-3">
                  No unusual variation detected.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
          <p className="font-semibold text-amber-800">
            AI Recommendation
          </p>

          <p className="mt-2 text-sm text-slate-700">
            Review abnormal observations before calculating the final standard
            time. Confirm whether these values represent genuine process
            variation or should be excluded because of interruptions or timing
            errors.
          </p>
        </div>
      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          Time Study History
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Previously completed time studies. Firestore integration will be added in the next phase.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-slate-100">
                <th className="p-3 text-left">Study ID</th>
                <th className="p-3 text-left">Operation</th>
                <th className="p-3 text-left">Operator</th>
                <th className="p-3 text-left">Standard Time</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-3">TS-0001</td>
                <td className="p-3">Sleeve Attach</td>
                <td className="p-3">Operator A</td>
                <td className="p-3">48.30 sec</td>
                <td className="p-3 text-green-600 font-semibold">
                  Completed
                </td>
              </tr>

              <tr className="border-b">
                <td className="p-3">TS-0002</td>
                <td className="p-3">Side Seam</td>
                <td className="p-3">Operator B</td>
                <td className="p-3">36.90 sec</td>
                <td className="p-3 text-blue-600 font-semibold">
                  Verified
                </td>
              </tr>

              <tr>
                <td className="p-3">TS-0003</td>
                <td className="p-3">Collar Join</td>
                <td className="p-3">Operator C</td>
                <td className="p-3">55.80 sec</td>
                <td className="p-3 text-yellow-600 font-semibold">
                  Draft
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          Export Time Study Report
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Export options will later generate PDF and Excel reports for management review.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <button className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500">
            Export PDF
          </button>

          <button className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-500">
            Export Excel
          </button>

          <button className="rounded-lg bg-slate-800 px-6 py-3 font-semibold text-white transition hover:bg-slate-700">
            Print Time Study Sheet
          </button>
        </div>
      </section>
      <section className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          Standard Time Calculation Sheet
        </h2>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-medium">Average Observed Time</td>
                <td className="p-3">{averageObservedTime.toFixed(2)} sec</td>
              </tr>

              <tr className="border-b">
                <td className="p-3 font-medium">Performance Rating</td>
                <td className="p-3">{rating}%</td>
              </tr>

              <tr className="border-b">
                <td className="p-3 font-medium">Normal Time</td>
                <td className="p-3">
                  {(averageObservedTime * (rating / 100)).toFixed(2)} sec
                </td>
              </tr>

              <tr className="border-b">
                <td className="p-3 font-medium">Allowance</td>
                <td className="p-3">{allowance}%</td>
              </tr>

              <tr>
                <td className="p-3 font-bold">Final Standard Time</td>
                <td className="p-3 font-bold text-purple-700">
                  {averageStandardTime.toFixed(2)} sec
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          Professional Time Study Observation Sheet
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Record cycle-wise observed times for formal garment operation time study.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="p-3 text-left">Cycle</th>
                <th className="p-3 text-left">Observed Time (sec)</th>
                <th className="p-3 text-left">Remarks</th>
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: 20 }).map((_, index) => {
                const value = observations[index];

                return (
                  <tr key={index} className="border-b">
                    <td className="p-3 font-medium">
                      Cycle {index + 1}
                    </td>

                    <td className="p-3">
                      {value !== undefined ? value.toFixed(2) : "-"}
                    </td>

                    <td className="p-3 text-slate-500">
                      {value !== undefined
                        ? "Observation recorded"
                        : "Waiting for observation"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-sm text-slate-500">
          The first 20 observations are shown as the standard professional time
          study sheet. Additional observations can be stored later in Firestore.
        </p>
      </section>
    </main>
  );
}