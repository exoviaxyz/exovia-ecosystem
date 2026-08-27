export type ClusterId = "mainnet" | "devnet";

export const CLUSTERS: { id: ClusterId; label: string }[] = [
  { id: "mainnet", label: "Mainnet" },
  { id: "devnet", label: "Devnet" },
];

export function clusterLabel(id: ClusterId): string {
  return CLUSTERS.find((c) => c.id === id)?.label ?? id;
}

export function explorerAddressUrl(
  address: string,
  cluster: ClusterId,
): string {
  const suffix = cluster === "devnet" ? "?cluster=devnet" : "";
  return `https://solscan.io/account/${address}${suffix}`;
}

export function shortAddress(address: string, head = 4, tail = 4): string {
  if (address.length <= head + tail + 1) return address;
  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}

/**
 * Keep only what belongs in a decimal amount: digits and a single separator.
 *
 * Wired to the value rather than to keystrokes, so pasted text, autofill and
 * mobile keyboards are filtered the same way a typed character is.
 */
export function decimalOnly(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  return rest.length > 0 ? `${whole}.${rest.join("")}` : whole;
}
