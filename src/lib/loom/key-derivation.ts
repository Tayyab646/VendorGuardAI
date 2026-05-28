export type DerivedKey = {
  key: CryptoKey;
  salt: Uint8Array<ArrayBuffer>;
  kdf: "PBKDF2-SHA256-MVP" | "Argon2id-WASM-ready";
  iterations: number;
};

export async function deriveVaultKey(passphrase: string, salt: Uint8Array<ArrayBuffer> = crypto.getRandomValues(new Uint8Array(new ArrayBuffer(16)))): Promise<DerivedKey> {
  if (!passphrase || passphrase.length < 8) throw new Error("Use a passphrase with at least 8 characters.");
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  const iterations = 310000;
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
  return { key, salt, kdf: "PBKDF2-SHA256-MVP", iterations };
}

export async function deriveVaultKeyArgon2idReady(passphrase: string, salt?: Uint8Array<ArrayBuffer>) {
  // The interface is intentionally isolated so an Argon2id WASM module can replace PBKDF2 without changing callers.
  return deriveVaultKey(passphrase, salt);
}
