"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Bot, Home, LockKeyhole, Radar, Settings, ShieldCheck, Vault, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const nav: Array<[string, string, LucideIcon]> = [
  ["/", "Home", Home],
  ["/dashboard", "Dashboard", Activity],
  ["/investigate", "Investigate", Radar],
  ["/vendors/cloudflare", "Vendor", ShieldCheck],
  ["/vault", "Vault", Vault],
  ["/agents", "Agents", Bot],
  ["/settings", "Settings", Settings]
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07111f]/88 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 font-semibold text-white">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-cyan-300 text-slate-950"><ShieldCheck className="h-5 w-5" /></span>
            <span className="hidden sm:inline">VendorGuard AI</span>
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {nav.map(([href, label, Icon]) => (
              <Link key={String(href)} href={String(href)} className={cn("inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm text-slate-300 hover:bg-white/8 hover:text-white", pathname === href && "bg-white/10 text-white")}>
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{label}</span>
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1 text-xs text-teal-100 sm:flex">
            <LockKeyhole className="h-3.5 w-3.5" /> Zero-Knowledge Mode Active
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
