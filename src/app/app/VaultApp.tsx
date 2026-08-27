"use client";

import { useMemo, useState } from "react";
import { AmountInput } from "@/components/AmountInput";
import { DevPanel } from "@/components/UnderDevelopment";
import { brand } from "@/config/brand";
import { useWallet } from "@/lib/wallet";

export type VaultId = "shielded" | "guarded";

const VAULTS: {
  id: VaultId;
  name: string;
  note: string;
  tabs: string[];
  stats: string[];
}[] = [
  {
    id: "shielded",
    name: brand.vault.shielded,
    note: "Proof-backed · anonymous",
    tabs: ["Deposit", "Withdraw", "Tickets"],
    stats: ["Pooled", "Deposits", "Crowd size"],
  },
  {
    id: "guarded",
    name: brand.vault.guarded,
    note: "Owner-only · passphrase",
    tabs: ["Deposit", "Withdraw", "Transfer", "Passphrase"],
    stats: ["Pooled", "Holders", "Passphrase set"],
  },
];

const TOKENS = ["SOL", "wSOL", "USDC"];
const PRESETS = ["0.5", "1", "10", "100"];

export function VaultApp({ initialVault }: { initialVault: VaultId }) {
  const [vaultId, setVaultId] = useState<VaultId>(initialVault);
  const [tab, setTab] = useState(0);
  const [token, setToken] = useState(TOKENS[0]);
  const [amount, setAmount] = useState("");

  const vault = useMemo(
    () => VAULTS.find((v) => v.id === vaultId) ?? VAULTS[0],
    [vaultId],
  );
  const active = vault.tabs[Math.min(tab, vault.tabs.length - 1)];

  return (
    <div className="mx-auto w-full max-w-xl px-5 py-10">
      {/* Pemilih vault */}
      <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-line">
        {VAULTS.map((v) => {
          const on = v.id === vault.id;
          return (
            <button
              key={v.id}
              onClick={() => {
                setVaultId(v.id);
                setTab(0);
              }}
              className={`px-4 py-3.5 text-center transition-colors ${
                on
                  ? "border-b-2 border-accent bg-raised"
                  : "border-b-2 border-transparent hover:bg-raised/60"
              }`}
            >
              <span
                className={`block text-sm font-semibold ${on ? "text-ink" : "text-ink-dim"}`}
              >
                {v.name}
              </span>
              <span className="mt-0.5 block text-[0.6875rem] text-ink-faint">
                {v.note}
              </span>
            </button>
          );
        })}
      </div>

      {/* Angka vault — kosong sampai programnya hidup */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        {vault.stats.map((s) => (
          <div key={s} className="panel px-4 py-4 text-center">
            <p className="num text-lg text-ink-ghost">—</p>
            <p className="mt-0.5 text-[0.6875rem] text-ink-faint">{s}</p>
          </div>
        ))}
      </div>

      {/* Tab */}
      <div className="mt-3 rounded-2xl border border-line">
        <div className="flex overflow-x-auto border-b border-line">
          {vault.tabs.map((t, i) => {
            const on = t === active;
            return (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={`flex-1 px-4 py-3 text-center text-[0.8125rem] whitespace-nowrap transition-colors ${
                  on
                    ? "border-b-2 border-accent text-accent"
                    : "border-b-2 border-transparent text-ink-dim hover:text-ink"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="p-5">
          {active === "Deposit" && (
            <Deposit
              vault={vault.name}
              token={token}
              setToken={setToken}
              amount={amount}
              setAmount={setAmount}
              shielded={vault.id === "shielded"}
            />
          )}
          {active === "Withdraw" && (
            <Withdraw shielded={vault.id === "shielded"} />
          )}
          {active === "Tickets" && <Tickets />}
          {active === "Transfer" && <Transfer token={token} />}
          {active === "Passphrase" && <Passphrase />}
        </div>
      </div>

      <p className="mt-4 text-center text-[0.6875rem] leading-relaxed text-ink-faint">
        The vault programs are still in development. Signing in asks your wallet
        for a signature over a short message — it proves the address is yours,
        and it is not a transaction: no funds move and no fee is paid.
      </p>
    </div>
  );
}

/* ---- panel isi ---- */

function Heading({ title, lead }: { title: string; lead: string }) {
  return (
    <>
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-dim">
        {lead}
      </p>
    </>
  );
}

function Deposit({
  vault,
  token,
  setToken,
  amount,
  setAmount,
  shielded,
}: {
  vault: string;
  token: string;
  setToken: (t: string) => void;
  amount: string;
  setAmount: (a: string) => void;
  shielded: boolean;
}) {
  return (
    <>
      <Heading
        title={`Deposit into the ${vault}`}
        lead={
          shielded
            ? "The deposit is recorded as a commitment and hands you a ticket. Keep the ticket — it is the only way back out."
            : "The balance moves into the pool program and stays yours to withdraw at any size, any time."
        }
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {TOKENS.map((t) => (
          <Chip key={t} on={t === token} onClick={() => setToken(t)}>
            {t}
          </Chip>
        ))}
        <Chip on={false} disabled>
          + Custom
        </Chip>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <Chip key={p} on={p === amount} onClick={() => setAmount(p)} muted>
            {p} {token}
          </Chip>
        ))}
      </div>

      <div className="mt-4">
        <AmountInput value={amount} onChange={setAmount} symbol={token} />
      </div>

      {shielded && (
        <p className="mt-3 font-mono text-[0.6875rem] leading-relaxed text-ink-faint">
          Ticket format · {brand.vault.ticketFormat}
        </p>
      )}

      <div className="mt-4">
        <ActionButton label="Deposit" />
      </div>
    </>
  );
}

function Withdraw({ shielded }: { shielded: boolean }) {
  return (
    <>
      <Heading
        title="Withdraw"
        lead={
          shielded
            ? "Paste the ticket you saved at deposit. The proof is built in your browser; the address you withdraw to never has to have met the one you deposited from."
            : "Withdraw any part of your balance back to your own address. The passphrase is asked for at the end."
        }
      />

      <div className="mt-4 space-y-3">
        {shielded ? (
          <Field label="Ticket" placeholder={brand.vault.ticketFormat} mono />
        ) : null}
        <Field label="Recipient address" placeholder="Solana address" mono />
      </div>

      {shielded && (
        <label className="mt-3 flex items-start gap-2.5 rounded-xl border border-line px-3 py-2.5">
          <input
            type="checkbox"
            disabled
            className="mt-0.5 h-3.5 w-3.5 accent-[var(--ex-accent)]"
          />
          <span className="text-[0.75rem] leading-relaxed text-ink-dim">
            Pay the network fee through a relayer ·{" "}
            {(brand.vault.relayerFeeBps / 100).toFixed(2)}% of the withdrawal,
            so the receiving address needs no SOL of its own.
          </span>
        </label>
      )}

      <div className="mt-4">
        <ActionButton label="Withdraw" />
      </div>
    </>
  );
}

function Tickets() {
  return (
    <>
      <Heading
        title="Your tickets"
        lead="Tickets live in this browser and nowhere else. Nothing here is uploaded, and clearing site data clears them for good."
      />
      <div className="mt-4">
        <DevPanel title="No tickets yet">
          Tickets appear here after your first deposit into the{" "}
          {brand.vault.shielded}. Back each one up somewhere outside the browser
          as soon as you get it.
        </DevPanel>
      </div>
    </>
  );
}

function Transfer({ token }: { token: string }) {
  return (
    <>
      <Heading
        title="Send inside the vault"
        lead="Move a balance to another address without either side leaving the pool, so no transfer between the two is ever written down."
      />
      <div className="mt-4 space-y-3">
        <Field label="Recipient address" placeholder="Solana address" mono />
        <Field label={`Amount (${token})`} placeholder="0" mono />
      </div>
      <div className="mt-4">
        <ActionButton label="Send" />
      </div>
    </>
  );
}

function Passphrase() {
  return (
    <>
      <Heading
        title="Guardian passphrase"
        lead="A second lock over the Guarded Vault. It is stretched in your browser into a guardian key, so a leaked private key on its own cannot move anything."
      />
      <div className="mt-4">
        <DevPanel title="Not live yet">
          The guardian key is still being built. Do not put a passphrase you
          intend to keep into this screen — it would go nowhere.
        </DevPanel>
      </div>
    </>
  );
}

/* ---- potongan kecil ---- */

function Chip({
  children,
  on,
  muted = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  on: boolean;
  muted?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors ${
        on
          ? "border-accent text-accent"
          : "border-line text-ink-dim hover:border-line-strong hover:text-ink"
      } ${muted ? "font-mono text-[0.75rem]" : ""} ${disabled ? "opacity-40" : ""}`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  placeholder,
  mono = false,
}: {
  label: string;
  placeholder: string;
  mono?: boolean;
}) {
  return (
    <label className="block rounded-xl border border-line bg-raised px-3.5 py-2.5">
      <span className="label block">{label}</span>
      <input
        placeholder={placeholder}
        disabled
        autoComplete="off"
        className={`mt-1 w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-ghost ${
          mono ? "font-mono text-[0.75rem]" : ""
        }`}
      />
    </label>
  );
}

/**
 * Satu tombol yang jujur: mengajak menyambungkan wallet kalau belum, dan
 * mengakui bahwa aksinya belum ada kalau sudah.
 */
function ActionButton({ label }: { label: string }) {
  const { connected, openModal, ready } = useWallet();

  if (!connected) {
    return (
      <button
        onClick={openModal}
        disabled={!ready}
        className="w-full rounded-2xl bg-accent px-5 py-3.5 text-sm font-semibold text-void transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        Connect wallet
      </button>
    );
  }

  return (
    <button
      disabled
      title={`${label} opens when the vault programs go live`}
      className="w-full cursor-not-allowed rounded-2xl border border-dashed border-line-strong px-5 py-3.5 text-sm font-semibold text-ink-dim"
    >
      {label} · under development
    </button>
  );
}
