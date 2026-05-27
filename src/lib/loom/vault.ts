import { decryptJson, encryptJson } from "@/lib/loom/crypto";
import { fragmentEncryptedBlob, reassembleEncryptedBlob, VaultFragment } from "@/lib/loom/fragmentation";
import { VendorReport } from "@/lib/types";

const DB_NAME = "vendorguard-loom-vault";
const DB_VERSION = 1;
const STORE = "fragments";

export type VaultRecord = {
  reportId: string;
  vendorName: string;
  encryptedAt: string;
  fragmentCount: number;
  encryptionStatus: "encrypted-client-side";
};

export async function storeEncryptedReport(report: VendorReport, passphrase: string): Promise<VaultRecord> {
  const encrypted = await encryptJson({ ...report, encryptionStatus: "encrypted-client-side" }, passphrase);
  const fragments = await fragmentEncryptedBlob(report.id, encrypted);
  const db = await openVaultDb();
  await tx(db, "readwrite", async (store) => {
    for (const fragment of fragments) store.put({ ...fragment, vendorName: report.vendorName, encryptedAt: encrypted.encryptedAt });
  });
  return { reportId: report.id, vendorName: report.vendorName, encryptedAt: encrypted.encryptedAt, fragmentCount: fragments.length, encryptionStatus: "encrypted-client-side" };
}

export async function listVaultReports(): Promise<VaultRecord[]> {
  const db = await openVaultDb();
  const rows = await getAll(db);
  const grouped = new Map<string, VaultRecord>();
  for (const row of rows) {
    grouped.set(row.reportId, { reportId: row.reportId, vendorName: row.vendorName, encryptedAt: row.encryptedAt, fragmentCount: row.total, encryptionStatus: "encrypted-client-side" });
  }
  return [...grouped.values()].sort((a, b) => b.encryptedAt.localeCompare(a.encryptedAt));
}

export async function unlockReport<T = VendorReport>(reportId: string, passphrase: string): Promise<T> {
  const db = await openVaultDb();
  const rows = (await getAll(db)).filter((row) => row.reportId === reportId) as VaultFragment[];
  const encrypted = await reassembleEncryptedBlob(rows);
  return decryptJson<T>(encrypted, passphrase);
}

export async function exportEncryptedReport(reportId: string) {
  const db = await openVaultDb();
  return (await getAll(db)).filter((row) => row.reportId === reportId);
}

export async function clearVault() {
  const db = await openVaultDb();
  await tx(db, "readwrite", (store) => {
    store.clear();
  });
}

function openVaultDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      const store = db.createObjectStore(STORE, { keyPath: ["reportId", "index"] });
      store.createIndex("reportId", "reportId");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function tx(db: IDBDatabase, mode: IDBTransactionMode, work: (store: IDBObjectStore) => void | Promise<void>) {
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const store = transaction.objectStore(STORE);
    void work(store);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

function getAll(db: IDBDatabase): Promise<Array<VaultFragment & { vendorName: string; encryptedAt: string }>> {
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
