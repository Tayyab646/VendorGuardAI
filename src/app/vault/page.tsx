"use client";

import { useEffect, useState } from "react";
import { Download, FileLock2, KeyRound, Trash2 } from "lucide-react";
import { clearVault, exportEncryptedReport, listVaultReports, unlockReport, VaultRecord } from "@/lib/loom/vault";
import { VendorReport } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function VaultPage() {
  const [records, setRecords] = useState<VaultRecord[]>([]);
  const [passphrase, setPassphrase] = useState("");
  const [unlocked, setUnlocked] = useState<VendorReport | null>(null);
  const [message, setMessage] = useState("");

  async function refresh() {
    setRecords(await listVaultReports());
  }

  useEffect(() => { void refresh(); }, []);

  async function unlock(id: string) {
    try {
      setUnlocked(await unlockReport<VendorReport>(id, passphrase));
      setMessage("Report decrypted locally in this browser.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unlock failed.");
    }
  }

  async function exportEncrypted(id: string) {
    const fragments = await exportEncryptedReport(id);
    const blob = new Blob([JSON.stringify(fragments, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendorguard-encrypted-${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportDecryptedPdf() {
    if (!unlocked) return;
    const printable = window.open("", "_blank");
    printable?.document.write(`<pre>${JSON.stringify(unlocked, null, 2)}</pre><script>window.print()</script>`);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-teal-200">Zero-Knowledge Risk Vault</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Encrypted reports only</h1>
      </div>
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <label className="text-sm text-slate-300">Unlock passphrase<input type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} className="mt-2 h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-white outline-none focus:ring-2 focus:ring-cyan-300" /></label>
          <Button variant="destructive" onClick={async () => { await clearVault(); await refresh(); setUnlocked(null); }}><Trash2 className="h-4 w-4" />Clear local encrypted data</Button>
        </div>
        <p className="mt-4 rounded-md border border-teal-300/30 bg-teal-300/10 p-3 text-sm text-teal-100">This report is encrypted client-side. VendorGuard cannot access your risk intelligence.</p>
      </Card>
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white">Local encrypted fragments</h2>
          <div className="mt-4 space-y-3">
            {records.length === 0 && <p className="text-sm text-slate-400">No encrypted reports yet. Run an investigation with a passphrase.</p>}
            {records.map((record) => (
              <div key={record.reportId} className="rounded-md border border-white/10 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="font-medium text-white"><FileLock2 className="mr-2 inline h-4 w-4 text-teal-200" />{record.vendorName}</p><p className="mt-1 text-sm text-slate-400">{record.fragmentCount} fragments, encrypted {new Date(record.encryptedAt).toLocaleString()}</p></div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => unlock(record.reportId)}><KeyRound className="h-4 w-4" />Unlock</Button>
                    <Button size="sm" variant="outline" onClick={() => exportEncrypted(record.reportId)}><Download className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white">Unlocked local report</h2>
          {message && <p className="mt-3 text-sm text-cyan-200">{message}</p>}
          {unlocked ? (
            <div className="mt-4 space-y-4">
              <p className="text-2xl font-semibold text-white">{unlocked.vendorName}</p>
              <p className="text-sm text-slate-300">{unlocked.summarizedFindings.join(" ")}</p>
              <Button onClick={exportDecryptedPdf}><Download className="h-4 w-4" />Export decrypted PDF</Button>
            </div>
          ) : <p className="mt-4 text-sm text-slate-400">Decrypted content appears here only after local unlock.</p>}
        </Card>
      </div>
    </div>
  );
}
