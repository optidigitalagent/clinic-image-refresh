import { ShieldCheck, HeartHandshake } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-brand-aurora relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.22em] font-medium"
            style={{ color: "var(--brand-green-deep)" }}
          >
            Стоматологія повного циклу · Київ
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl md:text-7xl leading-[1.02] font-display">
            Стоматологія<br />
            <span style={{ color: "var(--brand-green-deep)" }}>Ami Dental</span>
            <br />
            <em style={{ color: "var(--brand-pink-strong)", fontStyle: "italic" }}>з турботою про вас</em>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-foreground/75 max-w-xl">
            Лікування, ортодонтія, протезування, хірургія та комплексна реабілітація — в одному просторі з досвідченою командою.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#appointment"
              className="btn-primary-brand rounded-full px-6 py-3 text-sm font-medium inline-flex items-center gap-2"
            >
              Записатися на консультацію
            </a>
            <a
              href="#services"
              className="rounded-full px-6 py-3 text-sm font-medium border border-foreground/15 hover:bg-foreground/5"
            >
              Наші послуги
            </a>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
            <div>
              <dt className="text-3xl font-display" style={{ color: "var(--brand-pink-strong)" }}>20+</dt>
              <dd className="mt-1 text-xs text-muted-foreground">років досвіду</dd>
            </div>
            <div>
              <dt className="text-3xl font-display" style={{ color: "var(--brand-pink-strong)" }}>3</dt>
              <dd className="mt-1 text-xs text-muted-foreground">лікарі-експерти</dd>
            </div>
            <div>
              <dt className="text-3xl font-display" style={{ color: "var(--brand-pink-strong)" }}>1</dt>
              <dd className="mt-1 text-xs text-muted-foreground">комплексний план</dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap gap-4 max-w-xl">
            <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/70 backdrop-blur px-4 py-3 flex-1 min-w-[220px]">
              <ShieldCheck className="h-5 w-5 mt-0.5" style={{ color: "var(--brand-green-deep)" }} />
              <div>
                <div className="text-sm font-medium">Безпека</div>
                <div className="text-xs text-muted-foreground">Міжнародні протоколи стерилізації</div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/70 backdrop-blur px-4 py-3 flex-1 min-w-[220px]">
              <HeartHandshake className="h-5 w-5 mt-0.5" style={{ color: "var(--brand-pink-strong)" }} />
              <div>
                <div className="text-sm font-medium">Підтримка</div>
                <div className="text-xs text-muted-foreground">Пояснюємо кожне рішення</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
