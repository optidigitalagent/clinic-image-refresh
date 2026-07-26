import { Instagram, MapPin, Clock, Phone } from "lucide-react";
import { SectionHeading } from "./SectionLabel";

export function Contacts() {
  return (
    <section id="contacts" className="relative py-20 md:py-28 bg-brand-aurora-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Контакти"
          title={<>Як нас <em style={{ color: "var(--brand-pink-strong)" }}>знайти</em></>}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border/70 bg-background/80 backdrop-blur p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 mt-0.5" style={{ color: "var(--brand-green-deep)" }} />
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Адреса</div>
                <div className="mt-1 text-lg font-medium">вул. Зоологічна, 3-Я</div>
                <div className="text-sm text-muted-foreground">Київ, Шевченківський район</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 mt-0.5" style={{ color: "var(--brand-green-deep)" }} />
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Графік</div>
                <div className="mt-1 text-sm">Пн–Пт · 9:00–21:00</div>
                <div className="text-sm">Сб · 9:00–18:00</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 mt-0.5" style={{ color: "var(--brand-pink-strong)" }} />
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Телефони</div>
                <div className="mt-1 flex flex-col gap-0.5 text-sm">
                  <a href="tel:+380686707519">+38 (068) 670 75 19</a>
                  <a href="tel:+380736707519">+38 (073) 670 75 19</a>
                  <a href="tel:+380996707719">+38 (099) 670 77 19</a>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Instagram className="h-5 w-5 mt-0.5" style={{ color: "var(--brand-pink-strong)" }} />
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Instagram</div>
                <a
                  href="https://www.instagram.com/ami_dental_/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 text-sm hover:underline"
                >
                  @ami_dental_
                </a>
              </div>
            </div>

            <a
              href="https://www.google.com/maps?cid=14683152177039593001"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex btn-primary-brand rounded-full px-5 py-3 text-sm font-medium"
            >
              Відкрити маршрут
            </a>
          </div>

          <div className="rounded-3xl overflow-hidden border border-border/70 min-h-[360px] bg-muted">
            <iframe
              title="Ami Dental — Київ, вул. Зоологічна, 3-Я"
              src="https://www.google.com/maps?q=вул.+Зоологічна,+3-Я,+Київ&output=embed"
              className="w-full h-full min-h-[360px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
