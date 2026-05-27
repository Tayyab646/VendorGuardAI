import { VendorReport } from "@/lib/types";
import { sampleReport } from "@/lib/server/sample";
import { isDemoMode, requireEnv } from "@/lib/server/config";

export async function analyzeWithClaude(input: {
  vendorName: string;
  website: string;
  focus: string;
  evidenceContext: string;
}): Promise<VendorReport> {
  if (isDemoMode() && !process.env.ANTHROPIC_API_KEY) return sampleReport(input.vendorName, input.website);
  const apiKey = requireEnv("ANTHROPIC_API_KEY");
  const model = process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-5";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      max_tokens: 3000,
      temperature: 0.2,
      system: "You are VendorGuard AI, a defensive vendor threat intelligence analyst. Use only public-web evidence. Do not suggest hacking, scanning, exploitation, credential theft, login bypassing, brute forcing, or private access. Return strict JSON matching the requested schema.",
      messages: [
        {
          role: "user",
          content: `Create a vendor risk report for ${input.vendorName} (${input.website}). Focus: ${input.focus}.

Evidence context:
${input.evidenceContext}

Return JSON with keys: id, vendorName, website, investigationTimestamp, breachHorizonStage (0-4), riskScores {security, compliance, exposure, operational, reputation, overall}, evidence array {title,url,source,summary,category,confidence,observedAt}, summarizedFindings array, recommendedActions array, confidenceScore, nextMonitoringPlan array, encryptionStatus.`
        }
      ]
    })
  });

  if (!response.ok) throw new Error(`Claude analyze failed: ${response.status}`);
  const payload = await response.json();
  const text = payload.content?.map((part: { text?: string }) => part.text ?? "").join("\n") ?? "";
  const json = text.match(/\{[\s\S]*\}/)?.[0] ?? text;
  const report = JSON.parse(json) as VendorReport;
  return { ...report, id: report.id || crypto.randomUUID(), encryptionStatus: "plaintext-before-client-encryption" };
}
