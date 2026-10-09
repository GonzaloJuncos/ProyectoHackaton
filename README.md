# Logis — Supplier payments with on-chain approvals (Solana devnet)

**Logis** is a supplier-payment platform for Latin American SMBs: the company registers providers, uploads invoices, approves payments through a **2-of-3 Squads multisig**, an **automated verification agent** checks each invoice before execution, and the **USDC payment settles on Solana in seconds** with the invoice hash embedded on-chain — producing an auditable reconciliation dashboard.

> **This project runs exclusively on Solana devnet.** All USDC is testnet value (free from faucets, worth nothing). No mainnet, no real funds.

Built for the **Colosseum Crypto World's Fair** — Superteam Argentina track.

## The problem

Paying suppliers — especially cross-border — is slow (SWIFT takes days, hides fees and FX costs), and reconciling invoices with payments is manual. Logis makes every payment provable: invoice ↔ multi-sig approvals ↔ on-chain transaction, verifiable in the Solana Explorer.

## How it works (3-minute demo)

1. An **employee** registers a provider and uploads an invoice (or imports a CSV).
2. **Two of three approvers** (boss, supervisor, admin) sign the payment on-chain via a Squads 2/3 multisig.
3. The **verification agent** checks the invoice: matches the purchase order, provider is registered and active, amount is within expectations, no duplicates. If it fails, the payment is blocked — the human signers can't bypass this.
4. The **USDC payment executes on devnet** with the invoice's SHA-256 hash in a memo instruction.
5. The **reconciliation dashboard** links invoice ↔ approvals ↔ transaction, with a direct Explorer link.

## Architecture

```
apps/
  web/        React + Vite — the demo app (Phantom via @solana/kit wallet-standard)
  web-ui/     Next.js design reference (mock data only — not wired)
  api/        Fastify + Prisma + SQLite — never signs; it builds serialized
              instructions and the browser wallets sign them on-chain
packages/
  shared/     TypeScript API contracts shared by front and back
programa/     Reserved for a future own program (MVP uses Squads, already audited)
```

**On-chain pieces:** [Squads v4 multisig](https://squads.so) (threshold 2-of-3), SPL-Token USDC devnet (`4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`), Memo program carrying `logis:factura:<sha256>`.

## Run locally

Requires Node 18+.

```bash
npm install
cp apps/api/.env.example apps/api/.env   # DATABASE_URL=file:./dev.db
npm run db:push && npm run db:seed        # creates and seeds SQLite
npm run dev:api                           # http://localhost:3001
npm run dev:web                           # http://localhost:5173
```

Seed credentials (password `logis123` for all): `admin@`, `jefe@`, `supervisor@`, `empleado@logis.demo` — one per role. The seed includes 3 providers with real devnet wallets, 3 purchase orders and 8 invoices (one deliberately fails the agent's checks).

### To execute real payments on devnet

1. Each signer (admin/jefe/supervisor) logs in and connects a **Phantom wallet set to devnet** — its pubkey is linked to their user.
2. The admin creates the company multisig from the Invoices screen.
3. Fund the multisig vault with devnet USDC from <https://faucet.circle.com> (and devnet SOL for fees from any Solana faucet).
4. Propose a payment, approve with a second signer, execute — then open the Explorer link and look for the `logis:factura:` memo.

## Deploy

- **API** → Render via `render.yaml` (persistent disk for SQLite at `/var/data`; set `CORS_ORIGIN` to the front's public URL).
- **Web** → Vercel, root dir `apps/web` (`vercel.json` included for SPA routing; set `VITE_API_URL` to the API's public URL).

## Security model

- No custody: the API never holds keys — every transaction is signed by a human wallet in the browser, always showing destination, amount, token and network.
- The agent cannot skip multisig signatures: it only executes payments already approved 2/3 on-chain, and only if the invoice passes verification.
- Role hierarchy: admin > boss > supervisor > employee (employees can upload but never approve).

## Hackathon notes

- Everything was built during the hackathon window; prior work declared: none — the repo starts from the team's hackathon kit.
- Devnet only, by design (RNF-01).
