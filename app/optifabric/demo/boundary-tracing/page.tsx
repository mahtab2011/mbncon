"use client";

import Link from "next/link";
import PresentationProgress from "@/app/components/optifabric/PresentationProgress";
import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  calculatePolygonPixelArea,
  convertPixelAreaToSqInches,
} from "@/lib/optifabric/polygonAreaEngine";

import { PolygonPoint } from "@/lib/optifabric/polygonTypes";

type UploadedImage = {
  name: string;
  url: string;
};

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 560;

export default function BoundaryTracingDemoPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [uploadedImage, setUploadedImage] =
    useState<UploadedImage | null>(null);

  const [points, setPoints] = useState<PolygonPoint[]>([]);

  const [visibleScaleInches, setVisibleScaleInches] = useState(12);
  const [measuredScalePixels, setMeasuredScalePixels] = useState(600);

  const [message, setMessage] = useState(
    "Upload a clear pattern photograph to begin."
  );

  const pixelArea = useMemo(() => {
    return calculatePolygonPixelArea(points);
  }, [points]);

  const pixelsPerInch = useMemo(() => {
    if (visibleScaleInches <= 0 || measuredScalePixels <= 0) {
      return 0;
    }

    return measuredScalePixels / visibleScaleInches;
  }, [visibleScaleInches, measuredScalePixels]);

  const areaSqInches = useMemo(() => {
  if (
    visibleScaleInches <= 0 ||
    measuredScalePixels <= 0 ||
    points.length < 3
  ) {
    return 0;
  }

  return convertPixelAreaToSqInches(
    pixelArea,
    visibleScaleInches,
    measuredScalePixels
  );
}, [
  pixelArea,
  visibleScaleInches,
  measuredScalePixels,
  points.length,
]);

const drawImageContained = useCallback(
  (
    context: CanvasRenderingContext2D,
    image: HTMLImageElement,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const imageRatio = image.width / image.height;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imageRatio > canvasRatio) {
      drawHeight = canvasWidth / imageRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * imageRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    context.drawImage(
      image,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight
    );
  },
  []
);
const drawCanvas = useCallback(() => {
  const canvas = canvasRef.current;

  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#e2e8f0";
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (imageRef.current && uploadedImage) {
    drawImageContained(
      context,
      imageRef.current,
      canvas.width,
      canvas.height
    );
  } else {
    context.fillStyle = "#334155";
    context.font = "bold 24px Arial";
    context.textAlign = "center";

    context.fillText(
      "Upload a JPG, JPEG or PNG pattern photo",
      canvas.width / 2,
      canvas.height / 2 - 10
    );

    context.font = "18px Arial";

    context.fillText(
      "প্যাটার্নের JPG, JPEG অথবা PNG ছবি আপলোড করুন",
      canvas.width / 2,
      canvas.height / 2 + 28
    );
  }

  if (points.length === 0) {
    return;
  }

  context.beginPath();
  context.moveTo(points[0].x, points[0].y);

  points.slice(1).forEach((point) => {
    context.lineTo(point.x, point.y);
  });

  if (points.length >= 3) {
    context.closePath();

    context.fillStyle = "rgba(34, 211, 238, 0.18)";
    context.fill();
  }

  context.strokeStyle = "#0891b2";
  context.lineWidth = 3;
  context.stroke();

  points.forEach((point, index) => {
    context.beginPath();
    context.arc(point.x, point.y, 6, 0, Math.PI * 2);

    context.fillStyle = "#22d3ee";
    context.fill();

    context.strokeStyle = "#083344";
    context.lineWidth = 2;
    context.stroke();

    context.fillStyle = "#082f49";
    context.font = "bold 12px Arial";
    context.textAlign = "left";

    context.fillText(
      String(index + 1),
      point.x + 9,
      point.y - 9
    );
  });
}, [drawImageContained, points, uploadedImage]);
  
