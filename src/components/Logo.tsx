import Image from "next/image";
import { brand } from "@/config/brand";

/*
  Mark resmi, bukan lagi gambar sementara.

  Aslinya bermargin lebar — glifnya cuma sekitar 60% kanvas — jadi yang dipakai
  di sini `logo-mark-tight.webp`, hasil pangkas ke kotak pembatas glifnya.
  Versi utuh `logo-mark.webp` dan versi di atas kotak hitam `logo-mark-solid.webp`
  tetap ada di /public/images untuk keperluan lain.
*/
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <Image
      src="/images/logo-mark-tight.webp"
      alt=""
      width={64}
      height={64}
      priority
      className={className}
    />
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`display text-[1.05rem] tracking-[-0.02em] text-ink ${className}`}
    >
      {brand.wordmark}
    </span>
  );
}
