# Exovia

A privacy vault interface for Solana. Deposits move into a program-owned pool
and become internal balances, so the depositing address reads empty while the
funds stay withdrawable — through a zero-knowledge proof that names no sender,
or behind a passphrase-derived guardian key.

**exovia.xyz** · token `$EXOVIA`

## What is here

This repository holds the web interface. The vault programs themselves are
still in development, so every screen that would send a transaction says so
plainly instead of failing quietly.

- `/` — what the vaults do and what they do not
- `/app` — Shielded Vault and Guarded Vault, with deposit, withdraw, transfer
  and passphrase screens laid out as they will work
- `/docs` — the deposit/withdraw flow, the relayer, ticket handling, and the
  security model in full

Wallet sign-in is real. Any Solana wallet that speaks
[Wallet Standard](https://github.com/wallet-standard/wallet-standard) is
discovered on its own, and connecting runs the full handshake: the server
issues a nonce, the wallet signs a statement carrying it, and the server
verifies that ed25519 signature against the claimed address before setting an
httpOnly session cookie. It is a message signature, not a transaction — no
funds move and no fee is paid.

## Stack

- Next.js 16 (App Router) with React 19
- TypeScript, strict
- Tailwind CSS v4, tokens only — every colour flips between the light and dark
  themes through one set of CSS variables
- `bs58` and `tweetnacl` for signature verification, and nothing else at
  runtime — no wallet SDKs, no RPC client, no analytics

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Environment

| Variable               | Required      | What it does                                                                                                                                                                                                                                                                                                        |
| ---------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AUTH_SECRET`          | in production | HMAC key for the session cookie. **At least 32 random characters.** There is deliberately no fallback in production: without it the server refuses to sign sessions and `/api/auth/verify` fails loudly rather than handing out forgeable cookies. Local development falls back to a fixed development-only string. |
| `NEXT_PUBLIC_SITE_URL` | no            | Overrides the canonical URL in metadata when previewing on another host.                                                                                                                                                                                                                                            |

Generate one with `openssl rand -base64 32`.

The statement a wallet is asked to sign names the host actually being visited,
so a preview deployment shows its own URL rather than the production domain.
The host is recorded in the challenge cookie and the signature is checked
against exactly that, so it cannot be swapped between the two.

## Configuration

Everything that carries the brand lives in `src/config/brand.ts` — name, token
symbol, mint address, vault names, relayer fee and social links. The market
link and the shortened contract address are both derived from `token.mint`, so
changing the mint in that one place updates every place it appears.

## License

MIT — see [LICENSE](LICENSE).
