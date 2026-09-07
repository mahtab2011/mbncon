"use client";

interface ScaleCalibrationPanelProps {
  referenceLengthCm: number;

  calibrated: boolean;

  pixelsPerCm?: number;
  pixelsPerInch?: number;

  measuredPixels?: number;

  firstPointSelected: boolean;
  secondPointSelected: boolean;

  automaticStatus?: string;
  automaticConfidence?: number | null;

  automaticMessage?: string;

  warnings?: string[];

  busy?: boolean;

  onDetectScale?: () => void;
  onResetScale?: () => void;
}

function formatNumber(
  value: number | undefined,
  decimals = 4
): string {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return value.toFixed(decimals);
}

export default function ScaleCalibrationPanel({
  referenceLengthCm,

  calibrated,

  pixelsPerCm,
  pixelsPerInch,

  measuredPixels,

  firstPointSelected,
  secondPointSelected,

  automaticStatus = "not-started",
  automaticConfidence = null,

  automaticMessage = "",

  warnings = [],

  busy = false,

  onDetectScale,
  onResetScale,
}: ScaleCalibrationPanelProps) {
  const selectedPointCount = [
    firstPointSelected,
    secondPointSelected,
  ].filter(Boolean).length;

  const confidenceText =
    typeof automaticConfidence ===
      "number" &&
    Number.isFinite(
      automaticConfidence
    )
      ? `${automaticConfidence.toFixed(
          1
        )}%`
      : "—";

  return (
    <section className="rounded-3xl border border-amber-400/20 bg-amber-950/10 p-6">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">
        Scale calibration
      </p>

      <h2 className="mt-2 text-xl font-black">
        Detect the 12-inch Scale
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        Use automatic scale detection
        first. Manual two-point
        calibration remains available
        as an engineering backup.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <CalibrationValue
          label="Reference"
          value={`${formatNumber(
            referenceLengthCm,
            2
          )} cm`}
        />

        <CalibrationValue
          label="Selected points"
          value={`${selectedPointCount} / 2`}
        />

        <CalibrationValue
          label="Pixels / cm"
          value={formatNumber(
            pixelsPerCm,
            4
          )}
        />

        <CalibrationValue
          label="Pixels / inch"
          value={formatNumber(
            pixelsPerInch,
            4
          )}
        />

        <CalibrationValue
          label="Measured pixels"
          value={formatNumber(
            measuredPixels,
            2
          )}
        />

        <CalibrationValue
          label="Calibration"
          value={
            calibrated
              ? "Calibrated"
              : "Pending"
          }
        />

        <CalibrationValue
          label="AI status"
          value={automaticStatus.replace(
            /-/g,
            " "
          )}
        />

        <CalibrationValue
          label="AI confidence"
          value={confidenceText}
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onDetectScale}
          disabled={busy}
          className="rounded-xl bg-amber-400 px-5 py-3 font-black text-slate-950 transition enabled:hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {busy
            ? "AI Detecting Scale..."
            : "AI Detect Scale"}
        </button>

        <button
          type="button"
          onClick={onResetScale}
          disabled={
            !firstPointSelected &&
            !secondPointSelected &&
            !calibrated
          }
          className="rounded-xl border border-red-400/30 bg-red-950/20 px-5 py-3 font-black text-red-300 transition enabled:hover:bg-red-950/40 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-600"
        >
          Reset Scale
        </button>
      </div>

      {automaticMessage ? (
        <div className="mt-5 rounded-xl border border-amber-400/20 bg-slate-950/50 p-4 text-sm leading-6 text-amber-100">
          {automaticMessage}
        </div>
      ) : null}

      {warnings.length > 0 ? (
        <div className="mt-5 space-y-2">
          <p className="font-black text-red-300">
            Calibration warnings
          </p>

          {warnings.map(
            (warning) => (
              <div
                key={warning}
                className="rounded-xl border border-red-400/20 bg-red-950/10 px-4 py-3 text-sm leading-6 text-red-100"
              >
                {warning}
              </div>
            )
          )}
        </div>
      ) : null}

      <div className="mt-5 rounded-xl border border-amber-400/20 bg-slate-950/50 p-4">
        <p className="text-sm text-slate-400">
          Manual backup
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          Select the Calibrate Scale
          tool, click the 0-inch ruler
          point, and then click the
          12-inch ruler point.
        </p>
      </div>
    </section>
  );
}

function CalibrationValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-black capitalize text-white">
        {value}
      </p>
    </div>
  );
}