import { NextResponse } from "next/server";
import { analyzeWithClaude } from "@/lib/api/claude";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(await analyzeWithClaude({
    vendorName: String(body.vendorName ?? ""),
    website: String(body.website ?? ""),
    focus: String(body.focus ?? ""),
    evidenceContext: String(body.evidenceContext ?? "")
  }));
}
