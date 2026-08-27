import type { Metadata } from "next";
import { brand, tokenTicker } from "@/config/brand";
import { DevBadge } from "@/components/UnderDevelopment";

export const metadata: Metadata = {
  title: "Docs",
  description: `How the ${brand.name} vaults work, what they protect, and what they do not.`,
};

const RELAYER_FEE = `${(brand.vault.relayerFeeBps / 100).toFixed(2)}%`;

type Block =
  | { kind: "p"; text: string }
  | { kind: "note"; text: string }
  | { kind: "code"; text: string }
  | { kind: "h"; text: string }
  | { kind: "list"; items: { term?: string; text: string }[] };

interface Section {
  id: string;
  group: string;
  title: string;
  blocks: Block[];
}

const SECTIONS: Section[] = [
  {
    id: "what-is-exovia",
    group: "Overview",
    title: `What is ${brand.name}`,
    blocks: [
      {
        kind: "p",
        text: `${brand.name} is a privacy vault on Solana. A deposit does not sit in an account with your name on it — it moves into a program-owned pool and becomes one internal balance among all the others held there.`,
      },
      {
        kind: "note",
        text: "What an observer reads on chain is a pool settlement, the same shape any other payout from that program has.",
      },
      { kind: "h", text: "Two vaults" },
      {
        kind: "list",
        items: [
          {
            term: brand.vault.shielded,
            text: "A zero-knowledge proof stands between the deposit and the withdrawal, so the two cannot be tied together. Works with SOL and any SPL token.",
          },
          {
            term: brand.vault.guarded,
            text: "A passphrase-derived guardian key sits over your balance, so funds hold even if your private key is taken. Includes transfers that stay inside the vault.",
          },
        ],
      },
      { kind: "h", text: "What you get out of it" },
      {
        kind: "list",
        items: [
          {
            term: "An address that reads empty",
            text: "Whatever you deposit leaves your account. Anyone looking up your address sees a wallet holding nothing.",
          },
          {
            term: "No approved-token list",
            text: "Native SOL, stablecoins, or a mint created this morning — there is no list to be added to.",
          },
          {
            term: "Transfers with no counterparty on record",
            text: "Move a balance to another address without either side leaving the vault.",
          },
          {
            term: "Exits that need no fee balance",
            text: "A relayer can pay the network fee, so a fresh address never has to be funded first.",
          },
        ],
      },
    ],
  },
  {
    id: "how-it-works",
    group: "Overview",
    title: "How it works",
    blocks: [
      {
        kind: "p",
        text: "Deposit, wait, withdraw. The waiting is not a formality — it is where most of the privacy actually comes from.",
      },
      {
        kind: "list",
        items: [
          {
            term: "Deposit",
            text: "Your tokens move into the pool program and a commitment — a one-way fingerprint of a secret only you hold — is written on chain. Neither the amount nor your identity is part of what is published.",
          },
          {
            term: "Wait",
            text: "Every later deposit of the same size joins the crowd yours is standing in. Withdraw a minute after depositing and the timing alone narrows that crowd to one.",
          },
          {
            term: "Withdraw",
            text: "Your browser builds a proof from the ticket and the program checks it. It learns that some valid deposit is being spent, and nothing about which one.",
          },
        ],
      },
    ],
  },
  {
    id: "deposit",
    group: "User guide",
    title: "Deposit",
    blocks: [
      {
        kind: "p",
        text: "Pick a vault, pick a token, enter an amount. Round amounts are worth preferring: a deposit of 1 SOL hides among every other 1 SOL deposit, while 1.0473 SOL hides among nothing.",
      },
      {
        kind: "p",
        text: `A ${brand.vault.shielded} deposit hands you a ticket the moment it settles:`,
      },
      { kind: "code", text: brand.vault.ticketFormat },
      {
        kind: "p",
        text: "The base58 payload carries the commitment, the secret, the nullifier and which token it was. It never leaves your browser, and it is not recoverable from anywhere else.",
      },
      {
        kind: "note",
        text: "Lose the ticket and the deposit stays in the pool forever. Back it up the moment you get it — outside the browser.",
      },
    ],
  },
  {
    id: "withdraw",
    group: "User guide",
    title: "Withdraw",
    blocks: [
      {
        kind: "p",
        text: "Paste the ticket, name the address you want paid, and the proof is generated locally — the ticket is never sent anywhere. The program verifies it and records the nullifier so the same deposit cannot be spent twice.",
      },
      {
        kind: "p",
        text: "Withdraw to an address that has never had anything to do with the one you deposited from. Sending funds straight back to the depositing wallet undoes the whole exercise in one move.",
      },
    ],
  },
  {
    id: "relayer",
    group: "User guide",
    title: "Relayer",
    blocks: [
      {
        kind: "p",
        text: `A brand-new address holds no SOL, and funding it from your own wallet would draw exactly the line you were trying to avoid. A relayer submits the withdrawal for you, pays the network fee, and takes ${RELAYER_FEE} of the amount.`,
      },
      {
        kind: "p",
        text: "The relayer sees the proof and the destination. It cannot alter either, and it cannot learn which deposit is being spent.",
      },
    ],
  },
  {
    id: "guarded-vault",
    group: "User guide",
    title: brand.vault.guarded,
    blocks: [
      {
        kind: "p",
        text: "This vault answers a different question. It does not hide who deposited — it hides what they hold, and it adds a second lock in front of moving it.",
      },
      {
        kind: "p",
        text: "Your passphrase is stretched in the browser into a guardian key, and withdrawals need both your signature and that key. A stolen private key on its own moves nothing.",
      },
      {
        kind: "note",
        text: "The passphrase is never transmitted and never stored. Nobody can reset it for you.",
      },
    ],
  },
  {
    id: "internal-transfer",
    group: "User guide",
    title: "Internal transfer",
    blocks: [
      {
        kind: "p",
        text: "A transfer reassigns a balance from one address to another inside the vault. Nothing is withdrawn, so no transfer between the two addresses appears anywhere on chain.",
      },
      {
        kind: "p",
        text: "The recipient sees the balance the next time they open the vault and can withdraw it like any other.",
      },
    ],
  },
  {
    id: "tickets",
    group: "User guide",
    title: "Managing tickets",
    blocks: [
      {
        kind: "p",
        text: "Tickets are held in this browser's local storage. Clearing site data, using a private window, or switching devices means they are gone unless you copied them somewhere first.",
      },
      {
        kind: "p",
        text: "Treat a ticket the way you would treat a bearer note: anyone holding it can withdraw the deposit.",
      },
    ],
  },
  {
    id: "programs",
    group: "Reference",
    title: "Programs",
    blocks: [
      {
        kind: "p",
        text: "Program addresses are published here once the vaults are deployed and their source is up for review.",
      },
    ],
  },
  {
    id: "security",
    group: "Reference",
    title: "Security model",
    blocks: [
      {
        kind: "p",
        text: "What the design does hold, and what it does not:",
      },
      {
        kind: "list",
        items: [
          {
            term: "No admin key",
            text: "No owner, no upgrade authority, no pause switch. Nobody can move your balance, including us.",
          },
          {
            term: "No double spend",
            text: "Each deposit carries a nullifier recorded on first use. A second withdrawal against the same deposit is rejected.",
          },
          {
            term: "Privacy has limits",
            text: "The vault hides links on chain. It cannot help with an unusual amount, a withdrawal seconds after a deposit, or an address you have already tied to your name elsewhere.",
          },
          {
            term: "Your browser is part of it",
            text: "Tickets and passphrases are handled locally. A compromised machine defeats every guarantee above.",
          },
        ],
      },
    ],
  },
  {
    id: "faq",
    group: "Reference",
    title: "FAQ",
    blocks: [
      {
        kind: "list",
        items: [
          {
            term: "Is it live?",
            text: "Not yet. The interface is here to be read and walked through; the vault programs are still in development, and the app says so wherever an action would otherwise fire.",
          },
          {
            term: `Do I need ${tokenTicker} to use it?`,
            text: `No. ${tokenTicker} is the project token, not a toll on the vaults.`,
          },
          {
            term: "Can you recover my ticket or passphrase?",
            text: "No. Neither ever reaches us, so there is nothing on our side to recover from.",
          },
          {
            term: "Which wallets work?",
            text: "Any Solana wallet that speaks Wallet Standard, which in practice is all of the current ones. Installed wallets show up in the picker on their own.",
          },
        ],
      },
    ],
  },
];

