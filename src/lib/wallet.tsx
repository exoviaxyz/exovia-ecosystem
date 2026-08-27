"use client";

/*
  Wallet sign-in — client side.

  Connecting a wallet is how you sign in, and it is a real handshake:

    1. ask the wallet for its public key
    2. POST /api/auth/nonce  -> server returns a nonce and the statement to sign
    3. wallet signs that statement (ed25519, no transaction, no fee)
    4. POST /api/auth/verify -> server checks the signature and sets an
       httpOnly session cookie

  Nothing is trusted from the browser: the server rebuilds the message from the
  challenge it issued and checks the signature against the claimed address.

  Wallets are found through Wallet Standard (see ./wallet-standard), so every
  Solana wallet the visitor has installed is offered — the curated list below
  only decides what the picker shows when nothing is installed yet, and where
  to send someone who wants to install one.
*/

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import bs58 from "bs58";
import { CLUSTERS, shortAddress, type ClusterId } from "@/lib/cluster";
import {
  connectAndSign,
  discoverWallets,
  findWallet,
  knownWallets,
  releaseWallet,
  watchAccounts,
  type StandardWallet,
} from "@/lib/wallet-standard";

const WALLET_HINT_KEY = "exovia.wallet";
const CLUSTER_KEY = "exovia.cluster";

/**
 * Solana wallets from https://solana.com/wallets, each with its own icon.
 * Installed ones are detected and signed with; the rest link out to install.
 */
export interface CuratedWallet {
  id: string;
  name: string;
  icon: string;
  site: string;
}

export const CURATED_WALLETS: CuratedWallet[] = [
  {
    id: "phantom",
    name: "Phantom",
    icon: "/images/wallets/phantom.webp",
    site: "https://phantom.com/",
  },
  {
    id: "solflare",
    name: "Solflare",
    icon: "/images/wallets/solflare.webp",
    site: "https://www.solflare.com/",
  },
  {
    id: "backpack",
    name: "Backpack",
    icon: "/images/wallets/backpack.webp",
    site: "https://backpack.app/",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "/images/wallets/coinbase.webp",
    site: "https://www.coinbase.com/wallet",
  },
  {
    id: "trust",
    name: "Trust",
    icon: "/images/wallets/trust.webp",
    site: "https://trustwallet.com/download",
  },
  {
    id: "exodus",
    name: "Exodus",
    icon: "/images/wallets/exodus.webp",
    site: "https://www.exodus.com/",
  },
  {
    id: "nightly",
    name: "Nightly",
    icon: "/images/wallets/nightly.webp",
    site: "https://nightly.app/",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    icon: "/images/wallets/jupiter.webp",
    site: "https://jup.ag/wallet",
  },
];

/** One row in the picker. */
export interface WalletOption {
  id: string;
  name: string;
  icon: string;
  site: string;
  /** Present when the wallet is installed and ready to sign. */
  standard?: StandardWallet;
}

interface ConnectedWallet {
  id: string;
  name: string;
  icon: string;
}

interface WalletState {
  connected: boolean;
  address: string | null;
  wallet: ConnectedWallet | null;
  signedInAt: number | null;
  cluster: ClusterId;
  setCluster: (next: ClusterId) => void;
  modalOpen: boolean;
  signing: boolean;
  notice: string | null;
  ready: boolean;
  options: WalletOption[];
  openModal: () => void;
  closeModal: () => void;
  connect: (option: WalletOption) => Promise<void>;
  disconnect: () => Promise<void>;
  short: string;
}

