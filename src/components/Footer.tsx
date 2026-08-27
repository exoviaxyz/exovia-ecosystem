import Link from "next/link";
import {
  brand,
  mintPending,
  shortMint,
  tokenMarketUrl,
  tokenTicker,
} from "@/config/brand";
import { SolanaIcon } from "./icons";
import { LogoMark } from "./Logo";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-6 w-6" />
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} {brand.name} · {brand.strapline}
          </p>
        </div>

        <div className="flex items-center gap-4 sm:ml-auto">
          <Link
            href="/docs"
            className="text-xs text-ink-faint transition-colors hover:text-ink"
          >
            Docs
          </Link>
          <Link
            href="/app"
            className="text-xs text-ink-faint transition-colors hover:text-ink"
          >
            App
          </Link>

          {mintPending ? (
            <span
              className="num text-[0.6875rem] text-ink-ghost"
              title="Contract address is published at launch"
            >
              {tokenTicker} · CA soon
            </span>
          ) : (
            <a
              href={tokenMarketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="num text-[0.6875rem] text-ink-faint transition-colors hover:text-ink"
              title={brand.token.mint}
            >
              {tokenTicker} · {shortMint}
            </a>
          )}

          <SocialLinks />

          <span className="flex items-center gap-1.5 text-[0.6875rem] text-ink-ghost">
            <SolanaIcon />
            Solana
          </span>
        </div>
      </div>
    </footer>
  );
}
