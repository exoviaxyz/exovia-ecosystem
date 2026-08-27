import Link from "next/link";
import { brand } from "@/config/brand";
import { ProofStream } from "@/components/ProofStream";
import { SectionHeading } from "@/components/SectionHeading";
import {
  ArrowIcon,
  CheckIcon,
  Glyph,
  type GlyphName,
} from "@/components/icons";

const HEADLINE_STATS = [
  { value: "ZK", label: "Unlinked exits" },
  { value: "PASS", label: "Passphrase lock" },
  { value: "SPL", label: "Any token" },
  { value: "0", label: "Whitelists" },
];

const COMPARE: {
  row: string;
  shielded: string;
  guarded: string;
}[] = [
  {
    row: "What it is for",
    shielded: "Paying someone without naming yourself",
    guarded: "Holding a balance nobody can read",
  },
  {
    row: "How privacy is won",
    shielded: "A zero-knowledge proof stands in for your identity",
    guarded: "Funds sit in the pool program; your address reads zero",
  },
  {
    row: "What the chain shows",
    shielded: "The depositor is never named",
    guarded: "The depositor is visible; the amount is not",
  },
  {
    row: "Crowd to hide in",
    shielded: "Grows with every deposit of the same size",
    guarded: "None — this one hides the amount, not the sender",
  },
  {
    row: "Exit without a fee balance",
    shielded: "Yes, through a relayer",
    guarded: "—",
  },
  {
    row: "Send inside the vault",
    shielded: "—",
    guarded: "Yes, to any address",
  },
  {
    row: "If your key leaks",
    shielded: "—",
    guarded: "Funds hold — the passphrase is a second lock",
  },
  {
    row: "Getting funds out",
    shielded: "Present the ticket, prove it, withdraw",
    guarded: "Sign, then enter the passphrase",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Deposit",
    body: "Send SOL or any SPL token to the vault. It lands inside the pool program as an internal balance, and only a commitment — a one-way fingerprint — is written on chain. No amount, no name.",
  },
  {
    n: "02",
    title: "Let it sit",
    body: "Keep your ticket somewhere safe. Every deposit of the same size that arrives after yours widens the crowd you are standing in, and narrowing it back down gets harder by the day.",
  },
  {
    n: "03",
    title: "Withdraw",
    body: "Build a proof from the ticket and withdraw to an address that has never touched the first one. What the chain records is a pool settlement, and nothing points back.",
  },
];

