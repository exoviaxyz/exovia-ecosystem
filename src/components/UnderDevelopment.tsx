/*
  Yang belum jalan mengatakan begitu apa adanya — tidak ada layar error, tidak
  ada tombol yang pura-pura bekerja lalu gagal diam-diam.
*/

export function DevBadge({ label = "Under development" }: { label?: string }) {
  return (
    <span className="chip inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.14em] text-accent uppercase">
      <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
      {label}
    </span>
  );
}

export function DevPanel({
  title = "Under development",
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong bg-raised p-5 text-center">
      <DevBadge label={title} />
      {children && (
        <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-ink-dim">
          {children}
        </p>
      )}
    </div>
  );
}
