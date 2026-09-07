"use client";

interface BoundaryQualityBadgeProps {
  score: number;
  grade: "A" | "B" | "C" | "D";
}

function getBadgeClasses(
  grade: "A" | "B" | "C" | "D"
): string {
  if (grade === "A") {
    return "border-emerald-400/30 bg-emerald-950/30 text-emerald-200";
  }

  if (grade === "B") {
    return "border-cyan-400/30 bg-cyan-950/30 text-cyan-200";
  }

  if (grade === "C") {
    return "border-amber-400/30 bg-amber-950/30 text-amber-200";
  }

  return "border-red-400/30 bg-red-950/30 text-red-200";
}

export default function BoundaryQualityBadge({
  score,
  grade,
}: BoundaryQualityBadgeProps) {
  const safeScore = Math.max(
    0,
    Math.min(100, score)
  );

  return (
    <div
      className={`inline-flex items-center gap-4 rounded-2xl border px-5 py-4 ${getBadgeClasses(
        grade
      )}`}
    >
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">
          Boundary Quality
        </p>

        <p className="mt-1 text-3xl font-black">
          {safeScore.toFixed(0)}%
        </p>
      </div>

      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-current/20 bg-slate-950/30 text-2xl font-black">
        {grade}
      </div>
    </div>
  );
}