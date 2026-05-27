import { getRequest } from "@/lib/server/store";
import { runInvestigation } from "@/lib/server/investigation";
import { AgentEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ requestId: string }> }) {
  const { requestId } = await params;
  const record = getRequest(requestId);
  if (!record) return new Response("request not found", { status: 404 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = async (event: AgentEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };
      try {
        await runInvestigation(record.input, emit);
      } catch (error) {
        await emit({ type: "error", message: error instanceof Error ? error.message : "Unknown investigation error" });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
