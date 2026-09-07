"use client";

import Link from "next/link";
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import PresentationProgress from "@/app/components/optifabric/PresentationProgress";

import {
  getPatternPieceById,
} from "@/lib/optifabric/masters";

import {
  recognizePatternPiece,
  type PatternRecognitionResult,
  type RecognitionImageQuality,
} from "@/lib/optifabric/patternRecognitionPipeline";

import {
  completeWorkflowStep,
  loadWorkflowState,
  saveWorkflowState,
  type OptiFabricWorkflowState,
} from "@/lib/optifabric/workflow";

const uploadSteps = [
  {
    english: "Upload the pattern photo or PDF.",
    bangla: "Pattern-এর ছবি অথবা PDF upload করুন।",
  },
  {
    english: "Confirm that the 12-inch scale is visible.",
    bangla:
      "১২ ইঞ্চি scale পরিষ্কারভাবে দেখা যাচ্ছে কি না নিশ্চিত করুন।",
  },
  {
    english:
      "AI checks the active dataset and expected pattern piece.",
    bangla:
      "AI active dataset এবং expected pattern piece যাচাই করে।",
  },
  {
    english:
      "AI predicts the garment category and pattern-piece identity.",
    bangla:
      "AI garment category এবং pattern-piece identity অনুমান করে।",
  },
  {
    english:
      "The recognition result is saved for processing and tracing.",
    bangla:
      "Recognition result processing ও tracing-এর জন্য সংরক্ষণ করা হয়।",
  },
];

type ScaleVisibility =
  | "clear"
  | "partial"
  | "missing";

type ScaleLengthOption =
  | "12-inch"
  | "30-cm"
  | "custom";

type UploadStatus =
  | "idle"
  | "ready"
  | "recognizing"
  | "recognized"
  | "error";

function formatFileSize(
  sizeBytes: number
): string {
  if (sizeBytes < 1024) {
    return `${sizeBytes} bytes`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }

  return `${(
    sizeBytes /
    (1024 * 1024)
  ).toFixed(2)} MB`;
}

function getFileSourceType(
  file: File
): "image" | "pdf" {
  return file.type === "application/pdf"
    ? "pdf"
    : "image";
}

function getImageQuality(
  scaleVisibility: ScaleVisibility
): RecognitionImageQuality {
  if (scaleVisibility === "clear") {
    return "good";
  }

  if (scaleVisibility === "partial") {
    return "acceptable";
  }

  return "poor";
}

function getRecognitionStatusClass(
  status: PatternRecognitionResult["status"]
): string {
  if (status === "recognized") {
    return "border-emerald-400/40 bg-emerald-950/40 text-emerald-300";
  }

  if (status === "review-required") {
    return "border-amber-400/40 bg-amber-950/40 text-amber-300";
  }

  return "border-red-400/40 bg-red-950/40 text-red-300";
}

function getRecognitionStatusLabel(
  status: PatternRecognitionResult["status"]
): string {
  if (status === "recognized") {
    return "RECOGNISED";
  }

  if (status === "review-required") {
    return "REVIEW REQUIRED";
  }

  return "RECOGNITION FAILED";
}