useEffect(() => {
  drawCanvas();
}, [drawCanvas]);

  useEffect(() => {
    return () => {
      if (uploadedImage?.url) {
        URL.revokeObjectURL(uploadedImage.url);
      }
    };
  }, [uploadedImage]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const supportedImageTypes = ["image/jpeg", "image/png"];

    if (file.type === "application/pdf") {
      alert(
        "PDF is accepted by OptiFabric, but this pilot tracing screen currently needs a JPG, JPEG or PNG image.\n\nOptiFabric PDF গ্রহণ করে, তবে এই পাইলট ট্রেসিং স্ক্রিনে JPG, JPEG অথবা PNG ছবি ব্যবহার করুন।"
      );

      event.target.value = "";
      return;
    }

    if (!supportedImageTypes.includes(file.type)) {
      alert(
        "Please upload JPG, JPEG or PNG for boundary tracing.\n\nবাউন্ডারি ট্রেসিংয়ের জন্য JPG, JPEG অথবা PNG আপলোড করুন।"
      );

      event.target.value = "";
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert(
        "The file is larger than 20 MB.\n\nফাইলের আকার ২০ MB-এর বেশি।"
      );

      event.target.value = "";
      return;
    }

    if (uploadedImage?.url) {
      URL.revokeObjectURL(uploadedImage.url);
    }

    const imageUrl = URL.createObjectURL(file);

    const image = new Image();

    image.onload = () => {
      imageRef.current = image;

      setUploadedImage({
        name: file.name,
        url: imageUrl,
      });

      setPoints([]);

      setMessage(
        "Image loaded. Click around the outside edge of the pattern."
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);

      alert(
        "The image could not be opened. Please try another file.\n\nছবিটি খোলা যায়নি। অনুগ্রহ করে অন্য ফাইল ব্যবহার করুন।"
      );
    };

    image.src = imageUrl;
  }

  function handleCanvasClick(event: MouseEvent<HTMLCanvasElement>) {
    if (!uploadedImage || !canvasRef.current) {
      setMessage("Please upload a pattern image first.");
      return;
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    setPoints((currentPoints) => [
  ...currentPoints,
  {
    id: `point-${Date.now()}-${currentPoints.length + 1}`,
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
  },
]);

    setMessage(
      "Point added. Continue clicking around the pattern boundary."
    );
  }

  function undoLastPoint() {
    setPoints((currentPoints) => currentPoints.slice(0, -1));

    setMessage("Last point removed.");
  }

  function clearTracing() {
    setPoints([]);

    setMessage(
      "Tracing cleared. Click around the pattern edge to start again."
    );
  }

  function finishTracing() {
    if (points.length < 3) {
      setMessage(
        "Please add at least three points before completing the boundary."
      );

      return;
    }

    setMessage(
      "Boundary completed. Review the area and calibration result."
    );
  }

  
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <PresentationProgress currentStep={2} />
        <Link
          href="/optifabric/demo/photo-quality"
          className="text-cyan-300"
        >
          ← Back to Photo Quality Check
        </Link>

        <section className="mt-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
            STEP 2 OF 8
          </p>

          <h1 className="mt-4 text-4xl font-black">
            Trace the Pattern Boundary
          </h1>

          <p className="mt-3 text-2xl font-bold text-cyan-100">
            প্যাটার্নের সীমানা ট্রেস করুন
          </p>

          <p className="mt-5 max-w-4xl text-lg text-slate-300">
            Click around the outside edge of the pattern. OptiFabric will join
            the points and calculate the polygon area.
          </p>

          <p className="mt-3 max-w-4xl text-lg text-slate-400">
            প্যাটার্নের বাইরের সীমানা বরাবর ক্লিক করুন। OptiFabric বিন্দুগুলো
            যুক্ত করে পলিগনের ক্ষেত্রফল নির্ণয় করবে।
          </p>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl bg-slate-900 p-6 xl:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">
                  Interactive Pattern Canvas
                </h2>

                <p className="mt-1 text-slate-400">
                  ইন্টারঅ্যাকটিভ প্যাটার্ন ক্যানভাস
                </p>
              </div>

              <label className="cursor-pointer rounded-xl bg-cyan-400 px-6 py-3 font-black text-slate-950 hover:bg-cyan-300">
                Choose Pattern Image
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {uploadedImage && (
              <div className="mt-4 rounded-xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">
                  Selected file / নির্বাচিত ফাইল
                </p>

                <p className="mt-1 break-all font-bold text-cyan-300">
                  {uploadedImage.name}
                </p>
              </div>
            )}

            <div className="mt-6 overflow-hidden rounded-2xl border-4 border-cyan-700 bg-slate-200">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onClick={handleCanvasClick}
                className="block h-auto w-full cursor-crosshair"
              />
            </div>

            <div className="mt-5 rounded-2xl bg-blue-950 p-4">
              <p className="font-semibold text-cyan-200">{message}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={undoLastPoint}
                disabled={points.length === 0}
                className="rounded-xl border border-amber-500 px-5 py-3 font-bold text-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Undo Last Point / শেষ বিন্দু বাতিল
              </button>

              <button
                type="button"
                onClick={clearTracing}
                disabled={points.length === 0}
                className="rounded-xl border border-red-500 px-5 py-3 font-bold text-red-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear / মুছুন
              </button>

              <button
                type="button"
                onClick={finishTracing}
                disabled={points.length < 3}
                className="rounded-xl bg-green-500 px-5 py-3 font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Complete Boundary / সীমানা সম্পন্ন করুন
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl bg-slate-900 p-6">
              <h2 className="text-2xl font-black">
                AI Coach
              </h2>

              <p className="mt-1 text-cyan-200">
                AI সহায়ক
              </p>

              <div className="mt-5 rounded-2xl bg-blue-950 p-5">
                <p className="font-bold text-green-300">
                  What should I do?
                </p>

                <p className="mt-2 text-slate-200">
                  Start at one corner and click around the complete outside edge
                  of the pattern.
                </p>

                <p className="mt-5 font-bold text-green-300">
                  কী করবেন?
                </p>

                <p className="mt-2 text-slate-200">
                  একটি কোণা থেকে শুরু করে প্যাটার্নের সম্পূর্ণ বাইরের সীমানা
                  বরাবর ক্লিক করুন।
                </p>
              </div>

              <div className="mt-5 rounded-2xl bg-yellow-950 p-5">
                <p className="font-bold text-yellow-300">
                  Why does AI ask this?
                </p>

                <p className="mt-2 text-slate-200">
                  The boundary points create the polygon used for area,
                  consumption and nesting calculations.
                </p>

                <p className="mt-5 font-bold text-yellow-300">
                  AI কেন এটি জানতে চায়?
                </p>

                <p className="mt-2 text-slate-200">
                  এই সীমানার বিন্দুগুলো থেকে পলিগন তৈরি হয়। এর সাহায্যে
                  ক্ষেত্রফল, কাপড়ের ব্যবহার এবং নেস্টিং হিসাব করা হয়।
                </p>
              </div>

              <div className="mt-5 rounded-2xl bg-green-950 p-5">
                <p className="font-black text-green-300">
                  No CAD Experience Required
                </p>

                <p className="mt-2 text-green-100">
                  Click carefully around the edge. You can undo any incorrect
                  point.
                </p>

                <p className="mt-4 font-black text-green-300">
                  CAD অভিজ্ঞতা প্রয়োজন নেই
                </p>

                <p className="mt-2 text-green-100">
                  সীমানা বরাবর সাবধানে ক্লিক করুন। ভুল বিন্দু সহজেই বাতিল করা
                  যাবে।
                </p>
              </div>
            </section>

            <section className="rounded-3xl bg-slate-900 p-6">
              <h2 className="text-2xl font-black">
                Scale Calibration
              </h2>

              <p className="mt-1 text-slate-400">
                স্কেল ক্যালিব্রেশন
              </p>

              <label className="mt-5 block">
                <span className="font-bold">
                  Visible ruler length in inches
                </span>

                <span className="mt-1 block text-sm text-slate-400">
                  দৃশ্যমান স্কেলের দৈর্ঘ্য
                </span>

                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={visibleScaleInches}
                  onChange={(event) =>
                    setVisibleScaleInches(Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-xl bg-slate-800 p-4"
                />
              </label>

              <label className="mt-5 block">
                <span className="font-bold">
                  Measured ruler length in pixels
                </span>

                <span className="mt-1 block text-sm text-slate-400">
                  পিক্সেলে স্কেলের দৈর্ঘ্য
                </span>

                <input
                  type="number"
                  min="1"
                  value={measuredScalePixels}
                  onChange={(event) =>
                    setMeasuredScalePixels(Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-xl bg-slate-800 p-4"
                />
              </label>

              <div className="mt-5 rounded-xl bg-cyan-950 p-4">
                <p className="text-sm text-cyan-300">
                  Pixels per inch
                </p>

                <p className="mt-1 text-3xl font-black">
                  {pixelsPerInch > 0
                    ? pixelsPerInch.toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </section>

            <section className="rounded-3xl bg-slate-900 p-6">
              <h2 className="text-2xl font-black">
                Tracing Result
              </h2>

              <p className="mt-1 text-slate-400">
                ট্রেসিং ফলাফল
              </p>

              <div className="mt-5 grid gap-4">
                <div className="rounded-xl bg-slate-800 p-4">
                  <p className="text-sm text-slate-400">
                    Boundary points
                  </p>

                  <p className="mt-1 text-3xl font-black">
                    {points.length}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-800 p-4">
                  <p className="text-sm text-slate-400">
                    Polygon pixel area
                  </p>

                  <p className="mt-1 text-3xl font-black">
                    {pixelArea.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-xl bg-green-950 p-4">
                  <p className="text-sm text-green-300">
                    Estimated real area
                  </p>

                  <p className="mt-1 text-3xl font-black text-green-100">
                    {areaSqInches.toFixed(2)} sq in
                  </p>

                  <p className="mt-1 text-sm text-green-300">
                    আনুমানিক প্রকৃত ক্ষেত্রফল
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-slate-900 p-8 text-center">
          <h2 className="text-3xl font-black">
            Boundary Ready?
          </h2>

          <p className="mt-2 text-xl font-bold text-cyan-200">
            সীমানা প্রস্তুত?
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-slate-300">
            Complete the polygon before continuing to marker and fabric
            analysis.
          </p>

          <div className="mt-7">
            {points.length >= 3 ? (
              <Link
                href="/optifabric/demo/polygon"
                className="inline-block rounded-2xl bg-cyan-400 px-9 py-4 text-lg font-black text-slate-950 hover:bg-cyan-300"
              >
                Continue to Polygon Nesting →
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-2xl bg-slate-700 px-9 py-4 text-lg font-black text-slate-400"
              >
                Add at least 3 boundary points
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}