# VendorGuard AI powered by The Loom

Zero-knowledge, serverless, client-side vendor threat intelligence for Track 3: Security & Compliance in the Bright Data AI Agents Web Data Hackathon.

VendorGuard AI monitors public web signals for third-party vendor security, compliance, exposure, operational, and reputation risk. Bright Data supplies live web intelligence, Claude performs agentic reasoning, and The Loom Vault encrypts final reports in the browser so the backend never stores plaintext reports, passphrases, decrypted intelligence, or user secrets.

## What is implemented

- Next.js App Router frontend with Tailwind, ShadCN-style primitives, Framer Motion, Recharts, and lucide icons.
- Stateless Next API execution layer for Claude, Bright Data SERP, Bright Data Web Unlocker, and SSE progress.
- Real-time investigation flow at `/investigate`.
- The Breach Horizon timeline for early warning posture.
- The Loom Vault browser module:
  - passphrase-derived key interface, Argon2id WASM-ready
  - working AES-GCM-256 encryption with Web Crypto
  - Reed-Solomon-style fragmentation interface and MVP fragment reassembly
  - IndexedDB local encrypted fragment storage
  - browser-only decrypt/unlock flow
- Pages:
  - `/`
  - `/dashboard`
  - `/investigate`
  - `/vendors/cloudflare`
  - `/vault`
  - `/agents`
  - `/settings`

## Environment

Create `.env.local` from `.env.example`:

```bash
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-4-5
BRIGHT_DATA_API_KEY=
BRIGHT_DATA_SERP_ZONE=
BRIGHT_DATA_UNLOCKER_ZONE=
BRIGHT_DATA_MCP_URL=
APP_MODE=production
NEXT_PUBLIC_APP_MODE=production
```

Production mode requires real keys. If any required key is missing, the investigation stream fails fast and tells you exactly which variable to add. For offline judging or UI demos only, set `APP_MODE=demo` and `NEXT_PUBLIC_APP_MODE=demo`; that is the only mode that uses sample data.

## Run

```bash
npm install
npm run dev
```

In this Codex desktop workspace, npm was bootstrapped locally under `.tools` because the shell did not expose npm. The project itself is standard Next.js and works with a normal Node/npm installation.

## Where to put real API keys

Create this file at the project root:

```text
C:\Users\Laptop\Documents\Codex\2026-05-27\build-a-real-time-mvp-startup\.env.local
```

Put your actual values there:

- `ANTHROPIC_API_KEY`: your Claude API key from Anthropic Console.
- `ANTHROPIC_MODEL`: optional; defaults to `claude-sonnet-4-5`.
- `BRIGHT_DATA_API_KEY`: your Bright Data API token.
- `BRIGHT_DATA_SERP_ZONE`: your Bright Data SERP API zone name, for example the zone you created for SERP.
- `BRIGHT_DATA_UNLOCKER_ZONE`: your Bright Data Web Unlocker / Unlocker API zone name.
- `BRIGHT_DATA_MCP_URL`: optional, reserved for a Bright Data MCP endpoint if you connect one.
- `APP_MODE=production` and `NEXT_PUBLIC_APP_MODE=production`: real product mode, no predefined report data.

Restart `npm run dev` after changing `.env.local`.

## Demo flow

1. Open `/investigate`.
2. Use a demo vendor such as Cloudflare, Stripe, OpenAI, HubSpot, or Shopify.
3. Enter a passphrase with at least 8 characters.
4. Click **Start Live Investigation**.
5. Watch SSE agent progress:
   - Orchestrator Agent
   - Bright Data Search Agent
   - Web Unlocker Scraper Agent
   - Exposure Signal Agent
   - Compliance Agent
   - Source Verification Agent
   - Risk Scoring Agent
   - Report Agent
6. The browser encrypts the report with AES-GCM and stores local fragments in IndexedDB.
7. Open `/vault`, enter the same passphrase, and unlock the report locally.

## Security boundary

VendorGuard AI only analyzes public web data. It does not perform hacking, exploitation, unauthorized scanning, credential theft, login bypassing, brute forcing, port scanning, or private system access.

The backend is intentionally stateless for sensitive content:

- no persistent database
- no plaintext report storage
- no passphrase handling
- no decrypted risk data custody
- logs should contain only non-sensitive metadata such as request ID and timing

## Key files

- `src/lib/server/investigation.ts` - agent workflow and SSE events
- `src/lib/api/brightdata.ts` - Bright Data SERP and Web Unlocker calls
- `src/lib/api/claude.ts` - Claude report analysis
- `src/lib/loom/crypto.ts` - Web Crypto AES-GCM
- `src/lib/loom/key-derivation.ts` - Argon2id-ready KDF interface
- `src/lib/loom/fragmentation.ts` - Reed-Solomon-ready fragmentation interface
- `src/lib/loom/vault.ts` - IndexedDB encrypted fragment vault
