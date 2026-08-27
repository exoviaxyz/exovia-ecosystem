/**
 * Wallet sign-in — server side.
 *
 * Connecting a wallet proves nothing on its own: the browser can claim any
 * address it likes. So the server hands out a nonce, the wallet signs a
 * human-readable statement carrying it, and the server checks that ed25519
 * signature against the claimed Solana address. A verified address gets an
 * HMAC-signed session cookie.
 *
 * Nothing is trusted from the browser. The statement is rebuilt here from the
 * challenge this server issued, so a signature over anything else opens no
 * session. No transaction is involved and no fee is paid.
 */

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import bs58 from "bs58";
import nacl from "tweetnacl";
import { brand } from "@/config/brand";

export const NONCE_COOKIE = "exovia_nonce";
export const SESSION_COOKIE = "exovia_session";
export const NONCE_TTL_S = 5 * 60;
export const SESSION_TTL_S = 7 * 24 * 60 * 60;

export type Chain = "mainnet" | "devnet";

export function normaliseChain(value: unknown): Chain {
  return value === "devnet" ? "devnet" : "mainnet";
}

/**
 * Kunci HMAC untuk cookie sesi.
 *
 * Di produksi tidak ada nilai cadangan dengan sengaja. Nilai bawaan apa pun
 * yang tertulis di sini akan diketahui siapa pun yang membaca kodenya — dan
 * siapa pun yang mengetahuinya bisa menempa cookie sesi untuk alamat mana pun.
 * Lebih baik deploy gagal berisik daripada berjalan tanpa penjagaan.
 */
function secret(): string {
  const configured = process.env.AUTH_SECRET;
  if (configured && configured.length >= 32) return configured;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set it to at least 32 random " +
        "characters before serving traffic — sessions cannot be signed safely " +
        "without it.",
    );
  }

  // Hanya untuk pengembangan lokal; tidak pernah terpakai di produksi.
  return "exovia-development-only-not-a-secret";
}

export function newNonce(): string {
  return bs58.encode(randomBytes(16));
}

/**
 * Host yang benar-benar dibuka pengunjung.
 *
 * Dipakai apa adanya di kalimat yang ditandatangani supaya wallet menampilkan
 * alamat yang sama dengan yang ada di bilah alamat — di preview deployment
 * sekalipun. Nilainya tidak pernah dipakai untuk keputusan keamanan: yang
 * menentukan sah atau tidak adalah tanda tangan atas kalimat yang sama persis,
 * dan host-nya ikut disimpan di cookie tantangan supaya bisa disusun ulang.
 */
export function requestOrigin(req: { headers: Headers }): {
  domain: string;
  uri: string;
} {
  const host = req.headers.get("host");
  if (!host || host.length > 255 || /[^\w.:-]/.test(host)) {
    return { domain: brand.domain, uri: `https://${brand.domain}` };
  }
  const proto = host.startsWith("localhost") ? "http" : "https";
  return { domain: host, uri: `${proto}://${host}` };
}

/** The exact bytes the wallet is asked to sign. Rebuilt server-side to verify. */
export function buildMessage(input: {
  address: string;
  nonce: string;
  issuedAt: string;
  chain: Chain;
  domain: string;
  uri: string;
}): string {
  return [
    `${input.domain} wants you to sign in with your Solana account:`,
    input.address,
    "",
    `Sign in to ${brand.name}. This request does not trigger a blockchain transaction, moves no funds, and costs no fee.`,
    "",
    `URI: ${input.uri}`,
    "Version: 1",
    `Chain: solana:${input.chain}`,
    `Nonce: ${input.nonce}`,
    `Issued At: ${input.issuedAt}`,
  ].join("\n");
}

export function verifySignature(input: {
  address: string;
  nonce: string;
  issuedAt: string;
  chain: Chain;
  domain: string;
  uri: string;
  signature: string;
}): boolean {
  let publicKey: Uint8Array;
  let signature: Uint8Array;
  try {
    publicKey = bs58.decode(input.address);
    signature = bs58.decode(input.signature);
  } catch {
    return false;
  }
  if (publicKey.length !== 32 || signature.length !== 64) return false;

  const message = new TextEncoder().encode(buildMessage(input));
  try {
    return nacl.sign.detached.verify(message, signature, publicKey);
  } catch {
    return false;
  }
}

/* ---- session cookie: base64url(payload).hmac ---- */

export interface Session {
  address: string;
  chain: Chain;
  issuedAt: number;
  expiresAt: number;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function encodeSession(
  address: string,
  chain: Chain,
  now = Date.now(),
): string {
  const session: Session = {
    address,
    chain,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_S * 1000,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(
  cookie: string | undefined,
  now = Date.now(),
): Session | null {
  if (!cookie) return null;
  const [payload, mac] = cookie.split(".");
  if (!payload || !mac) return null;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given))
    return null;

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString(),
    ) as Session;
    if (!session.address || session.expiresAt < now) return null;
    return session;
  } catch {
    return null;
  }
}
