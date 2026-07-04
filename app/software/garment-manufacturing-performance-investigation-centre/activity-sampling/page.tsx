"use client";

import { useMemo, useState } from "react";

type SamplingObservation = {
  id: number;
  activity: string;
  category: string;
  recordedAt: string;
};

export default function ActivitySamplingPage() {
  const [working, setWorking] = useState(48);
  const [waiting, setWaiting] = useState(12);
  const [walking, setWalking] = useState(6);
  const [machineIdle, setMachineIdle] = useState(8);
  const [rework, setRework] = useState(4);
  const [other, setOther] = useState(2);
  const [samplingLog, setSamplingLog] = useState<SamplingObservation[]>([]);
  const totalSamples = useMemo(() => {
    return (
      working +
      waiting +
      walking +
      machineIdle +
      rework +
      other
    );
  }, [
    working,
    waiting,
    walking,
    machineIdle,
    rework,
    other,
  ]);

  const workingPercent = useMemo(() => {
    if (totalSamples === 0) return 0;
    return (working / totalSamples) * 100;
  }, [working, totalSamples]);
  const nonWorkingPercent = useMemo(() => {
    if (totalSamples === 0) return 0;

    return (
      ((waiting + walking + machineIdle + rework + other) /
        totalSamples) *
      100
    );
  }, [
    waiting,
    walking,
    machineIdle,
    rework,
    other,
    totalSamples,
  ]);
    const efficiencyLevel = useMemo(() => {
    if (workingPercent >= 85) return "Excellent";
    if (workingPercent >= 75) return "Good";
    if (workingPercent >= 65) return "Average";
    if (workingPercent >= 50) return "Needs Improvement";
    return "Critical";
  }, [workingPercent]);
    const observationCount = useMemo(() => {
    return totalSamples;
  }, [totalSamples]);

  const lossSamples = useMemo(() => {
    return waiting + walking + machineIdle + rework + other;
  }, [
    waiting,
    walking,
    machineIdle,
    rework,
    other,
  ]);
  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold text-slate-900">
        Activity Sampling
      </h1>

      <p className="mt-2 text-slate-600">
        Measure utilisation, waiting, walking, machine idle and other non-value-added activities.
      </p>

                        <section className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Total Samples
          </p>

          <h2 className="mt-3 text-3xl font-bold text-blue-700">
            {totalSamples}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Working %
          </p>

          <h2 className="mt-3 text-3xl font-bold text-green-700">
            {workingPercent.toFixed(1)}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Waiting
          </p>

          <h2 className="mt-3 text-3xl font-bold text-yellow-600">
            {waiting}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Machine Idle
          </p>

          <h2 className="mt-3 text-3xl font-bold text-red-600">
            {machineIdle}
          </h2>
        </div>
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Non-Working %
          </p>

          <h2 className="mt-3 text-3xl font-bold text-orange-600">
            {nonWorkingPercent.toFixed(1)}%
          </h2>
        </div>
                <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Efficiency Level
          </p>

          <h2 className="mt-3 text-2xl font-bold text-cyan-700">
            {efficiencyLevel}
          </h2>
        </div>
                <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Observation Count
          </p>

          <h2 className="mt-3 text-2xl font-bold text-indigo-700">
            {observationCount}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Loss Samples
          </p>

          <h2 className="mt-3 text-2xl font-bold text-rose-700">
            {lossSamples}
          </h2>
        </div>
      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Activity Classification Master List
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Factories can customize these activity types later by adding, editing,
          disabling, or moving items between categories.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <h3 className="font-bold text-green-800">
              Standard Work
            </h3>

            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>Sewing / machine running</li>
              <li>Cutting</li>
              <li>Fusing</li>
              <li>Pressing</li>
              <li>Finishing</li>
              <li>Inspection</li>
              <li>Packing</li>
              <li>Bundling</li>
            </ul>
          </div>

          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
            <h3 className="font-bold text-yellow-800">
              Non-Standard Work
            </h3>

            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>Walking</li>
              <li>Waiting for bundle</li>
              <li>Looking for supervisor</li>
              <li>Needle / thread / bobbin change</li>
              <li>Cleaning workstation</li>
              <li>Discussion</li>
              <li>Documentation</li>
              <li>Training</li>
            </ul>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <h3 className="font-bold text-red-800">
              No Work / Pure Loss
            </h3>

            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>Machine breakdown</li>
              <li>No operator</li>
              <li>No bundle</li>
              <li>No fabric / trims</li>
              <li>Power failure</li>
              <li>Quality hold</li>
              <li>Planning delay</li>
              <li>Unknown delay</li>
            </ul>
          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Factory Custom Activity Setup
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Later, factory administrators will be able to add, edit, disable, or
          reclassify activity types according to their internal IE standards.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800">
              Add New Activity
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Example: Barcode scanning, helper searching trims, line feeding delay.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800">
              Edit / Rename Activity
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Example: rename Walking to Movement or Machine Idle to Machine Waiting.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800">
              Disable Activity
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Disable unused activity types without deleting historical sampling data.
            </p>
          </div>

        </div>

      </section>

            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Sampling Category Interpretation
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <h3 className="font-bold text-green-800">
              Standard Work
            </h3>

            <p className="mt-3 text-sm text-slate-700">
              Activities directly contributing to garment production, inspection,
              finishing, or packing output.
            </p>
          </div>

          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
            <h3 className="font-bold text-yellow-800">
              Non-Standard Work
            </h3>

            <p className="mt-3 text-sm text-slate-700">
              Necessary but non-value-added activities such as walking, waiting,
              searching, discussion, cleaning, or minor adjustments.
            </p>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <h3 className="font-bold text-red-800">
              No Work / Pure Loss
            </h3>

            <p className="mt-3 text-sm text-slate-700">
              Lost time where no productive work is performed, such as breakdown,
              no material, no operator, quality hold, or planning delay.
            </p>
          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Sampling Study Information
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Factory / Unit
            </span>

            <input
              type="text"
              placeholder="Example: MBN Sample Factory"
              className="mt-2 w-full rounded-lg border border-slate-300 p-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Department / Line
            </span>

            <input
              type="text"
              placeholder="Example: Sewing Line 3"
              className="mt-2 w-full rounded-lg border border-slate-300 p-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Observer Name
            </span>

            <input
              type="text"
              placeholder="Example: IE Officer"
              className="mt-2 w-full rounded-lg border border-slate-300 p-3"
            />
          </label>
        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Global Garment Manufacturing Knowledge Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Select the department to load standardized garment manufacturing
          operations, activity sampling criteria, time study references, and
          future AI recommendations.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Department
            </span>

            <select
              className="mt-2 w-full rounded-lg border border-slate-300 p-3"
            >
              <option>Fabric Store</option>
              <option>Fabric Inspection</option>
              <option>Fabric Relaxation</option>
              <option>Cutting</option>
              <option>Fusing</option>
              <option>Printing</option>
              <option>Embroidery</option>
              <option>Sewing</option>
              <option>Washing</option>
              <option>Finishing</option>
              <option>Quality</option>
              <option>Packing</option>
              <option>Warehouse</option>
              <option>Maintenance</option>
              <option>Industrial Engineering</option>
              <option>Sample Room</option>
              <option>Utility</option>
              <option>Administration</option>
            </select>

          </label>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">

            <h3 className="font-semibold text-blue-800">
              Next Phase
            </h3>

            <p className="mt-2 text-sm text-slate-700">
              Selecting a department will automatically load its operation
              library, activity sampling guide, time study elements,
              investigation criteria, and AI recommendations.
            </p>

          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Cutting Department Operation Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Standard cutting room operations for activity sampling, method study,
          time study, and future AI investigation.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">
            Fabric receiving
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Fabric relaxation
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Fabric inspection before cutting
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Marker checking
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Marker placing
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Fabric spreading
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Ply counting
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Pattern alignment
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Straight knife cutting
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Band knife cutting
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Notching
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Drill marking
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Cut panel checking
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Numbering
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Bundling
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Bundle ticketing
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Shade sorting
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Cut panel issue to sewing
          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Sewing Department Operation Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Core sewing operations for woven shirts, trousers, jeans, jackets,
          knitwear, uniforms, and general garment assembly.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">Shoulder join</div>
          <div className="rounded-lg border border-slate-200 p-4">Side seam</div>
          <div className="rounded-lg border border-slate-200 p-4">Sleeve make</div>
          <div className="rounded-lg border border-slate-200 p-4">Sleeve attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Armhole top stitch</div>
          <div className="rounded-lg border border-slate-200 p-4">Collar interlining attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Collar make</div>
          <div className="rounded-lg border border-slate-200 p-4">Collar turning</div>
          <div className="rounded-lg border border-slate-200 p-4">Collar edge stitch</div>
          <div className="rounded-lg border border-slate-200 p-4">Collar attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Collar top stitch</div>
          <div className="rounded-lg border border-slate-200 p-4">Main label attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Size label attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Wash care label attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Brand label attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Front placket make</div>
          <div className="rounded-lg border border-slate-200 p-4">Front placket attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Front button attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Button hole</div>
          <div className="rounded-lg border border-slate-200 p-4">Button wrap</div>
          <div className="rounded-lg border border-slate-200 p-4">Cuff make</div>
          <div className="rounded-lg border border-slate-200 p-4">Cuff attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Sleeve vent make</div>
          <div className="rounded-lg border border-slate-200 p-4">Pocket attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Patch pocket attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Welt pocket make</div>
          <div className="rounded-lg border border-slate-200 p-4">Front pocket attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Back pocket attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Coin pocket attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Zipper attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Fly make</div>
          <div className="rounded-lg border border-slate-200 p-4">Fly top stitch</div>
          <div className="rounded-lg border border-slate-200 p-4">Waistband make</div>
          <div className="rounded-lg border border-slate-200 p-4">Waistband attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Belt loop make</div>
          <div className="rounded-lg border border-slate-200 p-4">Belt loop attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Bartack</div>
          <div className="rounded-lg border border-slate-200 p-4">Rivet attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Bottom hem</div>
          <div className="rounded-lg border border-slate-200 p-4">Internal lining attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Sleeve lining attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Jacket lapel shaping</div>
          <div className="rounded-lg border border-slate-200 p-4">Neck tape attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Shoulder tape attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Neck rib attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Thread trimming</div>
          <div className="rounded-lg border border-slate-200 p-4">In-line self inspection</div>
          <div className="rounded-lg border border-slate-200 p-4">Add New Sewing Operation</div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Finishing & Packing Operation Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Finishing, inspection, pressing, folding, packing, carton, and dispatch-related operations.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">Thread trimming</div>
          <div className="rounded-lg border border-slate-200 p-4">Loose thread removal</div>
          <div className="rounded-lg border border-slate-200 p-4">Spot cleaning</div>
          <div className="rounded-lg border border-slate-200 p-4">Final inspection</div>
          <div className="rounded-lg border border-slate-200 p-4">Measurement checking</div>
          <div className="rounded-lg border border-slate-200 p-4">Needle detection</div>
          <div className="rounded-lg border border-slate-200 p-4">Metal detection</div>
          <div className="rounded-lg border border-slate-200 p-4">Steam pressing</div>
          <div className="rounded-lg border border-slate-200 p-4">Hand ironing</div>
          <div className="rounded-lg border border-slate-200 p-4">Shape setting</div>
          <div className="rounded-lg border border-slate-200 p-4">Folding</div>
          <div className="rounded-lg border border-slate-200 p-4">Tag attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Hang tag attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Price ticket attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Barcode sticker attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Size sticker attach</div>
          <div className="rounded-lg border border-slate-200 p-4">Poly bag packing</div>
          <div className="rounded-lg border border-slate-200 p-4">Assortment packing</div>
          <div className="rounded-lg border border-slate-200 p-4">Carton packing</div>
          <div className="rounded-lg border border-slate-200 p-4">Carton sealing</div>
          <div className="rounded-lg border border-slate-200 p-4">Carton marking</div>
          <div className="rounded-lg border border-slate-200 p-4">Carton weighing</div>
          <div className="rounded-lg border border-slate-200 p-4">Finished goods transfer</div>
          <div className="rounded-lg border border-slate-200 p-4">Shipment staging</div>
          <div className="rounded-lg border border-slate-200 p-4">Loading for shipment</div>
          <div className="rounded-lg border border-slate-200 p-4">Add New Finishing Operation</div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Washing, Printing & Embroidery Operation Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Special process operations used for denim, knitwear, casualwear, jackets,
          uniforms, and decorated garments.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">Garment washing</div>
          <div className="rounded-lg border border-slate-200 p-4">Enzyme wash</div>
          <div className="rounded-lg border border-slate-200 p-4">Stone wash</div>
          <div className="rounded-lg border border-slate-200 p-4">Acid wash</div>
          <div className="rounded-lg border border-slate-200 p-4">Bleach wash</div>
          <div className="rounded-lg border border-slate-200 p-4">Tinting</div>
          <div className="rounded-lg border border-slate-200 p-4">Whisker marking</div>
          <div className="rounded-lg border border-slate-200 p-4">Whisker grinding</div>
          <div className="rounded-lg border border-slate-200 p-4">Hand scraping</div>
          <div className="rounded-lg border border-slate-200 p-4">Destroy effect</div>
          <div className="rounded-lg border border-slate-200 p-4">PP spray</div>
          <div className="rounded-lg border border-slate-200 p-4">Drying</div>

          <div className="rounded-lg border border-slate-200 p-4">Screen printing setup</div>
          <div className="rounded-lg border border-slate-200 p-4">Screen printing</div>
          <div className="rounded-lg border border-slate-200 p-4">Heat transfer printing</div>
          <div className="rounded-lg border border-slate-200 p-4">Sublimation printing</div>
          <div className="rounded-lg border border-slate-200 p-4">Print curing</div>
          <div className="rounded-lg border border-slate-200 p-4">Print inspection</div>

          <div className="rounded-lg border border-slate-200 p-4">Embroidery design loading</div>
          <div className="rounded-lg border border-slate-200 p-4">Embroidery hooping</div>
          <div className="rounded-lg border border-slate-200 p-4">Embroidery machine running</div>
          <div className="rounded-lg border border-slate-200 p-4">Thread colour change</div>
          <div className="rounded-lg border border-slate-200 p-4">Embroidery trimming</div>
          <div className="rounded-lg border border-slate-200 p-4">Embroidery inspection</div>

          <div className="rounded-lg border border-slate-200 p-4">Add New Special Process Operation</div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Quality Department Operation Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Standard garment quality assurance and inspection operations.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">Inline inspection</div>
          <div className="rounded-lg border border-slate-200 p-4">End-line inspection</div>
          <div className="rounded-lg border border-slate-200 p-4">Final inspection</div>

          <div className="rounded-lg border border-slate-200 p-4">Measurement checking</div>
          <div className="rounded-lg border border-slate-200 p-4">Specification verification</div>
          <div className="rounded-lg border border-slate-200 p-4">Workmanship inspection</div>

          <div className="rounded-lg border border-slate-200 p-4">Shade matching</div>
          <div className="rounded-lg border border-slate-200 p-4">Print inspection</div>
          <div className="rounded-lg border border-slate-200 p-4">Embroidery inspection</div>

          <div className="rounded-lg border border-slate-200 p-4">Accessory checking</div>
          <div className="rounded-lg border border-slate-200 p-4">Label verification</div>
          <div className="rounded-lg border border-slate-200 p-4">Barcode verification</div>

          <div className="rounded-lg border border-slate-200 p-4">Needle detection</div>
          <div className="rounded-lg border border-slate-200 p-4">Metal detection</div>
          <div className="rounded-lg border border-slate-200 p-4">AQL inspection</div>

          <div className="rounded-lg border border-slate-200 p-4">Defect classification</div>
          <div className="rounded-lg border border-slate-200 p-4">Re-inspection</div>
          <div className="rounded-lg border border-slate-200 p-4">Buyer inspection support</div>

          <div className="rounded-lg border border-slate-200 p-4">Add New Quality Operation</div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Maintenance Department Operation Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Machine maintenance, preventive maintenance, breakdown response, and engineering support operations.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">Preventive maintenance</div>
          <div className="rounded-lg border border-slate-200 p-4">Machine breakdown repair</div>
          <div className="rounded-lg border border-slate-200 p-4">Emergency maintenance</div>

          <div className="rounded-lg border border-slate-200 p-4">Needle replacement</div>
          <div className="rounded-lg border border-slate-200 p-4">Looper adjustment</div>
          <div className="rounded-lg border border-slate-200 p-4">Timing adjustment</div>

          <div className="rounded-lg border border-slate-200 p-4">Motor replacement</div>
          <div className="rounded-lg border border-slate-200 p-4">Belt replacement</div>
          <div className="rounded-lg border border-slate-200 p-4">Oil lubrication</div>

          <div className="rounded-lg border border-slate-200 p-4">Air pressure checking</div>
          <div className="rounded-lg border border-slate-200 p-4">Compressor inspection</div>
          <div className="rounded-lg border border-slate-200 p-4">Electrical fault finding</div>

          <div className="rounded-lg border border-slate-200 p-4">Spare parts issue</div>
          <div className="rounded-lg border border-slate-200 p-4">Machine installation</div>
          <div className="rounded-lg border border-slate-200 p-4">Machine relocation</div>

          <div className="rounded-lg border border-slate-200 p-4">Calibration</div>
          <div className="rounded-lg border border-slate-200 p-4">Safety inspection</div>
          <div className="rounded-lg border border-slate-200 p-4">Maintenance report preparation</div>

          <div className="rounded-lg border border-slate-200 p-4">Add New Maintenance Operation</div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Warehouse & Store Operation Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Fabric, trims, accessories, finished goods, and warehouse management operations.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">Fabric receiving</div>
          <div className="rounded-lg border border-slate-200 p-4">Fabric unloading</div>
          <div className="rounded-lg border border-slate-200 p-4">Fabric storage</div>

          <div className="rounded-lg border border-slate-200 p-4">Roll identification</div>
          <div className="rounded-lg border border-slate-200 p-4">Roll issuing</div>
          <div className="rounded-lg border border-slate-200 p-4">Fabric return</div>

          <div className="rounded-lg border border-slate-200 p-4">Trims receiving</div>
          <div className="rounded-lg border border-slate-200 p-4">Button issuing</div>
          <div className="rounded-lg border border-slate-200 p-4">Zipper issuing</div>

          <div className="rounded-lg border border-slate-200 p-4">Label issuing</div>
          <div className="rounded-lg border border-slate-200 p-4">Thread issuing</div>
          <div className="rounded-lg border border-slate-200 p-4">Packaging material issuing</div>

          <div className="rounded-lg border border-slate-200 p-4">Inventory counting</div>
          <div className="rounded-lg border border-slate-200 p-4">Cycle counting</div>
          <div className="rounded-lg border border-slate-200 p-4">Stock verification</div>

          <div className="rounded-lg border border-slate-200 p-4">Finished goods receiving</div>
          <div className="rounded-lg border border-slate-200 p-4">Finished goods dispatch</div>
          <div className="rounded-lg border border-slate-200 p-4">Container loading</div>

          <div className="rounded-lg border border-slate-200 p-4">Add New Warehouse Operation</div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Fabric Inspection & Fabric Relaxation Operation Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Standard operations performed before cutting to ensure fabric quality,
          stability, and cutting readiness.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">
            Fabric roll receiving
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Roll identification
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Roll weighing
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            4-Point fabric inspection
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Shade verification
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Width measurement
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            GSM verification
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Defect marking
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Fabric grading
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Relaxation planning
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Fabric relaxation
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Relaxation completion check
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Fabric issue to cutting
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Inspection report preparation
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Roll rejection handling
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Add New Fabric Operation
          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Sample Room Operation Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Product development, proto sample, fit sample, salesman sample,
          size set, pre-production sample, and approval sample operations.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">
            Tech pack review
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Pattern development
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Pattern digitizing
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Marker preparation
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Fabric selection
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Trims selection
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Sample cutting
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Sample sewing
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Sample washing
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Measurement checking
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Fit correction
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Buyer comments review
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Pattern revision
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            PP sample preparation
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Shipment sample preparation
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Sample approval filing
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Add New Sample Room Operation
          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Industrial Engineering Department Operation Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Core Industrial Engineering activities supporting productivity,
          costing, quality, planning, and continuous improvement.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">
            Time Study
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Activity Sampling
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Method Study
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Motion Study
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Line Balancing
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Capacity Study
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            SMV Calculation
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Operation Bulletin Preparation
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Layout Planning
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Bottleneck Investigation
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Productivity Analysis
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Efficiency Analysis
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Machine Utilization Study
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Manpower Utilization Study
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            WIP Analysis
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Kaizen Implementation
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Lean Manufacturing Audit
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Add New IE Operation
          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Product Category Master
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Select the garment category before choosing department and operation.
          Different products use different operation libraries.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">
            Woven Shirt
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Polo Shirt
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            T-Shirt
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Trouser
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Jeans
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Jacket
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Shorts
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Skirt
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Hoodie
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Sweatshirt
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Workwear
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            School Uniform
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Lingerie
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Sportswear
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Outerwear
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Sweater
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Denim Garment
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Add New Product Category
          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Product Type & Construction Master
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Define product type and construction details before selecting operations.
          This helps the app load the correct operation sequence.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800">
              Shirt Construction
            </h3>

            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>Formal Shirt</li>
              <li>Casual Shirt</li>
              <li>Short Sleeve Shirt</li>
              <li>Long Sleeve Shirt</li>
              <li>Button Down Collar Shirt</li>
              <li>Mandarin Collar Shirt</li>
              <li>Oxford Shirt</li>
              <li>Add New Shirt Type</li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800">
              Trouser / Jeans Construction
            </h3>

            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>Formal Trouser</li>
              <li>Chino Trouser</li>
              <li>Denim Jeans</li>
              <li>Five Pocket Jeans</li>
              <li>Cargo Pant</li>
              <li>Shorts</li>
              <li>Elastic Waist Pant</li>
              <li>Add New Bottom Type</li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800">
              Jacket / Outerwear Construction
            </h3>

            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>Light Jacket</li>
              <li>Bomber Jacket</li>
              <li>Padded Jacket</li>
              <li>Blazer</li>
              <li>Workwear Jacket</li>
              <li>Hooded Jacket</li>
              <li>Lined Jacket</li>
              <li>Add New Jacket Type</li>
            </ul>
          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Machine Master Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Select the machine used for each operation. Machine type directly
          affects SMV, quality, productivity, and maintenance analysis.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">
            Single Needle Lockstitch
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Double Needle Lockstitch
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Overlock (3 Thread)
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Overlock (4 Thread)
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Overlock (5 Thread)
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Flatlock
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Feed-off-the-Arm
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Button Attach Machine
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Button Hole Machine
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Bartack Machine
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Zigzag Machine
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Blind Stitch Machine
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Pattern Sewing Machine
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Automatic Pocket Setter
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Automatic Button Sewer
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Automatic Button Hole
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Heat Press Machine
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Fusing Machine
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Add New Machine
          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Machine Attachment Master Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Machine attachments, folders, guides, and special feet used to improve
          productivity, consistency, and garment quality.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">
            Right Edge Guide
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Left Edge Guide
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Center Guide
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Hemmer Folder
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Bias Binder
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Elastic Folder
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Piping Folder
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Collar Folder
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Cuff Folder
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Waistband Folder
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Zipper Guide
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Compensating Foot
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Roller Foot
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Teflon Foot
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Gathering Foot
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Swing Guide
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Add New Attachment
          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Needle Master Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Standard industrial sewing machine needle systems, point types,
          and sizes used throughout garment manufacturing.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">
            DB×1 Needle System
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            DP×5 Needle System
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            DC×27 Needle System
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Ball Point (SES)
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Medium Ball Point (SUK)
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Sharp Point (SPI)
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Leather Point (LR)
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Titanium Coated Needle
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Chrome Needle
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Size 9 (65)
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Size 11 (75)
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Size 14 (90)
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Size 16 (100)
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Size 18 (110)
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Size 19 (120)
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Size 21 (130)
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Add New Needle
          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Thread Master Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Standard industrial sewing thread types, fibre compositions,
          ticket numbers, and applications used in garment manufacturing.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">
            Polyester Spun Thread
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Polyester Core Spun Thread
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Cotton Thread
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Textured Polyester Thread
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Nylon Thread
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Monofilament Thread
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Ticket No. 20
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Ticket No. 30
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Ticket No. 40
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Ticket No. 50
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Ticket No. 60
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Ticket No. 80
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Needle Thread
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Bobbin Thread
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Decorative Thread
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Elastic Thread
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Add New Thread
          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Stitch Type Master Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          ISO stitch classifications commonly used in garment manufacturing.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">
            101 Single Thread Chain Stitch
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            301 Lockstitch
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            304 Zigzag Stitch
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            401 Two Thread Chain Stitch
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            406 Cover Stitch
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            504 Three Thread Overlock
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            512 Mock Safety Stitch
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            514 Four Thread Safety Stitch
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            516 Five Thread Safety Stitch
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            602 Cover Stitch
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            605 Flat Seam
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            607 Flatlock
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Decorative Stitch
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Blind Stitch
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Bartack Stitch
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Button Sewing Stitch
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Add New Stitch Type
          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Seam Type Master Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          ISO seam classifications used in garment manufacturing for quality,
          construction, engineering, and training.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">
            SS - Superimposed Seam
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            LS - Lapped Seam
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            BS - Bound Seam
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            FS - Flat Seam
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            EF - Edge Finished Seam
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            OS - Ornamental Seam
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            French Seam
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Welt Seam
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Slot Seam
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Double Lapped Seam
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Decorative Seam
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Reinforced Seam
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Add New Seam Type
          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Operator Skill Level Master Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Standard operator competency levels used for recruitment, training,
          productivity improvement, line balancing, and skill matrix management.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 p-4">
            Trainee Operator
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Junior Operator
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Semi-Skilled Operator
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Skilled Operator
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Highly Skilled Operator
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Multi-Skilled Operator
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Sample Operator
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Trainer Operator
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Team Leader
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Line Chief
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            Add New Skill Level
          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Machine Skill Requirement Matrix
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Recommended operator competency for common garment manufacturing machines.
        </p>

        <div className="overflow-x-auto mt-6">

          <table className="min-w-full border border-slate-200">

            <thead className="bg-slate-100">

              <tr>

                <th className="border p-3 text-left">
                  Machine
                </th>

                <th className="border p-3 text-left">
                  Minimum Skill
                </th>

                <th className="border p-3 text-left">
                  Preferred Skill
                </th>

                <th className="border p-3 text-left">
                  Training Required
                </th>

              </tr>

            </thead>

            <tbody>

              <tr>
                <td className="border p-3">Single Needle Lockstitch</td>
                <td className="border p-3">Junior</td>
                <td className="border p-3">Skilled</td>
                <td className="border p-3">Yes</td>
              </tr>

              <tr>
                <td className="border p-3">Overlock</td>
                <td className="border p-3">Semi-Skilled</td>
                <td className="border p-3">Skilled</td>
                <td className="border p-3">Yes</td>
              </tr>

              <tr>
                <td className="border p-3">Button Hole</td>
                <td className="border p-3">Skilled</td>
                <td className="border p-3">Highly Skilled</td>
                <td className="border p-3">Yes</td>
              </tr>

              <tr>
                <td className="border p-3">Bartack</td>
                <td className="border p-3">Skilled</td>
                <td className="border p-3">Highly Skilled</td>
                <td className="border p-3">Yes</td>
              </tr>

              <tr>
                <td className="border p-3">Automatic Pocket Setter</td>
                <td className="border p-3">Highly Skilled</td>
                <td className="border p-3">Multi-Skilled</td>
                <td className="border p-3">Advanced</td>
              </tr>

            </tbody>

          </table>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Operator Certification & Training Master
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Standard training and certification framework for garment manufacturing personnel.
        </p>

        <div className="overflow-x-auto mt-6">

          <table className="min-w-full border border-slate-200">

            <thead className="bg-slate-100">

              <tr>

                <th className="border p-3 text-left">
                  Certification
                </th>

                <th className="border p-3 text-left">
                  Minimum Duration
                </th>

                <th className="border p-3 text-left">
                  Practical Assessment
                </th>

                <th className="border p-3 text-left">
                  Renewal
                </th>

              </tr>

            </thead>

            <tbody>

              <tr>
                <td className="border p-3">Basic Sewing Operator</td>
                <td className="border p-3">2 Weeks</td>
                <td className="border p-3">Required</td>
                <td className="border p-3">Every 2 Years</td>
              </tr>

              <tr>
                <td className="border p-3">Advanced Sewing Operator</td>
                <td className="border p-3">4 Weeks</td>
                <td className="border p-3">Required</td>
                <td className="border p-3">Every 2 Years</td>
              </tr>

              <tr>
                <td className="border p-3">Multi-Machine Operator</td>
                <td className="border p-3">6 Weeks</td>
                <td className="border p-3">Required</td>
                <td className="border p-3">Every 3 Years</td>
              </tr>

              <tr>
                <td className="border p-3">Sample Room Specialist</td>
                <td className="border p-3">8 Weeks</td>
                <td className="border p-3">Required</td>
                <td className="border p-3">Every 3 Years</td>
              </tr>

              <tr>
                <td className="border p-3">Industrial Engineering Operator</td>
                <td className="border p-3">12 Weeks</td>
                <td className="border p-3">Required</td>
                <td className="border p-3">Every 3 Years</td>
              </tr>

            </tbody>

          </table>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Stitch Density (SPI) Master Library
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Recommended stitch density for different garment constructions and operations.
        </p>

        <div className="overflow-x-auto mt-6">

          <table className="min-w-full border border-slate-200">

            <thead className="bg-slate-100">

              <tr>

                <th className="border p-3 text-left">
                  Operation
                </th>

                <th className="border p-3 text-left">
                  Recommended SPI
                </th>

                <th className="border p-3 text-left">
                  Minimum
                </th>

                <th className="border p-3 text-left">
                  Maximum
                </th>

              </tr>

            </thead>

            <tbody>

              <tr>
                <td className="border p-3">Side Seam</td>
                <td className="border p-3">10</td>
                <td className="border p-3">8</td>
                <td className="border p-3">12</td>
              </tr>

              <tr>
                <td className="border p-3">Collar Attach</td>
                <td className="border p-3">10</td>
                <td className="border p-3">9</td>
                <td className="border p-3">12</td>
              </tr>

              <tr>
                <td className="border p-3">Top Stitch</td>
                <td className="border p-3">11</td>
                <td className="border p-3">10</td>
                <td className="border p-3">12</td>
              </tr>

              <tr>
                <td className="border p-3">Pocket Attach</td>
                <td className="border p-3">10</td>
                <td className="border p-3">9</td>
                <td className="border p-3">11</td>
              </tr>

              <tr>
                <td className="border p-3">Button Hole</td>
                <td className="border p-3">14</td>
                <td className="border p-3">12</td>
                <td className="border p-3">16</td>
              </tr>

            </tbody>

          </table>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Operation Resource Matrix
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Recommended engineering resources for common garment operations.
        </p>

        <div className="overflow-x-auto mt-6">

          <table className="min-w-full border border-slate-200">

            <thead className="bg-slate-100">

              <tr>

                <th className="border p-3 text-left">
                  Operation
                </th>

                <th className="border p-3 text-left">
                  Machine
                </th>

                <th className="border p-3 text-left">
                  Needle
                </th>

                <th className="border p-3 text-left">
                  Thread
                </th>

                <th className="border p-3 text-left">
                  Stitch
                </th>

                <th className="border p-3 text-left">
                  SPI
                </th>

              </tr>

            </thead>

            <tbody>

              <tr>
                <td className="border p-3">Collar Attach</td>
                <td className="border p-3">Single Needle Lockstitch</td>
                <td className="border p-3">DB×1 Size 11</td>
                <td className="border p-3">Poly Core 40</td>
                <td className="border p-3">301</td>
                <td className="border p-3">10</td>
              </tr>

              <tr>
                <td className="border p-3">Side Seam</td>
                <td className="border p-3">4 Thread Overlock</td>
                <td className="border p-3">DC×27 Size 11</td>
                <td className="border p-3">Polyester 40</td>
                <td className="border p-3">514</td>
                <td className="border p-3">10</td>
              </tr>

              <tr>
                <td className="border p-3">Bottom Hem</td>
                <td className="border p-3">Single Needle Lockstitch</td>
                <td className="border p-3">DB×1 Size 11</td>
                <td className="border p-3">Poly Core 40</td>
                <td className="border p-3">301</td>
                <td className="border p-3">11</td>
              </tr>

              <tr>
                <td className="border p-3">Button Attach</td>
                <td className="border p-3">Button Sewer</td>
                <td className="border p-3">DP×5</td>
                <td className="border p-3">Polyester 30</td>
                <td className="border p-3">Button Stitch</td>
                <td className="border p-3">14</td>
              </tr>

            </tbody>

          </table>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Operation Quality Checkpoint Matrix
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Standard quality checkpoints associated with key garment manufacturing operations.
        </p>

        <div className="overflow-x-auto mt-6">

          <table className="min-w-full border border-slate-200">

            <thead className="bg-slate-100">

              <tr>

                <th className="border p-3 text-left">
                  Operation
                </th>

                <th className="border p-3 text-left">
                  Quality Check
                </th>

                <th className="border p-3 text-left">
                  Typical Defect
                </th>

                <th className="border p-3 text-left">
                  Inspection Method
                </th>

              </tr>

            </thead>

            <tbody>

              <tr>
                <td className="border p-3">Collar Attach</td>
                <td className="border p-3">Collar alignment, seam margin, SPI</td>
                <td className="border p-3">Twisted collar, uneven seam</td>
                <td className="border p-3">Visual + Measurement</td>
              </tr>

              <tr>
                <td className="border p-3">Pocket Attach</td>
                <td className="border p-3">Pocket position, symmetry</td>
                <td className="border p-3">Skewed pocket</td>
                <td className="border p-3">Template + Visual</td>
              </tr>

              <tr>
                <td className="border p-3">Side Seam</td>
                <td className="border p-3">Seam allowance, SPI</td>
                <td className="border p-3">Open seam, puckering</td>
                <td className="border p-3">Visual</td>
              </tr>

              <tr>
                <td className="border p-3">Button Attach</td>
                <td className="border p-3">Button position, stitch security</td>
                <td className="border p-3">Loose button</td>
                <td className="border p-3">Pull Test + Visual</td>
              </tr>

              <tr>
                <td className="border p-3">Bottom Hem</td>
                <td className="border p-3">Hem width, SPI</td>
                <td className="border p-3">Uneven hem</td>
                <td className="border p-3">Measurement + Visual</td>
              </tr>

            </tbody>

          </table>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Sampling Session Information
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-4">

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Date
            </span>

            <input
              type="date"
              className="mt-2 w-full rounded-lg border border-slate-300 p-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Shift
            </span>

            <select
              className="mt-2 w-full rounded-lg border border-slate-300 p-3"
            >
              <option>Morning</option>
              <option>Evening</option>
              <option>Night</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Observation Interval
            </span>

            <select
              className="mt-2 w-full rounded-lg border border-slate-300 p-3"
            >
              <option>1 Minute</option>
              <option>2 Minutes</option>
              <option>5 Minutes</option>
              <option>10 Minutes</option>
              <option>Random</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Total Planned Observations
            </span>

            <input
              type="number"
              placeholder="500"
              className="mt-2 w-full rounded-lg border border-slate-300 p-3"
            />
          </label>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          One-Click Sampling Recorder
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Tap one button each time an observation is taken on the factory floor.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <button
                        onClick={() => {
              setWorking((value) => value + 1);

              setSamplingLog((previous) => [
                {
                  id: previous.length + 1,
                  activity: "Sewing / Machine Running",
                  category: "Standard Work",
                  recordedAt: new Date().toLocaleTimeString(),
                },
                ...previous,
              ]);
            }}
            className="rounded-xl bg-green-600 p-5 text-left font-semibold text-white transition hover:bg-green-500"
          >
            Standard Work
          </button>

                    <button
            onClick={() => {
              setWaiting((value) => value + 1);

              setSamplingLog((previous) => [
                {
                  id: previous.length + 1,
                  activity: "Waiting",
                  category: "Non-Standard Work",
                  recordedAt: new Date().toLocaleTimeString(),
                },
                ...previous,
              ]);
            }}
            className="rounded-xl bg-yellow-500 p-5 text-left font-semibold text-white transition hover:bg-yellow-400"
          >
            Waiting
          </button>

                    <button
            onClick={() => {
              setWalking((value) => value + 1);

              setSamplingLog((previous) => [
                {
                  id: previous.length + 1,
                  activity: "Walking / Movement",
                  category: "Non-Standard Work",
                  recordedAt: new Date().toLocaleTimeString(),
                },
                ...previous,
              ]);
            }}
            className="rounded-xl bg-cyan-600 p-5 text-left font-semibold text-white transition hover:bg-cyan-500"
          >
            Walking / Movement
          </button>

                    <button
            onClick={() => {
              setMachineIdle((value) => value + 1);

              setSamplingLog((previous) => [
                {
                  id: previous.length + 1,
                  activity: "Machine Idle",
                  category: "No Work / Pure Loss",
                  recordedAt: new Date().toLocaleTimeString(),
                },
                ...previous,
              ]);
            }}
            className="rounded-xl bg-red-600 p-5 text-left font-semibold text-white transition hover:bg-red-500"
          >
            Machine Idle
          </button>

                    <button
            onClick={() => {
              setRework((value) => value + 1);

              setSamplingLog((previous) => [
                {
                  id: previous.length + 1,
                  activity: "Rework",
                  category: "Non-Standard Work",
                  recordedAt: new Date().toLocaleTimeString(),
                },
                ...previous,
              ]);
            }}
            className="rounded-xl bg-orange-600 p-5 text-left font-semibold text-white transition hover:bg-orange-500"
          >
            Rework
          </button>

          <button
            onClick={() => {
              setOther((value) => value + 1);

              setSamplingLog((previous) => [
                {
                  id: previous.length + 1,
                  activity: "Other",
                  category: "Other / Review Required",
                  recordedAt: new Date().toLocaleTimeString(),
                },
                ...previous,
              ]);
            }}
            className="rounded-xl bg-slate-700 p-5 text-left font-semibold text-white transition hover:bg-slate-600"
          >
            Other
          </button>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Sampling Control
        </h2>

        <div className="mt-6 flex flex-wrap gap-4">
                    <button
            onClick={() => {
              setWorking(0);
              setWaiting(0);
              setWalking(0);
              setMachineIdle(0);
              setRework(0);
              setOther(0);
              setSamplingLog([]);
            }}
            className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500"
          >
            Reset All Samples
          </button>
        </div>

      </section>
      <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Activity Sampling Entry
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          <label className="block">
            <span className="text-sm font-semibold">
              Working Samples
            </span>

            <input
              type="number"
              value={working}
              onChange={(e) => setWorking(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">
              Waiting Samples
            </span>

            <input
              type="number"
              value={waiting}
              onChange={(e) => setWaiting(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">
              Walking Samples
            </span>

            <input
              type="number"
              value={walking}
              onChange={(e) => setWalking(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">
              Machine Idle
            </span>

            <input
              type="number"
              value={machineIdle}
              onChange={(e) => setMachineIdle(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">
              Rework
            </span>

            <input
              type="number"
              value={rework}
              onChange={(e) => setRework(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">
              Other
            </span>

            <input
              type="number"
              value={other}
              onChange={(e) => setOther(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </label>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Activity Sampling Analysis
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <h3 className="font-bold text-green-800">
              Productive Time
            </h3>

            <p className="mt-3 text-3xl font-bold text-green-700">
              {workingPercent.toFixed(1)}%
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Percentage of samples where standard work was observed.
            </p>
          </div>

          <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
            <h3 className="font-bold text-orange-800">
              Loss Time
            </h3>

            <p className="mt-3 text-3xl font-bold text-orange-700">
              {nonWorkingPercent.toFixed(1)}%
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Combined non-standard work and no-work observations.
            </p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h3 className="font-bold text-blue-800">
              IE Recommendation
            </h3>

            <p className="mt-3 text-sm text-slate-700">
              Focus first on waiting, machine idle, and walking causes to reduce
              hidden productivity loss.
            </p>
          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Sampling Loss Breakdown
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-5">

          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-center">
            <p className="text-sm text-slate-500">
              Waiting
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow-700">
              {totalSamples === 0 ? "0.0" : ((waiting / totalSamples) * 100).toFixed(1)}%
            </p>
          </div>

          <div className="rounded-lg bg-cyan-50 border border-cyan-200 p-4 text-center">
            <p className="text-sm text-slate-500">
              Walking
            </p>

            <p className="mt-2 text-2xl font-bold text-cyan-700">
              {totalSamples === 0 ? "0.0" : ((walking / totalSamples) * 100).toFixed(1)}%
            </p>
          </div>

          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center">
            <p className="text-sm text-slate-500">
              Machine Idle
            </p>

            <p className="mt-2 text-2xl font-bold text-red-700">
              {totalSamples === 0 ? "0.0" : ((machineIdle / totalSamples) * 100).toFixed(1)}%
            </p>
          </div>

          <div className="rounded-lg bg-orange-50 border border-orange-200 p-4 text-center">
            <p className="text-sm text-slate-500">
              Rework
            </p>

            <p className="mt-2 text-2xl font-bold text-orange-700">
              {totalSamples === 0 ? "0.0" : ((rework / totalSamples) * 100).toFixed(1)}%
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-center">
            <p className="text-sm text-slate-500">
              Other
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-700">
              {totalSamples === 0 ? "0.0" : ((other / totalSamples) * 100).toFixed(1)}%
            </p>
          </div>

        </div>

      </section>
            <section className="mt-10 rounded-xl bg-slate-900 p-6 text-white shadow">

        <h2 className="text-2xl font-bold">
          AI Sampling Insight
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl bg-slate-800 p-5">
            <p className="text-sm text-slate-400">
              Main Loss Signal
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow-300">
              Waiting / Idle Time
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-5">
            <p className="text-sm text-slate-400">
              Investigation Priority
            </p>

            <p className="mt-2 text-2xl font-bold text-red-400">
              High
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-5">
            <p className="text-sm text-slate-400">
              Recommended IE Tool
            </p>

            <p className="mt-2 text-2xl font-bold text-cyan-300">
              Method Study
            </p>
          </div>

        </div>

        <p className="mt-6 text-sm text-slate-300">
          AI recommends investigating waiting, walking, and machine idle samples
          first because these activities usually hide production flow problems,
          poor line feeding, machine support delay, or weak supervision.
        </p>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Activity Sampling Observation Log
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Preview of observation records collected during activity sampling.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-slate-100">
                <th className="p-3 text-left">Observation</th>
                <th className="p-3 text-left">Activity</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">
  Recorded At
</th>
              </tr>
            </thead>

                        <tbody>

              {samplingLog.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-5 text-center text-slate-500"
                  >
                    No observations recorded yet.
                  </td>
                </tr>
              ) : (
                samplingLog.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3">{item.id}</td>
                    <td className="p-3">{item.activity}</td>
                    <td className="p-3 font-semibold text-green-600">
                      {item.category}
                    </td>
                    <td className="p-3">{item.recordedAt}</td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>

      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          Activity Sampling Summary
        </h2>

        <div className="mt-6 overflow-x-auto">

          <table className="min-w-full border-collapse">

            <thead>

              <tr className="bg-slate-100">

                <th className="border p-3 text-left">
                  Activity
                </th>

                <th className="border p-3 text-center">
                  Samples
                </th>

                <th className="border p-3 text-center">
                  %
                </th>

              </tr>

            </thead>

            <tbody>

              <tr>
                <td className="border p-3">Working</td>
                <td className="border p-3 text-center">{working}</td>
                <td className="border p-3 text-center">
                  {totalSamples === 0
  ? "0.0%"
  : `${((working / totalSamples) * 100).toFixed(1)}%`}
                </td>
              </tr>

              <tr>
                <td className="border p-3">Waiting</td>
                <td className="border p-3 text-center">{waiting}</td>
                <td className="border p-3 text-center">
                  {totalSamples === 0
  ? "0.0%"
  : `${((waiting / totalSamples) * 100).toFixed(1)}%`}
                </td>
              </tr>

              <tr>
                <td className="border p-3">Walking</td>
                <td className="border p-3 text-center">{walking}</td>
                <td className="border p-3 text-center">
                  {totalSamples === 0
  ? "0.0%"
  : `${((walking / totalSamples) * 100).toFixed(1)}%`}
                </td>
              </tr>

              <tr>
                <td className="border p-3">Machine Idle</td>
                <td className="border p-3 text-center">{machineIdle}</td>
                <td className="border p-3 text-center">
                 {totalSamples === 0
  ? "0.0%"
  : `${((rework / totalSamples) * 100).toFixed(1)}%`}
                </td>
              </tr>

              <tr>
                <td className="border p-3">Rework</td>
                <td className="border p-3 text-center">{rework}</td>
                <td className="border p-3 text-center">
                  {((rework / totalSamples) * 100).toFixed(1)}%
                </td>
              </tr>

              <tr>
                <td className="border p-3">Other</td>
                <td className="border p-3 text-center">{other}</td>
                <td className="border p-3 text-center">
                  {totalSamples === 0
  ? "0.0%"
  : `${((other / totalSamples) * 100).toFixed(1)}%`}
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </section>
    </main>
  );
}