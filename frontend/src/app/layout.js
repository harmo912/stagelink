"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const TOTAL_IMAGES = 10;

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isCpanel = pathname.startsWith("/cpanel");

  const [slideIndex, setSlideIndex] = useState(0);
  const [noTransition, setNoTransition] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setSlideIndex((prev) => prev + 1), 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (slideIndex === TOTAL_IMAGES) {
      const timeout = setTimeout(() => {
        setNoTransition(true);
        setSlideIndex(0);
      }, 900);
      return () => clearTimeout(timeout);
    }
  }, [slideIndex]);

  useEffect(() => {
    if (noTransition) {
      const raf = requestAnimationFrame(() => setNoTransition(false));
      return () => cancelAnimationFrame(raf);
    }
  }, [noTransition]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/annuaire", label: "Annuaire des entreprises" },
    { href: "/aide", label: "Aide" },
  ];

  const slideCount = TOTAL_IMAGES + 1;

  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body
        className="bg-white text-zinc-900 antialiased min-h-screen flex flex-col m-0 p-0"
        style={{ fontFamily: "var(--font-body)" }}
        suppressHydrationWarning
      >
        {!isCpanel && (
          <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
              scrolled
                ? "bg-white/80 backdrop-blur-xl border-b border-zinc-200 shadow-sm"
                : "bg-transparent border-b border-transparent"
            }`}
          >
            <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 sm:h-24 flex items-center justify-between">
              <Link href="/" className="flex items-center shrink-0 transition-opacity hover:opacity-80">
                <img
                  src="/logo.png"
                  alt="StageLink"
                  className={`h-11 sm:h-14 w-auto object-contain ${!scrolled ? "drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]" : ""}`}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <span
                  style={{ fontFamily: "var(--font-display)" }}
                  className={`hidden text-xl font-bold tracking-tight ${scrolled ? "text-zinc-900" : "text-white"}`}
                >
                  StageLink
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      scrolled ? "text-zinc-600 hover:text-zinc-900" : "text-white/90 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <Link
                href="/annuaire"
                className="hidden md:inline-flex text-sm font-semibold px-5 py-2.5 rounded-full bg-[#4F46E5] text-white hover:bg-[#4338CA] transition-colors shadow-sm"
              >
                Voir les entreprises
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden w-11 h-11 rounded-xl transition-colors border flex items-center justify-center ${
                  scrolled ? "bg-zinc-100 border-zinc-200 text-zinc-900" : "bg-white/10 backdrop-blur-md border-white/20 text-white"
                }`}
                aria-label="Ouvrir le menu"
              >
                <i className={`bi ${isMenuOpen ? "bi-x-lg" : "bi-list"} text-xl`}></i>
              </button>
            </div>

            <div
              className={`md:hidden bg-white border-t border-zinc-100 shadow-xl overflow-hidden transition-all duration-300 ease-out ${
                isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-5 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-2.5 text-sm font-semibold text-zinc-700 rounded-lg hover:bg-zinc-50"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/annuaire"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-1 px-3 py-2.5 text-sm font-semibold text-white text-center bg-[#4F46E5] rounded-lg"
                >
                  Voir les entreprises
                </Link>
              </div>
            </div>
          </header>
        )}

        {!isCpanel && (
          <div className="relative w-full h-[420px] sm:h-[540px] md:h-[620px] bg-zinc-900 overflow-hidden">
            <div
              className="absolute inset-0 flex h-full"
              style={{
                width: `${slideCount * 100}%`,
                transform: `translateX(-${(100 / slideCount) * slideIndex}%)`,
                transition: noTransition ? "none" : "transform 0.9s ease-in-out",
              }}
            >
              {Array.from({ length: slideCount }).map((_, i) => {
                const imgNumber = i === TOTAL_IMAGES ? 1 : i + 1;
                return (
                  <div
                    key={i}
                    className="h-full bg-cover bg-center shrink-0"
                    style={{ width: `${100 / slideCount}%`, backgroundImage: `url('/images/img${imgNumber}.jpg')` }}
                  />
                );
              })}
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 pointer-events-none" />

            <div className="relative z-10 h-full flex items-center justify-center text-center px-5">
              <div className="max-w-4xl mx-auto">
                <h1
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.02] drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                >
                  Trouvez l'entreprise
                  <br className="hidden sm:block" /> qu'il vous faut.
                </h1>
                <p className="text-zinc-100/90 text-base sm:text-lg mt-6 font-medium max-w-xl mx-auto">
                  L'annuaire des entreprises béninoises, par domaine et par ville.
                </p>
              </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce motion-reduce:animate-none">
              <i className="bi bi-chevron-down text-white/70 text-xl"></i>
            </div>
          </div>
        )}

        <main className="w-full flex-grow bg-white">{children}</main>

        {!isCpanel && (
          <footer className="w-full bg-zinc-200 text-xs pt-16 pb-8 border-t border-zinc-00">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 border-b border-zinc-200 pb-12">
              <div className="col-span-2 space-y-4">
                <div className="flex items-center">
                  <img src="/logo.png" alt="StageLink" className="h-9 w-auto object-contain" onError={(e) => (e.target.style.display = "none")} />
                </div>
                <p className="max-w-xs text-zinc-500 font-medium leading-relaxed">
                  Annuaire des entreprises béninoises, classées par domaine d'activité.
                </p>
              </div>
              <div className="flex flex-col space-y-3">
                <span className="text-zinc-900 font-bold tracking-wide uppercase text-[10px]">Navigation</span>
                <Link href="/annuaire" className="text-zinc-500 font-medium hover:text-zinc-900 transition">Annuaire</Link>
                <Link href="/aide" className="text-zinc-500 font-medium hover:text-zinc-900 transition">Aide</Link>
              </div>
              <div className="flex flex-col space-y-3">
                <span className="text-zinc-900 font-bold tracking-wide uppercase text-[10px]">À propos</span>
                <span className="text-zinc-400 font-medium">ENEAM — 2026</span>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 font-medium">
              <p>&copy; {new Date().getFullYear()} StageLink — ENEAM.</p>
            </div>
          </footer>
        )}
      </body>
    </html>
  );
}