export default function OptiFabricPatternUploadPage() {
  const [workflow, setWorkflow] =
    useState<OptiFabricWorkflowState | null>(
      null
    );

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [
    expectedDatasetPatternPieceId,
    setExpectedDatasetPatternPieceId,
  ] = useState("");

  const [
    operatorDescription,
    setOperatorDescription,
  ] = useState("");

  const [
    visibleText,
    setVisibleText,
  ] = useState("");

  const [
    scaleLength,
    setScaleLength,
  ] = useState<ScaleLengthOption>(
    "12-inch"
  );

  const [
    scaleVisibility,
    setScaleVisibility,
  ] = useState<ScaleVisibility>(
    "clear"
  );

  const [
    grainLineVisible,
    setGrainLineVisible,
  ] = useState(true);

  const [
    notchesVisible,
    setNotchesVisible,
  ] = useState(true);

  const [
    uploadStatus,
    setUploadStatus,
  ] = useState<UploadStatus>("idle");

  const [
    recognitionResult,
    setRecognitionResult,
  ] =
    useState<PatternRecognitionResult | null>(
      null
    );

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  useEffect(() => {
    const storedWorkflow =
      loadWorkflowState();

    if (!storedWorkflow) {
      return;
    }

    setWorkflow(storedWorkflow);

    const firstDatasetPiece =
      storedWorkflow.patternPieces[0];

    if (firstDatasetPiece) {
      setExpectedDatasetPatternPieceId(
        firstDatasetPiece.id
      );
    }
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const expectedDatasetPiece =
    useMemo(() => {
      if (!workflow) {
        return undefined;
      }

      return workflow.patternPieces.find(
        (piece) =>
          piece.id ===
          expectedDatasetPatternPieceId
      );
    }, [
      workflow,
      expectedDatasetPatternPieceId,
    ]);

  const expectedPatternMaster =
    useMemo(() => {
      if (!expectedDatasetPiece) {
        return undefined;
      }

      return getPatternPieceById(
        expectedDatasetPiece.patternPieceId
      );
    }, [expectedDatasetPiece]);

  const isPdf =
    selectedFile?.type ===
    "application/pdf";

  const canRunRecognition =
    selectedFile !== null &&
    uploadStatus !== "recognizing";

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    setRecognitionResult(null);
    setErrorMessage("");

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }

    if (!file) {
      setSelectedFile(null);
      setUploadStatus("idle");
      return;
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    const allowedByExtension =
      /\.(jpg|jpeg|png|webp|pdf)$/i.test(
        file.name
      );

    if (
      !allowedMimeTypes.includes(
        file.type
      ) &&
      !allowedByExtension
    ) {
      setSelectedFile(null);
      setUploadStatus("error");
      setErrorMessage(
        "Please upload a JPG, JPEG, PNG, WEBP or PDF file."
      );
      return;
    }

    const maximumSizeBytes =
      20 * 1024 * 1024;

    if (file.size > maximumSizeBytes) {
      setSelectedFile(null);
      setUploadStatus("error");
      setErrorMessage(
        "The selected file is larger than 20 MB. Please reduce the file size and try again."
      );
      return;
    }

    setSelectedFile(file);
    setUploadStatus("ready");

    if (
      file.type.startsWith("image/")
    ) {
      setPreviewUrl(
        URL.createObjectURL(file)
      );
    }
  }

  function saveRecognitionToWorkflow(
    result: PatternRecognitionResult
  ) {
    if (
      !workflow ||
      !selectedFile ||
      !expectedDatasetPiece
    ) {
      return;
    }

    const updatedPatternResults =
      workflow.patternResults.map(
        (patternResult) => {
          if (
            patternResult.datasetPatternPieceId !==
            expectedDatasetPiece.id
          ) {
            return patternResult;
          }

          return {
            ...patternResult,

            sourceFileName:
              selectedFile.name,

            sourceFileType:
              selectedFile.type ||
              getFileSourceType(
                selectedFile
              ),

            recognitionConfidencePercent:
              result.patternPieceConfidencePercent,

            recognisedPatternPieceId:
              result.patternPieceId,

            warnings: [
              ...result.engineeringWarnings,
            ],
          };
        }
      );

    const updatedWorkflow: OptiFabricWorkflowState =
      {
        ...workflow,

        patternResults:
          updatedPatternResults,

        engineeringRecommendations: [
          ...new Set([
            ...workflow.engineeringRecommendations,
            ...result.engineeringRecommendations,
          ]),
        ],

        workflowWarnings: [
          ...new Set([
            ...workflow.workflowWarnings,
            ...result.engineeringWarnings,
          ]),
        ],

        updatedAt:
          new Date().toISOString(),
      };

    saveWorkflowState(
      updatedWorkflow
    );

    const progressedWorkflow =
      completeWorkflowStep(
        updatedWorkflow,
        "pattern-upload",
        "pattern-processing"
      );

    setWorkflow(progressedWorkflow);
  }

  function runRecognition() {
    if (!selectedFile) {
      setUploadStatus("error");
      setErrorMessage(
        "Please select a pattern image or PDF before running AI recognition."
      );
      return;
    }

    setUploadStatus("recognizing");
    setErrorMessage("");

    try {
      const result =
        recognizePatternPiece({
          fileName:
            selectedFile.name,

          sourceType:
            getFileSourceType(
              selectedFile
            ),

          selectedGarmentCategoryId:
            workflow?.garmentCategoryId,

          expectedPatternPieceId:
            expectedDatasetPiece
              ?.patternPieceId,

          visibleText:
            visibleText.trim() ||
            undefined,

          operatorDescription:
            operatorDescription.trim() ||
            expectedPatternMaster
              ?.name.en ||
            undefined,

          imageQuality:
            getImageQuality(
              scaleVisibility
            ),

          hasScaleReference:
            scaleVisibility !==
            "missing",

          hasVisibleGrainLine:
            grainLineVisible,

          hasVisibleNotches:
            notchesVisible,
        });

      setRecognitionResult(result);
      saveRecognitionToWorkflow(result);

      setUploadStatus(
        result.status === "failed"
          ? "error"
          : "recognized"
      );
    } catch (error) {
      setUploadStatus("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "AI pattern recognition could not be completed."
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white sm:p-6">
      <div className="mx-auto max-w-7xl">
        <PresentationProgress
          currentStep={0}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={
              workflow
                ? "/optifabric/engineering-wizard"
                : "/optifabric/cutting-assistant"
            }
            className="inline-block text-sm text-cyan-300 transition hover:text-cyan-200"
          >
            <span className="block">
              {workflow
                ? "← Back to Engineering Wizard"
                : "← Back to Cutting Assistant"}
            </span>

            <span className="mt-1 block text-slate-400">
              {workflow
                ? "← Engineering Wizard-এ ফিরে যান"
                : "← Cutting Assistant-এ ফিরে যান"}
            </span>
          </Link>

          <span
            className={`w-fit rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${
              workflow
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                : "border-amber-400/40 bg-amber-400/10 text-amber-300"
            }`}
          >
            {workflow
              ? `Active Job: ${workflow.datasetCode}`
              : "No Active Dataset"}
          </span>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <p className="font-semibold text-cyan-300">
            Global Demo 001 · Pattern
            Upload and Recognition
          </p>

          <p className="mt-2 font-bold text-cyan-200">
            Global Demo 001 · Pattern
            upload ও recognition
          </p>

          <h1 className="mt-5 text-4xl font-bold">
            Upload, Calibrate and
            Recognise Pattern
          </h1>

          <h2 className="mt-3 text-2xl font-black text-cyan-300">
            Pattern upload, calibration
            এবং AI recognition
          </h2>

          <p className="mt-5 max-w-4xl leading-8 text-slate-300">
            Upload one pattern piece per
            image or PDF. OptiFabric AI
            checks the active engineering
            dataset, expected garment
            category, expected pattern
            piece, scale visibility, grain
            line and notches before the
            tracing stage.
          </p>

          <p className="mt-4 max-w-4xl leading-8 text-slate-400">
            প্রতিটি image অথবা PDF-এ একটি
            pattern piece upload করুন।
            OptiFabric AI tracing stage-এর
            আগে active engineering dataset,
            expected garment category,
            expected pattern piece, scale,
            grain line এবং notch যাচাই করে।
          </p>
        </section>

        {workflow && (
          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <SummaryCard
              label="Dataset"
              value={workflow.datasetCode}
              detail={workflow.datasetName}
            />

            <SummaryCard
              label="Garment"
              value={
                workflow.garmentCategoryName
              }
              detail={
                workflow.garmentCategoryId
              }
            />

            <SummaryCard
              label="Fabric Width"
              value={`${workflow.fabricSpecification.fabricWidth}`}
              detail={
                workflow.fabricSpecification.fabricWidthUnit
              }
            />

            <SummaryCard
              label="Order Quantity"
              value={workflow.orderPlan.orderQuantity.toLocaleString(
                "en-GB"
              )}
              detail="garments"
            />

            <SummaryCard
              label="Workflow Step"
              value="Pattern Upload"
              detail="AI recognition preparation"
            />
          </section>
        )}

        {!workflow && (
          <section className="mt-6 rounded-2xl border border-amber-400/40 bg-amber-950/30 p-5">
            <h2 className="font-black text-amber-300">
              No active engineering
              dataset was found
            </h2>

            <p className="mt-3 leading-relaxed text-amber-100">
              You can still test the
              uploader, but garment and
              pattern-piece recognition
              will be more reliable after
              starting EDS-001 from the
              Global Demo page.
            </p>

            <Link
              href="/optifabric/global-demo"
              className="mt-4 inline-block rounded-xl bg-amber-300 px-5 py-3 font-black text-slate-950"
            >
              Start Global Demo 001
            </Link>
          </section>
        )}

        <section className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">
              Upload Pattern File
            </h2>

            <h3 className="mt-2 text-xl font-black text-cyan-300">
              Pattern file upload করুন
            </h3>

            {workflow && (
              <>
                <label className="mt-6 block text-sm font-semibold text-slate-300">
                  <span className="block">
                    Expected pattern piece
                  </span>

                  <span className="mt-1 block text-slate-400">
                    প্রত্যাশিত pattern piece
                  </span>
                </label>

                <select
                  value={
                    expectedDatasetPatternPieceId
                  }
                  onChange={(event) => {
                    setExpectedDatasetPatternPieceId(
                      event.target.value
                    );

                    setRecognitionResult(
                      null
                    );
                  }}
                  className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-800 p-4 text-slate-200"
                >
                  {workflow.patternPieces.map(
                    (datasetPiece) => {
                      const pieceMaster =
                        getPatternPieceById(
                          datasetPiece.patternPieceId
                        );

                      return (
                        <option
                          key={
                            datasetPiece.id
                          }
                          value={
                            datasetPiece.id
                          }
                        >
                          {pieceMaster
                            ?.name.en ??
                            datasetPiece
                              .patternPieceId}
                        </option>
                      );
                    }
                  )}
                </select>
              </>
            )}

            <label className="mt-6 block text-sm font-semibold text-slate-300">
              <span className="block">
                Pattern photo or PDF
              </span>

              <span className="mt-1 block text-slate-400">
                Pattern-এর ছবি অথবা PDF
              </span>
            </label>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
              onChange={handleFileChange}
              className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-800 p-4 text-slate-300"
            />

            {selectedFile && (
              <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
                <p className="font-bold text-white">
                  {selectedFile.name}
                </p>

                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                  <span>
                    {selectedFile.type ||
                      "File type unavailable"}
                  </span>

                  <span>•</span>

                  <span>
                    {formatFileSize(
                      selectedFile.size
                    )}
                  </span>
                </div>
              </div>
            )}

            {previewUrl && (
              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-700 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Uploaded pattern preview"
                  className="max-h-[520px] w-full object-contain"
                />
              </div>
            )}

            {isPdf && selectedFile && (
              <div className="mt-5 rounded-xl border border-violet-400/30 bg-violet-950/30 p-4">
                <p className="font-bold text-violet-200">
                  PDF uploaded
                </p>

                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  The PDF is ready for the
                  document-processing stage.
                  Image preview is currently
                  shown only for JPG, PNG and
                  WEBP files.
                </p>
              </div>
            )}

            <label className="mt-6 block text-sm font-semibold text-slate-300">
              <span className="block">
                Operator description
              </span>

              <span className="mt-1 block text-slate-400">
                Operator-এর pattern
                description
              </span>
            </label>

            <input
              type="text"
              value={operatorDescription}
              onChange={(event) =>
                setOperatorDescription(
                  event.target.value
                )
              }
              placeholder={
                expectedPatternMaster
                  ? `Example: ${expectedPatternMaster.name.en}`
                  : "Example: Men's shirt front panel"
              }
              className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-800 p-4 text-slate-200 placeholder:text-slate-500"
            />

            <label className="mt-5 block text-sm font-semibold text-slate-300">
              <span className="block">
                Visible text on the pattern
              </span>

              <span className="mt-1 block text-slate-400">
                Pattern-এ দৃশ্যমান লেখা
              </span>
            </label>

            <input
              type="text"
              value={visibleText}
              onChange={(event) =>
                setVisibleText(
                  event.target.value
                )
              }
              placeholder="Example: FRONT, SIZE M, STYLE 001"
              className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-800 p-4 text-slate-200 placeholder:text-slate-500"
            />

            <div className="mt-5 rounded-xl border border-cyan-800 bg-cyan-950/40 p-4">
              <p className="text-sm font-semibold text-cyan-300">
                Why does AI ask this?
              </p>

              <p className="mt-1 text-sm font-bold text-cyan-200">
                AI কেন এই file ও description
                চায়?
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                The file provides the pattern
                source. The filename, visible
                text, operator description and
                active dataset help the MVP
                recognition pipeline identify
                the garment and expected
                pattern piece.
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                File থেকে pattern source পাওয়া
                যায়। Filename, visible text,
                operator description এবং active
                dataset MVP recognition
                pipeline-কে garment ও pattern
                piece শনাক্ত করতে সাহায্য করে।
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">
              Scale and Pattern Quality
            </h2>

            <h3 className="mt-2 text-xl font-black text-cyan-300">
              Scale ও pattern quality
            </h3>

            <label className="mt-6 block text-sm font-semibold text-slate-300">
              <span className="block">
                Visible scale length
              </span>

              <span className="mt-1 block text-slate-400">
                দৃশ্যমান scale-এর দৈর্ঘ্য
              </span>
            </label>

            <select
              value={scaleLength}
              onChange={(event) =>
                setScaleLength(
                  event.target
                    .value as ScaleLengthOption
                )
              }
              className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-800 p-4 text-slate-300"
            >
              <option value="12-inch">
                12 inches · ১২ ইঞ্চি
              </option>

              <option value="30-cm">
                30 cm · ৩০ সেন্টিমিটার
              </option>

              <option value="custom">
                Custom scale · নিজস্ব scale
              </option>
            </select>

            <label className="mt-5 block text-sm font-semibold text-slate-300">
              <span className="block">
                Is the scale placed beside
                the pattern?
              </span>

              <span className="mt-1 block text-slate-400">
                Scale কি pattern-এর পাশে রাখা
                হয়েছে?
              </span>
            </label>

            <select
              value={scaleVisibility}
              onChange={(event) =>
                setScaleVisibility(
                  event.target
                    .value as ScaleVisibility
                )
              }
              className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-800 p-4 text-slate-300"
            >
              <option value="clear">
                Yes, clearly visible · হ্যাঁ,
                পরিষ্কারভাবে দেখা যাচ্ছে
              </option>

              <option value="partial">
                Partly visible · আংশিক দেখা
                যাচ্ছে
              </option>

              <option value="missing">
                Not visible · দেখা যাচ্ছে না
              </option>
            </select>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
                <input
                  type="checkbox"
                  checked={grainLineVisible}
                  onChange={(event) =>
                    setGrainLineVisible(
                      event.target.checked
                    )
                  }
                  className="mt-1 h-4 w-4"
                />

                <span>
                  <span className="block font-bold text-slate-200">
                    Grain line visible
                  </span>

                  <span className="mt-1 block text-sm text-slate-400">
                    Grain line দেখা যাচ্ছে
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
                <input
                  type="checkbox"
                  checked={notchesVisible}
                  onChange={(event) =>
                    setNotchesVisible(
                      event.target.checked
                    )
                  }
                  className="mt-1 h-4 w-4"
                />

                <span>
                  <span className="block font-bold text-slate-200">
                    Notches visible
                  </span>

                  <span className="mt-1 block text-sm text-slate-400">
                    Notch দেখা যাচ্ছে
                  </span>
                </span>
              </label>
            </div>

            <div className="mt-5 rounded-xl border border-cyan-800 bg-cyan-950/40 p-4">
              <p className="text-sm font-semibold text-cyan-300">
                Why does AI ask for scale,
                grain line and notches?
              </p>

              <p className="mt-1 text-sm font-bold text-cyan-200">
                AI কেন scale, grain line ও
                notch জানতে চায়?
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Scale converts pixels into
                real dimensions. Grain line
                controls pattern rotation and
                fabric direction. Notches help
                verify pattern identity and
                sewing alignment.
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Scale pixel-কে বাস্তব মাপে
                রূপান্তর করে। Grain line
                pattern rotation ও fabric
                direction নিয়ন্ত্রণ করে। Notch
                pattern identity ও sewing
                alignment যাচাই করতে সাহায্য
                করে।
              </p>
            </div>

            <button
              type="button"
              disabled={!canRunRecognition}
              onClick={runRecognition}
              className="mt-6 w-full rounded-2xl bg-cyan-500 px-6 py-4 font-black text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {uploadStatus ===
              "recognizing"
                ? "AI Recognition Running..."
                : "Run AI Pattern Recognition"}
            </button>

            {errorMessage && (
              <div className="mt-5 rounded-xl border border-red-400/40 bg-red-950/40 p-4">
                <p className="font-bold text-red-300">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>
        </section>

        {recognitionResult && (
          <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
                  AI Recognition Result
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Garment and Pattern-Piece
                  Prediction
                </h2>
              </div>

              <span
                className={`w-fit rounded-full border px-4 py-2 text-xs font-black ${getRecognitionStatusClass(
                  recognitionResult.status
                )}`}
              >
                {getRecognitionStatusLabel(
                  recognitionResult.status
                )}
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <RecognitionCard
                label="Recognised Garment"
                value={
                  recognitionResult.garmentCategoryName ??
                  "Not recognised"
                }
                code={
                  recognitionResult.garmentCategoryCode
                }
                confidence={
                  recognitionResult.garmentConfidencePercent
                }
              />

              <RecognitionCard
                label="Recognised Pattern Piece"
                value={
                  recognitionResult.patternPieceName ??
                  "Not recognised"
                }
                code={
                  recognitionResult.patternPieceCode
                }
                confidence={
                  recognitionResult.patternPieceConfidencePercent
                }
              />
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-950/30 p-5">
              <p className="font-black text-cyan-300">
                {
                  recognitionResult
                    .whyAiAsks.title
                }
              </p>

              <p className="mt-3 leading-relaxed text-slate-300">
                {
                  recognitionResult
                    .whyAiAsks.explanation
                }
              </p>

              <div className="mt-4 rounded-xl bg-slate-950/60 p-4">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-amber-300">
                  Engineering Impact
                </p>

                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {
                    recognitionResult
                      .whyAiAsks
                      .engineeringImpact
                  }
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-amber-400/30 bg-amber-950/20 p-5">
                <h3 className="font-black text-amber-300">
                  Engineering Warnings
                </h3>

                {recognitionResult
                  .engineeringWarnings.length >
                0 ? (
                  <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-amber-100">
                    {recognitionResult.engineeringWarnings.map(
                      (warning) => (
                        <li key={warning}>
                          {warning}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-emerald-300">
                    No recognition warning was
                    generated.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-950/20 p-5">
                <h3 className="font-black text-emerald-300">
                  AI Engineering
                  Recommendations
                </h3>

                <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-emerald-100">
                  {recognitionResult.engineeringRecommendations.map(
                    (recommendation) => (
                      <li
                        key={
                          recommendation
                        }
                      >
                        {recommendation}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={runRecognition}
                className="rounded-xl border border-slate-600 bg-slate-950 px-5 py-3 font-bold text-slate-200 transition hover:border-slate-400"
              >
                Run Recognition Again
              </button>

              <Link
                href="/optifabric/cutting-assistant/pattern-analysis"
                className="rounded-xl bg-cyan-400 px-5 py-3 text-center font-black text-slate-950 transition hover:bg-cyan-300"
              >
                Continue to Pattern
                Processing →
              </Link>
            </div>
          </section>
        )}

        <section className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold">
            Upload and Recognition Workflow
          </h2>

          <h3 className="mt-2 text-xl font-black text-cyan-300">
            Upload ও recognition কার্যপ্রবাহ
          </h3>

          <div className="mt-6 space-y-4">
            {uploadSteps.map(
              (step, index) => (
                <div
                  key={step.english}
                  className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 font-black text-cyan-300">
                    {index + 1}
                  </div>

                  <div>
                    <p className="font-bold text-slate-200">
                      {step.english}
                    </p>

                    <p className="mt-2 text-slate-400">
                      {step.bangla}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-black text-white">
        {value}
      </p>

      <p className="mt-1 text-xs leading-relaxed text-slate-400">
        {detail}
      </p>
    </article>
  );
}

function RecognitionCard({
  label,
  value,
  code,
  confidence,
}: {
  label: string;
  value: string;
  code?: string;
  confidence: number;
}) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
      <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-2xl font-black text-white">
        {value}
      </p>

      {code && (
        <p className="mt-1 font-mono text-xs text-cyan-300">
          {code}
        </p>
      )}

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">
            Confidence
          </span>

          <span className="font-black text-cyan-300">
            {confidence}%
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-cyan-400"
            style={{
              width: `${confidence}%`,
            }}
          />
        </div>
      </div>
    </article>
  );
}