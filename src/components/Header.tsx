"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/config/brand";
import { LogoMark, Wordmark } from "./Logo";
import { SocialLinks } from "./SocialLinks";
import { ThemeToggle } from "./ThemeToggle";
import { WalletButton } from "./WalletButton";

const NAV = [
  { href: "/app", label: "App" },
  { href: "/docs", label: "Docs" },
];

export function Header() {
  const pathname = usePathname();
  const onLanding = pathname === "/";

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-void/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-5">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label={brand.name}
        >
          <LogoMark />
          <Wordmark />
        </Link>

        <nav className="ml-auto flex items-center gap-1">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "rounded-full border border-line-strong px-3 py-1.5 text-sm text-ink"
                    : "rounded-full px-3 py-1.5 text-sm text-ink-dim transition-colors hover:text-ink"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Di layar sempit ikonnya disingkirkan — footer tetap memuatnya. */}
        <SocialLinks
          className="ml-1 hidden border-l border-line pl-4 sm:flex"
          size="h-[0.9rem] w-[0.9rem]"
        />

        <ThemeToggle />

        {onLanding ? (
          <Link
            href="/app"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-void transition-opacity hover:opacity-90"
          >
            Open App
          </Link>
        ) : (
          <WalletButton />
        )}
      </div>
    </header>
  );
}
