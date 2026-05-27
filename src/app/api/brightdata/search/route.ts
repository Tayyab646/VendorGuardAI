import { NextResponse } from "next/server";
import { brightDataSearch } from "@/lib/api/brightdata";

export async function POST(request: Request) {
  const { query } = await request.json();
  return NextResponse.json({ results: await brightDataSearch(String(query ?? "")) });
}
