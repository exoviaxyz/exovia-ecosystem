interface IconProps {
  className?: string;
}

export function GithubIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.87 3.16 9 7.54 10.46.55.1.75-.24.75-.53v-2.07c-3.07.67-3.72-1.3-3.72-1.3-.5-1.27-1.23-1.61-1.23-1.61-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.58 1.2 3.21.92.1-.71.39-1.2.7-1.47-2.45-.28-5.03-1.22-5.03-5.45 0-1.2.43-2.19 1.13-2.96-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13a10.4 10.4 0 0 1 5.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.76 1.13 2.96 0 4.24-2.58 5.17-5.04 5.44.4.34.75 1.01.75 2.05v3.04c0 .29.2.64.76.53a10.53 10.53 0 0 0 7.53-10.46C23.02 5.24 18.27.5 12 .5Z" />
    </svg>
  );
}

export function XIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.96 6.82H1.67l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z" />
    </svg>
  );
}

/**
 * Mark Solana: tiga pita miring. Digambar ulang sebagai tiga jajar genjang
 * dengan kemiringan yang sama, bukan disalin dari file mana pun.
 */
export function SolanaIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M5.2 1.4h16.1a.6.6 0 0 1 .42 1.02l-2.9 2.9a1.4 1.4 0 0 1-1 .41H1.72a.6.6 0 0 1-.42-1.02l2.9-2.9a1.4 1.4 0 0 1 1-.41Z" />
      <path
        d="M5.2 8.36h16.1a.6.6 0 0 1 .42 1.02l-2.9 2.9a1.4 1.4 0 0 1-1 .42H1.72a.6.6 0 0 1-.42-1.03l2.9-2.9a1.4 1.4 0 0 1 1-.41Z"
        opacity=".78"
      />
      <path
        d="M5.2 15.32h16.1a.6.6 0 0 1 .42 1.02l-2.9 2.9a1.4 1.4 0 0 1-1 .41H1.72a.6.6 0 0 1-.42-1.02l2.9-2.9a1.4 1.4 0 0 1 1-.41Z"
        opacity=".56"
      />
    </svg>
  );
}

export function SunIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.6v2.2M12 19.2v2.2M21.4 12h-2.2M4.8 12H2.6M18.6 5.4l-1.6 1.6M7 17l-1.6 1.6M18.6 18.6 17 17M7 7 5.4 5.4" />
    </svg>
  );
}

export function MoonIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.4 14.6A8.6 8.6 0 0 1 9.4 3.6a8.6 8.6 0 1 0 11 11Z" />
    </svg>
  );
}

export function ArrowIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function CheckIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 8.6 6.4 12 13 4.8" />
    </svg>
  );
}

/*
  Mark Streamflow: tiga pita bertingkat yang menyusun huruf S, sama seperti
  yang dipakai di rentapi.org. Tiap pita 24 x 6 dengan ujung membulat; celah
  1.25 dan offset atas 1.75 mengikuti proporsi mark aslinya di dalam kotak 24.
*/
export function StreamflowIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M 6.027 0 C 2.698 0 0 2.687 0 6 L 18 6 C 21.314 6 24 3.314 24 0 Z"
        transform="translate(0 1.75)"
      />
      <path
        d="M 18.175 0 L 0 0 C 0 3.259 2.608 6 5.825 6 L 24 6 C 24 2.742 21.392 0 18.175 0 Z"
        transform="translate(0 9)"
      />
      <path
        d="M 6.027 0 C 2.698 0 0 2.687 0 6 L 6 6 C 9.314 6 12 3.314 12 0 Z"
        transform="translate(0 16.25)"
      />
    </svg>
  );
}

/*
  Glif kartu arsitektur. Semuanya digambar di kisi 24 dengan tebal garis sama
  supaya sembilan kartu terbaca sebagai satu keluarga, bukan tempelan emoji.
*/
export type GlyphName =
  | "vanish"
  | "pool"
  | "token"
  | "transfer"
  | "proof"
  | "blend"
  | "relayer"
  | "passphrase"
  | "immutable";

const GLYPHS: Record<GlyphName, React.ReactNode> = {
  vanish: (
    <>
      <circle cx="9.5" cy="12" r="5.5" />
      <path d="M16 7.2a5.5 5.5 0 0 1 0 9.6" strokeDasharray="2 2.6" />
      <path d="M20 5.6a8.6 8.6 0 0 1 0 12.8" strokeDasharray="2 2.6" />
    </>
  ),
  pool: (
    <>
      <path d="M3.4 8.2 12 4l8.6 4.2-8.6 4.2Z" />
      <path d="M3.4 12.6 12 16.8l8.6-4.2" />
      <path d="M3.4 16.6 12 20.8l8.6-4.2" />
    </>
  ),
  token: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.6v8.8M9.4 9.8h3.4a1.9 1.9 0 0 1 0 3.8H9.4h3.6a1.9 1.9 0 0 1 0 3.8H9.4" />
    </>
  ),
  transfer: (
    <>
      <path d="M4 9h13M13.6 5.6 17 9l-3.4 3.4" />
      <path d="M20 15H7M10.4 11.6 7 15l3.4 3.4" />
    </>
  ),
  proof: (
    <>
      <path d="M12 3.4 19.4 6v6.2c0 3.7-2.9 6.9-7.4 8.4-4.5-1.5-7.4-4.7-7.4-8.4V6Z" />
      <path d="M8.8 12.1 11 14.4l4.2-4.6" />
    </>
  ),
  blend: (
    <>
      <path d="M2.6 12S6 6.4 12 6.4 21.4 12 21.4 12 18 17.6 12 17.6 2.6 12 2.6 12Z" />
      <path d="M4.4 4.4 19.6 19.6" />
    </>
  ),
  relayer: (
    <>
      <path d="M13.4 3 5.6 13.4h5.2L10.6 21l7.8-10.4h-5.2Z" />
    </>
  ),
  passphrase: (
    <>
      <circle cx="8.4" cy="12" r="3.6" />
      <path d="M12 12h9.4M18.4 12v3.2M15.6 12v2.2" />
    </>
  ),
  immutable: (
    <>
      <rect x="4.6" y="10.4" width="14.8" height="9.6" rx="2.2" />
      <path d="M8.4 10.4V7.8a3.6 3.6 0 0 1 7.2 0v2.6" />
      <path d="M12 14.2v2.4" />
    </>
  ),
};

export function Glyph({
  name,
  className = "h-5 w-5",
}: {
  name: GlyphName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {GLYPHS[name]}
    </svg>
  );
}
