Agent workflow and SSE progress events.

```text
src/lib/api/brightdata.ts
```

Bright Data SERP and Web Unlocker integration.

```text
src/lib/api/claude.ts
```

Claude Messages API report analysis.

```text
src/lib/loom/crypto.ts
```

AES-GCM browser encryption and decryption helpers.

```text
src/lib/loom/key-derivation.ts
```

Passphrase key derivation and Argon2id-ready boundary.

```text
src/lib/loom/fragmentation.ts
```

Encrypted report fragmentation interface.

```text
src/lib/loom/vault.ts
```

IndexedDB local encrypted report vault.

```text
src/lib/server/config.ts
```

Production/demo mode and required environment variable checks.

## Team Workflow

Clone the repo:

```bash
git clone https://github.com/Tayyab646/VendorGuardAI.git
cd VendorGuardAI
```

Install dependencies:

```bash
npm install
```

Create local environment file:

```bash
cp .env.local.example .env.local
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.local.example .env.local
```

Add your real local API keys to `.env.local`.

Run:

```bash
npm run dev
```

Before pushing:

```bash
git status
git add .
git commit -m "Describe your change"
git push
```

## Secret Safety

Never commit:

- `.env`
- `.env.local`
- real API keys
- `node_modules`
- `.next`
- logs

The `.gitignore` already blocks these files.

Safe to commit:

- `.env.example`
- `.env.local.example`
- source code
- README
- package files

## Deployment Notes

This app can be deployed to platforms that support Next.js App Router API routes, such as Vercel.

For deployment:

1. Add the same environment variables in the hosting provider dashboard.
2. Keep `APP_MODE=production`.
3. Do not expose server-side keys to client-side code.
4. Keep Bright Data and Anthropic keys as server-only environment variables.

## Current MVP Limitations

- Argon2id is interface-ready, but the current MVP key derivation uses Web Crypto-compatible browser primitives.
- Reed-Solomon fragmentation is represented by a clear MVP fragmentation interface and can be replaced with a full erasure-coding implementation.
- Backend state is in-memory, so active investigation request IDs reset when the server restarts.
- No persistent backend database is used by design.

## Project Status

VendorGuard AI is a working MVP with real integration paths. In production mode, it requires real Bright Data and Claude credentials. In demo mode, it can be used for offline presentation and UI testing.

## License

Add your team license here if needed.
