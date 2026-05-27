import { EncryptedBlob } from "@/lib/loom/crypto";

export type VaultFragment = {
  reportId: string;
  index: number;
  total: number;
  threshold: number;
  scheme: "reed-solomon-interface-mvp";
  payload: string;
  checksum: string;
};

export async function fragmentEncryptedBlob(reportId: string, blob: EncryptedBlob, total = 3, threshold = 2): Promise<VaultFragment[]> {
  const serialized = JSON.stringify(blob);
  const size = Math.ceil(serialized.length / total);
  const fragments = Array.from({ length: total }, (_, index) => serialized.slice(index * size, (index + 1) * size));
  return Promise.all(fragments.map(async (payload, index) => ({
    reportId,
    index,
    total,
    threshold,
    scheme: "reed-solomon-interface-mvp" as const,
    payload,
    checksum: await digest(payload)
  })));
}

export async function reassembleEncryptedBlob(fragments: VaultFragment[]): Promise<EncryptedBlob> {
  const ordered = [...fragments].sort((a, b) => a.index - b.index);
  if (!ordered.length) throw new Error("No fragments found.");
  const total = ordered[0].total;
  if (ordered.length < total) throw new Error("MVP reassembly requires all fragments. Reed-Solomon threshold recovery interface is prepared.");
  for (const fragment of ordered) {
    if ((await digest(fragment.payload)) !== fragment.checksum) throw new Error(`Fragment ${fragment.index} checksum failed.`);
  }
  return JSON.parse(ordered.map((fragment) => fragment.payload).join("")) as EncryptedBlob;
}

async function digest(value: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
