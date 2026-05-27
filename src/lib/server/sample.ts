import { VendorReport } from "@/lib/types";

export const demoVendors = ["Cloudflare", "Stripe", "OpenAI", "HubSpot", "Shopify"];

export function sampleEvidence(vendorName: string) {
  const now = new Date().toISOString();
  return [
    {
      title: `${vendorName} security advisory and vulnerability discussion`,
      url: `https://www.google.com/search?q=${encodeURIComponent(vendorName + " security advisory vulnerability")}`,
      source: "Public search result",
      summary: "Demo fallback signal representing public security advisory and vulnerability chatter. Configure Bright Data keys for live evidence.",
      category: "security",
      confidence: 68,
      observedAt: now
    },
    {
      title: `${vendorName} status incident and operational reliability signal`,
      url: `https://www.google.com/search?q=${encodeURIComponent(vendorName + " status incident outage")}`,
      source: "Public status/news search",
      summary: "Demo fallback signal representing public operational anomaly monitoring.",
      category: "operational",
      confidence: 61,
      observedAt: now
    },
    {
      title: `${vendorName} privacy compliance and regulatory search`,
      url: `https://www.google.com/search?q=${encodeURIComponent(vendorName + " privacy compliance lawsuit gdpr")}`,
      source: "Public regulatory/news search",
      summary: "Demo fallback signal representing compliance and policy-change monitoring.",
      category: "compliance",
      confidence: 57,
      observedAt: now
    }
  ];
}

export function sampleReport(vendorName: string, website: string): VendorReport {
  const evidence = sampleEvidence(vendorName);
  return {
    id: crypto.randomUUID(),
    vendorName,
    website,
    investigationTimestamp: new Date().toISOString(),
    breachHorizonStage: 1,
    riskScores: {
      security: 58,
      compliance: 43,
      exposure: 52,
      operational: 47,
      reputation: 39,
      overall: 50
    },
    evidence,
    summarizedFindings: [
      "Live API keys are not configured, so the MVP used safe sample public-web signals.",
      "The workflow, report shape, client encryption, and vault storage match the production integration path.",
      "Configure Bright Data and Anthropic environment variables to run the same flow on live evidence."
    ],
    recommendedActions: [
      "Add this vendor to continuous public-web monitoring.",
      "Review security advisories and public status history before renewal.",
      "Ask vendor owner to validate controls for high-confidence exposure signals."
    ],
    confidenceScore: 62,
    nextMonitoringPlan: [
      "Daily search for exposure and vulnerability chatter.",
      "Weekly compliance/regulatory review.",
      "Immediate alert on credential leak or confirmed incident signals."
    ],
    encryptionStatus: "plaintext-before-client-encryption"
  };
}
