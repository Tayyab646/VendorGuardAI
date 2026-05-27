import { NextResponse } from "next/server";
import { createRequest, expireOldRequests } from "@/lib/server/store";

export async function POST(request: Request) {
  expireOldRequests();
  const body = await request.json();
  const vendorName = String(body.vendorName ?? "").trim();
  const website = String(body.website ?? "").trim();
  const focus = String(body.focus ?? "public exposure, security, compliance, and operational risks").trim();
  if (!vendorName) return NextResponse.json({ error: "vendorName is required" }, { status: 400 });
  const requestId = createRequest({ vendorName, website, focus });
  console.info(JSON.stringify({ event: "investigation_started", requestId, vendorName, at: new Date().toISOString() }));
  return NextResponse.json({ request_id: requestId });
}
