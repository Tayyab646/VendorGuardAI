import { NextResponse } from "next/server";
import { brightDataScrape } from "@/lib/api/brightdata";

export async function POST(request: Request) {
  const { url } = await request.json();
  return NextResponse.json({ text: await brightDataScrape(String(url ?? "")) });
}