const GROUPS = [...new Set(SECTIONS.map((s) => s.group))];

export default function DocsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl gap-10 px-5 py-12">
      {/* Daftar isi */}
      <nav className="hidden w-52 shrink-0 lg:block">
        <div className="sticky top-24">
          {GROUPS.map((g) => (
            <div key={g} className="mb-6">
              <p className="label mb-2">{g}</p>
              <ul className="space-y-0.5">
                {SECTIONS.filter((s) => s.group === g).map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block rounded-lg px-2.5 py-1.5 text-[0.8125rem] text-ink-dim transition-colors hover:bg-raised hover:text-ink"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <article className="panel min-w-0 flex-1 p-6 sm:p-9">
        <header className="mb-9 border-b border-line pb-6">
          <h1 className="display text-3xl text-ink">{brand.name} docs</h1>
          <p className="mt-2 text-sm text-ink-dim">{brand.description}</p>
          <div className="mt-4">
            <DevBadge label="Vault programs in development" />
          </div>
        </header>

        {SECTIONS.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className="mb-12 scroll-mt-24 last:mb-0"
          >
            <h2 className="display text-xl text-ink">{s.title}</h2>
            {s.blocks.map((b, i) => (
              <Block key={i} block={b} />
            ))}
          </section>
        ))}
      </article>
    </div>
  );
}

function Block({ block }: { block: Block }) {
  switch (block.kind) {
    case "p":
      return (
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          {block.text}
        </p>
      );
    case "h":
      return (
        <h3 className="mt-7 text-sm font-semibold text-ink">{block.text}</h3>
      );
    case "note":
      return (
        <p className="mt-4 rounded-r-xl border-l-2 border-accent bg-raised px-4 py-3 text-[0.8125rem] leading-relaxed text-ink-dim">
          {block.text}
        </p>
      );
    case "code":
      return (
        <pre className="mt-4 overflow-x-auto rounded-xl border border-line bg-raised px-4 py-3">
          <code className="num text-[0.75rem] text-accent">{block.text}</code>
        </pre>
      );
    case "list":
      return (
        <ul className="mt-4 space-y-2.5">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-sm leading-relaxed text-ink-dim"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span>
                {item.term && (
                  <strong className="font-semibold text-ink">
                    {item.term}
                    {" — "}
                  </strong>
                )}
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      );
  }
}