const Ctx = createContext<WalletState | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [signedInAt, setSignedInAt] = useState<number | null>(null);
  const [cluster, setClusterState] = useState<ClusterId>("mainnet");
  const [modalOpen, setModalOpen] = useState(false);
  const [signing, setSigning] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [detected, setDetected] = useState(0); // bumped as wallets announce
  const unwatch = useRef<() => void>(() => {});
  // Lets the account watcher reach the current sign-out without depending on
  // it, which would rebuild the watcher on every address change.
  const disconnectRef = useRef<() => Promise<void>>(async () => {});

  // Listen for installed wallets announcing themselves.
  useEffect(() => discoverWallets(() => setDetected((n) => n + 1)), []);

  // Which network the visitor last chose.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CLUSTER_KEY);
      if (stored && CLUSTERS.some((c) => c.id === stored)) {
        setClusterState(stored as ClusterId);
      }
    } catch {
      // Private mode — the default stands.
    }
  }, []);

  // Restore an existing session from the httpOnly cookie.
  useEffect(() => {
    let alive = true;
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((s: { address: string | null; issuedAt?: number }) => {
        if (!alive) return;
        if (s.address) {
          setAddress(s.address);
          setSignedInAt(s.issuedAt ?? null);
          setWallet(readHint());
        }
      })
      .catch(() => {})
      .finally(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  const setCluster = useCallback((next: ClusterId) => {
    setClusterState(next);
    try {
      window.localStorage.setItem(CLUSTER_KEY, next);
    } catch {
      // The choice still holds for this session.
    }
  }, []);

  /** Installed wallets first, then the rest of the curated list. */
  const options = useMemo<WalletOption[]>(() => {
    void detected;
    const installed = knownWallets();
    const used = new Set<string>();

    const curated = CURATED_WALLETS.map((w) => {
      const match = findWallet(w.name);
      if (match) used.add(match.name);
      return { ...w, standard: match };
    });

    // Anything installed that we do not list — it still gets a row, with the
    // icon the wallet supplied.
    const extra: WalletOption[] = installed
      .filter((w) => !used.has(w.name))
      .map((w) => ({
        id: "standard:" + w.name,
        name: w.name,
        icon: w.icon,
        site: "",
        standard: w,
      }));

    return [...curated, ...extra].sort(
      (a, b) => Number(Boolean(b.standard)) - Number(Boolean(a.standard)),
    );
  }, [detected]);

  const connect = useCallback(
    async (option: WalletOption) => {
      if (!option.standard) {
        setNotice(`${option.name} is not installed in this browser.`);
        return;
      }
      setNotice(null);
      setSigning(true);
      try {
        // The nonce is requested only once the wallet has given us an address,
        // so the statement the wallet shows is the one the server issued.
        let signedAddress = "";
        const { address: addr, signature } = await connectAndSign(
          option.standard,
          async (a) => {
            signedAddress = a;
            const res = await fetch("/api/auth/nonce", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ address: a, chain: cluster }),
            });
            if (!res.ok) throw new Error("Could not start the sign-in.");
            const { message } = (await res.json()) as { message: string };
            return new TextEncoder().encode(message);
          },
        );

        const verifyRes = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            address: addr || signedAddress,
            signature: bs58.encode(signature),
            walletId: option.id,
          }),
        });
        const verified = (await verifyRes.json()) as {
          address?: string;
          error?: string;
        };
        if (!verifyRes.ok || !verified.address) {
          throw new Error(verified.error ?? "The signature was not accepted.");
        }

        const connected = {
          id: option.id,
          name: option.name,
          icon: option.icon,
        };
        setAddress(verified.address);
        setSignedInAt(Date.now());
        setWallet(connected);
        writeHint(connected);
        setModalOpen(false);

        // Swapping accounts in the extension invalidates the session, which
        // was opened for one address only.
        if (option.standard) {
          unwatch.current();
          unwatch.current = watchAccounts(option.standard, (next) => {
            if (next !== verified.address) void disconnectRef.current();
          });
        }
      } catch (e) {
        setNotice(
          e instanceof Error && e.message
            ? e.message
            : "Sign-in was cancelled.",
        );
      } finally {
        setSigning(false);
      }
    },
    [cluster],
  );

  const disconnect = useCallback(async () => {
    const name = wallet?.name;
    unwatch.current();
    unwatch.current = () => {};
    setAddress(null);
    setWallet(null);
    setSignedInAt(null);
    setNotice(null);
    clearHint();
    await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
    if (name) await releaseWallet(name);
  }, [wallet]);

  useEffect(() => {
    disconnectRef.current = disconnect;
  }, [disconnect]);

  useEffect(() => () => unwatch.current(), []);

  const value = useMemo<WalletState>(
    () => ({
      connected: address !== null,
      address,
      wallet,
      signedInAt,
      cluster,
      setCluster,
      modalOpen,
      signing,
      notice,
      ready,
      options,
      openModal: () => {
        setNotice(null);
        setModalOpen(true);
      },
      closeModal: () => setModalOpen(false),
      connect,
      disconnect,
      short: address ? shortAddress(address) : "",
    }),
    [
      address,
      wallet,
      signedInAt,
      cluster,
      setCluster,
      modalOpen,
      signing,
      notice,
      ready,
      options,
      connect,
      disconnect,
    ],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <WalletModal />
    </Ctx.Provider>
  );
}

