import type { Metadata } from "next";
import { VaultApp, type VaultId } from "./VaultApp";

export const metadata: Metadata = {
  title: "App",
  description:
    "Deposit, withdraw and transfer inside the Exovia vaults on Solana.",
};

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<{ vault?: string }>;
}) {
  const { vault } = await searchParams;
  const initial: VaultId = vault === "shielded" ? "shielded" : "guarded";
  return <VaultApp initialVault={initial} />;
}
