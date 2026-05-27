import { isDemoMode, requireEnv } from "@/lib/server/config";

export type SearchResult = {
  title: string;
  url: string;
  snippet: string;
  source: string;
};

export async function brightDataSearch(query: string): Promise<SearchResult[]> {
  if (isDemoMode() && (!process.env.BRIGHT_DATA_API_KEY || !process.env.BRIGHT_DATA_SERP_ZONE)) {
    return [
      { title: `Demo SERP: ${query}`, url: `https://www.google.com/search?q=${encodeURIComponent(query)}`, snippet: "Demo mode search result. Add Bright Data credentials and remove APP_MODE=demo for live SERP data.", source: "demo" }
    ];
  }
  const apiKey = requireEnv("BRIGHT_DATA_API_KEY");
  const zone = requireEnv("BRIGHT_DATA_SERP_ZONE");

  const response = await fetch("https://api.brightdata.com/request", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      zone,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      format: "raw"
    })
  });

  if (!response.ok) throw new Error(`Bright Data SERP failed: ${response.status}`);
  const raw = await response.text();
  const links = [...raw.matchAll(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/g)].slice(0, 8);
  return links.map((match, index) => ({
    title: stripHtml(match[2]) || `Public result ${index + 1}`,
    url: normalizeGoogleUrl(match[1]),
    snippet: stripHtml(raw.slice(Math.max(0, match.index - 160), match.index + 260)),
    source: "Bright Data SERP"
  })).filter((item) => item.url.startsWith("http"));
}

export async function brightDataScrape(url: string): Promise<string> {
  if (isDemoMode() && (!process.env.BRIGHT_DATA_API_KEY || !process.env.BRIGHT_DATA_UNLOCKER_ZONE)) return `Demo scrape content for ${url}. Public evidence would be extracted here using Bright Data Web Unlocker after live keys are configured.`;
  const apiKey = requireEnv("BRIGHT_DATA_API_KEY");
  const zone = requireEnv("BRIGHT_DATA_UNLOCKER_ZONE");

  const response = await fetch("https://api.brightdata.com/request", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ zone, url, format: "raw" })
  });
  if (!response.ok) throw new Error(`Bright Data scrape failed: ${response.status}`);
  return stripHtml((await response.text()).slice(0, 12000));
}

function stripHtml(value: string) {
  return value.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeGoogleUrl(value: string) {
  try {
    if (value.startsWith("/url?")) {
      const url = new URL(`https://google.com${value}`);
      return url.searchParams.get("q") ?? value;
    }
    return value;
  } catch {
    return value;
  }
}
