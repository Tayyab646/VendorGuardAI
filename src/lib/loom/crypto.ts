import { deriveVaultKeyArgon2idReady } from "@/lib/loom/key-derivation";

export type EncryptedBlob = {
  version: 1;
  algorithm: "AES-GCM-256";
  kdf: string;
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
  encryptedAt: string;
};

export async function encryptJson(value: unknown, passphrase: string): Promise<EncryptedBlob> {
  const derived = await deriveVaultKeyArgon2idReady(passphrase);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(value));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, derived.key, plaintext);
  return {
    version: 1,
    algorithm: "AES-GCM-256",
    kdf: derived.kdf,
    iterations: derived.iterations,
    salt: toBase64(derived.salt),
    iv: toBase64(iv),
    ciphertext: toBase64(new Uint8Array(ciphertext)),
    encryptedAt: new Date().toISOString()
  };
}

export async function decryptJson<T>(blob: EncryptedBlob, passphrase: string): Promise<T> {
  const salt = fromBase64(blob.salt);
  const iv = fromBase64(blob.iv);
  const derived = await deriveVaultKeyArgon2idReady(passphrase, salt);
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, derived.key, fromBase64(blob.ciphertext));
  return JSON.parse(new TextDecoder().decode(plaintext)) as T;
}

export function toBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes));
}

export function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}
