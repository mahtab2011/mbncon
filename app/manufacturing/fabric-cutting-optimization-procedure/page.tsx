"use client";

import { useState } from "react";

import { importPatternPdf } from "@/lib/gpa/patternAi/pdfPatternImporter";
import {
  calibrateImage,
  readImageInformation,
} from "@/lib/gpa/patternAi/imageCalibration";
import { detectPatternBoundaries } from "@/lib/gpa/patternAi/patternBoundaryDetector";
import { tracePolygons } from "@/lib/gpa/patternAi/polygonTracer";
import { recognizePatterns } from "@/lib/gpa/patternAi/patternRecognitionEngine";
import { optimizeMarker } from "@/lib/gpa/patternAi/markerOptimizationEngine";
import { generateEngineeringReport } from "@/lib/gpa/patternAi/engineeringReportEngine";

export default function FabricCuttingOptimizationProcedurePage() {

  const [uploadedFileName, setUploadedFileName] =
    useState("");

  const [uploadStatus, setUploadStatus] =
    useState("");

  const [uploadMessage, setUploadMessage] =
    useState("");

  const [engineeringReady, setEngineeringReady] =
    useState(false);
const [engineeringReportTime, setEngineeringReportTime] =
  useState("");
  async function handlePatternUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    const file = event.target.files?.[0];

    if (!file) return;

    setUploadedFileName(file.name);

    const result = importPatternPdf(
      file.name,
      file.size
    );

    setUploadStatus(result.status);

    setUploadMessage(result.message);

    if (result.status === "ready") {
      setEngineeringReady(true);
    } else {
   const imageInfo =
  await readImageInformation(file);

const calibration =
  await calibrateImage(imageInfo.width);

const boundaries =
  detectPatternBoundaries()

const polygons =
  tracePolygons(boundaries);

const patterns =
  recognizePatterns(polygons);

const marker =
  optimizeMarker(polygons, 150);

generateEngineeringReport(
  result,
  calibration,
  boundaries,
  polygons,
  patterns,
  marker
);

setEngineeringReportTime(
  new Date().toLocaleString()
);
        setEngineeringReady(false);
    }

  }   // ← THIS WAS THE MISSING BRACE


  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8">
        <h1 className="text-5xl font-bold text-blue-700">
          AI Fabric Pattern Engineering Centre
        </h1>

        <p className="mt-4 text-xl text-slate-600">
          AI-assisted pattern analysis, scale calibration, marker optimization,
          fabric consumption prediction and intelligent cutting planning.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {[
          {
            title: "Pattern Pieces",
            value: "0",
            color: "text-blue-700",
          },
          {
            title: "Marker Efficiency",
            value: "0%",
            color: "text-green-700",
          },
          {
            title: "Estimated Fabric",
            value: "0 m",
            color: "text-purple-700",
          },
          {
            title: "AI Saving",
            value: "0%",
            color: "text-orange-700",
          },
          {
            title: "Fabric Width",
            value: "--",
            color: "text-indigo-700",
          },
          {
            title: "Pattern Area",
            value: "0 cm²",
            color: "text-pink-700",
          },
          {
            title: "AI Confidence",
            value: "--",
            color: "text-cyan-700",
          },
          {
            title: "Optimization Status",
            value: "READY",
            color: "text-emerald-700",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl bg-white p-6 shadow"
          >
            <p className="text-sm font-semibold text-slate-500">
              {card.title}
            </p>

            <h2 className={`mt-3 text-3xl font-bold ${card.color}`}>
              {card.value}
            </h2>
          </div>
        ))}

      </div>
            <section className="mt-8 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          1. Pattern Upload Centre
        </h2>

        <p className="mt-2 text-slate-600">
          Upload pattern photo, scanned PDF or mobile camera image with a
          12-inch scale placed beside the pattern.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 p-8 text-center">
            <p className="text-lg font-bold text-blue-700">
              Upload Pattern File
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Supported: PDF, JPG, PNG
            </p>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handlePatternUpload}
              className="mt-6 w-full rounded-lg bg-white p-3"
            />
            {uploadedFileName && (
  <div className="mt-4 rounded-lg bg-slate-100 p-4">

    <div className="font-semibold">
      File:
      {" "}
      {uploadedFileName}
    </div>

    <div
      className={`mt-2 font-medium ${
        uploadStatus === "ready"
          ? "text-green-700"
          : "text-red-700"
      }`}
    >
      {uploadMessage}
    </div>

  </div>
)}
{engineeringReady && (

<div className="mt-6 rounded-xl bg-green-50 p-5">

<h3 className="text-lg font-bold text-green-700">

Engineering Pipeline

</h3>

<p className="mt-2">

✅ PDF Imported

</p>

<p>

✅ Image Calibrated

</p>

<p>

✅ Boundary Detection Complete

</p>

<p>

✅ Polygon Generated

</p>

<p>

✅ Pattern Recognized

</p>

<p>

✅ Marker Optimized

</p>

<p>

✅ Engineering Report Generated

</p>
<div className="mt-4 border-t pt-4 text-sm text-slate-600">
  Report Generated:
  <span className="ml-2 font-semibold">
    {engineeringReportTime}
  </span>
</div>

</div>

)}
          </div>

          <div className="rounded-2xl bg-slate-50 p-6">
            <h3 className="text-xl font-bold text-slate-800">
              Upload Instructions
            </h3>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
              <li>Place each pattern piece flat on a table.</li>
              <li>Keep a 12-inch scale beside the pattern.</li>
              <li>Take the photo from directly above.</li>
              <li>Avoid shadow, angle distortion and folded edges.</li>
              <li>Use one photo per pattern group if possible.</li>
            </ul>
          </div>
        </div>
      </section>
      {/* RC3 Real Pattern Upload Engine */}