export function useWallet(): WalletState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}

/* ---- which wallet signed in, for the header label only ---- */

function readHint(): ConnectedWallet | null {
  try {
    const raw = localStorage.getItem(WALLET_HINT_KEY);
    return raw ? (JSON.parse(raw) as ConnectedWallet) : null;
  } catch {
    return null;
  }
}

function writeHint(w: ConnectedWallet) {
  try {
    localStorage.setItem(WALLET_HINT_KEY, JSON.stringify(w));
  } catch {
    // Private mode — the label just falls back to a generic one.
  }
}

function clearHint() {
  try {
    localStorage.removeItem(WALLET_HINT_KEY);
  } catch {
    // Nothing stored to clear.
  }
}

/* ---- picker ---- */

/**
 * Wallet icons are 24px and come from mixed sources — files in /public and
 * data URIs supplied by the wallet itself. A plain <img> handles both; there
 * is nothing for the image optimizer to do at this size.
 */
export function WalletIcon({
  src,
  size = 24,
  alt = "",
}: {
  src: string;
  size?: number;
  alt?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-md"
    />
  );
}

function WalletModal() {
  const { modalOpen, closeModal, connect, signing, notice, options } =
    useWallet();

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !signing) closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, closeModal, signing]);

  if (!modalOpen) return null;

  const installed = options.filter((o) => o.standard);
  const rest = options.filter((o) => !o.standard);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in with a wallet"
      onClick={signing ? undefined : closeModal}
    >
      <div className="absolute inset-0 bg-sunk/80 backdrop-blur-sm" />
      <div
        className="panel relative flex max-h-[80vh] w-full max-w-[400px] flex-col p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1.5 flex items-start justify-between gap-4">
          <h2 className="display text-lg text-ink">Sign in with a wallet</h2>
          <button
            onClick={closeModal}
            disabled={signing}
            className="shrink-0 rounded-full border border-line px-2 py-1 font-mono text-xs text-ink-faint transition-colors hover:border-line-strong hover:text-ink disabled:opacity-40"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-ink-dim">
          Your wallet will ask you to sign a short message. It proves the
          address is yours — no transaction, no fee, nothing moves.
        </p>

        <div className="-mr-1 flex flex-col gap-1.5 overflow-y-auto pr-1">
          {installed.map((o) => (
            <button
              key={o.id}
              onClick={() => connect(o)}
              disabled={signing}
              className="flex items-center gap-3 rounded-xl border border-line bg-raised px-3 py-2.5 text-left transition-colors hover:border-accent disabled:opacity-45"
            >
              <WalletIcon src={o.icon} />
              <span className="text-sm font-medium text-ink">{o.name}</span>
              <span className="label ml-auto">Detected</span>
            </button>
          ))}

          {installed.length === 0 && (
            <p className="mb-1 rounded-xl border border-line px-3 py-2.5 font-mono text-[0.6875rem] leading-relaxed text-ink-dim">
              No Solana wallet found in this browser. Install one below, then
              reload the page.
            </p>
          )}

          {rest.length > 0 && (
            <>
              {installed.length > 0 && (
                <p className="label mt-3 mb-0.5">More Solana wallets</p>
              )}
              {rest.map((o) => (
                <a
                  key={o.id}
                  href={o.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5 text-left opacity-55 transition-opacity hover:opacity-100"
                >
                  <WalletIcon src={o.icon} />
                  <span className="text-sm font-medium text-ink">{o.name}</span>
                  <span className="label ml-auto">Install ↗</span>
                </a>
              ))}
            </>
          )}
        </div>

        {notice && (
          <p className="mt-4 rounded-xl border border-warn/35 px-3 py-2 font-mono text-[0.6875rem] leading-relaxed text-warn">
            {notice}
          </p>
        )}

        {signing && (
          <p className="mt-4 font-mono text-[0.6875rem] text-ink-faint">
            Waiting for the signature…
          </p>
        )}
      </div>
    </div>
  );
}
