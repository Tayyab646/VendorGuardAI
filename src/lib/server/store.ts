export type InvestigationInput = {
  vendorName: string;
  website: string;
  focus: string;
};

type RequestRecord = {
  input: InvestigationInput;
  createdAt: number;
};

const globalStore = globalThis as typeof globalThis & {
  __vendorguardRequests?: Map<string, RequestRecord>;
};

export const requestStore = globalStore.__vendorguardRequests ?? new Map<string, RequestRecord>();
globalStore.__vendorguardRequests = requestStore;

export function createRequest(input: InvestigationInput) {
  const id = crypto.randomUUID();
  requestStore.set(id, { input, createdAt: Date.now() });
  return id;
}

export function getRequest(id: string) {
  return requestStore.get(id);
}

export function expireOldRequests() {
  const cutoff = Date.now() - 1000 * 60 * 20;
  for (const [id, record] of requestStore) {
    if (record.createdAt < cutoff) requestStore.delete(id);
  }
}
