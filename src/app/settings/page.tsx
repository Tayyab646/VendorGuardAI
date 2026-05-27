"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Copy, DatabaseZap, KeyRound, LockKeyhole, Trash2 } from "lucide-react";
import { clearVault, listVaultReports } from "@/lib/loom/vault";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const env = ["ANTHROPIC_API_KEY", "ANTHROPIC_MODEL=claude-sonnet-4-5", "BRIGHT_DATA_API_KEY", "BRIGHT_DATA_SERP_ZONE", "BRIGHT_DATA_UNLOCKER_ZONE", "BRIGHT_DATA_MCP_URL optional", "APP_MODE=production", "NEXT_PUBLIC_APP_MODE=production"];

export default function SettingsPage() {
  const [count, setCount] = useState(0);
  useEffect(() => { void listVaultReports().then((records) => setCount(records.length)); }, []);
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Settings</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Keys, custody, and usage</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-white"><KeyRound className="h-5 w-5 text-cyan-300" />API key configuration guide</h2>
          <p className="mt-3 text-sm text-slate-400">Add these variables to `.env.local`, then restart the dev server. Production mode requires real Bright Data and Claude keys.</p>
          <div className="mt-4 rounded-md border border-white/10 bg-black/20 p-4 font-mono text-sm text-slate-200">
            {env.map((item) => <div key={item}>{item.includes("=") ? item : `${item}=`}</div>)}
          </div>
          <Button className="mt-4" variant="secondary" onClick={() => navigator.clipboard.writeText(env.map((item) => item.includes("=") ? item : `${item.replace(" optional", "")}=`).join("\n"))}><Copy className="h-4 w-4" />Copy env template</Button>
        </Card>
        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-white"><LockKeyhole className="h-5 w-5 text-teal-300" />Zero-knowledge mode</h2>
          <div className="mt-4 rounded-md border border-teal-300/30 bg-teal-300/10 p-4 text-sm text-teal-100"><CheckCircle2 className="mr-2 inline h-4 w-4" />Active. Reports, passphrases, decrypted data, and fragments are never sent to the backend.</div>
          <div className="mt-4 grid gap-3 text-sm">
            <div className="flex justify-between border-t border-white/10 pt-3"><span className="text-slate-400">Local vault reports</span><span className="text-white">{count}</span></div>
            <div className="flex justify-between border-t border-white/10 pt-3"><span className="text-slate-400">Storage</span><span className="text-white">IndexedDB fragments</span></div>
            <div className="flex justify-between border-t border-white/10 pt-3"><span className="text-slate-400">Encryption</span><span className="text-white">AES-GCM-256</span></div>
          </div>
          <Button className="mt-5" variant="destructive" onClick={async () => { await clearVault(); setCount(0); }}><Trash2 className="h-4 w-4" />Clear local encrypted data</Button>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-white"><DatabaseZap className="h-5 w-5 text-cyan-300" />Bright Data usage indicator</h2>
          <p className="mt-3 text-sm text-slate-400">Usage is estimated client-side from agent runs. Configure Bright Data dashboards for authoritative billing.</p>
          <p className="mt-5 text-3xl font-semibold text-white">SERP + Unlocker ready</p>
        </Card>
        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-white"><KeyRound className="h-5 w-5 text-cyan-300" />Claude usage indicator</h2>
          <p className="mt-3 text-sm text-slate-400">The backend sends evidence summaries to Claude and streams progress to the browser without storing reports.</p>
          <p className="mt-5 text-3xl font-semibold text-white">Agent reasoning ready</p>
        </Card>
      </div>
    </div>
  );
}
