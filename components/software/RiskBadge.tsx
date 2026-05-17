type RiskLevel =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

type RiskBadgeProps = {
  level: RiskLevel | string;
};

export default function RiskBadge({
  level,
}: RiskBadgeProps) {
  const styles = {
    Low: "bg-emerald-100 text-emerald-700",
    Medium: "bg-amber-100 text-amber-700",
    High: "bg-red-100 text-red-700",
    Critical: "bg-black text-white",
  };

  return (
    <div
      className={`inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider ${
        styles[level as RiskLevel] ||
        "bg-neutral-200 text-neutral-700"
      }`}
    >
      {level} Risk
    </div>
  );
}