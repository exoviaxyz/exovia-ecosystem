"use client";

import { useEffect, useState } from "react";
import { brand } from "@/config/brand";

/*
  Panel kaca di sebelah headline.

  Barisnya digit heksadesimal yang ditarik dari satu PRNG berbiji tetap, jadi
  server dan browser menghasilkan teks yang sama persis — tidak ada hydration
  mismatch — sementara baris yang disorot bergilir di klien saja.
*/

/** xorshift32 — cukup untuk membuat baris yang terlihat acak dan tetap sama. */
function hexLines(seed: number, count: number, width: number): string[] {
  let state = seed;
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
  const digits = "0123456789abcdef";
  return Array.from({ length: count }, () =>
    Array.from({ length: width }, () => digits[Math.floor(next() * 16)]).join(
      "",
    ),
  );
}

const NOISE = hexLines(0x5eed_1a2b, 13, 64);

const MARKS = [
  { at: 2, key: "commitment", value: "0x9f4c…a71d", tone: "accent" },
  { at: 5, key: "recipient", value: "unlinked", tone: "ink" },
  { at: 8, key: "proof", value: "VERIFIED", tone: "accent" },
  { at: 11, key: "withdrawal", value: "SETTLED", tone: "accent" },
] as const;

export function ProofStream() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setStep((n) => (n + 1) % MARKS.length),
      2200,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
        <span className="num ml-2 text-[0.6875rem] text-ink-faint">
          {brand.domain}://proof/stream
        </span>
      </div>

      <div className="px-4 py-4">
        {NOISE.map((line, i) => {
          const mark = MARKS.find((m) => m.at === i);
          const live = mark && MARKS[step]?.at === i;

          if (!mark) {
            return (
              <p
                key={i}
                className="num truncate text-[0.6875rem] leading-[1.55] text-ink-ghost/45 select-none"
              >
                {line}
              </p>
            );
          }

          return (
            <p
              key={i}
              className={`num truncate text-[0.6875rem] leading-[1.55] transition-opacity duration-500 ${
                live ? "opacity-100" : "opacity-40"
              }`}
            >
              <span className="text-ink-dim">{mark.key}: </span>
              <span
                className={mark.tone === "accent" ? "text-accent" : "text-ink"}
              >
                {mark.value}
              </span>
              {live && <span className="text-accent"> ✓</span>}
            </p>
          );
        })}
      </div>
    </div>
  );
}
