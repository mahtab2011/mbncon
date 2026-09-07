"use client";

interface MarkerGenerationPanelProps {
  geometryReady: boolean;

  markerGenerated: boolean;

  generating?: boolean;

  fabricWidthCm: number;

  quantityPerPattern: number;

  pieceSpacingCm: number;

  edgeAllowanceCm: number;

  allowRotation: boolean;

  maximumMarkerLengthCm?: number | null;

  onFabricWidthChange: (
    value: number
  ) => void;

  onQuantityChange: (
    value: number
  ) => void;

  onPieceSpacingChange: (
    value: number
  ) => void;

  onEdgeAllowanceChange: (
    value: number
  ) => void;

  onAllowRotationChange: (
    value: boolean
  ) => void;

  onMaximumMarkerLengthChange: (
    value: number | null
  ) => void;

  onGenerate: () => void;

  onClear?: () => void;
}

export default function MarkerGenerationPanel({
  geometryReady,

  markerGenerated,

  generating = false,

  fabricWidthCm,

  quantityPerPattern,

  pieceSpacingCm,

  edgeAllowanceCm,

  allowRotation,

  maximumMarkerLengthCm = null,

  onFabricWidthChange,

  onQuantityChange,

  onPieceSpacingChange,

  onEdgeAllowanceChange,

  onAllowRotationChange,

  onMaximumMarkerLengthChange,

  onGenerate,

  onClear,
}: MarkerGenerationPanelProps) {
  const validFabricWidth =
    Number.isFinite(
      fabricWidthCm
    ) &&
    fabricWidthCm > 0;

  const validQuantity =
    Number.isFinite(
      quantityPerPattern
    ) &&
    quantityPerPattern > 0;

  const readyToGenerate =
    geometryReady &&
    validFabricWidth &&
    validQuantity &&
    !generating;

  return (
    <section className="rounded-3xl border border-violet-400/20 bg-violet-950/10 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-300">
            Marker generation
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            AI Marker Layout Controls
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Configure the fabric width,
            quantity, spacing, edge allowance
            and rotation rules before sending
            the saved engineering polygons to
            the marker-placement engine.
          </p>
        </div>

        <div
          className={`rounded-2xl border px-5 py-3 ${
            geometryReady
              ? "border-emerald-400/30 bg-emerald-950/30"
              : "border-amber-400/30 bg-amber-950/20"
          }`}
        >
          <p
            className={`text-xs font-black uppercase tracking-wider ${
              geometryReady
                ? "text-emerald-300"
                : "text-amber-300"
            }`}
          >
            Geometry
          </p>

          <p className="mt-1 text-xl font-black text-white">
            {geometryReady
              ? "READY"
              : "PENDING"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <NumberField
          label="Fabric Width"
          value={fabricWidthCm}
          min={1}
          step={0.1}
          suffix="cm"
          onChange={
            onFabricWidthChange
          }
        />

        <NumberField
          label="Quantity per Pattern"
          value={quantityPerPattern}
          min={1}
          step={1}
          suffix="pcs"
          integer
          onChange={
            onQuantityChange
          }
        />

        <NumberField
          label="Piece Spacing"
          value={pieceSpacingCm}
          min={0}
          step={0.1}
          suffix="cm"
          onChange={
            onPieceSpacingChange
          }
        />

        <NumberField
          label="Edge Allowance"
          value={edgeAllowanceCm}
          min={0}
          step={0.1}
          suffix="cm"
          onChange={
            onEdgeAllowanceChange
          }
        />

        <NullableNumberField
          label="Maximum Marker Length"
          value={
            maximumMarkerLengthCm
          }
          min={1}
          step={1}
          suffix="cm"
          placeholder="No limit"
          onChange={
            onMaximumMarkerLengthChange
          }
        />

        <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
            Rotation
          </p>

          <label className="mt-4 flex cursor-pointer items-center justify-between gap-4">
            <div>
              <p className="font-black text-white">
                Allow Rotation
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                The engine may use approved
                pattern rotations during
                placement.
              </p>
            </div>

            <input
              type="checkbox"
              checked={allowRotation}
              onChange={(event) =>
                onAllowRotationChange(
                  event.target.checked
                )
              }
              className="h-5 w-5 accent-violet-400"
            />
          </label>
        </div>
      </div>

      {!geometryReady ? (
        <div className="mt-5 rounded-xl border border-amber-400/30 bg-amber-950/20 p-4 text-sm leading-6 text-amber-100">
          Complete and save all
          marker-eligible pattern geometry
          before generating a project marker.
        </div>
      ) : null}

      {!validFabricWidth ? (
        <div className="mt-5 rounded-xl border border-red-400/30 bg-red-950/20 p-4 text-sm leading-6 text-red-100">
          Fabric width must be greater
          than zero.
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onGenerate}
          disabled={!readyToGenerate}
          className="flex-1 rounded-xl bg-violet-500 px-5 py-3 font-black text-white transition enabled:hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
        >
          {generating
            ? "AI Generating Marker..."
            : markerGenerated
              ? "Regenerate Marker Layout"
              : "Generate Marker Layout"}
        </button>

        {markerGenerated &&
        onClear ? (
          <button
            type="button"
            onClick={onClear}
            disabled={generating}
            className="rounded-xl border border-red-400/30 bg-red-950/20 px-5 py-3 font-black text-red-300 transition enabled:hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear Marker
          </button>
        ) : null}
      </div>

      <div
        className={`mt-5 rounded-xl border px-4 py-3 text-center font-black ${
          markerGenerated
            ? "border-emerald-400/30 bg-emerald-950/20 text-emerald-300"
            : geometryReady
              ? "border-violet-400/30 bg-violet-950/20 text-violet-200"
              : "border-amber-400/30 bg-amber-950/20 text-amber-300"
        }`}
      >
        {markerGenerated
          ? "✓ Marker Layout Available"
          : geometryReady
            ? "Ready to Generate Marker"
            : "Waiting for Complete Geometry"}
      </div>
    </section>
  );
}

function NumberField({
  label,
  value,
  min,
  step,
  suffix,
  integer = false,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  step: number;
  suffix: string;
  integer?: boolean;
  onChange: (
    value: number
  ) => void;
}) {
  return (
    <label className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
      <span className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <div className="mt-3 flex items-center gap-3">
        <input
          type="number"
          value={value}
          min={min}
          step={step}
          onChange={(event) => {
            const parsedValue =
              Number(
                event.target.value
              );

            if (
              Number.isFinite(
                parsedValue
              )
            ) {
              onChange(
                integer
                  ? Math.max(
                      min,
                      Math.floor(
                        parsedValue
                      )
                    )
                  : Math.max(
                      min,
                      parsedValue
                    )
              );
            }
          }}
          className="min-w-0 flex-1 rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 font-black text-white outline-none transition focus:border-violet-400"
        />

        <span className="font-black text-slate-400">
          {suffix}
        </span>
      </div>
    </label>
  );
}

function NullableNumberField({
  label,
  value,
  min,
  step,
  suffix,
  placeholder,
  onChange,
}: {
  label: string;
  value: number | null;
  min: number;
  step: number;
  suffix: string;
  placeholder: string;
  onChange: (
    value: number | null
  ) => void;
}) {
  return (
    <label className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
      <span className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <div className="mt-3 flex items-center gap-3">
        <input
          type="number"
          value={value ?? ""}
          min={min}
          step={step}
          placeholder={placeholder}
          onChange={(event) => {
            const rawValue =
              event.target.value;

            if (
              rawValue.trim() === ""
            ) {
              onChange(null);
              return;
            }

            const parsedValue =
              Number(rawValue);

            if (
              Number.isFinite(
                parsedValue
              )
            ) {
              onChange(
                Math.max(
                  min,
                  parsedValue
                )
              );
            }
          }}
          className="min-w-0 flex-1 rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 font-black text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400"
        />

        <span className="font-black text-slate-400">
          {suffix}
        </span>
      </div>
    </label>
  );
}