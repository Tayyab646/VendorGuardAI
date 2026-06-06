```md
# VendorGuard AI powered by The Loom

VendorGuard AI powered by The Loom is a zero-knowledge vendor threat intelligence MVP built for **Track 3: Security & Compliance** in the **Bright Data AI Agents Web Data Hackathon**.

It helps companies monitor third-party vendors, SaaS providers, suppliers, and partners for early public-web risk signals before they become official breach announcements.

## Why This Project Stands Out

- Uses **Bright Data** for live public-web intelligence.
- Uses **Claude** for agentic investigation, reasoning, verification, and report generation.
- Uses **The Loom Vault** for browser-side zero-knowledge report encryption.
- Backend is stateless and does not store plaintext reports or user secrets.
- Includes a unique **Breach Horizon** timeline that estimates where a vendor sits before public incident confirmation.
- Provides a full SaaS interface with landing page, dashboard, investigation flow, vault, agents, settings, and vendor detail pages.

## Core Features

- Real-time investigation flow with Server-Sent Events.
- Bright Data SERP and Web Unlocker integration paths.
- Claude-powered vendor risk analysis.
- Risk scoring across security, compliance, exposure, operational, and reputation categories.
- Evidence confidence scoring.
- Breach Horizon early-warning timeline.
- Browser-only AES-GCM encrypted report vault.
- IndexedDB local encrypted fragment storage.
- Production mode with required real API keys.
- Demo mode only when explicitly enabled.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React
- Web Crypto API
- IndexedDB
- Bright Data APIs
- Anthropic Claude API

## Installation

Install Node.js LTS:

```text
https://nodejs.org
```

Clone the repo:

```bash
git clone https://github.com/Tayyab646/VendorGuardAI.git
cd VendorGuardAI
```

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```bash
cp .env.local.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.local.example .env.local
```

Add real keys:

```env
ANTHROPIC_API_KEY=your_real_anthropic_api_key
ANTHROPIC_MODEL=claude-sonnet-4-5
BRIGHT_DATA_API_KEY=your_real_bright_data_api_key
BRIGHT_DATA_SERP_ZONE=your_real_bright_data_serp_zone
BRIGHT_DATA_UNLOCKER_ZONE=your_real_bright_data_unlocker_zone
BRIGHT_DATA_MCP_URL=
APP_MODE=production
NEXT_PUBLIC_APP_MODE=production
```

Run locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Main Pages

- `/` - landing page
- `/dashboard` - risk dashboard
- `/investigate` - live vendor investigation
- `/vendors/cloudflare` - vendor detail page
- `/vault` - encrypted report vault
- `/agents` - agent activity and usage
- `/settings` - API and zero-knowledge settings

## API Routes

### Investigation

- `POST /api/investigate/start`
- `GET /api/investigate/stream/[requestId]`

### Bright Data

- `POST /api/brightdata/search`
- `POST /api/brightdata/scrape`

### Claude

- `POST /api/claude/analyze`

### Report

- `POST /api/report/generate`

## Security Boundary

VendorGuard AI only analyzes public web data.

Allowed:

- public search results
- public vendor websites
- public status pages
- public advisories
- public news
- public regulatory pages
- public vulnerability discussions
- public documentation

Not allowed:

- hacking
- exploitation
- unauthorized scanning
- credential theft
- login bypassing
- brute forcing
- port scanning
- private system access

## Team Workflow

Pull latest code:

```bash
git pull origin main
```

Create your own `.env.local` file and add your own API keys. Never commit `.env.local`.

Run the app:

```bash
npm run dev
```

Before pushing changes:

```bash
git status
git add .
git commit -m "Describe your change"
git push
```

Do not commit:

- `.env`
- `.env.local`
- real API keys
- `node_modules`
- `.next`
- logs

Safe to commit:

- source code
- README
- `.env.example`
- `.env.local.example`
- package files

## Build

```bash
npm run build
```

## Current Limitations

- Argon2id is interface-ready, but the MVP currently uses browser-compatible Web Crypto key derivation.
- Reed-Solomon fragmentation is implemented as a clear MVP interface and can be upgraded to full erasure coding.
- Investigation request IDs are stored in memory, so active streams reset if the server restarts.
- No backend database is used because the product is designed to avoid storing sensitive report content.
- Demo data is available only when `APP_MODE=demo` is explicitly enabled.

## Project Status

VendorGuard AI is a working real-time MVP with production API integration paths, zero-knowledge browser encryption, live agent progress, risk scoring, Breach Horizon visualization, and encrypted local report custody.
```