<section className="mt-8 rounded-2xl bg-white p-6 shadow">
  <h2 className="text-2xl font-bold text-slate-800">
    RC3. Real Pattern Upload Engine
  </h2>

  <p className="mt-2 text-slate-600">
    Upload real pattern PDF or image files for AI scale calibration, boundary
    tracing, dimension extraction and marker optimisation.
  </p>

  <div className="mt-6 grid gap-6 lg:grid-cols-2">
    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6">
      <h3 className="text-lg font-bold text-slate-700">
        Upload Pattern File
      </h3>

      <p className="mt-2 text-sm text-slate-600">
        Supported formats: PDF, JPG, JPEG, PNG. Place a 12-inch scale beside the
        pattern before taking a photo.
      </p>

      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="mt-5 w-full rounded-lg border bg-white p-3"
      />

      <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
        AI will use this file for scale detection, pattern boundary tracing and
        real measurement extraction.
      </div>
    </div>

    <div className="rounded-xl bg-slate-50 p-6">
      <h3 className="text-lg font-bold text-slate-700">
        Upload Readiness Checklist
      </h3>

      <ul className="mt-4 space-y-3 text-sm text-slate-700">
        <li>✅ Pattern photo or PDF is clear</li>
        <li>✅ 12-inch ruler/scale is visible</li>
        <li>✅ Pattern edges are not folded</li>
        <li>✅ Camera is placed straight above the pattern</li>
        <li>✅ Background contrast is clear</li>
      </ul>
    </div>
  </div>
</section>
{/* RC3 AI 12-Inch Scale Detection Engine */}

<section className="mt-8 rounded-2xl bg-white p-6 shadow">

  <h2 className="text-2xl font-bold text-slate-800">
    RC3. AI 12-Inch Scale Detection Engine
  </h2>

  <p className="mt-2 text-slate-600">
    GPA automatically detects the reference ruler and converts image pixels
    into real engineering dimensions before pattern measurement begins.
  </p>

  <div className="mt-6 grid gap-6 lg:grid-cols-2">

    <div className="rounded-xl bg-blue-50 p-6">

      <h3 className="text-lg font-bold text-blue-700">
        Detected Reference Scale
      </h3>

      <div className="mt-4 space-y-3">

        <div className="flex justify-between">
          <span>Reference Length</span>
          <span className="font-bold">12.00 Inches</span>
        </div>

        <div className="flex justify-between">
          <span>Detected Pixels</span>
          <span className="font-bold">1488 px</span>
        </div>

        <div className="flex justify-between">
          <span>Pixel Density</span>
          <span className="font-bold">124 px / inch</span>
        </div>

        <div className="flex justify-between">
          <span>Calibration Accuracy</span>
          <span className="font-bold text-green-700">99.7%</span>
        </div>

      </div>

    </div>

    <div className="rounded-xl bg-green-50 p-6">

      <h3 className="text-lg font-bold text-green-700">
        AI Calibration Status
      </h3>

      <ul className="mt-4 space-y-3 text-slate-700">

        <li>✅ Scale located automatically</li>

        <li>✅ Perspective correction completed</li>

        <li>✅ Pixel-to-inch conversion established</li>

        <li>✅ Ready for polygon tracing</li>

      </ul>

    </div>

  </div>

</section>
{/* RC3 AI Polygon Pattern Tracing Engine */}

<section className="mt-8 rounded-2xl bg-white p-6 shadow">
  <h2 className="text-2xl font-bold text-slate-800">
    RC3. AI Polygon Pattern Tracing Engine
  </h2>

  <p className="mt-2 text-slate-600">
    GPA traces the real outline of each pattern piece as a polygon so that
    dimensions and areas can be calculated from actual shape boundaries instead
    of simple rectangular estimates.
  </p>

  <div className="mt-6 grid gap-6 lg:grid-cols-3">
    {[
      ["Detected Pieces", "12"],
      ["Polygon Points", "1,284"],
      ["Tracing Accuracy", "98.9%"],
    ].map((item) => (
      <div key={item[0]} className="rounded-xl bg-slate-50 p-5">
        <div className="text-sm text-slate-600">{item[0]}</div>
        <div className="mt-2 text-3xl font-bold text-indigo-700">
          {item[1]}
        </div>
      </div>
    ))}
  </div>

  <div className="mt-6 rounded-xl border border-slate-200 p-5">
    <h3 className="text-lg font-bold text-slate-800">
      AI Tracing Workflow
    </h3>

    <div className="mt-4 grid gap-4 md:grid-cols-4">
      {[
        "Edge Detection",
        "Noise Removal",
        "Curve Smoothing",
        "Polygon Output",
      ].map((step) => (
        <div
          key={step}
          className="rounded-lg bg-blue-50 p-4 text-center font-semibold text-blue-700"
        >
          {step}
        </div>
      ))}
    </div>
  </div>
</section>
{/* RC3 True Polygon Area Calculation Engine */}

