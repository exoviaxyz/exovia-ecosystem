"use client";

import { decimalOnly } from "@/lib/cluster";

/**
 * Kolom jumlah yang hanya menerima angka.
 *
 * Penyaringan dipasang di nilainya, bukan di ketikan, supaya teks yang
 * ditempel, autofill, dan papan ketik ponsel tersaring sama seperti karakter
 * yang diketik satu per satu.
 */
export function AmountInput({
  value,
  onChange,
  symbol,
  label = "Amount",
}: {
  value: string;
  onChange: (next: string) => void;
  symbol: string;
  label?: string;
}) {
  return (
    <label className="block rounded-2xl border border-line bg-raised px-4 py-3 focus-within:border-line-strong">
      <span className="label block">{label}</span>
      <span className="mt-1 flex items-center gap-3">
        <input
          value={value}
          onChange={(e) => onChange(decimalOnly(e.target.value))}
          inputMode="decimal"
          autoComplete="off"
          placeholder="0"
          aria-label={label}
          className="num w-full bg-transparent text-2xl text-ink outline-none placeholder:text-ink-ghost"
        />
        <span className="flex shrink-0 items-center gap-1.5 text-sm text-ink-dim">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {symbol}
        </span>
      </span>
    </label>
  );
}
