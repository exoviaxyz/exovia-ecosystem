import { brand } from "@/config/brand";
import { GithubIcon, StreamflowIcon, XIcon } from "./icons";

/*
  Tiga tautan luar yang sama, dipakai di navbar dan footer.

  Tautan yang di `brand.links` masih "#" tidak dirender sama sekali — ikon yang
  ada tapi tidak menuju ke mana-mana lebih buruk daripada ikon yang belum ada.
  Begitu nilainya diisi di satu tempat itu, ikonnya muncul di kedua tempat.
*/

/**
 * `href` diberi tipe `string` supaya perbandingan dengan "#" tetap sah walau
 * `brand` memakai `as const` dan nilainya sedang bukan "#".
 */
const LINKS: {
  href: string;
  label: string;
  Icon: (props: { className?: string }) => React.ReactElement;
}[] = [
  {
    href: brand.links.github,
    label: `${brand.name} on GitHub`,
    Icon: GithubIcon,
  },
  {
    href: brand.links.twitter,
    label: `${brand.name} on X`,
    Icon: XIcon,
  },
  {
    href: brand.links.streamflow,
    label: `${brand.name} vesting on Streamflow`,
    Icon: StreamflowIcon,
  },
];

export function SocialLinks({
  className = "",
  size = "h-4 w-4",
}: {
  className?: string;
  size?: string;
}) {
  const shown = LINKS.filter((l) => l.href && l.href !== "#");
  if (shown.length === 0) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {shown.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="text-ink-faint transition-colors hover:text-ink"
        >
          <Icon className={size} />
        </a>
      ))}
    </div>
  );
}
