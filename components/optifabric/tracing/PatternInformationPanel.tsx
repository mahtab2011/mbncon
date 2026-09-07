"use client";

interface PatternInformationPanelProps {
  patternName: string;

  patternId?: string;

  fileName?: string;
  fileType?: string;
  fileSize?: number;

  materialCategory?: string;

  scaleVisible?: boolean;
  grainLineVisible?: boolean;
  notchesVisible?: boolean;
  validationPassed?: boolean;
}

function formatFileSize(
  fileSize?: number
): string {
  if (
    typeof fileSize !== "number" ||
    !Number.isFinite(fileSize) ||
    fileSize <= 0
  ) {
    return "—";
  }

  if (fileSize < 1024) {
    return `${fileSize} B`;
  }

  if (fileSize < 1024 ** 2) {
    return `${(
      fileSize / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    fileSize /
    1024 ** 2
  ).toFixed(2)} MB`;
}

function formatBooleanStatus(
  value?: boolean
): string {
  if (value === true) {
    return "Yes";
  }

  if (value === false) {
    return "No";
  }

  return "Unknown";
}

export default function PatternInformationPanel({
  patternName,

  patternId,

  fileName,
  fileType,
  fileSize,

  materialCategory,

  scaleVisible,
  grainLineVisible,
  notchesVisible,
  validationPassed,
}: PatternInformationPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-slate-400">
        Pattern information
      </p>

      <h2 className="mt-2 text-2xl font-black text-white">
        {patternName}
      </h2>

      <div className="mt-5 space-y-3">
        <InformationRow
          label="Pattern ID"
          value={patternId || "—"}
        />

        <InformationRow
          label="File name"
          value={fileName || "—"}
        />

        <InformationRow
          label="File type"
          value={fileType || "—"}
        />

        <InformationRow
          label="File size"
          value={formatFileSize(
            fileSize
          )}
        />

        <InformationRow
          label="Material"
          value={
            materialCategory || "—"
          }
        />

        <InformationRow
          label="Scale visible"
          value={formatBooleanStatus(
            scaleVisible
          )}
        />

        <InformationRow
          label="Grain line visible"
          value={formatBooleanStatus(
            grainLineVisible
          )}
        />

        <InformationRow
          label="Notches visible"
          value={formatBooleanStatus(
            notchesVisible
          )}
        />

        <InformationRow
          label="Validation"
          value={
            validationPassed === true
              ? "Passed"
              : validationPassed === false
                ? "Requires review"
                : "Not checked"
          }
        />
      </div>
    </section>
  );
}

function InformationRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3">
      <span className="text-sm font-bold text-slate-400">
        {label}
      </span>

      <span className="max-w-[60%] break-words text-right font-black text-white">
        {value}
      </span>
    </div>
  );
}