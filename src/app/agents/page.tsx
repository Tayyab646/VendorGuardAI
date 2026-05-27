import { Bot, DatabaseZap, FileSearch, Gauge, GlobeLock, Scale, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

type AgentRow = [string, string, string, string, LucideIcon];

const agents: AgentRow[] = [
  ["Orchestrator Agent", "Claude", "Plans investigation steps", "Ready", Sparkles],
  ["Bright Data Search Agent", "Bright Data SERP", "Searches live public web risk signals", "Live capable", DatabaseZap],
  ["Web Unlocker Scraper Agent", "Bright Data Web Unlocker", "Scrapes selected public pages", "Live capable", GlobeLock],
  ["Exposure Signal Agent", "Claude", "Detects exposure, CVEs, leak, phishing, and outage chatter", "Ready", ShieldCheck],
  ["Compliance Agent", "Claude", "Detects regulation, lawsuits, privacy, and audit changes", "Ready", Scale],
  ["Source Verification Agent", "Claude", "Scores credibility, recency, independence, and relevance", "Ready", FileSearch],
  ["Risk Scoring Agent", "Claude", "Calculates risk scores and Breach Horizon stage", "Ready", Gauge],
  ["Report Agent", "Claude + The Loom handoff", "Generates report for client-side encryption", "Ready", Bot]
];

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Agent Mesh</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Autonomous investigation agents</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {agents.map(([name, tool, task, status, Icon], index) => (
          <Card key={String(name)} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <Icon className="mt-1 h-6 w-6 text-cyan-300" />
                <div>
                  <h2 className="font-semibold text-white">{name}</h2>
                  <p className="mt-1 text-sm text-slate-400">{task}</p>
                </div>
              </div>
              <span className="rounded-full border border-teal-300/30 bg-teal-300/10 px-2.5 py-1 text-xs text-teal-100">{status}</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div><p className="text-slate-500">Tool used</p><p className="mt-1 text-slate-200">{tool}</p></div>
              <div><p className="text-slate-500">Last activity</p><p className="mt-1 text-slate-200">{index + 2}m ago</p></div>
              <div><p className="text-slate-500">Usage est.</p><p className="mt-1 text-slate-200">{(index + 1) * 0.04}$</p></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
