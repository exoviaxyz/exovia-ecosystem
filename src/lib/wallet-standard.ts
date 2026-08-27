/**
 * Wallet Standard discovery.
 *
 * Rather than hard-coding one `window.*` key per wallet, this speaks the
 * Wallet Standard handshake that every current Solana wallet implements: the
 * app announces itself, installed wallets register themselves back, and each
 * one arrives carrying its own name, icon and feature set.
 *
 * The upshot is that any Solana wallet the visitor has installed shows up in
 * the picker — including ones not on our curated list — with no adapter per
 * wallet and no bundle of wallet SDKs.
 *
 * Spec: https://github.com/wallet-standard/wallet-standard
 */

export interface StandardAccount {
  address: string;
  publicKey: Uint8Array;
}

interface ConnectFeature {
  connect: (input?: { silent?: boolean }) => Promise<{
    accounts: readonly StandardAccount[];
  }>;
}

interface DisconnectFeature {
  disconnect: () => Promise<void>;
}

interface SignMessageFeature {
  signMessage: (input: {
    account: StandardAccount;
    message: Uint8Array;
  }) => Promise<readonly { signature: Uint8Array }[]>;
}

interface EventsFeature {
  on: (event: "change", listener: (props: unknown) => void) => () => void;
}

export interface StandardWallet {
  name: string;
  icon: string;
  chains: readonly string[];
  accounts: readonly StandardAccount[];
  features: Record<string, unknown>;
}

const CONNECT = "standard:connect";
const DISCONNECT = "standard:disconnect";
const SIGN_MESSAGE = "solana:signMessage";
const EVENTS = "standard:events";

/** Only wallets that can sign a Solana message are of any use to us. */
function usable(wallet: StandardWallet): boolean {
  return (
    Array.isArray(wallet.chains) &&
    wallet.chains.some((c) => c.startsWith("solana:")) &&
    typeof wallet.features?.[CONNECT] === "object" &&
    typeof wallet.features?.[SIGN_MESSAGE] === "object"
  );
}

const registry = new Map<string, StandardWallet>();

type RegisterApi = { register: (...wallets: StandardWallet[]) => () => void };
type RegisterCallback = (api: RegisterApi) => void;

function api(onChange: () => void): RegisterApi {
  return {
    register: (...wallets) => {
      let added = false;
      for (const w of wallets) {
        if (usable(w) && !registry.has(w.name)) {
          registry.set(w.name, w);
          added = true;
        }
      }
      if (added) onChange();
      return () => {};
    },
  };
}

/**
 * Start listening for wallets and ask any already-loaded ones to announce
 * themselves. Returns a teardown function.
 */
export function discoverWallets(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (event: Event) => {
    const detail = (event as CustomEvent<RegisterCallback>).detail;
    if (typeof detail === "function") detail(api(onChange));
  };

  window.addEventListener("wallet-standard:register-wallet", handler);
  window.dispatchEvent(
    new CustomEvent("wallet-standard:app-ready", { detail: api(onChange) }),
  );

  return () =>
    window.removeEventListener("wallet-standard:register-wallet", handler);
}

export function knownWallets(): StandardWallet[] {
  return [...registry.values()];
}

export function findWallet(name: string): StandardWallet | undefined {
  const wanted = name.toLowerCase();
  for (const w of registry.values()) {
    const found = w.name.toLowerCase();
    if (
      found === wanted ||
      found.startsWith(wanted) ||
      wanted.startsWith(found)
    )
      return w;
  }
  return undefined;
}

/**
 * Ask the wallet for an account.
 *
 * `silent` is how a wallet is re-attached on a later visit without throwing a
 * popup at someone who only came to read: wallets that already hold an
 * approval for this site answer straight away, the rest answer with nothing.
 */
export async function connectWallet(
  wallet: StandardWallet,
  options: { silent?: boolean } = {},
): Promise<string | null> {
  const connect = wallet.features[CONNECT] as ConnectFeature;
  const { accounts } = await connect.connect(
    options.silent ? { silent: true } : undefined,
  );
  const account = accounts[0] ?? wallet.accounts[0];
  return account?.address ?? null;
}

/**
 * Connect, then sign `message` with the wallet's first account.
 *
 * The message is built from the address rather than passed in ready-made: the
 * server issues the nonce only once the wallet has said which account it is
 * offering, so the statement shown in the wallet is the one the server will
 * check against.
 */
export async function connectAndSign(
  wallet: StandardWallet,
  message: (address: string) => Promise<Uint8Array>,
): Promise<{ address: string; signature: Uint8Array }> {
  const connect = wallet.features[CONNECT] as ConnectFeature;
  const { accounts } = await connect.connect();
  const account = accounts[0] ?? wallet.accounts[0];
  if (!account) throw new Error("The wallet returned no account.");

  const sign = wallet.features[SIGN_MESSAGE] as SignMessageFeature;
  const [result] = await sign.signMessage({
    account,
    message: await message(account.address),
  });
  if (!result?.signature) throw new Error("The wallet returned no signature.");

  return { address: account.address, signature: result.signature };
}

/** Tell the wallet we are done, if it offers a way to be told. */
export async function releaseWallet(name: string): Promise<void> {
  const wallet = findWallet(name);
  const feature = wallet?.features[DISCONNECT] as DisconnectFeature | undefined;
  if (feature?.disconnect) {
    await feature.disconnect().catch(() => {
      // Wallet declined to let go — the app forgets it either way.
    });
  }
}

/**
 * Follow the wallet's own account switch, so swapping accounts in the
 * extension is reflected in the header rather than leaving a stale address.
 */
export function watchAccounts(
  wallet: StandardWallet,
  onAccounts: (address: string | null) => void,
): () => void {
  const events = wallet.features[EVENTS] as EventsFeature | undefined;
  if (!events?.on) return () => {};
  try {
    return events.on("change", () => {
      onAccounts(wallet.accounts[0]?.address ?? null);
    });
  } catch {
    return () => {};
  }
}
