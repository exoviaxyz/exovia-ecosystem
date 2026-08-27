"use client";

import { useEffect, useRef, useState } from "react";
import { explorerAddressUrl } from "@/lib/cluster";
import { useWallet, WalletIcon } from "@/lib/wallet";

export function WalletButton() {
  const {
    connected,
    short,
    address,
    wallet,
    cluster,
    openModal,
    disconnect,
    ready,
  } = useWallet();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!connected) {
    return (
      <button
        onClick={openModal}
        disabled={!ready}
        className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-void transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        Connect
      </button>
    );
  }

  return (
    <div className="relative" ref={box}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-sm text-ink transition-colors hover:border-accent"
        aria-expanded={open}
      >
        {wallet && <WalletIcon src={wallet.icon} size={16} />}
        <span className="num text-[0.8125rem]">{short}</span>
      </button>

      {open && (
        <div className="panel absolute right-0 z-40 mt-2 w-60 p-3">
          <p className="label mb-1">{wallet?.name ?? "Wallet"}</p>
          <p className="num mb-3 text-[0.6875rem] leading-relaxed break-all text-ink-dim">
            {address}
          </p>
          <div className="flex flex-col gap-1.5">
            <a
              href={address ? explorerAddressUrl(address, cluster) : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-line px-3 py-2 text-xs text-ink-dim transition-colors hover:border-line-strong hover:text-ink"
            >
              View on Solscan ↗
            </a>
            <button
              onClick={() => {
                setOpen(false);
                void disconnect();
              }}
              className="rounded-lg border border-line px-3 py-2 text-left text-xs text-ink-dim transition-colors hover:border-danger/50 hover:text-danger"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
