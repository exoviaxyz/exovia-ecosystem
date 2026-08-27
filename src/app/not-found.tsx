import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 py-24 text-center">
      <p className="label">404</p>
      <h1 className="display mt-3 text-4xl text-ink">
        Nothing at this address
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-dim">
        The page you were after is not here — which, in fairness, is the whole
        point of the rest of the site.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-void transition-opacity hover:opacity-90"
      >
        Back home
        <ArrowIcon />
      </Link>
    </div>
  );
}
