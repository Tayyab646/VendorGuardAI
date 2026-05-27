export type RiskScores = {
  security: number;
  compliance: number;
  exposure: number;
  operational: number;
  reputation: number;
  overall: number;
};

export type Evidence = {
  title: string;
  url: string;
  source: string;
  summary: string;
  category: string;
  confidence: number;
  observedAt: string;
};

export type VendorReport = {
  id: string;
  vendorName: string;
  website: string;
  investigationTimestamp: string;
  breachHorizonStage: number;
  riskScores: RiskScores;
  evidence: Evidence[];
  summarizedFindings: string[];
  recommendedActions: string[];
  confidenceScore: number;
  nextMonitoringPlan: string[];
  encryptionStatus?: "plaintext-before-client-encryption" | "encrypted-client-side";
};

export type AgentEvent = {
  type: "progress" | "report" | "error" | "done";
  agent?: string;
  step?: string;
  message?: string;
  progress?: number;
  report?: VendorReport;
};
