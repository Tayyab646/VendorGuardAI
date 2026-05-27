import { cn } from "@/lib/utils";

const stages = [
  "Public exposure signal",
  "Vulnerability chatter",
  "Credential/data leak signal",
  "Operational anomaly",
  "Public incident confirmation"
];

export function BreachHorizon({ stage, vendor }: { stage: number; vendor: string }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">The Breach Horizon</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{vendor}</h3>
        </div>
        <div className="rounded-md border border-orange-300/30 bg-orange-400/10 px-3 py-2 text-sm text-orange-100">Stage {stage + 1}/5</div>
      </div>
      <div className="grid gap-3">
        {stages.map((label, index) => (
          <div key={label} className="grid grid-cols-[2rem_1fr] items-center gap-3">
            <div className={cn("grid h-8 w-8 place-items-center rounded-full border text-sm", index <= stage ? "border-cyan-200 bg-cyan-300 text-slate-950" : "border-white/15 bg-white/5 text-slate-400")}>{index + 1}</div>
            <div className={cn("rounded-md border px-4 py-3 text-sm", index === stage ? "border-orange-300/40 bg-orange-400/12 text-orange-100" : index < stage ? "border-cyan-300/30 bg-cyan-300/8 text-cyan-100" : "border-white/10 bg-white/[0.03] text-slate-400")}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
