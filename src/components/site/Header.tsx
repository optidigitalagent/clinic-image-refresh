import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { withBasePath } from "@/lib/base-path";

function useNav(isPricePage: boolean) {
  if (isPricePage) {
    return [
      { href: withBasePath(), label: "Головна сторінка" },
      { href: withBasePath("#about"), label: "Про клініку" },
      { href: withBasePath("#team"), label: "Лікарі" },
      { href: withBasePath("#cases"), label: "Кейси" },
      { href: withBasePath("#certificates"), label: "Сертифікати" },
      { href: withBasePath("#contacts"), label: "Контакти" },
    ];
  }
  return [
    { href: withBasePath("#services"), label: "Послуги" },
    { href: withBasePath("#about"), label: "Про клініку" },
    { href: withBasePath("#team"), label: "Лікарі" },
    { href: withBasePath("#cases"), label: "Кейси" },
    { href: withBasePath("#certificates"), label: "Сертифікати" },
    { href: withBasePath("price"), label: "Ціни" },
    { href: withBasePath("#contacts"), label: "Контакти" },
  ];
}

export function Header({ isPricePage = false }: { isPricePage?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const NAV = useNav(isPricePage);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all ${
        scrolled || open
          ? "backdrop-blur-md bg-background/85 border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <a href={withBasePath()} className="flex items-center gap-2 sm:gap-2.5 shrink-0" aria-label="Ami Dental">
          <img
            src={withBasePath("media/brand/tooth-only.png")}
            alt=""
            aria-hidden="true"
            className="h-12 sm:h-14 lg:h-16 w-auto object-contain block shrink-0 translate-y-[2px]"
          />
          <span className="font-display text-[32px] sm:text-[40px] lg:text-[46px] leading-[0.85] tracking-tight flex items-center gap-1.5">
            <span className="text-brand-pink-strong">Ami</span>
            <span className="text-brand-green-deep">Dental</span>
          </span>
        </a>


        <nav className="hidden lg:flex items-center gap-7 text-sm text-foreground/80">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-foreground transition-colors">
              {n.label}
            </a>
          ))}
        </nav>

        <a
          href={withBasePath("#appointment")}
          className="hidden sm:inline-flex btn-accent-brand rounded-full px-5 py-2.5 text-sm font-medium"
        >
          Записатися
        </a>

        <button
          type="button"
          aria-label="Меню"
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden absolute left-0 right-0 top-full border-t border-border/60 bg-background/95 backdrop-blur shadow-lg">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-2 sm:px-6">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-foreground/80"
              >
                {n.label}
              </a>
            ))}
            <a
              href={withBasePath("#appointment")}
              onClick={() => setOpen(false)}
              className="sm:hidden mt-1 inline-flex btn-accent-brand rounded-full px-5 py-2.5 text-sm font-medium justify-center"
            >
              Записатися
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
