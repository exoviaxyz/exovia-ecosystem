export function SectionHeading({
  eyebrow,
  title,
  lead,
  className = "",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="label mb-3">{eyebrow}</p>
      <h2 className="display text-3xl text-ink sm:text-[2.6rem]">{title}</h2>
      {lead && (
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-dim">
          {lead}
        </p>
      )}
    </div>
  );
}
