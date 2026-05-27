import { AgentEvent } from "@/lib/types";

export async function startInvestigation(input: { vendorName: string; website: string; focus: string }) {
  const response = await fetch("/api/investigate/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();
  return data.request_id as string;
}

export function streamInvestigation(requestId: string, onEvent: (event: AgentEvent) => void, onClose?: () => void) {
  const source = new EventSource(`/api/investigate/stream/${requestId}`);
  source.onmessage = (message) => onEvent(JSON.parse(message.data) as AgentEvent);
  source.onerror = () => {
    source.close();
    onClose?.();
  };
  return () => source.close();
}
