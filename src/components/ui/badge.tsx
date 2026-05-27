import { cn, riskLabel } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", className)}>{children}</span>;
}

export function RiskBadge({ score }: { score: number }) {
  const label = riskLabel(score);
  const tone = label === "Critical" ? "border-red-300/40 bg-red-400/15 text-red-100" : label === "High" ? "border-orange-300/40 bg-orange-400/15 text-orange-100" : label === "Medium" ? "border-amber-300/40 bg-amber-300/15 text-amber-100" : "border-teal-300/40 bg-teal-300/15 text-teal-100";
  return <Badge className={tone}>{label}</Badge>;
}
