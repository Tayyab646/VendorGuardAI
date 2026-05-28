import { EncryptedBlob, toBase64, fromBase64 } from "@/lib/loom/crypto";

export type VaultFragment = {
  reportId: string;
  index: number;
  total: number;
  threshold: number;
  scheme: "reed-solomon-galois-field";
  payload: string;
  checksum: string;
};

class ReedSolomonEngine {
  private exp = new Uint8Array(512);
  private log = new Uint8Array(256);

  constructor() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      this.exp[i] = x;
      this.exp[i + 255] = x;
      this.log[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11D;
    }
    this.log[0] = 0;
  }

  mul(a: number, b: number): number {
    if (a === 0 || b === 0) return 0;
    return this.exp[this.log[a] + this.log[b]];
  }

  div(a: number, b: number): number {
    if (a === 0) return 0;
    if (b === 0) throw new Error("Div by 0");
    return this.exp[(this.log[a] + 255 - this.log[b]) % 255];
  }

  encode(dataShards: Uint8Array[], numParity: number): Uint8Array[] {
    const numData = dataShards.length;
    const shardSize = dataShards[0].length;
    const parityShards = Array.from({ length: numParity }, () => new Uint8Array(shardSize));

    for (let i = 0; i < numParity; i++) {
      for (let j = 0; j < numData; j++) {
        const coef = this.exp[this.log[i + 1] * j % 255] || 1;
        for (let k = 0; k < shardSize; k++) {
          if (j === 0) parityShards[i][k] = this.mul(dataShards[j][k], coef);
          else parityShards[i][k] ^= this.mul(dataShards[j][k], coef);
        }
      }
    }
    return parityShards;
  }

  buildMatrix(numData: number, numParity: number): Uint8Array[] {
    const matrix: Uint8Array[] = [];
    for (let i = 0; i < numData + numParity; i++) {
      const row = new Uint8Array(numData);
      if (i < numData) {
        row[i] = 1;
      } else {
        for (let j = 0; j < numData; j++) {
          row[j] = this.exp[this.log[(i - numData) + 1] * j % 255] || 1;
        }
      }
      matrix.push(row);
    }
    return matrix;
  }

  inverse(matrix: Uint8Array[]): Uint8Array[] {
    const n = matrix.length;
    const inv = Array.from({ length: n }, (_, i) => {
      const row = new Uint8Array(n);
      row[i] = 1;
      return row;
    });

    for (let i = 0; i < n; i++) {
      let pivot = i;
      while (pivot < n && matrix[pivot][i] === 0) pivot++;
      if (pivot === n) throw new Error("Singular matrix - Not enough shards");

      [matrix[i], matrix[pivot]] = [matrix[pivot], matrix[i]];
      [inv[i], inv[pivot]] = [inv[pivot], inv[i]];

      const invPivot = this.div(1, matrix[i][i]);
      for (let j = 0; j < n; j++) {
        matrix[i][j] = this.mul(matrix[i][j], invPivot);
        inv[i][j] = this.mul(inv[i][j], invPivot);
      }

      for (let k = 0; k < n; k++) {
        if (k !== i && matrix[k][i] !== 0) {
          const factor = matrix[k][i];
          for (let j = 0; j < n; j++) {
            matrix[k][j] ^= this.mul(matrix[i][j], factor);
            inv[k][j] ^= this.mul(inv[i][j], factor);
          }
        }
      }
    }
    return inv;
  }

  reconstruct(shards: Uint8Array[], dataIndexes: number[], totalData: number): Uint8Array[] {
    const matrix = this.buildMatrix(totalData, Math.max(0, shards.length - totalData));
    const subMatrix = dataIndexes.map(idx => new Uint8Array(matrix[idx]));
    const inv = this.inverse(subMatrix);

    const recovered: Uint8Array[] = [];
    const shardSize = shards[0].length;
    for (let i = 0; i < totalData; i++) {
      const out = new Uint8Array(shardSize);
      for (let j = 0; j < shards.length; j++) {
        if (inv[i][j] !== 0) {
          for (let k = 0; k < shardSize; k++) {
            out[k] ^= this.mul(inv[i][j], shards[j][k]);
          }
        }
      }
      recovered.push(out);
    }
    return recovered;
  }
}

const rs = new ReedSolomonEngine();

export async function fragmentEncryptedBlob(
  reportId: string,
  blob: EncryptedBlob,
  total = 3,
  threshold = 2
): Promise<VaultFragment[]> {
  const binaryData = new TextEncoder().encode(JSON.stringify(blob));

  const shardSize = Math.ceil(binaryData.length / threshold);
  const dataShards: Uint8Array[] = [];

  for (let i = 0; i < threshold; i++) {
    const shard = new Uint8Array(shardSize);
    shard.set(binaryData.subarray(i * shardSize, (i + 1) * shardSize));
    dataShards.push(shard);
  }

  const numParity = total - threshold;
  const parityShards = rs.encode(dataShards, numParity);

  const allShards = [...dataShards, ...parityShards];

  return Promise.all(allShards.map(async (shard, index) => {
    const payloadBase64 = toBase64(shard);
    return {
      reportId,
      index,
      total,
      threshold,
      scheme: "reed-solomon-galois-field" as const,
      payload: payloadBase64,
      checksum: await digest(payloadBase64)
    };
  }));
}

export async function reassembleEncryptedBlob(fragments: VaultFragment[]): Promise<EncryptedBlob> {
  if (!fragments.length) throw new Error("No fragments found.");

  const threshold = fragments[0].threshold;
  const totalData = threshold;

  const validFragments: VaultFragment[] = [];
  for (const f of fragments) {
    if ((await digest(f.payload)) === f.checksum) {
      validFragments.push(f);
    }
  }

  if (validFragments.length < threshold) {
    throw new Error(`Data loss unrecoverable. Need at least ${threshold} healthy shards.`);
  }

  const shards = validFragments.slice(0, threshold).map(f => fromBase64(f.payload));
  const dataIndexes = validFragments.slice(0, threshold).map(f => f.index);

  const recoveredShards = rs.reconstruct(shards, dataIndexes, totalData);

  const totalLength = recoveredShards.reduce((acc, s) => acc + s.length, 0);
  const combinedBuffer = new Uint8Array(totalLength);
  let cursor = 0;
  for (const shard of recoveredShards) {
    combinedBuffer.set(shard, cursor);
    cursor += shard.length;
  }

  const jsonText = new TextDecoder().decode(combinedBuffer).replace(/\0+$/, '').trim();
  return JSON.parse(jsonText) as EncryptedBlob;
}

async function digest(value: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}