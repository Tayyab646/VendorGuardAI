import { RiskBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function RiskScoreCard({ label, score }: { label: string; score: number }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-300">{label}</p>
        <RiskBadge score={score} />
      </div>
      <div className="mt-4 flex items-end gap-2">
        <span className="text-3xl font-semibold text-white">{score}</span>
        <span className="pb-1 text-sm text-slate-400">/ 100</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-cyan-300" style={{ width: `${score}%` }} />
      </div>
    </Card>
  );
}
