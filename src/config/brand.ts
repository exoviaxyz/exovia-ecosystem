/**
 * Satu tempat untuk semua yang berbau merek.
 *
 * Untuk ganti contract address, cukup ubah `token.mint` di bawah — teks CA,
 * tautan pasar, dan versi pendeknya semua diturunkan dari nilai ini.
 */

export const brand = {
  name: "Exovia",
  wordmark: "Exovia",
  domain: "exovia.xyz",

  /** Satu kalimat yang dipakai ulang di metadata dan pembuka halaman. */
  description:
    "A privacy vault on Solana. Deposits sit inside a shared pool program as internal balances, so your address reads empty while your funds stay yours.",

  /** Diambil dari sampul brand resmi. */
  strapline: "Deposit privately. Start securely.",

  // ── TOKEN ────────────────────────────────────────────────
  token: {
    name: "Exovia",
    symbol: "EXOVIA",
    decimals: 6,
    /** Ganti di sini saja — sisanya ikut sendiri. */
    mint: "XXXXXXXXXXXXXXXXXXXXXpump",
  },

  // ── VAULT ────────────────────────────────────────────────
  vault: {
    /** Nama dua mode vault, dipakai di landing, app, dan docs. */
    shielded: "Shielded Vault",
    guarded: "Guarded Vault",
    /** Bentuk tiket penarikan Shielded Vault. */
    ticketFormat: "exovia-{cluster}-{amount}-{base58}",
    /** Potongan relayer, dalam basis poin. */
    relayerFeeBps: 30,
    /** Program on-chain masih dalam pengembangan. Isi kalau sudah ada. */
    programId: null as string | null,
  },

  // ── LINKS ────────────────────────────────────────────────
  links: {
    twitter: "https://x.com/exoviaxyz",
    github: "https://github.com/exoviaxyz/exovia-ecosystem",
    /**
     * Masih URL dasar sampai kontrak vesting Exovia ada — tambahkan alamat
     * kontraknya di belakang, ikon di navbar dan footer ikut sendiri.
     * Tautan yang dikosongkan ("#") tidak dirender sama sekali.
     */
    streamflow: "https://app.streamflow.finance/contract/solana/mainnet/",
    email: "hello@exovia.xyz",
    docs: "/docs",
    app: "/app",
  },
} as const;

export const tokenTicker = `$${brand.token.symbol}`;

/** Listing pump.fun — diturunkan dari mint supaya tidak pernah lepas sinkron. */
export const tokenMarketUrl = `https://pump.fun/coin/${brand.token.mint}`;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://${brand.domain}`;

/** CA dipendekkan untuk footer: 6 karakter depan + 4 belakang. */
export const shortMint = `${brand.token.mint.slice(0, 6)}…${brand.token.mint.slice(-4)}`;

/** Mint masih placeholder selama belum diisi CA sungguhan. */
export const mintPending = brand.token.mint.startsWith("XXXX");
