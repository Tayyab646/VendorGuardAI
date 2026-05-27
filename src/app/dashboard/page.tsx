import Link from "next/link";
import { Activity, AlertTriangle, FileLock2, Radar, ShieldCheck, type LucideIcon } from "lucide-react";
import { BreachHorizon } from "@/components/breach-horizon";
import { EvidenceChart } from "@/components/evidence-chart";
import { RiskScoreCard } from "@/components/risk-score-card";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const metrics: Array<[string, string, LucideIcon]> = [
    ["Vendors monitored", "5", ShieldCheck],
    ["Active investigations", "2", Activity],
    ["High-risk vendors", "1", AlertTriangle],
    ["Encrypted reports", "Local", FileLock2]
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Command Center</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Vendor risk dashboard</h1>
        </div>
        <Link href="/investigate" className="inline-flex h-10 items-center justify-center rounded-md bg-cyan-300 px-4 text-sm font-medium text-slate-950">Start Investigation</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map(([label, value, Icon]) => (
          <Card key={String(label)} className="p-5">
            <Icon className="h-5 w-5 text-cyan-300" />
            <p className="mt-4 text-sm text-slate-400">{label}</p>
            <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <Card className="p-6"><BreachHorizon stage={2} vendor="Portfolio overview" /></Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white">Evidence confidence chart</h2>
          <EvidenceChart />
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <RiskScoreCard label="Cloudflare overall" score={42} />
        <RiskScoreCard label="Stripe overall" score={38} />
        <RiskScoreCard label="OpenAI overall" score={61} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Live agent activity</h2>
          {["Orchestrator drafted monitoring plan", "Bright Data Search Agent queried public exposure signals", "Source Verification Agent scored independent sources"].map((item) => (
            <div key={item} className="border-t border-white/10 py-3 text-sm text-slate-300"><Radar className="mr-2 inline h-4 w-4 text-cyan-300" />{item}</div>
          ))}
        </Card>
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Recent alerts</h2>
          {["OpenAI: vulnerability chatter increased", "Shopify: operational incident mention detected", "HubSpot: compliance news query scheduled"].map((item) => (
            <div key={item} className="border-t border-white/10 py-3 text-sm text-slate-300"><AlertTriangle className="mr-2 inline h-4 w-4 text-orange-300" />{item}</div>
          ))}
        </Card>
      </div>
    </div>
  );
}
