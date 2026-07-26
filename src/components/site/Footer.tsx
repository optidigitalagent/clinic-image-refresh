import { Instagram, MapPin, Phone } from "lucide-react";
import { withBasePath } from "@/lib/base-path";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <a href={withBasePath()} className="flex items-center gap-2.5 shrink-0" aria-label="Ami Dental">
            <img
              src={withBasePath("media/brand/tooth-only.png")}
              alt=""
              aria-hidden="true"
              className="h-10 w-auto object-contain"
            />
            <span className="font-display text-2xl leading-none tracking-tight">
              <span style={{ color: "var(--brand-pink-strong)" }}>Ami</span>
              <span> </span>
              <span style={{ color: "var(--brand-green-deep)" }}>Dental</span>
            </span>
          </a>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <a href="tel:+380686707519" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <Phone className="h-3.5 w-3.5" /> +38 (068) 670 75 19
            </a>
            <a
              href="https://www.google.com/maps?cid=14683152177039593001"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <MapPin className="h-3.5 w-3.5" /> вул. Зоологічна, 3-Я
            </a>
            <a
              href="https://www.instagram.com/ami_dental_/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <Instagram className="h-3.5 w-3.5" /> @ami_dental_
            </a>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground/80">
          © {new Date().getFullYear()} Ami Dental. Всі права захищені.
        </p>
      </div>
    </footer>
  );
}
