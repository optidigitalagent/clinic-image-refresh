import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { withBasePath } from "@/lib/base-path";
import { SectionHeading } from "./SectionLabel";

const SLIDES = [
  withBasePath("media/clinic/team-photo.jpg"),
  ...Array.from({ length: 20 }, (_, index) =>
    withBasePath(`media/clinic/clinic-${String(index + 1).padStart(2, "0")}.png`),
  ),
];

const POINTS = [
  "Індивідуальний план лікування з прозорою вартістю",
  "Стерилізація та безпека за міжнародними протоколами",
  "Лікарі, які пояснюють кожне рішення зрозумілою мовою",
  "Зручний графік і всі ключові напрямки в одній клініці",
];

export function AboutClinic() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="about" className="relative py-20 md:py-28 bg-brand-aurora-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Про клініку"
          title={<>Спокій починається <br /><em style={{ color: "var(--brand-pink-strong)" }}>ще у приймальні</em></>}
          subtitle="Ami Dental — це сучасна стоматологія, де турбота про пацієнта поєднується з досвідом, наукою та інноваціями."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-5 lg:gap-14 items-start">
          <div className="lg:col-span-3 relative rounded-3xl overflow-hidden border border-border/70 bg-card shadow-sm">
            <div
              className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-foreground/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset"
              tabIndex={0}
              role="region"
              aria-label="Фотогалерея клініки Ami Dental"
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft") {
                  setI((current) => (current - 1 + SLIDES.length) % SLIDES.length);
                }
                if (event.key === "ArrowRight") {
                  setI((current) => (current + 1) % SLIDES.length);
                }
              }}
            >
              <img
                key={`backdrop-${SLIDES[i]}`}
                src={SLIDES[i]}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl"
              />
              <img
                key={SLIDES[i]}
                src={SLIDES[i]}
                alt={`Клініка Ami Dental — фото ${i + 1} з ${SLIDES.length}`}
                className="relative h-full w-full object-contain animate-in fade-in duration-500"
                decoding="async"
              />
              <button
                aria-label="Попереднє фото"
                onClick={() => setI((i - 1 + SLIDES.length) % SLIDES.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/85 shadow-sm backdrop-blur inline-flex items-center justify-center transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Наступне фото"
                onClick={() => setI((i + 1) % SLIDES.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/85 shadow-sm backdrop-blur inline-flex items-center justify-center transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-3 right-3 rounded-full bg-background/85 px-3 py-1.5 text-xs font-medium tabular-nums shadow-sm backdrop-blur">
                {i + 1} / {SLIDES.length}
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto p-3 [scrollbar-width:thin]" aria-label="Вибір фото">
              {SLIDES.map((src, idx) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`Показати фото ${idx + 1}`}
                  aria-current={idx === i ? "true" : undefined}
                  onClick={() => setI(idx)}
                  className={`relative h-14 w-[4.5rem] shrink-0 overflow-hidden rounded-xl border-2 transition-all focus-visible:outline-none focus-visible:ring-2 ${
                    idx === i
                      ? "border-[var(--brand-green-strong)] opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <ul className="space-y-4">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ background: "color-mix(in oklab, var(--brand-green) 22%, transparent)", color: "var(--brand-green-deep)" }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm text-foreground/85">{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#appointment" className="btn-primary-brand rounded-full px-5 py-3 text-sm font-medium">
                Записатися на консультацію
              </a>
              <a href="#team" className="rounded-full px-5 py-3 text-sm font-medium border border-foreground/15">
                Познайомитися з лікарями
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
