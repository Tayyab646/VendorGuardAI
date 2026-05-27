import { NextResponse } from "next/server";
import { analyzeWithClaude } from "@/lib/api/claude";

export async function POST(request: Request) {
  const body = await request.json();
  const report = await analyzeWithClaude({
    vendorName: String(body.vendorName ?? ""),
    website: String(body.website ?? ""),
    focus: String(body.focus ?? "public vendor risk intelligence"),
    evidenceContext: String(body.evidenceContext ?? "")
  });
  return NextResponse.json(report);
}
