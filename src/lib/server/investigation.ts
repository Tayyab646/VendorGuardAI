import { brightDataScrape, brightDataSearch } from "@/lib/api/brightdata";
import { analyzeWithClaude } from "@/lib/api/claude";
import { AgentEvent } from "@/lib/types";
import { isDemoMode } from "@/lib/server/config";

type Emit = (event: AgentEvent) => Promise<void>;

export async function runInvestigation(input: { vendorName: string; website: string; focus: string }, emit: Emit) {
  await emit({ type: "progress", agent: "Orchestrator Agent", step: "Planning investigation", message: "Creating autonomous public-web investigation plan.", progress: 8 });
  const queries = [
    `${input.vendorName} security advisory vulnerability CVE`,
    `${input.vendorName} data leak credentials exposed API key`,
    `${input.vendorName} status incident outage`,
    `${input.vendorName} privacy policy GDPR lawsuit regulatory investigation`,
    `${input.vendorName} phishing impersonation domain`
  ];

  await emit({ type: "progress", agent: "Bright Data Search Agent", step: "Searching with Bright Data", message: "Querying live public web sources through Bright Data SERP.", progress: 20 });
  const searchBatches = await Promise.all(queries.map((query) => brightDataSearch(query).catch((error) => {
    if (!isDemoMode()) throw error;
    return [{ title: query, url: `https://www.google.com/search?q=${encodeURIComponent(query)}`, snippet: String(error), source: "demo-fallback" }];
  })));
  const results = searchBatches.flat().slice(0, 10);

  await emit({ type: "progress", agent: "Web Unlocker Scraper Agent", step: "Scraping public sources", message: "Extracting readable evidence from selected public pages.", progress: 38 });
  const scraped = await Promise.all(results.slice(0, 5).map(async (result) => ({ result, text: await brightDataScrape(result.url).catch((error) => {
    if (!isDemoMode()) throw error;
    return `Demo scrape fallback: ${String(error)}`;
  }) })));

  await emit({ type: "progress", agent: "Exposure Signal Agent", step: "Analyzing exposure signals", message: "Looking for exposed admin references, leak mentions, CVEs, impersonation, and incident chatter.", progress: 54 });
  await emit({ type: "progress", agent: "Compliance Agent", step: "Reviewing compliance signals", message: "Checking for policy changes, regulatory actions, lawsuits, and audit/security updates.", progress: 63 });
  await emit({ type: "progress", agent: "Source Verification Agent", step: "Verifying evidence", message: "Scoring credibility, recency, independence, relevance, and confidence.", progress: 72 });

  const evidenceContext = scraped.map(({ result, text }) => `SOURCE: ${result.source}\nTITLE: ${result.title}\nURL: ${result.url}\nSNIPPET: ${result.snippet}\nTEXT: ${text.slice(0, 1800)}`).join("\n\n---\n\n");
  await emit({ type: "progress", agent: "Risk Scoring Agent", step: "Calculating Breach Horizon stage", message: "Producing category scores and Breach Horizon placement.", progress: 82 });
  const report = await analyzeWithClaude({ ...input, evidenceContext });

  await emit({ type: "progress", agent: "Report Agent", step: "Generating final report", message: "Preparing browser-side encryption handoff. Backend will not store this report.", progress: 92 });
  await emit({ type: "report", report, progress: 96 });
  await emit({ type: "progress", agent: "The Loom Vault", step: "Encrypting report in browser", message: "Client will derive key, encrypt with AES-GCM, fragment, and store locally.", progress: 100 });
  await emit({ type: "done", message: "Investigation complete." });
}
