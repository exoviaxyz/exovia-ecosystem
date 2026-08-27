"use client";

import { useCallback, useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./icons";

const KEY = "exovia.theme";
type Theme = "dark" | "light";

/**
 * Skrip yang harus jalan sebelum halaman dilukis, kalau tidak temanya
 * berkedip dari gelap ke terang. Ditanam apa adanya di <head>.
 */
export const themeBootScript = `(function(){try{var t=localStorage.getItem("${KEY}");if(!t){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})()`;

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  // Baca apa yang sudah dipasang skrip di atas, bukan menebak ulang.
  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(KEY, next);
      } catch {
        // Mode privat — pilihannya berlaku sampai tab ditutup.
      }
      return next;
    });
  }, []);

  return (
    <button
      onClick={toggle}
      className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-dim transition-colors hover:border-line-strong hover:text-ink"
      aria-label={theme === "dark" ? "Switch to light" : "Switch to dark"}
      title={theme === "dark" ? "Switch to light" : "Switch to dark"}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
