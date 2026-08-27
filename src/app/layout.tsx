import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { brand, siteUrl } from "@/config/brand";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { themeBootScript } from "@/components/ThemeToggle";
import { WalletProvider } from "@/lib/wallet";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const TITLE = `${brand.wordmark} — Private Vaults on Solana`;
const OG_IMAGE = "/images/cover-banner.webp";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: TITLE,
    template: `%s — ${brand.wordmark}`,
  },
  description: brand.description,
  applicationName: brand.name,
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: brand.name,
    title: TITLE,
    description: brand.description,
    images: [{ url: OG_IMAGE, width: 1500, height: 500, alt: brand.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: brand.description,
    images: [OG_IMAGE],
  },
  icons: {
    icon: [{ url: "/favicon.webp", type: "image/webp" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Tema dipasang sebelum lukisan pertama, supaya tidak berkedip. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="scanlines flex min-h-screen flex-col">
        <WalletProvider>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
