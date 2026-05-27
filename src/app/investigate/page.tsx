"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, LockKeyhole, Play, ShieldAlert } from "lucide-react";
import { startInvestigation, streamInvestigation } from "@/lib/agents/client";
import { storeEncryptedReport } from "@/lib/loom/vault";
import { AgentEvent, VendorReport } from "@/lib/types";
import { BreachHorizon } from "@/components/breach-horizon";
import { RiskScoreCard } from "@/components/risk-score-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function InvestigationPage() {
  const [vendorName, setVendorName] = useState("Cloudflare");
  const [website, setWebsite] = useState("https://www.cloudflare.com");
  const [focus, setFocus] = useState("Monitor this vendor for public exposure, security, compliance, and operational risks.");
  const [passphrase, setPassphrase] = useState("");
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [report, setReport] = useState<VendorReport | null>(null);
  const [running, setRunning] = useState(false);
  const [vaultStatus, setVaultStatus] = useState("");

  async function run() {
    setRunning(true);
    setEvents([]);
    setReport(null);
    setVaultStatus("");
    const requestId = await startInvestigation({ vendorName, website, focus });
    streamInvestigation(requestId, async (event) => {
      setEvents((current) => [...current, event]);
      if (event.type === "report" && event.report) {
        setReport(event.report);
        if (passphrase) {
          const record = await storeEncryptedReport(event.report, passphrase);
          setVaultStatus(`Encrypted client-side into ${record.fragmentCount} local fragments.`);
        } else {
          setVaultStatus("Report generated. Add a passphrase before running to store it in The Loom Vault.");
        }
      }
      if (event.type === "done" || event.type === "error") setRunning(false);
    }, () => setRunning(false));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <Card className="p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Live Investigation</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Autonomous vendor intelligence</h1>
        <div className="mt-6 space-y-4">
          <label className="block text-sm text-slate-300">Vendor name<input value={vendorName} onChange={(e) => setVendorName(e.target.value)} className="mt-2 h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-white outline-none focus:ring-2 focus:ring-cyan-300" /></label>
          <label className="block text-sm text-slate-300">Vendor website<input value={website} onChange={(e) => setWebsite(e.target.value)} className="mt-2 h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-white outline-none focus:ring-2 focus:ring-cyan-300" /></label>
          <label className="block text-sm text-slate-300">Risk focus<textarea value={focus} onChange={(e) => setFocus(e.target.value)} className="mt-2 min-h-28 w-full rounded-md border border-white/10 bg-white/5 p-3 text-white outline-none focus:ring-2 focus:ring-cyan-300" /></label>
          <label className="block text-sm text-slate-300">Passphrase for report encryption<input type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} className="mt-2 h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-white outline-none focus:ring-2 focus:ring-cyan-300" /></label>
          <div className="rounded-md border border-teal-300/30 bg-teal-300/10 p-3 text-sm text-teal-100"><LockKeyhole className="mr-2 inline h-4 w-4" />This report is encrypted client-side. VendorGuard cannot access your risk intelligence.</div>
          <Button onClick={run} disabled={running || !vendorName} className="w-full">
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Start Live Investigation
          </Button>
        </div>
      </Card>
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white">Real-time agent progress</h2>
          <div className="mt-5 space-y-3">
            {events.length === 0 && <p className="text-sm text-slate-400">Agent progress will stream here using Server-Sent Events.</p>}
            {events.filter((event) => event.type === "progress").map((event, index) => (
              <motion.div key={`${event.step}-${index}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-md border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div><p className="font-medium text-white">{event.step}</p><p className="mt-1 text-sm text-slate-400">{event.agent}: {event.message}</p></div>
                  <span className="text-sm text-cyan-200">{event.progress}%</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${event.progress ?? 0}%` }} /></div>
              </motion.div>
            ))}
          </div>
          {vaultStatus && <p className="mt-4 rounded-md border border-teal-300/30 bg-teal-300/10 p-3 text-sm text-teal-100"><CheckCircle2 className="mr-2 inline h-4 w-4" />{vaultStatus}</p>}
        </Card>
        {report && (
          <div className="space-y-4">
            <Card className="p-6"><BreachHorizon stage={report.breachHorizonStage} vendor={report.vendorName} /></Card>
            <div className="grid gap-4 md:grid-cols-3">
              <RiskScoreCard label="Overall risk" score={report.riskScores.overall} />
              <RiskScoreCard label="Exposure risk" score={report.riskScores.exposure} />
              <RiskScoreCard label="Compliance risk" score={report.riskScores.compliance} />
            </div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-white">Evidence table</h2>
              <div className="mt-4 space-y-3">{report.evidence.map((item) => <div key={item.url} className="rounded-md border border-white/10 p-3 text-sm"><a className="text-cyan-200" href={item.url} target="_blank">{item.title}</a><p className="mt-1 text-slate-400">{item.summary}</p></div>)}</div>
            </Card>
          </div>
        )}
        {events.some((event) => event.type === "error") && <Card className="border-orange-300/30 p-4 text-orange-100"><ShieldAlert className="mr-2 inline h-4 w-4" />{events.find((event) => event.type === "error")?.message}</Card>}
      </div>
    </div>
  );
}
