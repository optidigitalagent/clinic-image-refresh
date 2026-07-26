import { ArrowRight } from "lucide-react";
import { withBasePath } from "@/lib/base-path";
import { SectionHeading } from "./SectionLabel";

const SERVICES = [
  { n: "01", title: "Терапія", text: "Лікування карієсу, некаріозних уражень і художні реставрації зубів.", href: "price#cat-2" },
  { n: "02", title: "Ендодонтія", text: "Лікування та переліковування кореневих каналів за сучасними протоколами.", href: "price#cat-3" },
  { n: "03", title: "Ортодонтія", text: "Виправлення прикусу у дорослих і підлітків, брекети та ортодонтичні апарати.", href: "price#cat-8" },
  { n: "04", title: "Ортопедія", text: "Керамічні коронки, вкладки, накладки, вініри та коронки на імплантах.", href: "price#cat-6" },
  { n: "05", title: "Хірургія та імплантація", text: "Видалення зубів, кісткова пластика, синус-ліфтинг і дентальна імплантація.", href: "price#cat-4" },
  { n: "06", title: "Пародонтологія", text: "Комплексне лікування ясен і тканин пародонту — основи здорової усмішки.", href: "price#cat-1" },
];

export function Services() {
  return (
    <section id="services" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Послуги"
          title={<>Комплексна турбота <br /><em style={{ color: "var(--brand-pink-strong)" }}>про вашу усмішку</em></>}
          subtitle="Профільні спеціалісти працюють як одна команда — від точної діагностики до стабільного результату."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <article key={s.n} className="group relative rounded-3xl border border-border/70 bg-card p-6 hover:shadow-lg transition-shadow">
              <div className="text-xs font-mono tracking-widest text-muted-foreground">{s.n}</div>
              <h3 className="mt-4 text-2xl font-display">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{s.text}</p>
              <a
                href={withBasePath(s.href)}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium group-hover:gap-2 transition-all"
                style={{ color: "var(--brand-green-deep)" }}
              >
                Відкрити прайс <ArrowRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