const ARCHITECTURE: {
  glyph: GlyphName;
  title: string;
  body: string;
}[] = [
  {
    glyph: "vanish",
    title: "Your address reads empty",
    body: "Deposit and the balance leaves your account for the pool program. Anyone reading your address sees a wallet with nothing in it.",
  },
  {
    glyph: "pool",
    title: "One shared pool",
    body: "Every deposit joins the same program-owned pool. Yours is not a separate box with your name on it — it is one entry among all of them.",
  },
  {
    glyph: "token",
    title: "SOL and any SPL token",
    body: "Native SOL, stablecoins, or a token minted this morning. There is no list of approved mints to be on.",
  },
  {
    glyph: "transfer",
    title: "Move funds inside",
    body: "Send a balance to another address without either side leaving the vault, so nothing about the pair is written down.",
  },
  {
    glyph: "proof",
    title: "Proofs, not passwords",
    body: "A withdrawal is settled against a zero-knowledge proof. The program learns that a valid deposit exists and nothing else about which one.",
  },
  {
    glyph: "blend",
    title: "Looks like plain settlement",
    body: "Withdrawals leave the same trace as any other pool payout — there is no distinctive shape for an observer to filter on.",
  },
  {
    glyph: "relayer",
    title: "Arrive without fees",
    body: `A relayer pays the network fee and takes ${(brand.vault.relayerFeeBps / 100).toFixed(2)}% out of the withdrawal, so a fresh address never has to be funded first.`,
  },
  {
    glyph: "passphrase",
    title: "A second lock",
    body: "A passphrase-derived guardian key sits over the Guarded Vault. A stolen private key on its own moves nothing.",
  },
  {
    glyph: "immutable",
    title: "Nobody holds a master key",
    body: "No admin, no upgrade path, no pause switch. A spent deposit is recorded once and can never be spent twice.",
  },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="aura border-b border-line">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-28">
          <div>
            <span className="chip inline-flex items-center gap-2 px-3 py-1.5 text-[0.6875rem] text-ink-dim">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
              Built on Solana · SOL and SPL tokens
            </span>

            <h1 className="display mt-7 text-5xl sm:text-6xl lg:text-[4.6rem]">
              Hold everything.
              <br />
              <span className="accent-text">Show nothing.</span>
            </h1>

            <p className="mt-7 max-w-lg text-[0.95rem] leading-relaxed text-ink-dim">
              Deposit into the {brand.name} pool program and the balance leaves
              your address for a pool shared with everyone else&apos;s. Send it
              on with a proof that names no sender, or lock it behind a
              passphrase only you know. From the outside it reads as ordinary
              settlement.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-void transition-opacity hover:opacity-90"
              >
                Open App
                <ArrowIcon />
              </Link>
              <Link
                href="/docs"
                className="rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent"
              >
                Read the docs
              </Link>
            </div>
          </div>

          <ProofStream />
        </div>

        <div className="mx-auto -mb-px w-full max-w-6xl px-5">
          <div className="grid grid-cols-2 rounded-t-2xl border border-b-0 border-line sm:grid-cols-4">
            {HEADLINE_STATS.map((s, i) => (
              <div
                key={s.label}
                className={`px-5 py-5 text-center ${i > 0 ? "border-l border-line" : ""} ${i === 2 ? "border-l-0 sm:border-l" : ""} ${i >= 2 ? "border-t border-line sm:border-t-0" : ""}`}
              >
                <p className="display text-2xl text-accent">{s.value}</p>
                <p className="mt-1 text-[0.6875rem] text-ink-faint">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Two vaults ───────────────────────────────────── */}
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <SectionHeading
            eyebrow="Two vaults"
            title="Pick the kind of quiet you need"
            lead="One breaks the link between who paid and who was paid. The other keeps what you hold off the record. They are separate vaults and you can use both."
          />

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-[22%] p-0" />
                  <th className="rounded-t-2xl border border-b-0 border-line bg-raised px-5 py-6 text-center align-top">
                    <p className="display text-lg text-ink">
                      {brand.vault.shielded}
                    </p>
                    <span className="chip mt-2 inline-block px-3 py-1 text-[0.6875rem] font-normal text-accent">
                      Anonymous transfers
                    </span>
                  </th>
                  <th className="rounded-t-2xl border border-b-0 border-l-0 border-line bg-raised px-5 py-6 text-center align-top">
                    <p className="display text-lg text-ink">
                      {brand.vault.guarded}
                    </p>
                    <span className="chip mt-2 inline-block px-3 py-1 text-[0.6875rem] font-normal text-accent">
                      Hidden holdings
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r.row}>
                    <td className="py-4 pr-5 align-top text-[0.8125rem] text-ink-faint">
                      {r.row}
                    </td>
                    <Cell value={r.shielded} />
                    <Cell value={r.guarded} className="border-l-0" />
                  </tr>
                ))}
                <tr>
                  <td />
                  <td className="rounded-b-2xl border border-t-0 border-line px-5 py-5 text-center">
                    <Link
                      href="/app?vault=shielded"
                      className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-opacity hover:opacity-80"
                    >
                      Open {brand.vault.shielded}
                      <ArrowIcon />
                    </Link>
                  </td>
                  <td className="rounded-b-2xl border border-t-0 border-l-0 border-line px-5 py-5 text-center">
                    <Link
                      href="/app?vault=guarded"
                      className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-opacity hover:opacity-80"
                    >
                      Open {brand.vault.guarded}
                      <ArrowIcon />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <SectionHeading
            eyebrow="How it works"
            title="Three moves, start to end"
          />

          <ol className="mt-12 max-w-2xl">
            {STEPS.map((s, i) => (
              <li key={s.n} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="num grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong text-xs text-accent">
                    {s.n}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span className="w-px flex-1 bg-line" aria-hidden="true" />
                  )}
                </div>
                <div className={i < STEPS.length - 1 ? "pb-10" : ""}>
                  <h3 className="text-base font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-dim">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Architecture ─────────────────────────────────── */}
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <SectionHeading
            eyebrow="Architecture"
            title="What the design actually buys you"
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ARCHITECTURE.map((c) => (
              <article key={c.title} className="panel p-5">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-line text-accent">
                  <Glyph name={c.glyph} />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-ink">
                  {c.title}
                </h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-dim">
                  {c.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing ──────────────────────────────────────── */}
      <section className="aura">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 text-center">
          <h2 className="display text-3xl text-ink sm:text-[2.6rem]">
            Your funds. Your business.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-dim">
            Connect a Solana wallet and look around. Nothing moves until the
            vault programs are live.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-void transition-opacity hover:opacity-90"
            >
              Open App
              <ArrowIcon />
            </Link>
            <a
              href={brand.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent"
            >
              Follow on X
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Cell({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  return (
    <td
      className={`border-x border-line px-5 py-4 text-center align-top text-[0.8125rem] leading-relaxed text-ink ${className}`}
    >
      {value === "—" ? (
        <span className="text-ink-ghost">—</span>
      ) : value.startsWith("Yes") ? (
        <span className="inline-flex items-center gap-1.5 text-accent">
          <CheckIcon />
          {value.replace(/^Yes,?\s*/, "") || "Yes"}
        </span>
      ) : (
        value
      )}
    </td>
  );
}