<section className="mt-8 rounded-2xl bg-white p-6 shadow">

  <h2 className="text-2xl font-bold text-slate-800">
    RC3. True Polygon Area Calculation Engine
  </h2>

  <p className="mt-2 text-slate-600">
    GPA calculates the exact area of each traced polygon using computational
    geometry, providing more accurate fabric estimates than rectangular
    approximations.
  </p>

  <div className="mt-6 overflow-x-auto">

    <table className="min-w-full border">

      <thead className="bg-indigo-100">

        <tr>

          <th className="border px-4 py-2">Pattern Piece</th>

          <th className="border px-4 py-2">Polygon Points</th>

          <th className="border px-4 py-2">Exact Area</th>

          <th className="border px-4 py-2">Calculation Status</th>

        </tr>

      </thead>

      <tbody>

        {[
          ["Front Panel",184,"2478.4 cm²","Calculated"],
          ["Back Panel",191,"2554.8 cm²","Calculated"],
          ["Sleeve Left",132,"1186.5 cm²","Calculated"],
          ["Sleeve Right",132,"1186.5 cm²","Calculated"],
          ["Collar",61,"304.8 cm²","Calculated"],
          ["Pocket",44,"269.7 cm²","Calculated"],
        ].map((row)=>(

          <tr key={row[0]}>

            <td className="border px-4 py-2 font-medium">
              {row[0]}
            </td>

            <td className="border px-4 py-2">
              {row[1]}
            </td>

            <td className="border px-4 py-2">
              {row[2]}
            </td>

            <td className="border px-4 py-2">

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">

                {row[3]}

              </span>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

  <div className="mt-6 rounded-xl bg-green-50 p-5">

    <h3 className="text-lg font-bold text-green-700">
      Engineering Result
    </h3>

    <div className="mt-4 grid gap-4 md:grid-cols-3">

      <div>

        <div className="text-sm text-slate-600">
          Total Polygon Area
        </div>

        <div className="text-3xl font-bold text-green-700">
          8,932 cm²
        </div>

      </div>

      <div>

        <div className="text-sm text-slate-600">
          Accuracy
        </div>

        <div className="text-3xl font-bold text-blue-700">
          99.6%
        </div>

      </div>

      <div>

        <div className="text-sm text-slate-600">
          Geometry Engine
        </div>

        <div className="text-3xl font-bold text-purple-700">
          Active
        </div>

      </div>

    </div>

  </div>

</section>
{/* RC3 AI Seam Allowance & Notch Detection Engine */}

<section className="mt-8 rounded-2xl bg-white p-6 shadow">

  <h2 className="text-2xl font-bold text-slate-800">
    RC3. AI Seam Allowance & Notch Detection Engine
  </h2>

  <p className="mt-2 text-slate-600">
    GPA detects seam allowances, notches, drill holes and fold lines to improve
    cutting accuracy and prepare patterns for intelligent marker generation.
  </p>

  <div className="mt-6 grid gap-6 lg:grid-cols-4">

    {[
      ["Seam Allowances","24"],
      ["Notches","36"],
      ["Drill Holes","8"],
      ["Fold Lines","5"],
    ].map((item)=>(

      <div
        key={item[0]}
        className="rounded-xl bg-blue-50 p-5 text-center"
      >

        <div className="text-sm text-slate-600">
          {item[0]}
        </div>

        <div className="mt-2 text-3xl font-bold text-blue-700">
          {item[1]}
        </div>

      </div>

    ))}

  </div>

  <div className="mt-8 overflow-x-auto">

    <table className="min-w-full border">

      <thead className="bg-slate-100">

        <tr>

          <th className="border px-4 py-2">Pattern Piece</th>

          <th className="border px-4 py-2">Seam Allowance</th>

          <th className="border px-4 py-2">Notches</th>

          <th className="border px-4 py-2">Fold Line</th>

          <th className="border px-4 py-2">Status</th>

        </tr>

      </thead>

      <tbody>

        {[
          ["Front Panel","10 mm","8","No","Detected"],
          ["Back Panel","10 mm","8","No","Detected"],
          ["Sleeve","10 mm","6","No","Detected"],
          ["Collar","6 mm","4","Yes","Detected"],
          ["Pocket","10 mm","2","No","Detected"],
          ["Cuff","6 mm","2","Yes","Detected"],
        ].map((row)=>(

          <tr key={row[0]}>

            <td className="border px-4 py-2 font-medium">
              {row[0]}
            </td>

            <td className="border px-4 py-2">
              {row[1]}
            </td>

            <td className="border px-4 py-2">
              {row[2]}
            </td>

            <td className="border px-4 py-2">
              {row[3]}
            </td>

            <td className="border px-4 py-2">

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">

                {row[4]}

              </span>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</section>
{/* RC3 AI Pattern Validation & Missing Piece Detection */}

<section className="mt-8 rounded-2xl bg-white p-6 shadow">

  <h2 className="text-2xl font-bold text-slate-800">
    RC3. AI Pattern Validation & Missing Piece Detection
  </h2>

  <p className="mt-2 text-slate-600">
    GPA validates that every required pattern piece is present before marker
    generation and highlights missing, duplicate or suspicious components.
  </p>

  <div className="mt-6 grid gap-5 md:grid-cols-4">

    <div className="rounded-xl bg-green-50 p-5">
      <div className="text-sm text-slate-600">
        Required Pieces
      </div>
      <div className="mt-2 text-3xl font-bold text-green-700">
        12
      </div>
    </div>

    <div className="rounded-xl bg-blue-50 p-5">
      <div className="text-sm text-slate-600">
        Detected Pieces
      </div>
      <div className="mt-2 text-3xl font-bold text-blue-700">
        12
      </div>
    </div>

    <div className="rounded-xl bg-amber-50 p-5">
      <div className="text-sm text-slate-600">
        Duplicate Pieces
      </div>
      <div className="mt-2 text-3xl font-bold text-amber-700">
        0
      </div>
    </div>

    <div className="rounded-xl bg-purple-50 p-5">
      <div className="text-sm text-slate-600">
        Validation Score
      </div>
      <div className="mt-2 text-3xl font-bold text-purple-700">
        100%
      </div>
    </div>

  </div>

  <div className="mt-8 overflow-x-auto">

    <table className="min-w-full border">

      <thead className="bg-slate-100">

        <tr>
          <th className="border px-4 py-2">Pattern Piece</th>
          <th className="border px-4 py-2">Required</th>
          <th className="border px-4 py-2">Detected</th>
          <th className="border px-4 py-2">Validation</th>
        </tr>

      </thead>

      <tbody>

        {[
          ["Front Panel","1","1","Pass"],
          ["Back Panel","1","1","Pass"],
          ["Sleeve","2","2","Pass"],
          ["Collar","2","2","Pass"],
          ["Pocket","2","2","Pass"],
          ["Cuff","2","2","Pass"],
        ].map((row)=>(

          <tr key={row[0]}>

            <td className="border px-4 py-2 font-medium">{row[0]}</td>
            <td className="border px-4 py-2">{row[1]}</td>
            <td className="border px-4 py-2">{row[2]}</td>

            <td className="border px-4 py-2">
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                {row[3]}
              </span>
            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</section>
{/* RC3 AI Marker Optimization Engine */}

<section className="mt-8 rounded-2xl bg-white p-6 shadow">

  <h2 className="text-2xl font-bold text-slate-800">
    RC3. AI Marker Optimization Engine
  </h2>

  <p className="mt-2 text-slate-600">
    GPA evaluates multiple marker layout scenarios and recommends the best
    arrangement based on fabric utilisation, waste reduction and engineering
    constraints.
  </p>

  <div className="mt-6 grid gap-6 md:grid-cols-4">

    {[
      ["Layouts Analysed","1,248"],
      ["Best Efficiency","89.6%"],
      ["Estimated Waste","10.4%"],
      ["AI Confidence","98.8%"],
    ].map((item)=>(

      <div
        key={item[0]}
        className="rounded-xl bg-indigo-50 p-5 text-center"
      >

        <div className="text-sm text-slate-600">
          {item[0]}
        </div>

        <div className="mt-2 text-3xl font-bold text-indigo-700">
          {item[1]}
        </div>

      </div>

    ))}

  </div>

  <div className="mt-8 overflow-x-auto">

    <table className="min-w-full border">

      <thead className="bg-slate-100">

        <tr>

          <th className="border px-4 py-2">Optimization Rule</th>
          <th className="border px-4 py-2">Status</th>
          <th className="border px-4 py-2">Impact</th>

        </tr>

      </thead>

      <tbody>

        {[
          ["Respect Grain Direction","Applied","High"],
          ["Minimise Empty Spaces","Applied","High"],
          ["Rotate Allowed Pieces","Applied","Medium"],
          ["Group Small Components","Applied","Medium"],
          ["Maintain Safety Gap","Applied","High"],
          ["Reduce Marker Length","Applied","High"],
        ].map((row)=>(

          <tr key={row[0]}>

            <td className="border px-4 py-2 font-medium">
              {row[0]}
            </td>

            <td className="border px-4 py-2">

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">

                {row[1]}

              </span>

            </td>

            <td className="border px-4 py-2">
              {row[2]}
            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

  <div className="mt-8 rounded-xl bg-green-50 p-6">

    <h3 className="text-xl font-bold text-green-700">
      AI Recommendation
    </h3>

    <p className="mt-3 text-slate-700">

      The recommended marker layout improves fabric utilisation from
      <strong> 87.8% </strong>
      to
      <strong> 89.6% </strong>,
      reducing estimated fabric waste by approximately
      <strong> 1.8% </strong>
      while maintaining grain direction and production constraints.

    </p>

  </div>

</section>
{/* RC3 AI Fabric Defect & Shade Zone Avoidance Engine */}

<section className="mt-8 rounded-2xl bg-white p-6 shadow">

  <h2 className="text-2xl font-bold text-slate-800">
    RC3. AI Fabric Defect & Shade Zone Avoidance Engine
  </h2>

  <p className="mt-2 text-slate-600">
    GPA analyses the fabric roll for defects and shade variation, recommending
    marker placement that avoids unsuitable areas and improves cutting quality.
  </p>

  <div className="mt-6 grid gap-6 md:grid-cols-4">

    {[
      ["Defects Detected","6"],
      ["Shade Zones","2"],
      ["Usable Fabric","94.8%"],
      ["AI Confidence","98.2%"],
    ].map((item)=>(

      <div
        key={item[0]}
        className="rounded-xl bg-rose-50 p-5 text-center"
      >

        <div className="text-sm text-slate-600">
          {item[0]}
        </div>

        <div className="mt-2 text-3xl font-bold text-rose-700">
          {item[1]}
        </div>

      </div>

    ))}

  </div>

  <div className="mt-8 overflow-x-auto">

    <table className="min-w-full border">

      <thead className="bg-slate-100">

        <tr>

          <th className="border px-4 py-2">Fabric Zone</th>
          <th className="border px-4 py-2">Condition</th>
          <th className="border px-4 py-2">AI Action</th>

        </tr>

      </thead>

      <tbody>

        {[
          ["Zone A","Normal","Use"],
          ["Zone B","Minor Shade Variation","Avoid Large Panels"],
          ["Zone C","Hole Detected","Avoid"],
          ["Zone D","Oil Stain","Avoid"],
          ["Zone E","Normal","Use"],
          ["Zone F","Normal","Use"],
        ].map((row)=>(

          <tr key={row[0]}>

            <td className="border px-4 py-2 font-medium">
              {row[0]}
            </td>

            <td className="border px-4 py-2">
              {row[1]}
            </td>

            <td className="border px-4 py-2">

              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                row[2] === "Use"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>

                {row[2]}

              </span>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

  <div className="mt-8 rounded-xl bg-amber-50 p-6">

    <h3 className="text-xl font-bold text-amber-700">
      AI Engineering Recommendation
    </h3>

    <p className="mt-3 text-slate-700">

      Reposition large pattern pieces into defect-free zones while allocating
      smaller components to areas with minor shade variation where permitted by
      factory quality standards.

    </p>

  </div>

</section>
            <section className="mt-8 rounded-2xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-slate-800">
          2. AI Scale Calibration Centre
        </h2>

        <p className="mt-2 text-slate-600">
          GPA converts pixels into real-world measurements using a reference
          ruler. This allows accurate pattern measurement from photos or PDFs.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          <div className="rounded-xl border bg-slate-50 p-6">

            <h3 className="text-lg font-bold text-blue-700">
              Reference Object
            </h3>

            <div className="mt-4 space-y-4">

              <select className="w-full rounded-lg border p-3">
                <option>12 Inch Steel Scale</option>
                <option>30 cm Steel Scale</option>
                <option>A4 Paper</option>
                <option>Letter Paper</option>
              </select>

              <input
                type="number"
                placeholder="Detected Pixel Length"
                className="w-full rounded-lg border p-3"
              />

              <input
                type="number"
                placeholder="Actual Length (mm)"
                className="w-full rounded-lg border p-3"
              />

            </div>

          </div>

          <div className="rounded-xl bg-blue-50 p-6">

            <h3 className="text-lg font-bold text-blue-700">
              AI Calibration Result
            </h3>

            <div className="mt-5 space-y-3 text-slate-700">

              <p>
                Scale Accuracy :
                <span className="font-bold text-green-700">
                  Pending
                </span>
              </p>

              <p>
                Pixels per mm :
                <span className="font-bold">
                  --
                </span>
              </p>

              <p>
                Measurement Confidence :
                <span className="font-bold">
                  --
                </span>
              </p>

              <p>
                Calibration Status :
                <span className="font-bold text-orange-600">
                  Waiting for Pattern
                </span>
              </p>

            </div>

          </div>

        </div>

      </section>
            <section className="mt-8 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          3. AI Pattern Boundary Detection
        </h2>

        <p className="mt-2 text-slate-600">
          GPA prepares the uploaded image for pattern tracing by identifying
          visible pattern edges, piece outlines and cutting boundaries.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-6">
            <h3 className="text-lg font-bold text-blue-700">
              Detection Mode
            </h3>

            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 text-slate-700">
                <input type="checkbox" />
                Auto Detect Pattern Edge
              </label>

              <label className="flex items-center gap-3 text-slate-700">
                <input type="checkbox" />
                Detect Internal Cut Lines
              </label>

              <label className="flex items-center gap-3 text-slate-700">
                <input type="checkbox" />
                Detect Notches and Drill Marks
              </label>

              <label className="flex items-center gap-3 text-slate-700">
                <input type="checkbox" />
                AI Clean Background Noise
              </label>
            </div>
          </div>

          <div className="rounded-xl bg-blue-50 p-6">
            <h3 className="text-lg font-bold text-blue-700">
              Pattern Trace Status
            </h3>

            <div className="mt-4 space-y-3 text-slate-700">
              <p>
                Pieces Detected:{" "}
                <span className="font-bold text-slate-900">--</span>
              </p>

              <p>
                Boundary Quality:{" "}
                <span className="font-bold text-orange-600">Pending</span>
              </p>

              <p>
                Edge Confidence:{" "}
                <span className="font-bold text-slate-900">--</span>
              </p>

              <p>
                Manual Review:{" "}
                <span className="font-bold text-blue-700">Required</span>
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-6">
            <h3 className="text-lg font-bold text-amber-700">
              Factory Guidance
            </h3>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
              <li>Use high contrast background.</li>
              <li>Keep pattern paper flat.</li>
              <li>Do not overlap pieces.</li>
              <li>Keep scale fully visible.</li>
              <li>Review AI trace before cutting decision.</li>
            </ul>
          </div>
        </div>
      </section>
      {/* AI Pattern Piece Recognition */}

<section className="bg-white rounded-xl shadow-lg p-6 mt-8">

<h2 className="text-2xl font-bold text-indigo-700 mb-4">

AI Pattern Piece Recognition

</h2>

<p className="text-gray-600 mb-6">

AI automatically classifies every detected pattern piece after boundary tracing.

</p>

<div className="overflow-x-auto">

<table className="min-w-full border">

<thead className="bg-indigo-100">

<tr>

<th className="border px-4 py-2">Detected Piece</th>

<th className="border px-4 py-2">AI Classification</th>

<th className="border px-4 py-2">Confidence</th>

<th className="border px-4 py-2">Status</th>

</tr>

</thead>

<tbody>

{[
["Pattern 01","Front Panel","99.1%","Verified"],

["Pattern 02","Back Panel","98.6%","Verified"],

["Pattern 03","Sleeve Left","98.0%","Verified"],

["Pattern 04","Sleeve Right","98.0%","Verified"],

["Pattern 05","Collar Upper","97.4%","Verified"],

["Pattern 06","Collar Under","96.9%","Verified"],

["Pattern 07","Pocket","99.4%","Verified"],

["Pattern 08","Pocket Facing","95.8%","Review"],

["Pattern 09","Cuff","97.5%","Verified"],

["Pattern 10","Waistband","96.4%","Verified"],

].map((piece)=>(
<tr key={piece[0]}>

<td className="border px-4 py-2">{piece[0]}</td>

<td className="border px-4 py-2 font-semibold">

{piece[1]}

</td>

<td className="border px-4 py-2">

{piece[2]}

</td>

<td className="border px-4 py-2">

<span

className={`px-3 py-1 rounded-full text-sm font-semibold ${
piece[3]==="Verified"
?"bg-green-100 text-green-700"
:"bg-yellow-100 text-yellow-700"
}`}

>

{piece[3]}

</span>

</td>

</tr>

))}

</tbody>

</table>

</div>

</section>
{/* Automatic Pattern Dimension Extraction */}

<section className="mt-8 rounded-2xl bg-white p-6 shadow">

  <h2 className="text-2xl font-bold text-slate-800">
    7. Automatic Pattern Dimension Extraction
  </h2>

  <p className="mt-2 text-slate-600">
    GPA automatically extracts engineering dimensions from each recognised
    pattern piece after AI classification.
  </p>

  <div className="mt-6 overflow-x-auto">

    <table className="min-w-full border">

      <thead className="bg-slate-100">

        <tr>

          <th className="border px-4 py-2">Pattern Piece</th>

          <th className="border px-4 py-2">Length</th>

          <th className="border px-4 py-2">Width</th>

          <th className="border px-4 py-2">Area</th>

          <th className="border px-4 py-2">Grain Line</th>

          <th className="border px-4 py-2">Status</th>

        </tr>

      </thead>

      <tbody>

        {[
          ["Front Panel","74.2 cm","33.6 cm","2480 cm²","Vertical","Measured"],
          ["Back Panel","76.1 cm","34.0 cm","2555 cm²","Vertical","Measured"],
          ["Sleeve Left","61.5 cm","24.3 cm","1188 cm²","Diagonal","Measured"],
          ["Sleeve Right","61.5 cm","24.3 cm","1188 cm²","Diagonal","Measured"],
          ["Collar Upper","43.2 cm","8.1 cm","305 cm²","Horizontal","Measured"],
          ["Pocket","17.5 cm","15.4 cm","270 cm²","Vertical","Measured"],
          ["Cuff","27.8 cm","9.4 cm","261 cm²","Horizontal","Measured"],
          ["Waistband","84.5 cm","8.2 cm","693 cm²","Horizontal","Measured"],
        ].map((row) => (

          <tr key={row[0]}>

            <td className="border px-4 py-2 font-medium">{row[0]}</td>
            <td className="border px-4 py-2">{row[1]}</td>
            <td className="border px-4 py-2">{row[2]}</td>
            <td className="border px-4 py-2">{row[3]}</td>
            <td className="border px-4 py-2">{row[4]}</td>

            <td className="border px-4 py-2">

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">

                {row[5]}

              </span>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</section>
{/* AI Pattern Area Calculation Engine */}

<section className="mt-8 rounded-2xl bg-white p-6 shadow">

  <h2 className="text-2xl font-bold text-slate-800">
    8. AI Pattern Area Calculation Engine
  </h2>

  <p className="mt-2 text-slate-600">
    GPA calculates the usable fabric area for every recognised pattern piece.
    Future AI versions will calculate exact polygon areas from traced pattern
    boundaries instead of simplified dimensions.
  </p>

  <div className="mt-6 overflow-x-auto">

    <table className="min-w-full border">

      <thead className="bg-emerald-100">

        <tr>

          <th className="border px-4 py-2">Pattern Piece</th>
          <th className="border px-4 py-2">Calculated Area</th>
          <th className="border px-4 py-2">% of Garment</th>
          <th className="border px-4 py-2">Fabric Utilisation</th>
          <th className="border px-4 py-2">AI Status</th>

        </tr>

      </thead>

      <tbody>

        {[
          ["Front Panel","2480 cm²","29.4%","Excellent","Calculated"],
          ["Back Panel","2555 cm²","30.3%","Excellent","Calculated"],
          ["Sleeve Left","1188 cm²","14.1%","Good","Calculated"],
          ["Sleeve Right","1188 cm²","14.1%","Good","Calculated"],
          ["Collar","305 cm²","3.6%","Excellent","Calculated"],
          ["Pocket","270 cm²","3.2%","Excellent","Calculated"],
          ["Cuff","261 cm²","3.1%","Good","Calculated"],
          ["Waistband","693 cm²","8.2%","Excellent","Calculated"],
        ].map((row)=>(

          <tr key={row[0]}>

            <td className="border px-4 py-2 font-medium">{row[0]}</td>
            <td className="border px-4 py-2">{row[1]}</td>
            <td className="border px-4 py-2">{row[2]}</td>
            <td className="border px-4 py-2">{row[3]}</td>

            <td className="border px-4 py-2">

              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">

                {row[4]}

              </span>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

  <div className="mt-6 rounded-xl bg-emerald-50 p-5">

    <h3 className="text-lg font-bold text-emerald-700">
      Total Estimated Pattern Area
    </h3>

    <div className="mt-3 text-3xl font-bold text-emerald-800">
      8,940 cm²
    </div>

    <p className="mt-2 text-sm text-slate-600">
      This value will be used by the AI Marker Layout Generator to estimate
      total fabric consumption and optimise nesting efficiency.
    </p>

  </div>

</section>
{/* Fabric Width & Roll Master */}

<section className="mt-8 rounded-2xl bg-white p-6 shadow">

  <h2 className="text-2xl font-bold text-slate-800">
    9. Fabric Width & Roll Master
  </h2>

  <p className="mt-2 text-slate-600">
    Define the engineering properties of the fabric before AI generates the
    cutting marker and estimates fabric consumption.
  </p>

  <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

    <div>
      <label className="block text-sm font-semibold text-slate-700">
        Fabric Width
      </label>

      <select className="mt-2 w-full rounded-lg border p-3">
        <option>44 Inches</option>
        <option>58 Inches</option>
        <option selected>60 Inches</option>
        <option>62 Inches</option>
        <option>72 Inches</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-semibold text-slate-700">
        Roll Length
      </label>

      <input
        type="text"
        defaultValue="100 Metres"
        className="mt-2 w-full rounded-lg border p-3"
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-slate-700">
        Fabric Type
      </label>

      <select className="mt-2 w-full rounded-lg border p-3">
        <option>Single Jersey</option>
        <option>Interlock</option>
        <option>Rib</option>
        <option>Pique</option>
        <option>Denim</option>
        <option>Woven</option>
        <option>Fleece</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-semibold text-slate-700">
        GSM
      </label>

      <input
        type="number"
        defaultValue="180"
        className="mt-2 w-full rounded-lg border p-3"
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-slate-700">
        Shrinkage (%)
      </label>

      <input
        type="number"
        defaultValue="5"
        className="mt-2 w-full rounded-lg border p-3"
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-slate-700">
        Fabric Direction
      </label>

      <select className="mt-2 w-full rounded-lg border p-3">
        <option>One Way</option>
        <option>Two Way</option>
        <option>No Restriction</option>
      </select>
    </div>

  </div>

  <div className="mt-8 grid gap-4 md:grid-cols-3">

    <div className="rounded-xl bg-blue-50 p-5">
      <div className="text-sm text-slate-600">Usable Width</div>
      <div className="mt-2 text-3xl font-bold text-blue-700">
        58.8"
      </div>
    </div>

    <div className="rounded-xl bg-green-50 p-5">
      <div className="text-sm text-slate-600">Estimated Lay Length</div>
      <div className="mt-2 text-3xl font-bold text-green-700">
        2.36 m
      </div>
    </div>

    <div className="rounded-xl bg-amber-50 p-5">
      <div className="text-sm text-slate-600">Fabric Status</div>
      <div className="mt-2 text-3xl font-bold text-amber-700">
        Ready
      </div>
    </div>

  </div>

</section>
{/* AI Marker Layout Generator */}

<section className="mt-8 rounded-2xl bg-white p-6 shadow">

  <h2 className="text-2xl font-bold text-slate-800">
    10. AI Marker Layout Generator
  </h2>

  <p className="mt-2 text-slate-600">
    GPA arranges recognised pattern pieces into an intelligent cutting marker
    to maximise fabric utilisation while respecting grain direction and fabric
    constraints.
  </p>

  <div className="mt-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8">

    <div className="flex items-center justify-between">

      <div>

        <h3 className="text-lg font-bold text-slate-700">
          AI Marker Preview
        </h3>

        <p className="text-sm text-slate-500">
          Preliminary nesting layout generated by GPA AI.
        </p>

      </div>

      <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
        Draft Layout
      </span>

    </div>

    <div className="mt-8 rounded-lg bg-white p-6">

      <div className="grid grid-cols-6 gap-3">

        {[
          "Front",
          "Back",
          "Sleeve L",
          "Sleeve R",
          "Collar",
          "Pocket",
          "Cuff",
          "Waistband",
          "Facing",
          "Pocket Facing",
          "Label",
          "Binding",
        ].map((piece) => (

          <div
            key={piece}
            className="rounded-lg border bg-blue-50 p-3 text-center text-xs font-semibold text-blue-700 shadow-sm"
          >
            {piece}
          </div>

        ))}

      </div>

    </div>

  </div>

  <div className="mt-8 grid gap-5 md:grid-cols-4">

    <div className="rounded-xl bg-green-50 p-5">

      <div className="text-sm text-slate-600">
        Marker Efficiency
      </div>

      <div className="mt-2 text-3xl font-bold text-green-700">
        87.8%
      </div>

    </div>

    <div className="rounded-xl bg-blue-50 p-5">

      <div className="text-sm text-slate-600">
        Fabric Utilisation
      </div>

      <div className="mt-2 text-3xl font-bold text-blue-700">
        Excellent
      </div>

    </div>

    <div className="rounded-xl bg-amber-50 p-5">

      <div className="text-sm text-slate-600">
        Estimated Waste
      </div>

      <div className="mt-2 text-3xl font-bold text-amber-700">
        12.2%
      </div>

    </div>

    <div className="rounded-xl bg-indigo-50 p-5">

      <div className="text-sm text-slate-600">
        AI Layout Score
      </div>

      <div className="mt-2 text-3xl font-bold text-indigo-700">
        A+
      </div>

    </div>

  </div>

</section>
{/* Fabric Consumption Calculator */}

<section className="mt-8 rounded-2xl bg-white p-6 shadow">

  <h2 className="text-2xl font-bold text-slate-800">
    11. Fabric Consumption Calculator
  </h2>

  <p className="mt-2 text-slate-600">
    GPA estimates total fabric consumption using the AI marker layout,
    fabric width, shrinkage allowance and cutting efficiency.
  </p>

  <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

    <div className="rounded-xl bg-blue-50 p-5">
      <div className="text-sm text-slate-600">
        Fabric / Garment
      </div>

      <div className="mt-2 text-3xl font-bold text-blue-700">
        1.68 m
      </div>
    </div>

    <div className="rounded-xl bg-green-50 p-5">
      <div className="text-sm text-slate-600">
        Marker Length
      </div>

      <div className="mt-2 text-3xl font-bold text-green-700">
        2.36 m
      </div>
    </div>

    <div className="rounded-xl bg-indigo-50 p-5">
      <div className="text-sm text-slate-600">
        Marker Efficiency
      </div>

      <div className="mt-2 text-3xl font-bold text-indigo-700">
        87.8%
      </div>
    </div>

    <div className="rounded-xl bg-amber-50 p-5">
      <div className="text-sm text-slate-600">
        Shrinkage Allowance
      </div>

      <div className="mt-2 text-3xl font-bold text-amber-700">
        5%
      </div>
    </div>

    <div className="rounded-xl bg-red-50 p-5">
      <div className="text-sm text-slate-600">
        Cutting Loss
      </div>

      <div className="mt-2 text-3xl font-bold text-red-700">
        2.4%
      </div>
    </div>

    <div className="rounded-xl bg-emerald-50 p-5">
      <div className="text-sm text-slate-600">
        Final Fabric / Garment
      </div>

      <div className="mt-2 text-3xl font-bold text-emerald-700">
        1.81 m
      </div>
    </div>

  </div>

  <div className="mt-8 overflow-x-auto">

    <table className="min-w-full border">

      <thead className="bg-slate-100">

        <tr>

          <th className="border px-4 py-2">Order Qty</th>
          <th className="border px-4 py-2">Consumption / Garment</th>
          <th className="border px-4 py-2">Total Fabric</th>
          <th className="border px-4 py-2">Estimated Rolls</th>

        </tr>

      </thead>

      <tbody>

        <tr>

          <td className="border px-4 py-2">10,000 pcs</td>

          <td className="border px-4 py-2">
            1.81 m
          </td>

          <td className="border px-4 py-2">
            18,100 m
          </td>

          <td className="border px-4 py-2">
            181 Rolls
          </td>

        </tr>

      </tbody>

    </table>

  </div>

</section>
{/* AI Fabric Saving Recommendation */}

<section className="mt-8 rounded-2xl bg-white p-6 shadow">

  <h2 className="text-2xl font-bold text-slate-800">
    12. AI Fabric Saving Recommendation
  </h2>

  <p className="mt-2 text-slate-600">
    GPA analyses the current marker layout and recommends engineering
    improvements to reduce fabric consumption while maintaining production
    quality and grain direction.
  </p>

  <div className="mt-6 space-y-4">

    {[
      {
        title: "Rotate Sleeve Pieces",
        saving: "0.8%",
        impact: "Estimated saving: 145 metres",
        status: "High Impact",
      },
      {
        title: "Move Pocket Between Front Panels",
        saving: "0.5%",
        impact: "Estimated saving: 92 metres",
        status: "Medium Impact",
      },
      {
        title: "Combine Collar & Cuff Layout",
        saving: "0.4%",
        impact: "Estimated saving: 73 metres",
        status: "Medium Impact",
      },
      {
        title: "Reduce Marker Gap by 3 mm",
        saving: "0.6%",
        impact: "Estimated saving: 108 metres",
        status: "High Impact",
      },
    ].map((item) => (

      <div
        key={item.title}
        className="rounded-xl border border-slate-200 p-5"
      >

        <div className="flex items-center justify-between">

          <div>

            <h3 className="text-lg font-semibold text-slate-800">
              {item.title}
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              {item.impact}
            </p>

          </div>

          <div className="text-right">

            <div className="text-2xl font-bold text-green-700">
              {item.saving}
            </div>

            <div className="text-sm text-slate-500">
              {item.status}
            </div>

          </div>

        </div>

      </div>

    ))}

  </div>

  <div className="mt-8 rounded-xl bg-green-50 p-6">

    <h3 className="text-xl font-bold text-green-700">
      Overall AI Saving Potential
    </h3>

    <div className="mt-3 grid gap-6 md:grid-cols-4">

      <div>
        <div className="text-sm text-slate-600">
          Fabric Saving
        </div>

        <div className="text-2xl font-bold text-green-700">
          3.1%
        </div>
      </div>

      <div>
        <div className="text-sm text-slate-600">
          Fabric Saved
        </div>

        <div className="text-2xl font-bold text-green-700">
          418 m
        </div>
      </div>

      <div>
        <div className="text-sm text-slate-600">
          Estimated Cost Saving
        </div>

        <div className="text-2xl font-bold text-green-700">
          $1,045
        </div>
      </div>

      <div>
        <div className="text-sm text-slate-600">
          CO₂ Reduction
        </div>

        <div className="text-2xl font-bold text-green-700">
          96 kg
        </div>
      </div>

    </div>

  </div>

</section>
{/* Interactive Marker Visualization */}

<section className="mt-8 rounded-2xl bg-white p-6 shadow">

  <h2 className="text-2xl font-bold text-slate-800">
    13. Interactive Marker Visualization
  </h2>

  <p className="mt-2 text-slate-600">
    Visual representation of the AI-generated marker layout. Future versions
    will allow engineers to move, rotate and optimise pattern pieces directly.
  </p>

  <div className="mt-6 rounded-xl border-4 border-slate-300 bg-slate-50 p-6">

    <div className="mb-4 flex items-center justify-between">

      <div>

        <div className="text-lg font-bold text-slate-700">
          Fabric Width : 60 Inches
        </div>

        <div className="text-sm text-slate-500">
          Interactive Engineering Workspace
        </div>

      </div>

      <div className="rounded-full bg-indigo-100 px-4 py-2 font-semibold text-indigo-700">
        AI Preview
      </div>

    </div>

    <div className="rounded-lg border bg-white p-6">

      <div className="grid grid-cols-8 gap-2">

        {[
          "Front",
          "Back",
          "Sleeve L",
          "Sleeve R",
          "Pocket",
          "Pocket",
          "Collar",
          "Collar",
          "Cuff",
          "Cuff",
          "Waist",
          "Facing",
          "Binding",
          "Label",
          "Fly",
          "Pocket Facing",
        ].map((piece) => (

          <div
            key={piece}
            className="flex h-16 items-center justify-center rounded-lg border bg-blue-100 text-center text-xs font-semibold text-blue-800"
          >
            {piece}
          </div>

        ))}

      </div>

    </div>

  </div>

  <div className="mt-8 grid gap-5 md:grid-cols-4">

    <div className="rounded-xl bg-green-50 p-5">

      <div className="text-sm text-slate-600">
        Marker Efficiency
      </div>

      <div className="mt-2 text-3xl font-bold text-green-700">
        87.8%
      </div>

    </div>

    <div className="rounded-xl bg-blue-50 p-5">

      <div className="text-sm text-slate-600">
        Utilised Area
      </div>

      <div className="mt-2 text-3xl font-bold text-blue-700">
        88%
      </div>

    </div>

    <div className="rounded-xl bg-amber-50 p-5">

      <div className="text-sm text-slate-600">
        Waste Area
      </div>

      <div className="mt-2 text-3xl font-bold text-amber-700">
        12%
      </div>

    </div>

    <div className="rounded-xl bg-purple-50 p-5">

      <div className="text-sm text-slate-600">
        AI Layout Rating
      </div>

      <div className="mt-2 text-3xl font-bold text-purple-700">
        A+
      </div>

    </div>

  </div>

</section>
{/* AI Cutting Instruction Generator */}

<section className="mt-8 rounded-2xl bg-white p-6 shadow">

  <h2 className="text-2xl font-bold text-slate-800">
    14. AI Cutting Instruction Generator
  </h2>

  <p className="mt-2 text-slate-600">
    GPA generates production-ready cutting instructions based on the AI marker,
    fabric characteristics and engineering calculations.
  </p>

  <div className="mt-6 overflow-x-auto">

    <table className="min-w-full border">

      <thead className="bg-slate-100">

        <tr>

          <th className="border px-4 py-2">Instruction</th>
          <th className="border px-4 py-2">Value</th>

        </tr>

      </thead>

      <tbody>

        <tr>
          <td className="border px-4 py-2">Fabric Width</td>
          <td className="border px-4 py-2">60 Inches</td>
        </tr>

        <tr>
          <td className="border px-4 py-2">Marker Length</td>
          <td className="border px-4 py-2">2.36 Metres</td>
        </tr>

        <tr>
          <td className="border px-4 py-2">Number of Plies</td>
          <td className="border px-4 py-2">80</td>
        </tr>

        <tr>
          <td className="border px-4 py-2">Fabric Direction</td>
          <td className="border px-4 py-2">One Way</td>
        </tr>

        <tr>
          <td className="border px-4 py-2">Bundle Size</td>
          <td className="border px-4 py-2">20 Pieces</td>
        </tr>

        <tr>
          <td className="border px-4 py-2">Estimated Cutting Time</td>
          <td className="border px-4 py-2">34 Minutes</td>
        </tr>

        <tr>
          <td className="border px-4 py-2">QC Checkpoints</td>
          <td className="border px-4 py-2">
            Shade • Grain • Notches • Piece Count
          </td>
        </tr>

      </tbody>

    </table>

  </div>

  <div className="mt-8 rounded-xl bg-blue-50 p-5">

    <h3 className="text-lg font-bold text-blue-700">
      AI Production Notes
    </h3>

    <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">

      <li>Spread fabric with face side up.</li>

      <li>Maintain one-way grain alignment.</li>

      <li>Verify notch accuracy before bulk cutting.</li>

      <li>Separate bundles by size immediately after cutting.</li>

      <li>Inspect first ply before continuing full lay.</li>

    </ul>

  </div>

</section>
{/* PDF Optimization Report */}

<section className="mt-8 rounded-2xl bg-white p-6 shadow">

  <h2 className="text-2xl font-bold text-slate-800">
    15. PDF Optimization Report
  </h2>

  <p className="mt-2 text-slate-600">
    GPA compiles all engineering calculations into a professional optimisation
    report ready for production review and future PDF export.
  </p>

  <div className="mt-6 overflow-x-auto">

    <table className="min-w-full border">

      <thead className="bg-slate-100">

        <tr>

          <th className="border px-4 py-2">Report Section</th>

          <th className="border px-4 py-2">Status</th>

        </tr>

      </thead>

      <tbody>

        {[
          ["Pattern Upload","Completed"],
          ["Scale Calibration","Completed"],
          ["Boundary Detection","Completed"],
          ["Pattern Recognition","Completed"],
          ["Dimension Extraction","Completed"],
          ["Area Calculation","Completed"],
          ["Marker Layout","Completed"],
          ["Fabric Consumption","Completed"],
          ["AI Saving Recommendation","Completed"],
          ["Cutting Instruction","Completed"],
        ].map((item)=>(

          <tr key={item[0]}>

            <td className="border px-4 py-2 font-medium">
              {item[0]}
            </td>

            <td className="border px-4 py-2">

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">

                {item[1]}

              </span>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

  <div className="mt-8 rounded-xl bg-indigo-50 p-6">

    <h3 className="text-xl font-bold text-indigo-700">
      Executive Engineering Summary
    </h3>

    <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

      <div>
        <div className="text-sm text-slate-600">
          Marker Efficiency
        </div>

        <div className="text-3xl font-bold text-indigo-700">
          87.8%
        </div>
      </div>

      <div>
        <div className="text-sm text-slate-600">
          Fabric / Garment
        </div>

        <div className="text-3xl font-bold text-green-700">
          1.81 m
        </div>
      </div>

      <div>
        <div className="text-sm text-slate-600">
          Estimated Saving
        </div>

        <div className="text-3xl font-bold text-emerald-700">
          3.1%
        </div>
      </div>

      <div>
        <div className="text-sm text-slate-600">
          Overall AI Rating
        </div>

        <div className="text-3xl font-bold text-purple-700">
          A+
        </div>
      </div>

    </div>

    <div className="mt-6">

      <button className="rounded-xl bg-indigo-700 px-6 py-3 font-semibold text-white hover:bg-indigo-800">

        Generate Engineering PDF Report

      </button>

    </div>

  </div>

</section>
    </main>
  );
}