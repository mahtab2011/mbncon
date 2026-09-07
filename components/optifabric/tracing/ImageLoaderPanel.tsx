"use client";

import {
  ChangeEvent,
  RefObject,
} from "react";

interface ImageLoaderPanelProps {
  fileInputRef?:
    RefObject<HTMLInputElement | null>;

  imageLoaded: boolean;

  currentFileName?: string;

  message?: string;

  onFileChange:
    (
      event:
        ChangeEvent<HTMLInputElement>
    ) => void;

  onOpenFileDialog?: () => void;
}

export default function ImageLoaderPanel({
  fileInputRef,

  imageLoaded,

  currentFileName,

  message,

  onFileChange,

  onOpenFileDialog,
}: ImageLoaderPanelProps) {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-6">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
        Pattern image
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Load Tracing Image
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        Load a PNG, JPG or JPEG image
        containing one garment pattern
        piece and a visible reference
        scale.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        onChange={onFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={onOpenFileDialog}
        className="mt-5 w-full rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
      >
        {imageLoaded
          ? "Replace Tracing Image"
          : "Load Tracing Image"}
      </button>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ImageValue
          label="Image status"
          value={
            imageLoaded
              ? "Loaded"
              : "Not loaded"
          }
        />

        <ImageValue
          label="Current file"
          value={
            currentFileName || "—"
          }
        />
      </div>

      {message ? (
        <div className="mt-5 rounded-xl border border-cyan-400/20 bg-slate-950/50 px-4 py-3 text-sm leading-6 text-cyan-100">
          {message}
        </div>
      ) : null}

      <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950/50 p-4">
        <p className="font-black text-white">
          Image guidance
        </p>

        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
          <li>
            Use one pattern piece per image.
          </li>

          <li>
            Keep the camera directly above
            the pattern.
          </li>

          <li>
            Keep the ruler and pattern on
            the same flat surface.
          </li>

          <li>
            Avoid shadows, blur and
            perspective distortion.
          </li>
        </ul>
      </div>
    </section>
  );
}

function ImageValue({
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

      <p className="mt-1 break-words font-black text-white">
        {value}
      </p>
    </div>
  );
}