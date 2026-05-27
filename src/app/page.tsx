import Link from "next/link";
import { ArrowRight, DatabaseZap, LockKeyhole, Radar, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { BreachHorizon } from "@/components/breach-horizon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const sections = [
  ["Problem", "Vendor risk usually reaches security teams after public fallout. Procurement, GRC, and security need earlier public-web evidence."],
  ["Why News Monitoring Is Too Late", "Press alerts describe confirmed incidents. VendorGuard watches exposure chatter, advisories, status anomalies, and regulatory signals as they emerge."],
  ["How Bright Data Agents Work", "Agents query live search, unlock public pages, extract readable evidence, and feed Claude with source-linked context."],
  ["How The Loom Protects Reports", "Reports are encrypted, fragmented, and stored in your browser. Passphrases and decrypted intelligence never leave the client."],
  ["Use Cases", "Third-party risk, SaaS reviews, supplier diligence, renewal checkpoints, board reporting, and continuous vendor monitoring."],
  ["Pricing Preview", "Free demo mode, Team live investigations, and Enterprise private deployment with Bring Your Own Keys."]
];

const valueProps: Array<[string, LucideIcon, string]> = [
  ["Live web intelligence", DatabaseZap, "Bright Data SERP and Web Unlocker integrations are wired into the execution layer."],
  ["Agentic reasoning", Sparkles, "Claude plans investigations, analyzes evidence, verifies sources, and drafts reports."],
  ["Browser custody", LockKeyhole, "The Loom Vault encrypts and stores only local encrypted fragments."]
];

export default function LandingPage() {
  return (
    <div className="space-y-20 pb-20">
      <section className="relative -mx-6 overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(17,210,227,0.24),transparent_34%),linear-gradient(135deg,#07111f,#0c1727_48%,#07111f)] px-6 py-24 sm:-mx-8 sm:px-8">
        <div className="absolute inset-0 cyber-grid opacity-60" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
              <ShieldCheck className="h-4 w-4" /> Zero-Knowledge Mode Active
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-normal text-white sm:text-7xl">
              Vendor threat intelligence without surrendering your data.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Bright Data-powered agents patrol the live web for vendor risk while The Loom keeps your intelligence encrypted in your browser.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/investigate">Run Live Investigation <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-glow backdrop-blur">
            <BreachHorizon stage={2} vendor="Live vendor posture" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        {valueProps.map(([title, Icon, body]) => (
          <Card key={String(title)} className="p-6">
            <Icon className="mb-5 h-7 w-7 text-cyan-300" />
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{body}</p>
          </Card>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">
        {sections.map(([title, body]) => (
          <Card key={title} className="p-6">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-3 leading-7 text-slate-300">{body}</p>
          </Card>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-3 text-cyan-200"><Radar className="h-5 w-5" /> Breach Horizon</div>
          <h2 className="mt-4 text-3xl font-semibold text-white">Estimate where a vendor sits before public confirmation.</h2>
          <p className="mt-4 text-slate-300">The timeline translates public exposure, vulnerability chatter, leak signals, operational anomalies, and confirmed incidents into a board-readable early warning posture.</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 text-teal-200"><LockKeyhole className="h-5 w-5" /> Zero-Knowledge Risk Vault</div>
          <h2 className="mt-4 text-3xl font-semibold text-white">Encrypted reports stay under user custody.</h2>
          <p className="mt-4 text-slate-300">VendorGuard can execute public-web research, but it cannot read your final decrypted intelligence, passphrases, or stored reports.</p>
        </Card>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <span>VendorGuard AI powered by The Loom</span>
        <span>Built for Track 3: Security & Compliance</span>
      </footer>
    </div>
  );
}
